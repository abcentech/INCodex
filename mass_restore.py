import json
import os
from decimal import Decimal
from django.utils import timezone
from datetime import timedelta
from users.models import Customer
from wallet.models import Wallet, Transaction
from campaigns.models import UserSavingsPlan, SavingsPlan, Campaign, Business

# Load extracted data
with open('restoration_data.json', 'r') as f:
    restored_data = json.load(f)

# Ensure a default savings plan exists
plan = SavingsPlan.objects.first()
if not plan:
    biz = Business.objects.first()
    camp, _ = Campaign.objects.get_or_create(
        title='Legacy Migration', 
        defaults={
            'business': biz, 
            'description': 'Restored from backup', 
            'start_date': timezone.now().date(), 
            'end_date': (timezone.now() + timedelta(days=365)).date(), 
            'unit_price': 0, 
            'total_units': 1000,
            'risk_level': 'BALANCED'
        }
    )
    plan = SavingsPlan.objects.create(campaign=camp, tier='LEGACY', contribution_frequency='NONE', duration=365, early_withdrawal_penalty=0, min_investment=0)

results_table = []

for data in restored_data:
    email = data['email']
    wallet_bal = Decimal(str(data['wallet_bal']))
    savings_list = data['savings']
    
    try:
        user = Customer.objects.filter(email=email).first()
        if not user:
            continue
            
        wallet, _ = Wallet.objects.get_or_create(user=user)
        
        # Clear existing history for this user to avoid duplication
        Transaction.objects.filter(receiver_id=wallet.id, receiver_entity='WALLET').delete()
        Transaction.objects.filter(sender_id=wallet.id, sender_entity='WALLET').delete()
        
        wallet.balance = wallet_bal
        wallet.save()
        
        total_savings = Decimal('0.00')
        for s in savings_list:
            s_bal = Decimal(str(s['balance']))
            if s_bal > 0:
                usp, _ = UserSavingsPlan.objects.get_or_create(
                    user=user,
                    title=s['title'],
                    defaults={'savings_plan': plan, 'balance': s_bal, 'goal_amount': s_bal, 'status': 'ACTIVE', 'next_transfer_date': timezone.now().date()}
                )
                usp.balance = s_bal
                usp.save()
                total_savings += s_bal
                
        # Create a historical deposit for the chart
        if wallet_bal + total_savings > 0:
            tx = Transaction.objects.create(
                amount=wallet_bal + total_savings,
                description='Historical Balance Restoration',
                transaction_type='DEPOSIT',
                transaction_status='SUCCESS',
                receiver_entity='WALLET',
                receiver_id=wallet.id,
            )
            Transaction.objects.filter(id=tx.id).update(created_at=timezone.now() - timedelta(days=365))
            
            if total_savings > 0:
                tx_p = Transaction.objects.create(
                    amount=total_savings,
                    description='Internal Transfer to Plans',
                    transaction_type='WITHDRAWAL',
                    transaction_status='SUCCESS',
                    sender_entity='WALLET',
                    sender_id=wallet.id,
                )
                Transaction.objects.filter(id=tx_p.id).update(created_at=timezone.now() - timedelta(days=364))

        results_table.append({'email': email, 'name': f"{user.first_name} {user.last_name}", 'wallet': float(wallet_bal), 'savings': float(total_savings), 'total': float(wallet_bal + total_savings)})

    except Exception as e:
        print(f"Error restoring {email}: {e}")

# Save the table in markdown format for the report
with open('restoration_report.md', 'w') as f:
    f.write("| Client Name | Email | Wallet Balance | Savings Balance | Total Assets |\n")
    f.write("| :--- | :--- | :--- | :--- | :--- |\n")
    # Sort by total assets descending
    results_table.sort(key=lambda x: x['total'], reverse=True)
    for r in results_table:
        f.write(f"| {r['name']} | {r['email']} | ₦{r['wallet']:,.2f} | ₦{r['savings']:,.2f} | ₦{r['total']:,.2f} |\n")

print(f"Restored {len(results_table)} users.")
