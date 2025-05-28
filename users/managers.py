from django.contrib.auth.models import BaseUserManager

class CustomUserManager(BaseUserManager):
    
    # Review code later on

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email must be provided.')
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self.db)

        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('phone_number', '')
        # extra_fields.setdefault('bvn', '')
        return self.create_user(email, password, **extra_fields)