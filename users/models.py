from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

from django_cryptography.fields import encrypt

from .managers import CustomUserManager

from datetime import timedelta
import uuid

# Create your models here.
class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    email = models.EmailField(max_length=40, unique=True, db_index=True)
    phone_number = encrypt(models.CharField(max_length=15, unique=True))
    date_joined = models.DateTimeField(auto_now_add=True)
    user_type = models.CharField(max_length=20, choices=[('CUSTOMER', 'Customer'), ('BUSINESS', 'Business')], default='CUSTOMER')
    updated_at = models.DateTimeField(auto_now=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    # custom
    is_verified = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    class Meta:
        # abstract = True
        pass


class Customer(User):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
    ]
    first_name = models.CharField(max_length=40)
    middle_name = models.CharField(max_length=40, blank=True)
    last_name = models.CharField(max_length=40)
    date_of_birth = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True)
    state_of_origin = models.CharField(max_length=20, null=True)    # change default to None, when you clearn the db
    state_of_residence = models.CharField(max_length=20, null=True)
    next_of_kin_name = models.CharField(max_length=20, null=True)
    next_of_kin_phone =  encrypt(models.CharField(max_length=15, unique=True, null=True))
    address = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=40, blank=True, null=True)
    state = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self) -> str:
        return f'Customer: {self.first_name} {self.last_name}'
    
    def get_full_name(self):
        return f'{self.first_name} {self.middle_name} {self.last_name}'


class Business(User):
    profile_picture = models.ImageField(upload_to='businesses/', blank=True, null=True)
    company_name = models.CharField(max_length=100, blank=True)
    tax_id = encrypt(models.CharField(max_length=40, unique=True, db_index=True, blank=True))
    address = models.CharField(max_length=100)

    class Meta:
        verbose_name_plural = "Businesses"

    def __str__(self) -> str:
        return f'Business: {self.company_name}'

class OTP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    
    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(minutes=10)
        super().save(*args, **kwargs)

    def is_valid(self):
        return timezone.now() <= self.expires_at