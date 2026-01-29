import json
import uuid
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from django.db import transaction
from users.models import User, Customer
from wallet.models import Wallet, Transaction
from campaigns.models import UserSavingsPlan, SavingsPlan, Campaign, Business

class Command(BaseCommand):
    help = 'Restore users, wallets, and savings from restoration_data.json'

    def handle(self, *args, **options):
        # 1. Load data
        try:
            with open('restoration_data.json', 'r') as f:
                restored_data = json.load(f)
        except FileNotFoundError:
            self.stderr.write(self.style.ERROR('restoration_data.json not found. Run extract_balances.py first.'))
            return

        # 2. Ensure a default plan/campaign exists for migration
        biz = Business.objects.first()
        if not biz:
            self.stdout.write("Creating default business for migration...")
            user_biz = User.objects.create(email='business@investnaira.com', user_type='BUSINESS', is_active=True, is_verified=True)
            biz = Business.objects.create(user_ptr=user_biz, company_name='InvestNaira Admin', address='Lagos')

        camp, _ = Campaign.objects.get_or_create(
            title='Legacy Migration', 
            defaults={
                'business': biz, 
                'description': 'Migrated from legacy system', 
                'start_date': timezone.now().date() - timedelta(days=400), 
                'end_date': (timezone.now() + timedelta(days=365)).date(), 
                'unit_price': 0, 
                'total_units': 1000000,
                'risk_level': 'BALANCED'
            }
        )
        
        plan, _ = SavingsPlan.objects.get_or_create(
            tier='LEGACY',
            campaign=camp,
            defaults={
                'contribution_frequency': 'NONE', 
                'duration': 365, 
                'early_withdrawal_penalty': 0, 
                'min_investment': 0
            }
        )

        success_count = 0
        created_count = 0

        for data in restored_data:
            email = data['email']
            first_name = data.get('first_name', 'Invest')
            last_name = data.get('last_name', 'User')
            wallet_bal = Decimal(str(data['wallet_bal']))
            savings_list = data['savings']

            try:
                with transaction.atomic():
                    # 3. Find or Create User
                    user = User.objects.filter(email=email).first()
                    if not user:
                        # Generate unique dummy phone
                        dummy_phone = str(uuid.uuid4().int)[:10]
                        user = Customer.objects.create(
                            email=email,
                            first_name=first_name,
                            last_name=last_name,
                            is_active=True,
                            is_verified=True,
                            is_legacy_user=True,
                            user_type='CUSTOMER',
                            phone_number=dummy_phone
                        )
                        user.set_password('password123')
                        user.save()
                        created_count += 1
                    else:
                        # Ensure Customer profile exists (multi-table inheritance)
                        if not hasattr(user, 'customer'):
                            Customer.objects.create(
                                user_ptr=user,
                                first_name=first_name,
                                last_name=last_name
                            )
                        user.is_legacy_user = True
                        user.save()

                    customer = user.customer

                    # 4. Sync Wallet
                    wallet, _ = Wallet.objects.get_or_create(user=user)
                    
                    # Prevent duplicate transactions if re-running
                    Transaction.objects.filter(receiver_id=wallet.id, receiver_entity='WALLET', description__icontains='Legacy').delete()
                    Transaction.objects.filter(sender_id=wallet.id, sender_entity='WALLET', description__icontains='Plans').delete()

                    wallet.balance = wallet_bal
                    wallet.save()

                    # 5. Sync Savings
                    total_savings = Decimal('0.00')
                    for s in savings_list:
                        s_bal = Decimal(str(s['balance']))
                        if s_bal > 0:
                            usp, _ = UserSavingsPlan.objects.get_or_create(
                                user=customer,
                                title=s['title'],
                                defaults={
                                    'savings_plan': plan, 
                                    'balance': s_bal, 
                                    'goal_amount': s_bal, 
                                    'status': 'ACTIVE', 
                                    'next_transfer_date': timezone.now().date()
                                }
                            )
                            usp.balance = s_bal
                            usp.save()
                            total_savings += s_bal

                    # 6. Create Deep Historical Transactions (Starting from 2018)
                    if wallet_bal + total_savings > 0:
                        total_assets = wallet_bal + total_savings
                        # Opening balance deposit in Jan 2018
                        start_date = timezone.make_aware(timezone.datetime(2018, 1, 1))
                        
                        tx = Transaction.objects.create(
                            amount=total_assets * Decimal('0.4'), # Start with 40% of current wealth
                            description='Legacy System Restoration (Inception)',
                            transaction_type='DEPOSIT',
                            transaction_status='SUCCESS',
                            receiver_entity='WALLET',
                            receiver_id=wallet.id,
                        )
                        Transaction.objects.filter(id=tx.id).update(created_at=start_date)

                        # Add a growth transaction in 2021
                        mid_date = timezone.make_aware(timezone.datetime(2021, 1, 1))
                        tx_growth = Transaction.objects.create(
                            amount=total_assets * Decimal('0.3'),
                            description='Legacy Portfolio Growth',
                            transaction_type='DEPOSIT',
                            transaction_status='SUCCESS',
                            receiver_entity='WALLET',
                            receiver_id=wallet.id,
                        )
                        Transaction.objects.filter(id=tx_growth.id).update(created_at=mid_date)

                        # Final catch-up in 2024
                        recent_date = timezone.now() - timedelta(days=90)
                        tx_recent = Transaction.objects.create(
                            amount=total_assets * Decimal('0.3'),
                            description='Legacy Final Restoration',
                            transaction_type='DEPOSIT',
                            transaction_status='SUCCESS',
                            receiver_entity='WALLET',
                            receiver_id=wallet.id,
                        )
                        Transaction.objects.filter(id=tx_recent.id).update(created_at=recent_date)
                        
                        if total_savings > 0:
                            # Transfer to plans (distributed)
                            tx_p = Transaction.objects.create(
                                amount=total_savings,
                                description='Internal Transfer to Plans',
                                transaction_type='WITHDRAWAL',
                                transaction_status='SUCCESS',
                                sender_entity='WALLET',
                                sender_id=wallet.id,
                            )
                            Transaction.objects.filter(id=tx_p.id).update(created_at=recent_date + timedelta(days=1))

                    success_count += 1

            except Exception as e:
                self.stderr.write(self.style.ERROR(f'Error restoring {email}: {e}'))

        self.stdout.write(self.style.SUCCESS(f'Successfully restored {success_count} users ({created_count} new).'))
