import requests
import json
from dotenv import load_dotenv
import os
import hashlib
import hmac
import uuid

from django.db.models import Q

from campaigns.models import UserSavingsPlan
from wallet.models import Transaction, Wallet

from .users import generate_access_token

load_dotenv()

# SECRET_KEY = os.getenv('PAYSTACK_SECRET_KEY')
# PUBLIC_KEY = os.getenv('PAYSTACK_PUBLIC_KEY')
# BASE_URL = os.getenv('PAYSTACK_BASE_URL')
CONTRACT_CODE = os.getenv('MONNIFY_CONTRACT_CODE')
SECRET_KEY = os.getenv('MONNIFY_SECRET_KEY')
API_KEY = os.getenv('MONNIFY_API_KEY')
BASE_URL = 'https://sandbox.monnify.com'

header = {
        "Authorization": f"Bearer {generate_access_token(BASE_URL, API_KEY, SECRET_KEY)}",
    }

# utils start here
def initialize_transaction(payload):
    '''
    Sample data:
    {
        "amount": 10000,
        "email": "test@example.com"
    }
    '''
    url = f'{BASE_URL}/transaction/initialize'
    
    response = requests.post(url=url, data=payload, headers=header)
    data = response.json()
    
    return data


def create_virtual_account(payload):
    '''
    Receive:
    {
        "account_name": "ysbbs hsbsb nxnznq",
        "currency_code": "NGN",
        "customer_email": "jxbbz@qq.com",
        "customer_name": "ysbbs hsbsb nxnznq",
        "bvn": "54848484888",
        "nin":"34848484058",
    }
    
    Transform to:
    {
        "accountReference": "abc123d380",
        "accountName": "ysbbs hsbsb nxnznq",
        "currencyCode": "NGN",
        "contractCode": "7059707855",
        "customerEmail": "jxbbz@qq.com",
        "customerName": "ysbbs hsbsb nxnznq",
        "bvn": "54848484888",
        "nin":"34848484058",
        "getAllAvailableBanks": true
    }
    '''
    url = f'{BASE_URL}/api/v2/bank-transfer/reserved-accounts'
    data = {
        'accountReference': f'INV-{uuid.uuid4()}',
        'accountName': payload['account_name'],
        'currencyCode': payload['currency_code'],
        'contractCode': CONTRACT_CODE,
        'customerEmail': payload['customer_email'],
        'customerName': payload['customer_name'],
        'bvn': payload['bvn'],
        'nin': payload['nin'],
        'getAllAvailableBanks': True
    }
    
    response = requests.post(url, data=data, headers=header)
    
    return response.json()

# def get_virtual_account(account_reference):
#     '''
#     {{baseurl}}/api/v1/virtual-bank-account/:accountReference
#     '''
#     url = f'{KORA_PAY_BASE_URL}/api/v1/virtual-bank-account/:{account_reference}'
#     body = {
#         'account_reference': account_reference
#     }
#     response = requests.get(url, data=body, headers=header)
    
#     return response.json()


# def create_hash(body):
#     secret_bytes = SECRET_KEY.encode('utf-8')
#     body_string = json.dumps(body)
#     body_bytes = body_string.encode('utf-8')
    
#     hash_object = hmac.new(secret_bytes, body_bytes, hashlib.sha512)
#     return hash_object.hexdigest()


def get_user_transactions(user):
    
    # get the user's wallet
    wallet = Wallet.objects.get_or_create(user=user)[0]

    # get the user's savings plans
    user_savings_plans = UserSavingsPlan.objects.filter(user=user)
    
    # Q object for query
    query = Q()
    
    query |= Q(sender_entity='WALLET', sender_id=wallet.id)
    query |= Q(receiver_entity='WALLET', receiver_id=wallet.id)
    
    for plan in user_savings_plans:
        query |= Q(sender_entity='PLAN', sender_id=plan.id)
        query |= Q(receiver_entity='PLAN', receiver_id=plan.id)
    
    # transactions related to user
    transactions = Transaction.objects.filter(query).order_by('-created_at')
    
    return transactions