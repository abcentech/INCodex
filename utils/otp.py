from django.utils import timezone
from datetime import timedelta
import random
from users.models import OTP, User

def generate_otp(user):
    # Invalidate old OTPs
    OTP.objects.filter(user=user).delete()
    
    otp_code = ''.join([str(random.randint(0, 9)) for _ in range(6)])
    otp = OTP.objects.create(
        user=user,
        otp=otp_code,
        expires_at=timezone.now() + timedelta(minutes=10)
    )
    return otp_code

def verify_otp(user, otp_code):
    try:
        otp = OTP.objects.get(user=user, otp=otp_code)
        if otp.is_valid():
            otp.delete()
            return True
        return False
    except OTP.DoesNotExist:
        return False
