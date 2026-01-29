from django.db import models
from django.conf import settings
import uuid
import string
import random

User = settings.AUTH_USER_MODEL

class UserReferral(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='referral_profile')
    referral_code = models.CharField(max_length=12, unique=True, db_index=True)
    total_referrals = models.IntegerField(default=0)
    total_earnings = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.referral_code}"

    @staticmethod
    def generate_code():
        length = 8
        while True:
            code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))
            if not UserReferral.objects.filter(referral_code=code).exists():
                return code


class Referral(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('COMPLETED', 'Completed'),
        ('REWARDED', 'Rewarded'),
    ]

    referrer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='referrals_sent')
    referred_user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='referral_received')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    reward_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.referrer.email} referred {self.referred_user.email}"
