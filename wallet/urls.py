from django.urls import path
from .views import TransactionListView, WalletBalanceView, TransferView, WalletAnalyticsView, DepositView, WithdrawView

urlpatterns = [
    path('transactions/', TransactionListView.as_view(), name='transactions'),
    path('balance/', WalletBalanceView.as_view(), name='balance'),
    path('transfer/', TransferView.as_view(), name='transfer'),
    path('deposit/', DepositView.as_view(), name='deposit'),
    path('withdraw/', WithdrawView.as_view(), name='withdraw'),
    path('analytics/', WalletAnalyticsView.as_view(), name='analytics'),
]
