"""
URL configuration for investnaira project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path

from dj_rest_auth.views import PasswordResetConfirmView, PasswordResetView, LoginView, LogoutView, UserDetailsView, PasswordChangeView
from dj_rest_auth.registration.views import RegisterView, VerifyEmailView
from rest_framework_simplejwt.views import TokenRefreshView

from rest_framework.schemas import get_schema_view
from rest_framework.documentation import include_docs_urls

from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerSplitView, SpectacularYAMLAPIView, SpectacularJSONAPIView

from users.views import CustomConfirmEmailView, VerifyOTPView, CustomResendEmailVerificationView, CustomPasswordResetView, CustomPasswordResetConfirmView


schema_view = get_schema_view(title='Investnaira API', url='http://localhost:8000/', urlconf='investnaira.urls', description='API for Investnaira', version='1.0.0')

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('api/v1/users/', include('users.urls')),

    # SCHEMA & DOCUMENTATION URLS
    path('api/v1/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/v1/docs/', SpectacularSwaggerSplitView.as_view(), name='investnaira-swagger-ui'),
    path('api/v1/redoc/', SpectacularRedocView.as_view(), name='investnaira-redoc'),
    path('api/v1/schema-yaml', SpectacularYAMLAPIView.as_view(), name='schema-yaml'),   # downloads the schema as a yaml file to your machine
    path('api/v1/schema-json', SpectacularJSONAPIView.as_view(), name='schema-json'),
    
    # AUTH URLS
    re_path(r'^api/v1/auth/login', LoginView.as_view(), name='login'),
    re_path(r'^api/v1/auth/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    re_path(r'^api/v1/auth/logout', LogoutView.as_view(), name='logout'),
    re_path(r'^api/v1/auth/user', UserDetailsView.as_view(), name='user'),
    re_path(r'^api/v1/auth/registration/register', RegisterView.as_view(), name='register'),
    re_path(r'^api/v1/auth/registration/verify-email/', VerifyEmailView.as_view(), name='verify-email'),
    re_path(r'^api/v1/auth/registration/resend-email/', CustomResendEmailVerificationView.as_view(), name='resend-verification-email'),
    re_path(r'^api/v1/auth/registration/account-confirm-email/', CustomConfirmEmailView.as_view(), name='account_confirm_email'),
    path('api/v1/auth/password/reset', CustomPasswordResetView.as_view(), name='password-reset'),
    path('api/v1/auth/password/reset/confirm/', CustomPasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('api/v1/auth/password/change/', PasswordChangeView.as_view(), name='password_change'),
    path('api/v1/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/v1/auth/verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),

    # WALLET & TRANSACTION URLS
    path('api/v1/wallet/', include('wallet.urls')),

    # USER URLS
    path('api/v1/users/', include('users.urls')),   
    
    # CAMPIAGN URLS
    path('api/v1/campaigns/', include('campaigns.urls')),
]
