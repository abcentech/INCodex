from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    VerifyUserView, CheckUserView, LegacySendOTPView, FinalizeMigrationView, UserTaskViewSet,
    SecurityViewSet
)

router = DefaultRouter()
router.register(r'tasks', UserTaskViewSet, basename='user-tasks')
router.register(r'security', SecurityViewSet, basename='security')

urlpatterns = [
    path('verify-user/', VerifyUserView.as_view(), name='verify-user'),
    path('auth/check-user/', CheckUserView.as_view(), name='check-user'),
    path('auth/legacy/send-otp/', LegacySendOTPView.as_view(), name='legacy-send-otp'),
    path('auth/legacy/finalize/', FinalizeMigrationView.as_view(), name='legacy-finalize'),
    path('', include(router.urls)),
]