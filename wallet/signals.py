from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver

from users.models import User, Customer, Business

from .models import Wallet

@receiver(post_save, sender=Customer)
def create_customer_wallet(sender, instance, created, **kwargs):
    if created:  # Only create a wallet when a new customer is created...for now. TBD if businesses can have wallets too
        # Create a wallet
        try:
            Wallet.objects.create(
                user=instance,
                balance=0.00
            )
            print(f"Wallet created for user: {instance.__str__()}")
        except Exception as e:
            # Log the error or handle it as needed
            print(f"Error creating wallet for user: {instance.__str__()}: {e}")


@receiver(post_save, sender=Business)
def create_business_wallet(sender, instance, created, **kwargs):
    if created:
        # Create a wallet
        try:
            Wallet.objects.create(
                user=instance,
                balance=0.00
            )
            print(f"Wallet created for user: {instance.__str__()}")
        except Exception as e:
            # Log the error or handle it as needed
            print(f"Error creating wallet for user: {instance.__str__()}: {e}")
        
        
@receiver(pre_delete, sender=User)
def handle_user_deletion(sender, instance, **kwargs):
    if hasattr(instance, 'wallet'):
        instance.wallet.user = None
        instance.wallet.save()
        print("Wallet user set to null")