import re
import json

users = {}
# Regex for users: ('ID', 'EMAIL', 'FIRST', 'LAST', ...
user_re = re.compile(r"\('([a-f0-9\-]+)','([^']+)','([^']+)','([^']+)'")

with open('in_db_backup/users_202502221052.sql', 'r') as f:
    for line in f:
        matches = user_re.findall(line)
        for uid, email, first, last in matches:
            users[uid] = {'email': email, 'first_name': first, 'last_name': last, 'wallet_bal': 0.0, 'savings': []}

# Regex for wallets: ('UUID', 'ACCT', BALANCE, ...
wallet_re = re.compile(r"\('([a-f0-9\-]+)','[^']+',([0-9\.]+),")

with open('in_db_backup/wallets_202502221052.sql', 'r') as f:
    for line in f:
        matches = wallet_re.findall(line)
        for uid, bal in matches:
            if uid in users:
                users[uid]['wallet_bal'] = float(bal)

# Regex for plans: ('UUID', ..., 'TITLE', ..., BALANCE, ...
# Looking at the prev grep: ('a5fad8a3...', ..., 'Take care...', ..., 1140874.0, ...)
# Structure from prev view: ('user_id', 'created_at', 'updated_at', 'plan_id', 'title', 'units', 'balance', ...)
plan_re = re.compile(r"\('([a-f0-9\-]+)','[^']+','[^']+','[^']+','([^']+)',[0-9\.]+,([0-9\.]+),")

with open('in_db_backup/_plans__202502221052.sql', 'r') as f:
    for line in f:
        matches = plan_re.findall(line)
        for uid, title, bal in matches:
            if uid in users:
                users[uid]['savings'].append({'title': title, 'balance': float(bal)})

# Path for non-zero results
restored = []
for uid, data in users.items():
    has_wallet = data['wallet_bal'] > 0
    has_savings = any(s['balance'] > 0 for s in data['savings'])
    if has_wallet or has_savings:
        restored.append(data)

with open('restoration_data.json', 'w') as f:
    json.dump(restored, f, indent=2)

print(f"Extracted {len(restored)} users with non-zero balances.")
