import re
import os
from decimal import Decimal
from django.utils import timezone
from datetime import datetime
from users.models import Customer
from wallet.models import Wallet, Transaction
from campaigns.models import UserSavingsPlan

# 1. Build User Mapping (Backup UUID -> Email)
user_map = {}
user_re = re.compile(r"\('([a-f0-9\-]+)','([^']+)','([^']+)','([^']+)'")

with open('in_db_backup/users_202502221052.sql', 'r') as f:
    for line in f:
        matches = user_re.findall(line)
        for uid, email, first, last in matches:
            user_map[uid] = email

# 2. Parse Transactions
# Format: ('tx_ref', 'user_id', 'type', 'description', channel, amount, balance, 'created_at', 'updated_at', 'entity', 'entity_id', channel_id, 'status', 'related_tx_ref')
# Note: Some ids are numeric strings, others are UUIDs. 
# We'll use a more flexible regex for values.
tx_val_re = re.compile(r"\('([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*[^,]+,\s*([0-9\.]+),\s*[0-9\.]+,\s*'([^']+)',\s*'[^']+',\s*'([^']+)',\s*'([^']+)',\s*[^,]+,\s*'([^']+)',\s*([^,)]+)\)")

total_imported = 0

def get_tz_aware(date_str):
    # Format: 2018-03-25 21:51:41+01 or 2019-11-27 20:43:11+00
    try:
        # Simplistic parsing for the SQL format
        clean_date = date_str.split('+')[0]
        dt = datetime.strptime(clean_date, "%Y-%m-%d %H:%M:%S")
        return timezone.make_aware(dt)
    except:
        return timezone.now()

with open('in_db_backup/transactions_202502221052.sql', 'r') as f:
    for line in f:
        matches = tx_val_re.findall(line)
        for tx_ref, user_uid, tx_type_raw, desc, amount, created_at_str, entity, entity_id, status, related_ref in matches:
            email = user_map.get(user_uid)
            if not email:
                continue
                
            user = Customer.objects.filter(email=email).first()
            if not user:
                continue
            
            # Map type and entities
            # Default to SUCCESS as we are restoring "completed" or historical data
            mapped_type = 'DEPOSIT' if tx_type_raw == 'credit' else 'WITHDRAWAL'
            
            # If it's a transfer between wallet and plan, we might want to tag it as TRANSFER
            if 'plan' in desc.lower() or 'wallet' in desc.lower():
                mapped_type = 'TRANSFER'

            # Identify sender/receiver
            sender_ent = None
            sender_id = None
            receiver_ent = None
            receiver_id = None
            
            wallet = getattr(user, 'wallet', None)
            if not wallet:
                wallet, _ = Wallet.objects.get_or_create(user=user)

            if tx_type_raw == 'credit':
                receiver_ent = 'WALLET' if entity == 'wallet' else 'PLAN'
                receiver_id = wallet.id if entity == 'wallet' else None # Plan matching is complex, we'll keep it simple
            else:
                sender_ent = 'WALLET' if entity == 'wallet' else 'PLAN'
                sender_id = wallet.id if entity == 'wallet' else None

            try:
                tx = Transaction.objects.create(
                    amount=Decimal(amount),
                    description=desc,
                    transaction_type=mapped_type,
                    transaction_status='SUCCESS',
                    sender_entity=sender_ent,
                    sender_id=sender_id,
                    receiver_entity=receiver_ent,
                    receiver_id=receiver_id
                )
                # Overwrite created_at
                Transaction.objects.filter(id=tx.id).update(created_at=get_tz_aware(created_at_str))
                total_imported += 1
            except Exception as e:
                pass # Silently skip duplicates or errors for mass import

print(f"Imported {total_imported} historical transactions.")
