from celery import shared_task

from django.utils import timezone
from django.db import transaction
from django.core.exceptions import ValidationError

from .models import SavingsPlan, UserSavingsPlan
from wallet.models import Transaction, create_transaction, process_transaction
from utils.campaigns import calculate_next_transfer_date


# create function to make the transfer of funds from wallet to user savings plan


@shared_task()
def process_transfers():
    today = timezone.now().date()

    # 1. get all user savings plans that are active
    user_savings_plans = UserSavingsPlan.objects.filter(
        status="ACTIVE", next_transfer_date__lte=today
    ).select_related("savings_plan", "user__wallet")

    for user_savings_plan in user_savings_plans:
        try:
            with transaction.atomic():
                if user_savings_plan.savings_plan:
                    # 2. Calculate the amount to be transferred
                    amount = user_savings_plan.savings_plan.min_investment

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
                        raise ValidationError(message)

                    # 4. Update the user savings plan
                    user_savings_plan.duration -= 1
                    user_savings_plan.next_transfer_date = calculate_next_transfer_date(
                        user_savings_plan.savings_plan.contribution_frequency
                    )

                    if user_savings_plan.duration <= 0:
                        user_savings_plan.status = "COMPLETED"

                    user_savings_plan.save()
                else:
                    # 5. if there is no savings plan, update the user savings plan status to "CANCELLED"
                    user_savings_plan.status = "CANCELLED"
                    user_savings_plan.save()

        except Exception as e:
            # Log the error and continue with the next plan
            print(f"Error processing plan {user_savings_plan.id}: {str(e)}")
