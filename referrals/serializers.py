from rest_framework import serializers
from .models import UserReferral, Referral
from django.contrib.auth import get_user_model

User = get_user_model()

class UserReferralSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserReferral
        fields = ['referral_code', 'total_referrals', 'total_earnings', 'created_at']
        read_only_fields = ['total_referrals', 'total_earnings', 'created_at']

class ReferralSerializer(serializers.ModelSerializer):
    referred_user_name = serializers.CharField(source='referred_user.get_full_name', read_only=True)
    
    class Meta:
        model = Referral
        fields = ['id', 'referred_user_name', 'status', 'reward_amount', 'created_at', 'completed_at']
        read_only_fields = ['id', 'referred_user_name', 'status', 'reward_amount', 'created_at', 'completed_at']

class ApplyReferralCodeSerializer(serializers.Serializer):
    referral_code = serializers.CharField(max_length=12)

    def validate_referral_code(self, value):
        if not UserReferral.objects.filter(referral_code=value).exists():
            raise serializers.ValidationError("Invalid referral code.")
        return value
