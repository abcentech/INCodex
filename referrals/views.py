from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import UserReferral, Referral
from .serializers import UserReferralSerializer, ReferralSerializer, ApplyReferralCodeSerializer
from django.utils import timezone

class MyReferralCodeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = request.user.referral_profile
        except UserReferral.DoesNotExist:
            profile = UserReferral.objects.create(
                user=request.user,
                referral_code=UserReferral.generate_code()
            )
        serializer = UserReferralSerializer(profile)
        return Response(serializer.data)

class ApplyReferralCodeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Check if user was already referred
        if Referral.objects.filter(referred_user=request.user).exists():
            return Response({"details": "Referral code already applied."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ApplyReferralCodeSerializer(data=request.data)
        if serializer.is_valid():
            code = serializer.validated_data['referral_code']
            referrer_profile = get_object_or_404(UserReferral, referral_code=code)
            
            # Prevent self-referral
            if referrer_profile.user == request.user:
                return Response({"details": "You cannot refer yourself."}, status=status.HTTP_400_BAD_REQUEST)

            # Create the referral record
            Referral.objects.create(
                referrer=referrer_profile.user,
                referred_user=request.user,
                status='PENDING'
            )
            
            # Update referrer's total count (optional, or wait for completion)
            referrer_profile.total_referrals += 1
            referrer_profile.save()

            return Response({"details": "Referral code applied successfully."}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ReferralStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        referrals = Referral.objects.filter(referrer=request.user).order_by('-created_at')
        serializer = ReferralSerializer(referrals, many=True)
        
        # Add summary stats
        profile = request.user.referral_profile
        return Response({
            "referral_code": profile.referral_code,
            "total_referrals": profile.total_referrals,
            "total_earnings": profile.total_earnings,
            "referrals": serializer.data
        })
