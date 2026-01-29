from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, UserSecurity

@receiver(post_save, sender=User)
def create_user_security(sender, instance, created, **kwargs):
    if created:
        UserSecurity.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_security(sender, instance, **kwargs):
    if not hasattr(instance, 'security'):
        UserSecurity.objects.get_or_create(user=instance)
    instance.security.save()
