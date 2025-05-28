from django.shortcuts import render, get_object_or_404
from django.utils import timezone, html
from django.contrib.auth import get_user_model
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from dj_rest_auth.registration.views import VerifyEmailView, ConfirmEmailView, ResendEmailVerificationView
from dj_rest_auth.views import PasswordResetView, PasswordResetConfirmView

from allauth.account.views import ConfirmEmailView
from allauth.account.utils import send_email_confirmation
from allauth.account.models import EmailAddress

from .models import OTP, Customer
from .serializers import UserSerializer, OTPSerializer, PasswordResetConfirmSerializer, PasswordResetSerializer, VerifyOTPSerializer, IdentityVerificationSerializer
from utils.users import verify_bank_account

from wallet.permissions import IsOwner

from sentry_sdk import capture_event, set_user

from datetime import timedelta
import random
import logging


User = get_user_model()

logger = logging.getLogger(__name__)

# Create your views here.

class CustomConfirmEmailView(ConfirmEmailView):
    def get(self, *args, **kwargs):
        self.object = self.get_object()
        if self.object.email_address.verified:
            return Response({'detail': 'Email already verified.'}, status=status.HTTP_200_OK)

        otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])
        
        OTP.objects.create(
            user=self.object.email_address.user,
            otp=otp,
            expires_at=timezone.now() + timedelta(minutes=10)
        )
        
        self.send_otp_email(self.object.email_address.email, otp)
        
        logger.info(f"OTP sent to {self.object.email_address.email}")
        return Response({'detail': 'OTP sent to your email.'}, status=status.HTTP_200_OK)
        
    

def send_otp_email(from_email, email, template, otp):
    subject = 'Your InvestNaira OTP Token'
    message = render_to_string(template, {
            'otp': otp,
        })
    send_mail(
        subject=subject,
        from_email=from_email,
        message=message,
        recipient_list=[email,],
        fail_silently=False,
    )


class VerifyOTPView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = VerifyOTPSerializer
    
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        
        try:
            email_address = EmailAddress.objects.get(email=email)
        except EmailAddress.DoesNotExist:
            logger.error(f"No account found with email: {email}")
            capture_event({'message': f"No account found with email: {email}"})
            return Response({'detail': 'No account found with this email address.'}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            otp_obj = OTP.objects.get(user=email_address.user, otp=otp)
        except OTP.DoesNotExist:
            logger.error(f"Invalid OTP: {otp}")
            return Response({'detail': 'Invalid OTP.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if otp_obj.is_valid():
            email_address.verified = True
            email_address.save()
            
            # Delete the OTP
            otp_obj.delete()
            
            logger.info(f"Email verified successfully: {email}")
            return Response({'detail': 'Email verified successfully.'}, status=status.HTTP_200_OK)
        else:
            logger.error(f"Expired OTP: {otp}")
            return Response({'detail': 'Expired OTP.'}, status=status.HTTP_400_BAD_REQUEST)
        

class CustomResendEmailVerificationView(ResendEmailVerificationView):
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = self.get_queryset().filter(**serializer.validated_data).first()
        if email and not email.verified:
            email.send_confirmation(request)
            
            logger.info(f"Email verification sent to {email.email}")
            return Response({'detail': 'Email verification sent'}, status=status.HTTP_200_OK)

        else:
            logger.info(f"Email has already been verified")
            return Response({'detail': 'Email has already been verified'}, status=status.HTTP_200_OK)


class CustomPasswordResetView(APIView):
    
    serializer_class = PasswordResetSerializer
    
    def post(self, request):
        data = self.serializer_class(data=request.data)
        
        if data.is_valid():
            email = data['email'].value
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                logger.error(f"User not found: {email}")
                return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            
            otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])
            
            OTP.objects.create(
                user=user,
                otp=otp,
                expires_at=timezone.now() + timedelta(minutes=10)
            )
            
            send_otp_email(from_email=settings.DEFAULT_FROM_EMAIL, email=email, template='account/email/password_reset_key.txt', otp=otp)
            
            logger.info(f"OTP sent to {email}")
            return Response({"detail": "OTP sent to your email"}, status=status.HTTP_200_OK)
        
        logger.error(f"Invalid request")
        return Response({'detail': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)
    

class CustomPasswordResetConfirmView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = PasswordResetConfirmSerializer
    
    def post(self, request):
        data = self.serializer_class(data=request.data)
        
        if data.is_valid():
            email = data['email'].value
            otp = data['otp'].value
            new_password = data['new_password'].value

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                logger.error(f"User not found: {email}")
                return Response({"detail": "User not found"}, status=status.HTTP_400_BAD_REQUEST)

            try:
                otp_obj = OTP.objects.filter(user=user).latest('created_at')
            except OTP.DoesNotExist:
                logger.error(f"OTP not found")
                return Response({"detail": "OTP not found"}, status=status.HTTP_400_BAD_REQUEST)

            if not otp_obj.is_valid() or otp_obj.otp != otp:
                logger.error(f"Invalid or expired OTP")
                return Response({"detail": "Invalid or expired OTP"}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.save()
            otp_obj.delete()

            logger.info(f"Password reset successful")
            return Response({"detail": "Password reset successful"}, status=status.HTTP_200_OK)
        
        logger.error(f"Invalid request")
        return Response({'detail': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)
    
    
class VerifyUserView(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = IdentityVerificationSerializer
    
    def post(self, request):
        set_user({"id": request.user.id, "email": request.user.email})
        serializer = self.serializer_class(data=request.data)
        user = request.user
        
        try:
            customer = user.customer
            if serializer.is_valid():
                data = serializer.validated_data
                print(data)
                response = verify_bank_account(data['bvn'], data['account_number'], data['bank_code'])
                print(response)
                
                # TODO: Clean up code when settled on a payment provider
                if response['status']:
                    if len(response['data']['account_name'].split(' ')) == 3:
                        customer.first_name, customer.middle_name, customer.last_name = response['data']['account_name'].split(' ')
                        setattr(customer._meta.get_field('first_name'), 'editable', False)
                        setattr(customer._meta.get_field('middle_name'), 'editable', False)
                        setattr(customer._meta.get_field('first_name'), 'editable', False)
                        
                        logger.info(f"Account verified: {response['data']['account_name']}")
                        return Response(response, status=status.HTTP_200_OK)
                    else:
                        customer.first_name, customer.last_name = response['data']['account_name'].split(' ')
                        setattr(customer._meta.get_field('first_name'), 'editable', False)
                        setattr(customer._meta.get_field('middle_name'), 'editable', False)
                        setattr(customer._meta.get_field('first_name'), 'editable', False)
                        
                        logger.info(f"Account verified: {response['data']['account_name']}")
                        return Response(response, status=status.HTTP_200_OK)
                else:
                    logger.error(f"Invalid account number: {data['account_number']}")
                    return Response(response, status=status.HTTP_400_BAD_REQUEST)
            else:
                logger.error(f"Invalid request: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Customer.DoesNotExist:
            logger.error(f"User is not a customer")
            return Response({"error": "User is not a customer"}, status=status.HTTP_400_BAD_REQUEST)