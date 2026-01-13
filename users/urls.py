from django.urls import path
from .views import VerifyUserView, CheckUserView, LegacySendOTPView, FinalizeMigrationView


urlpatterns = [
    path('verify-user/', VerifyUserView.as_view(), name='verify-user'),
    path('auth/check-user/', CheckUserView.as_view(), name='check-user'),
    path('auth/legacy/send-otp/', LegacySendOTPView.as_view(), name='legacy-send-otp'),
    path('auth/legacy/finalize/', FinalizeMigrationView.as_view(), name='legacy-finalize'),
]