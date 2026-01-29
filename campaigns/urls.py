from django.urls import path
from .views import (
    CampaignsView, UserSavingsPlansView, ToggleAutoTransferView, 
    UpdateTransferAmountView, CampaignInvestmentView, PortfolioRebalancingView,
    PerformanceAnalyticsView
)

app_name = 'campaigns'

urlpatterns = [
    path('', CampaignsView.as_view(), name='campaigns'),
    path('<pk>/', CampaignsView.as_view(), name='campaign-detail'),
    path('<pk>/invest/', CampaignInvestmentView.as_view(), name='campaign-invest'),
    path('savings-plans/', UserSavingsPlansView.as_view(), name='user-savings-plans'),
    path('savings-plans/<str:plan_id>/', UserSavingsPlansView.as_view(), name='user-savings-plan-detail'),
    path('portfolio-rebalancing/', PortfolioRebalancingView.as_view(), name='portfolio-rebalancing'),
    path('performance-analytics/', PerformanceAnalyticsView.as_view(), name='performance-analytics'),
    path('savings-plans/<str:plan_id>/toggle-auto-transfer/', ToggleAutoTransferView.as_view(), name='toggle-auto-transfer'),
    path('savings-plans/<str:plan_id>/transfer-amount/', UpdateTransferAmountView.as_view(), name='update-transfer-amount'),
]