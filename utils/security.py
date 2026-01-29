import hmac
import hashlib
import time
import base64
import struct
import secrets
import string

def generate_totp_secret(length=32):
    """Generate a random base32 secret for TOTP"""
    # Base32 characters: A-Z, 2-7
    base32_chars = string.ascii_uppercase + "234567"
    return ''.join(secrets.choice(base32_chars) for _ in range(length))

def get_totp_token(secret, intervals_no):
    """Calculate TOTP token for a given secret and interval number"""
    key = base64.b32decode(secret, casefold=True)
    # Convert intervals_no to 8-byte big-endian integer
    msg = struct.pack(">Q", intervals_no)
    # Calculate HMAC-SHA1
    hmac_hash = hmac.new(key, msg, hashlib.sha1).digest()
    
    # Dynamic truncation
    offset = hmac_hash[-1] & 0x0F
    code = struct.unpack(">I", hmac_hash[offset:offset+4])[0] & 0x7FFFFFFF
    
    return str(code % 1000000).zfill(6)

def verify_totp_token(secret, token, window=1):
    """Verify a TOTP token with a small time window (default 30s)"""
    if not secret or not token:
        return False
        
    try:
        current_time = int(time.time())
        interval = 30
        
        # Check current and adjacent intervals based on window
        for i in range(-window, window + 1):
            intervals_no = (current_time // interval) + i
            if get_totp_token(secret, intervals_no) == token:
                return True
    except Exception as e:
        print(f"TOTP verification error: {e}")
        return False
        
    return False

def generate_backup_codes(count=10, length=8):
    """Generate a list of random alphanumeric backup codes"""
    chars = string.ascii_uppercase + string.digits
    codes = []
    for _ in range(count):
        code = ''.join(secrets.choice(chars) for _ in range(length))
        codes.append(code)
    return codes
