import random
from datetime import timedelta
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db import transaction
from users.models import User, Business, Customer
from wallet.models import Wallet, Transaction
from campaigns.models import Campaign, SavingsPlan, UserSavingsPlan

class Command(BaseCommand):
    help = 'Seed the database with premium-grade demo data for the superuser'

    def handle(self, *args, **options):
        email = 'invest@investnaira.com'
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'User {email} does not exist. Run create_admin first.'))
            return

        with transaction.atomic():
            # 1. Ensure Business exists for campaigns
            User.objects.filter(email='partner@arkbuilders.com').delete()
            business, _ = Business.objects.get_or_create(
                email='partner@arkbuilders.com',
                defaults={
                    'user_type': 'BUSINESS',
                    'is_active': True,
                    'company_name': 'Arkbuilders Global',
                    'address': '123 Wealth Avenue, Lagos',
                }
            )
            business_user = business.user_ptr
            if not hasattr(business_user, 'wallet'):
                Wallet.objects.create(user=business_user)

            # 2. Create Campaigns & Savings Plans
            self.stdout.write('Creating Campaigns and Savings Plans...')
            campaigns_data = [
                ('Real Estate Growth Fund', 'High-yield real estate investments for long-term wealth.', 'AGGRESIVE', 500.00),
                ('Tech Innovation Pot', 'Aggregated tech stocks and startups.', 'BALANCED', 200.00),
                ('Conservative Bond Ladder', 'Low-risk government and corporate bonds.', 'CONSERVATIVE', 100.00),
            ]

            now = timezone.now().date()
            for title, desc, risk, unit_price in campaigns_data:
                campaign, created = Campaign.objects.get_or_create(
                    title=title,
                    defaults={
                        'business': business,
                        'description': desc,
                        'start_date': now - timedelta(days=365),
                        'end_date': now + timedelta(days=365),
                        'risk_level': risk,
                        'unit_price': Decimal(str(unit_price)),
                        'total_units': 10000,
                        'current_units': random.randint(1000, 5000)
                    }
                )
                
                # Create default Savings Plans for each campaign
                for tier in ['Starter', 'Standard', 'Premium']:
                    SavingsPlan.objects.get_or_create(
                        campaign=campaign,
                        tier=tier,
                        defaults={
                            'contribution_frequency': 'Monthly',
                            'duration': 365,
                            'early_withdrawal_penalty': Decimal('5.00'),
                            'min_investment': Decimal(str(unit_price * 10))
                        }
                    )

            # 3. Setup User's Wallet and History
            self.stdout.write('Setting up User Wallet and Transaction History...')
            wallet, _ = Wallet.objects.get_or_create(user=user)
            wallet.balance = Decimal('10000000.00') # 10 Million
            wallet.save()

            # Clear old transactions to make it clean
            Transaction.objects.filter(sender_id=wallet.id).delete()
            Transaction.objects.filter(receiver_id=wallet.id).delete()

            # Create 12 months of historical transactions
            for i in range(12):
                month_date = timezone.now() - timedelta(days=30 * i)
                
                # Monthly Salary Deposit
                tx = Transaction.objects.create(
                    amount=Decimal('500000.00'),
                    description=f'Salary Deposit - {month_date.strftime("%B %Y")}',
                    transaction_type='DEPOSIT',
                    transaction_status='SUCCESS',
                    receiver_entity='WALLET',
                    receiver_id=wallet.id,
                )
                Transaction.objects.filter(id=tx.id).update(created_at=month_date - timedelta(days=random.randint(0, 5)))

                # Random Monthly Withdrawal
                tx = Transaction.objects.create(
                    amount=Decimal(str(random.randint(50000, 150000))),
                    description=f'Utility & Bills - {month_date.strftime("%B %Y")}',
                    transaction_type='WITHDRAWAL',
                    transaction_status='SUCCESS',
                    sender_entity='WALLET',
                    sender_id=wallet.id,
                )
                Transaction.objects.filter(id=tx.id).update(created_at=month_date - timedelta(days=random.randint(6, 12)))

                # Random Investment
                if i % 2 == 0:
                    tx = Transaction.objects.create(
                        amount=Decimal('250000.00'),
                        description=f'Automated Investment - {month_date.strftime("%B %Y")}',
                        transaction_type='INVESTMENT',
                        transaction_status='SUCCESS',
                        sender_entity='WALLET',
                        sender_id=wallet.id,
                    )
                    Transaction.objects.filter(id=tx.id).update(created_at=month_date - timedelta(days=random.randint(13, 20)))

            # 4. Create Active User Savings Plans (Missions)
            self.stdout.write('Creating Active Missions...')
            plans = SavingsPlan.objects.all()[:2]
            for plan in plans:
                UserSavingsPlan.objects.get_or_create(
                    user=user.customer,
                    savings_plan=plan,
                    title=f"My {plan.campaign.title} Mission",
                    defaults={
                        'next_transfer_date': now + timedelta(days=15),
                        'balance': Decimal('1500000.00'),
                        'goal_amount': Decimal('5000000.00'),
                        'status': 'ACTIVE'
                    }
                )

            self.stdout.write(self.style.SUCCESS('Successfully seeded premium data!'))
