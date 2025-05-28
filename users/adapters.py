from allauth.account.adapter import DefaultAccountAdapter
from allauth.account.utils import user_email
from django.urls import reverse
from django.conf import settings
from django.template.loader import render_to_string
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import send_mail
from django.utils import timezone

from .models import OTP

import random
from datetime import timedelta

class CustomAccountAdapter(DefaultAccountAdapter):
    def get_email_confirmation_url(self, request, emailconfirmation):
        """
        Constructs the email confirmation (activation) url.
        """
        url = reverse(
            "account_confirm_email",
            args=[emailconfirmation.key])
        return request.build_absolute_uri(url)

    def send_confirmation_mail(self, request, emailconfirmation, signup):
        """
        We override this method to prevent sending the confirmation email verification link.
        We're sending an OTP instead
        """
        user = emailconfirmation.email_address.user
        otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])
        
        # Create OTP object
        OTP.objects.create(user=user, otp=otp, expires_at=timezone.now() + timedelta(minutes=10))
        
        # Send email with OTP
        current_site = get_current_site(request)
        activate_url = self.get_email_confirmation_url(request, emailconfirmation)
        ctx = {
            "user": user,
            "activate_url": activate_url,
            "current_site": current_site,
            "key": emailconfirmation.key,
            "otp": otp,
        }
        subject = render_to_string(
            "account/email/email_confirmation_signup_subject.txt", ctx
        )
        subject = " ".join(subject.splitlines())
        message = render_to_string(
            "account/email/email_confirmation_signup_message.txt", ctx
        )
        send_mail(subject=subject, message=message, from_email=settings.DEFAULT_FROM_EMAIL, recipient_list=[emailconfirmation.email_address.email])

    def confirm_email(self, request, email_address):
        """
        Marks the email address as confirmed on the db
        """
        email_address.verified = True
        email_address.set_as_primary(conditional=True)
        email_address.save()