import requests
import json
import base64
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv('MONNIFY_SECRET_KEY')
API_KEY = os.getenv('MONNIFY_API_KEY')
BASE_URL = 'https://sandbox.monnify.com'


def generate_access_token(base_url, api_key, secret_key):
    # Endpoint
    url = f"{base_url}/api/v1/auth/login"

    # Create the authorization header
    credentials = f"{api_key}:{secret_key}"
    encoded_credentials = base64.b64encode(credentials.encode('utf-8')).decode('utf-8')
    headers = {
        "Authorization": f"Basic {encoded_credentials}",
        "Content-Type": "application/json"
    }

    # Make the POST request
    try:
        response = requests.post(url, headers=headers, data=json.dumps({}))
        response.raise_for_status()  # Raises a HTTPError if the status is 4xx, 5xx
        
        # Parse the JSON response
        token_data = response.json()
        
        return token_data['responseBody']['accessToken']
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None


def verify_bank_account(bvn, account_number, bank_code):
    url = f"{BASE_URL}/api/v1/vas/bvn-account-match"
    headers = {
        'Authorization': f'Bearer {generate_access_token(BASE_URL, API_KEY, SECRET_KEY)}',
        'Content-Type': 'application/json'
    }
    
    payload = {
        "bankCode": bank_code,
        "accountNumber": account_number,
        "bvn": bvn,
    }
    
    response = requests.post(url, headers=headers, data=payload)
    data = response.json()
    
    return data