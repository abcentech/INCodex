from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

from utils.wallet import get_user_transactions
from .serializers import TransactionSerializer

class TransactionListView(ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return get_user_transactions(self.request.user)
