from django.urls import path
from .views import MyReferralCodeView, ApplyReferralCodeView, ReferralStatsView

app_name = 'referrals'

urlpatterns = [
    path('my-code/', MyReferralCodeView.as_view(), name='my-code'),
    path('apply-code/', ApplyReferralCodeView.as_view(), name='apply-code'),
    path('stats/', ReferralStatsView.as_view(), name='stats'),
]
