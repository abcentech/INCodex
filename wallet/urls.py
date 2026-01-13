from django.urls import path
from .views import TransactionListView, WalletBalanceView, TransferView, WalletAnalyticsView

urlpatterns = [
    path('transactions/', TransactionListView.as_view(), name='transactions'),
    path('balance/', WalletBalanceView.as_view(), name='balance'),
    path('transfer/', TransferView.as_view(), name='transfer'),
    path('analytics/', WalletAnalyticsView.as_view(), name='analytics'),
]
