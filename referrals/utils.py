from .models import Referral, UserReferral
from notifications.utils import create_notification
from decimal import Decimal
from django.utils import timezone

def complete_referral(referred_user):
    """
    Called when a user completes KYC. 
    Marks the referral as COMPLETED and notifies the referrer.
    """
    try:
        referral = Referral.objects.get(referred_user=referred_user, status='PENDING')
        referral.status = 'COMPLETED'
        referral.completed_at = timezone.now()
        
        # In a real scenario, you might add a reward amount here
        # For now, we'll just mark it as completed.
        # referral.reward_amount = Decimal('500.00') 
        
        referral.save()
        
        # Notify the referrer
        create_notification(
            user=referral.referrer,
            title="Referral Successful! 🤝",
            message=f"Your friend {referred_user.get_full_name()} has completed their KYC. You're one step closer to your reward!",
            notification_type='ACHIEVEMENT'
        )
        
        return True
    except Referral.DoesNotExist:
        return False
