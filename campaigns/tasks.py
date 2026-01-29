from celery import shared_task

from django.utils import timezone
from django.db import transaction
from django.core.exceptions import ValidationError

from .models import SavingsPlan, UserSavingsPlan
from wallet.models import Transaction, create_transaction, process_transaction
from utils.campaigns import calculate_next_transfer_date
from notifications.utils import notify_savings_transfer, notify_goal_achieved, notify_plan_paused


# create function to make the transfer of funds from wallet to user savings plan


@shared_task()
def process_transfers():
    """
    Process automatic transfers from wallet to savings plans.
    Runs daily to check for plans due for transfer.
    """
    today = timezone.now().date()

    # 1. Get all active user savings plans with auto-transfer enabled and due for transfer
    user_savings_plans = UserSavingsPlan.objects.filter(
        status="ACTIVE", 
        auto_transfer_enabled=True,
        next_transfer_date__lte=today
    ).select_related("savings_plan", "user__wallet")

    processed_count = 0
    failed_count = 0

    for user_savings_plan in user_savings_plans:
        try:
            with transaction.atomic():
                # 2. Determine transfer amount (use transfer_amount if set, otherwise min_investment)
                if user_savings_plan.transfer_amount:
                    amount = user_savings_plan.transfer_amount
                elif user_savings_plan.savings_plan:
                    amount = user_savings_plan.savings_plan.min_investment
                else:
                    # No amount configured, skip this plan
                    print(f"Skipping plan {user_savings_plan.id}: No transfer amount configured")
                    continue

                # 3. Create and process the transaction
                tx = create_transaction(
                    sender_entity="WALLET",
                    sender_id=user_savings_plan.user.wallet.id,
                    receiver_entity="PLAN",
                    receiver_id=user_savings_plan.id,
                    amount=amount,
                    description=f"Automatic transfer to {user_savings_plan.title}",
                    transaction_type="INVESTMENT",
                )
                success, message = process_transaction(tx.id)

                if not success:
                    # Transaction failed (likely insufficient balance)
                    user_savings_plan.failed_transfer_count += 1
                    
                    # Notify user of failure
                    notify_savings_transfer(
                        user=user_savings_plan.user.user,
                        plan_title=user_savings_plan.title,
                        amount=amount,
                        success=False
                    )
                    
                    # Pause plan after 3 consecutive failures
                    if user_savings_plan.failed_transfer_count >= 3:
                        user_savings_plan.status = "PAUSED"
                        user_savings_plan.auto_transfer_enabled = False
                        
                        # Notify user of plan pause
                        notify_plan_paused(
                            user=user_savings_plan.user.user,
                            plan_title=user_savings_plan.title,
                            reason="3 consecutive failed transfers"
                        )
                        
                        print(f"Plan {user_savings_plan.id} paused after 3 failed attempts: {message}")
                    else:
                        print(f"Transfer failed for plan {user_savings_plan.id} (attempt {user_savings_plan.failed_transfer_count}): {message}")
                    
                    user_savings_plan.save()
                    failed_count += 1
                    continue

                # 4. Update the user savings plan on success
                user_savings_plan.balance += amount
                user_savings_plan.last_transfer_date = timezone.now()
                user_savings_plan.failed_transfer_count = 0  # Reset failure count on success
                
                # Notify user of successful transfer
                notify_savings_transfer(
                    user=user_savings_plan.user.user,
                    plan_title=user_savings_plan.title,
                    amount=amount,
                    success=True
                )
                
                if user_savings_plan.savings_plan:
                    user_savings_plan.next_transfer_date = calculate_next_transfer_date(
                        user_savings_plan.savings_plan.contribution_frequency
                    )
                else:
                    # Default to monthly if no savings plan
                    user_savings_plan.next_transfer_date = calculate_next_transfer_date('MONTHLY')

                # Check if goal is reached
                if user_savings_plan.balance >= user_savings_plan.goal_amount:
                    user_savings_plan.status = "COMPLETED"
                    user_savings_plan.auto_transfer_enabled = False
                    
                    # Notify user of goal achievement
                    notify_goal_achieved(
                        user=user_savings_plan.user.user,
                        plan_title=user_savings_plan.title,
                        goal_amount=user_savings_plan.goal_amount
                    )

                user_savings_plan.save()
                processed_count += 1
                print(f"Successfully processed transfer for plan {user_savings_plan.id}: {amount}")

        except Exception as e:
            # Log the error and continue with the next plan
            print(f"Error processing plan {user_savings_plan.id}: {str(e)}")
            failed_count += 1

    print(f"Transfer processing complete: {processed_count} successful, {failed_count} failed")
    return {"processed": processed_count, "failed": failed_count}
