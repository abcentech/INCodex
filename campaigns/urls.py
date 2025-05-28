from django.urls import path
from .views import CampaignsView, UserSavingsPlansView

urlpatterns = [
    path('', CampaignsView.as_view(), name='campaigns'),
    path('user_savings_plans/', UserSavingsPlansView.as_view(), name='tranfer-funds'),
    path('<str:pk>/', CampaignsView.as_view(), name='campaigns'),
]