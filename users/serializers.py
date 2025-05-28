from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import serializers

from dj_rest_auth.registration.serializers import RegisterSerializer

from .models import Customer, Business, OTP
from wallet.serializers import WalletSerializer

User = get_user_model()
class UserSerializer(serializers.ModelSerializer):
    wallet = WalletSerializer(read_only=True)
    class Meta:
        model = User
        fields = ['id', 'email', 'phone_number', 'wallet', 'user_type']
        read_only_fields = ['id']
        
    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.user_type == 'CUSTOMER':
            try:
                customer = Customer.objects.get(pk=instance.pk)
                customer_data = CustomerSerializer(customer).data
                data.update({k: v for k, v in customer_data.items() if k not in data and k != 'password'})
            except Customer.DoesNotExist:
                pass
        elif instance.user_type == 'BUSINESS':
            try:
                business = Business.objects.get(pk=instance.pk)
                business_data = BusinessSerializer(business).data
                data.update({k: v for k, v in business_data.items() if k not in data and k != 'password'})
            except Business.DoesNotExist:
                pass
        return data

class CustomerSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    wallet = WalletSerializer(read_only=True)
    
    class Meta:
        model = Customer
        fields = ['id', 'email', 'phone_number', 'first_name', 'middle_name', 'last_name', 'date_of_birth', 'gender', 'state_of_origin', 'state_of_residence', 'next_of_kin_name', 'next_of_kin_phone', 'address', 'city', 'state', 'wallet', 'password']    # add referral_code later
        read_only_fields = ['id', 'wallet']     # add referral_code later
        extra_kwargs = {'password': {'write_only': True}}
    

    @transaction.atomic
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        customer = Customer.objects.create(**validated_data)
        if password:
            customer.set_password(password)
        customer.save()
        return customer

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr != 'password':
                setattr(instance, attr, value)
        instance.save()
        return instance


class BusinessSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    wallet = WalletSerializer(read_only=True)
    
    class Meta:
        model = Business
        fields = ['id', 'email', 'phone_number', 'profile_picture', 'tax_id', 'company_id', 'address', 'wallet', 'password']
        read_only_fields = ['id', 'wallet']
        extra_kwargs = {'password': {'write_only': True}}


    @transaction.atomic
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        business = Business.objects.create(**validated_data)
        if password:
            business.set_password(password)
        business.save()
        return business

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr != 'password':
                setattr(instance, attr, value)
        instance.save()
        return instance


class CustomRegisterSerializer(RegisterSerializer):
    user_type = serializers.ChoiceField(choices=['CUSTOMER', 'BUSINESS'])
    email = serializers.EmailField()
    phone_number = serializers.CharField(max_length=15)
    
    # Customer-specific fields
    first_name = serializers.CharField(max_length=40, required=False)
    middle_name = serializers.CharField(max_length=40, required=False)
    last_name = serializers.CharField(max_length=40, required=False)
    date_of_birth = serializers.DateField(required=False)
    gender = serializers.ChoiceField(choices=[('M', 'Male'), ('F', 'Female'), (None, 'Not specified')], required=False, allow_blank=True)
    state_of_origin = serializers.CharField(max_length=20, required=False)
    state_of_residence = serializers.CharField(max_length=20, required=False)
    next_of_kin_name = serializers.CharField(max_length=20, required=False)
    next_of_kin_phone = serializers.CharField(max_length=20, required=False)
    
    # Business-specific fields
    profile_picture = serializers.ImageField(required=False)
    company_name = serializers.CharField(max_length=100, required=False)
    tax_id = serializers.CharField(max_length=40, required=False)
    address = serializers.CharField(max_length=100, required=False)

    def to_internal_value(self, data):
        print("Received data:", data)  # This will print the received data
        return super().to_internal_value(data)

    @transaction.atomic
    def save(self, request):
        user_type = self.validated_data['user_type']
        
        # Remove the fields that are not part of the User model
        custom_fields = {}
        for field in ['first_name', 'middle_name', 'last_name', 'date_of_birth', 'gender', 'profile_picture', 'company_name', 'address', 'state_of_origin', 'state_of_residence', 'next_of_kin_name', 'next_of_kin_phone', 'address', 'city', 'state', 'tax_id']:
            if field in self.validated_data:
                custom_fields[field] = self.validated_data.pop(field)
        
        # Create the user object directly as Customer or Business
        if user_type == 'CUSTOMER':
            user = Customer.objects.create_user(
                email=self.validated_data.get('email'),
                password=self.validated_data.get('password1'),
                phone_number=self.validated_data.get('phone_number'),
                user_type=user_type,
                **custom_fields
            )
        elif user_type == 'BUSINESS':
            custom_fields.pop('gender', None)
            user = Business.objects.create_user(
                email=self.validated_data.get('email'),
                password=self.validated_data.get('password1'),
                phone_number=self.validated_data.get('phone_number'),
                user_type=user_type,
                **custom_fields
            )
        
        return user

    def validate(self, data):
        user_type = data.get('user_type')
        if user_type == 'CUSTOMER':
            if not all([data.get('first_name'), data.get('middle_name'), data.get('last_name')]):
                raise serializers.ValidationError({"customer_info": "first_ame, middle_name, and last_name are required for customer users."})
        elif user_type == 'BUSINESS':
            if not all([data.get('company_name'), data.get('tax_id'), data.get('address')]):
                raise serializers.ValidationError({"business_info": "company_name, tax_id, and address are required for business users."})
        return data
    
    
class OTPSerializer(serializers.ModelSerializer):
    # otp = serializers.CharField(max_length=6)
    class Meta:
        model = OTP
        fields = ['user', 'otp', 'created_at', 'expires_at']
        

class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
        

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()        
        
class PasswordResetConfirmSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
    new_password = serializers.CharField()
    
    
class IdentityVerificationSerializer(serializers.Serializer):
    bvn = serializers.CharField(max_length=11)
    account_number = serializers.CharField(max_length=10)
    bank_code = serializers.CharField(max_length=10)