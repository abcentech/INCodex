from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

from utils.wallet import get_user_transactions
from .serializers import TransactionSerializer

class TransactionListView(ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return get_user_transactions(self.request.user).order_by('-created_at')

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class WalletBalanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            wallet = request.user.wallet
            return Response({
                'balance': wallet.balance,
                'currency': 'NGN' # Default for now
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Wallet not found'}, status=status.HTTP_404_NOT_FOUND)

from users.models import User
from .models import create_transaction, process_transaction

class TransferView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        recipient_email = request.data.get('email')
        amount = request.data.get('amount')
        description = request.data.get('description', 'Transfer')

        if not recipient_email or not amount:
            return Response({'detail': 'Email and amount are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            amount = float(amount)
            if amount <= 0:
                 return Response({'detail': 'Amount must be positive'}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
             return Response({'detail': 'Invalid amount'}, status=status.HTTP_400_BAD_REQUEST)

        if request.user.email == recipient_email:
             return Response({'detail': 'Cannot transfer to self'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            recipient = User.objects.get(email=recipient_email)
            if not hasattr(recipient, 'wallet'):
                 # Create wallet if missing (shouldn't happen for valid users but safety)
                 from .models import Wallet
                 Wallet.objects.create(user=recipient)
            
            # Atomic transaction creation and processing
            try:
                tx = create_transaction(
                    sender_wallet=request.user.wallet,
                    receiver_wallet=recipient.wallet,
                    amount=amount,
                    description=description,
                    transaction_type='TRANSFER'
                )
                success, msg = process_transaction(tx.id)
                
                if success:
                    return Response({'detail': 'Transfer successful', 'data': TransactionSerializer(tx).data}, status=status.HTTP_200_OK)
                else:
                    return Response({'detail': msg}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                 return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except User.DoesNotExist:
            return Response({'detail': 'Recipient not found'}, status=status.HTTP_404_NOT_FOUND)

class DepositView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        amount = request.data.get('amount')
        description = request.data.get('description', 'Wallet Deposit')

        if not amount:
            return Response({'detail': 'Amount is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            amount = Decimal(str(amount))
            if amount <= 0:
                 return Response({'detail': 'Amount must be positive'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
             return Response({'detail': 'Invalid amount'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            tx = create_transaction(
                receiver_wallet=request.user.wallet,
                amount=amount,
                description=description,
                transaction_type='DEPOSIT'
            )
            success, msg = process_transaction(tx.id)
            if success:
                return Response({'detail': 'Deposit successful', 'balance': request.user.wallet.balance}, status=status.HTTP_200_OK)
            return Response({'detail': msg}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class WithdrawView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        amount = request.data.get('amount')
        description = request.data.get('description', 'Wallet Withdrawal')

        if not amount:
            return Response({'detail': 'Amount is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            amount = Decimal(str(amount))
            if amount <= 0:
                 return Response({'detail': 'Amount must be positive'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
             return Response({'detail': 'Invalid amount'}, status=status.HTTP_400_BAD_REQUEST)

        if request.user.wallet.balance < amount:
            return Response({'detail': 'Insufficient funds'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            tx = create_transaction(
                sender_wallet=request.user.wallet,
                amount=amount,
                description=description,
                transaction_type='WITHDRAWAL'
            )
            success, msg = process_transaction(tx.id)
            if success:
                return Response({'detail': 'Withdrawal successful', 'balance': request.user.wallet.balance}, status=status.HTTP_200_OK)
            return Response({'detail': msg}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

from django.db.models import Sum
from decimal import Decimal
from datetime import timedelta
from django.utils import timezone
from campaigns.models import UserSavingsPlan

class WalletAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        # 1. Asset Allocation
        wallet_balance = user.wallet.balance
        
        # Sum of active savings plans
        savings_balance = UserSavingsPlan.objects.filter(
            user=user.customer, 
            status='ACTIVE'
        ).aggregate(total=Sum('balance'))['total'] or 0
        
        total_net_worth = wallet_balance + savings_balance
        
        allocation = {
            'wallet': wallet_balance,
            'savings': savings_balance,
            'net_worth': total_net_worth
        }

        # 2. Portfolio Growth (Chart Data) - Last 365 Days
        # This is a simplified reconstruction. For production, a daily snapshot table is better.
        # We start with current balance and work backwards using transactions.
        
        days = 365
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=days-1)
        
        # Fetch transactions in the last 365 days
        start_datetime = timezone.make_aware(timezone.datetime.combine(start_date, timezone.datetime.min.time()))
        transactions = get_user_transactions(user).filter(
            created_at__gte=start_datetime
        ).order_by('-created_at')
        
        daily_balances = []
        current_running_balance = wallet_balance # This assumes wallet balance is the main driver + savings. 
        # Ideally we should track "Net Worth" history, but for now let's track "Wallet Balance" history 
        # or we assume savings balance is relatively static/monotonic. 
        # Let's track Wallet Breakdown for the line chart for simplicity, 
        # or if we want "Wealth", we combine them. Let's stick to Wallet Balance for the chart 
        # to match the transactions we have.
        
        # Map transactions to dates
        tx_by_date = {}
        for tx in transactions:
            date_str = tx.created_at.date().isoformat()
            if date_str not in tx_by_date:
                tx_by_date[date_str] = 0
            
            # If it was a DEPOSIT, it added to balance, so previous was LESS.
            # If it was a WITHDRAWAL/TRANSFER/INVESTMENT (out), it subtracted, so previous was MORE.
            # We are working BACKWARDS from Today.
            
            if tx.transaction_type == 'DEPOSIT':
                tx_by_date[date_str] += tx.amount # We will SUBTRACT this to go back
            else:
                tx_by_date[date_str] -= tx.amount # We will ADD this to go back
                
        # Generate last 30 days
        running_bal = wallet_balance
        history = []
        
        for i in range(days):
            # Going backwards from today? Or forward?
            # Let's simple create the range and fill it.
            # Easier to loop backwards from today.
            d = end_date - timedelta(days=i)
            d_str = d.isoformat()
            
            history.append({
                'date': d_str,
                'balance': running_bal
            })
            
            # Adjust running_bal for the PREV day
            # Balance(Yesterday) = Balance(Today) - (Deposits_Today - Withdrawals_Today)
            # Net Change Today = Deposits - Withdrawals
            # Actually, `tx_by_date` above calculated Net Change (Positive = Deposit).
            # So: Balance(Yesterday) = Balance(Today) - NetCode(Today)
            
            change = tx_by_date.get(d_str, 0)
            
            # If tx was DEPOSIT (+1000), Balance went UP today. So Yesterday was 1000 less.
            # So running_bal - 1000.
            # If tx was WITHDRAWAL (-500), Balance went DOWN today. So Yesterday was 500 more.
            # So running_bal - (-500) = running_bal + 500.
            
            # Wait, my logic in the loop above for tx_by_date:
            # if DEPOSIT: tx_by_date += amount (Positive)
            # else: tx_by_date -= amount (Negative)
            
            # So `change` is the Net Flow for that day.
            # PrevBalance = CurrBalance - Change
            
            running_bal = running_bal - change
            
        history.reverse() # Sort Chronologically
        
        return Response({
            'allocation': allocation,
            'chart_data': history
        }, status=status.HTTP_200_OK)
