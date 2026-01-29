from django.core.management.base import BaseCommand
from users.models import User, Customer
from django.db import transaction

class Command(BaseCommand):
    help = 'Create or update the superuser admin'

    def handle(self, *args, **options):
        email = 'invest@investnaira.com'
        password = 'password123'
        
        with transaction.atomic():
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'is_staff': True,
                    'is_superuser': True,
                    'is_active': True,
                    'is_verified': True,
                    'user_type': 'CUSTOMER',
                }
            )
            
            user.set_password(password)
            user.is_staff = True
            user.is_superuser = True
            user.is_verified = True
            user.save()
            
            # Ensure a Customer record exists for this user as well
            customer, c_created = Customer.objects.get_or_create(
                user_ptr=user,
                defaults={
                    'first_name': 'Invest',
                    'last_name': 'Naira',
                }
            )

            # Ensure allauth EmailAddress is verified
            from allauth.account.models import EmailAddress
            email_addr, ea_created = EmailAddress.objects.get_or_create(
                user=user,
                email=user.email,
                defaults={'verified': True, 'primary': True}
            )
            if not email_addr.verified:
                email_addr.verified = True
                email_addr.save()
            
            if created:
                self.stdout.write(self.style.SUCCESS(f'Successfully created superuser {email}'))
            else:
                self.stdout.write(self.style.SUCCESS(f'Successfully updated superuser {email}'))
