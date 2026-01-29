from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import UserReferral

User = settings.AUTH_USER_MODEL

@receiver(post_save, sender=User)
def create_user_referral(sender, instance, created, **kwargs):
    if created:
        UserReferral.objects.create(
            user=instance,
            referral_code=UserReferral.generate_code()
        )
