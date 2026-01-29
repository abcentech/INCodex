from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.conf import settings

User = get_user_model()

class DevAuthBackend(ModelBackend):
    """
    Custom authentication backend that allows authentication with any password 
    for existing users when DEBUG is True.
    """
    def authenticate(self, request, email=None, password=None, **kwargs):
        if not settings.DEBUG:
            return None
            
        if email is None:
            email = kwargs.get(User.get_email_field_name())
            
        try:
            user = User.objects.get(email=email)
            # Ensure EmailAddress exists and is verified for allauth
            from allauth.account.models import EmailAddress
            email_address, created = EmailAddress.objects.get_or_create(
                user=user, 
                email=user.email,
                defaults={'verified': True, 'primary': True}
            )
            if not email_address.verified:
                email_address.verified = True
                email_address.save()
            
            if not user.is_verified:
                user.is_verified = True
                user.save()
                
            # Allow any password if DEBUG is True
            return user
        except User.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
