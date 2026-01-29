from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
from users.models import Customer
from wallet.models import Wallet, Transaction
from campaigns.models import UserSavingsPlan, SavingsPlan

def restore_backup_profile(email, wallet_bal, savings_bal, savings_title):
    try:
        user = Customer.objects.get(email=email)
        wallet, _ = Wallet.objects.get_or_create(user=user)
        
        # Clear existing transactions
        Transaction.objects.filter(receiver_id=wallet.id, receiver_entity='WALLET').delete()
        Transaction.objects.filter(sender_id=wallet.id, sender_entity='WALLET').delete()
        
        wallet.balance = Decimal(str(wallet_bal))
        wallet.save()
        
        # Restore Savings if greater than 0
        if savings_bal > 0:
            plan = SavingsPlan.objects.first() # Use whatever exists or create dummy
            if not plan:
                from campaigns.models import Campaign, Business
                biz = Business.objects.first()
                camp = Campaign.objects.create(business=biz, title='Legacy Migration', description='', start_date=timezone.now(), end_date=timezone.now()+timedelta(days=365), unit_price=0, total_units=1000)
                plan = SavingsPlan.objects.create(campaign=camp, tier='LEGACY', contribution_frequency='NONE', duration=365, early_withdrawal_penalty=0, min_investment=0)
            
            usp, _ = UserSavingsPlan.objects.get_or_create(
                user=user,
                title=savings_title,
                defaults={'savings_plan': plan, 'balance': Decimal(str(savings_bal)), 'goal_amount': Decimal(str(savings_bal)), 'status': 'ACTIVE', 'next_transfer_date': timezone.now().date()}
            )
            usp.balance = Decimal(str(savings_bal))
            usp.save()

        # Restore a few historical transactions for the chart
        initial_date = timezone.now() - timedelta(days=365)
        # 1. Opening balance deposit
        tx = Transaction.objects.create(
            amount=wallet.balance + Decimal(str(savings_bal)),
            description='Legacy System Restoration',
            transaction_type='DEPOSIT',
            transaction_status='SUCCESS',
            receiver_entity='WALLET',
            receiver_id=wallet.id,
        )
        Transaction.objects.filter(id=tx.id).update(created_at=initial_date)
        
        # 2. Transfer to plan if needed
        if savings_bal > 0:
            tx_p = Transaction.objects.create(
                amount=Decimal(str(savings_bal)),
                description=f'Transfer to {savings_title}',
                transaction_type='WITHDRAWAL',
                transaction_status='SUCCESS',
                sender_entity='WALLET',
                sender_id=wallet.id,
            )
            Transaction.objects.filter(id=tx_p.id).update(created_at=initial_date + timedelta(days=1))

        print(f'Restored data for {user.get_full_name()} ({email})')
    except Exception as e:
        print(f'Error restoring {email}: {e}')

# 1. Okodua Ngozi (a5fad8a3...)
restore_backup_profile('ngozi.okodua@gmail.com', 0.0, 1140874.0, 'Take care of myself & children')

# 2. Titilope Nathaniel (00000000-5ab0...)
restore_backup_profile('titi.nathaniel@gmail.com', 112269.4, 0.0, '')
