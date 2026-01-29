from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
import random
from users.models import Customer
from wallet.models import Wallet, Transaction
from campaigns.models import UserSavingsPlan, SavingsPlan

def seed_client_premium_data(email, target_balance):
    try:
        user = Customer.objects.get(email=email)
        wallet, _ = Wallet.objects.get_or_create(user=user)
        
        # Clear existing transactions for a clean state
        Transaction.objects.filter(receiver_id=wallet.id, receiver_entity='WALLET').delete()
        Transaction.objects.filter(sender_id=wallet.id, sender_entity='WALLET').delete()
        
        now = timezone.now()
        current_balance = Decimal('0.00')
        
        # 1. Starting Balance (12 months ago)
        start_date = now - timedelta(days=365)
        initial_deposit = target_balance * Decimal('0.4')
        current_balance += initial_deposit
        
        tx = Transaction.objects.create(
            amount=initial_deposit,
            description='Opening Balance Migration',
            transaction_type='DEPOSIT',
            transaction_status='SUCCESS',
            receiver_entity='WALLET',
            receiver_id=wallet.id,
        )
        Transaction.objects.filter(id=tx.id).update(created_at=start_date)
        
        # 2. Monthly Salary Deposits & Savings Transfers
        for i in range(12):
            month_date = start_date + timedelta(days=30 * (i + 1))
            if month_date > now:
                break
                
            # Salary
            salary = Decimal(random.randint(150000, 300000))
            current_balance += salary
            tx_sal = Transaction.objects.create(
                amount=salary,
                description=f'Salary Deposit - {month_date.strftime("%B %Y")}',
                transaction_type='DEPOSIT',
                transaction_status='SUCCESS',
                receiver_entity='WALLET',
                receiver_id=wallet.id,
            )
            Transaction.objects.filter(id=tx_sal.id).update(created_at=month_date - timedelta(days=random.randint(0, 2)))
            
            # Random Expenses
            expense = Decimal(random.randint(50000, 100000))
            current_balance -= expense
            tx_exp = Transaction.objects.create(
                amount=expense,
                description=f'Monthly Living Expenses - {month_date.strftime("%B %Y")}',
                transaction_type='WITHDRAWAL',
                transaction_status='SUCCESS',
                sender_entity='WALLET',
                sender_id=wallet.id,
            )
            Transaction.objects.filter(id=tx_exp.id).update(created_at=month_date + timedelta(days=random.randint(3, 10)))

        # 3. Final Balance Adjustment
        wallet.balance = current_balance
        wallet.save()
        print(f'Successfully seeded 12 months of data for {email}. Final Balance: {current_balance}')
        
    except Exception as e:
        print(f'Error seeding {email}: {e}')

# Run for requested users
seed_client_premium_data('ngozi.okodua@gmail.com', Decimal('850000.00'))
seed_client_premium_data('iamtoninath@gmail.com', Decimal('1200000.00'))
