from django.shortcuts import render
from django.utils import timezone
from django.shortcuts import get_object_or_404
from decimal import Decimal
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.generics import (
    ListAPIView,
    ListCreateAPIView,
    RetrieveUpdateAPIView,
)
from rest_framework.permissions import IsAuthenticated

from wallet.models import Wallet, Transaction, create_transaction, process_transaction
from wallet.permissions import IsOwner
from wallet.serializers import TransactionSerializer

from .models import Campaign, SavingsPlan, UserSavingsPlan, create_user_savings_plan
from .serializers import CampaignSerializer, UserSavingsPlanSerializer, CampaignInvestmentSerializer, CampaignDetailSerializer
from .auto_transfer_serializers import AutoTransferToggleSerializer, AutoTransferAmountSerializer
from utils.portfolio_optimizer import PortfolioOptimizer
from utils.performance import PerformanceCalculator
from .permissions import IsBusiness, IsCampaignOwner


# Create your views here.
class CampaignsView(APIView):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [IsAuthenticated()]
        elif self.request.method in ["PUT", "PATCH", "DELETE"]:
            return [IsAuthenticated(), IsBusiness(), IsCampaignOwner()]
        return [IsAuthenticated(), IsBusiness()]

    def get(self, request, pk=None):
        if pk:
            campaign = get_object_or_404(Campaign, id=pk)
            serializer = CampaignDetailSerializer(campaign)
        else:
            campaigns = self.queryset.filter(end_date__gt=timezone.now().date())
            serializer = self.serializer_class(campaigns, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(serializer, status=status.HTTP_201_CREATED)

        return Response(
            {"details": "Campaign could not be created."},
            status=status.HTTP_400_BAD_REQUEST,
        )


class PortfolioRebalancingView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        optimizer = PortfolioOptimizer(request.user)
        allocation = optimizer.get_current_allocation()
        recommendations = optimizer.get_recommendations()
        
        return Response({
            "risk_profile": optimizer.risk_profile,
            "current_allocation": allocation,
            "target_allocation": optimizer.target,
            "recommendations": recommendations
        })

class PerformanceAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        calculator = PerformanceCalculator(request.user)
        performance = calculator.get_portfolio_performance()
        
        return Response(performance)

    def put(self, request, pk):
        campaign = get_object_or_404(Campaign, pk=pk)
        serializer = self.serializer_class(campaign, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(
            {"details": "Campaign could not be updated."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    def patch(self, request, pk):
        campaign = get_object_or_404(Campaign, pk=pk)
        serializer = self.serializer_class(campaign, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(
            {"details": "Campaign could not be partially updated."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    def delete(self, request, pk):
        campaign = get_object_or_404(Campaign, pk=pk)
        campaign.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserSavingsPlansView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSavingsPlanSerializer
    queryset = UserSavingsPlan.objects.all()

    def get(self, request, plan_id=None):
        if plan_id:
            user_savings_plan = get_object_or_404(self.queryset, id=plan_id, user=request.user)
            serializer = self.serializer_class(user_savings_plan)
        else:
            user_savings_plans = self.queryset.filter(user=request.user)
            serializer = self.serializer_class(user_savings_plans, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):

        # PLAN
        # Ignore campaigns, since you can still get it from the savings plan if
        # it is related to one
        # Right now, it's more like:
        # POST: Get a savings plan, get the amount they want to deposit,
        # Create a usersavingsplan from the data received

        # POST: Get a savings plan, get the amount they want to deposit,
        # Create a usersavingsplan from the data received

        savings_plan_id = request.data.get("savings_plan")
        units_bought = request.data.get("units_bought", 1)
        amount = request.data.get("amount")

        if not savings_plan_id or not amount:
            return Response({"details": "savings_plan and amount are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            savings_plan = SavingsPlan.objects.get(id=savings_plan_id)
        except (SavingsPlan.DoesNotExist, ValueError):
            return Response({"details": "SavingsPlan does not exist"}, status=status.HTTP_404_NOT_FOUND)

        # create user savings plan
        goal_amount = Decimal(str(savings_plan.min_investment)) * Decimal(str(savings_plan.duration))

        user_savings_plan = create_user_savings_plan(
            user=request.user,
            savings_plan=savings_plan,
            title=f"My {savings_plan.campaign.title} Plan",
            goal_amount=goal_amount,
            units_bought=units_bought,
        )

        # creating and processing transaction
        try:
            tx = create_transaction(
                sender_wallet=request.user.wallet,
                receiver_wallet=savings_plan.campaign.business.user.wallet,
                amount=Decimal(str(amount)),
                description=f"Investment into {savings_plan.campaign.title}",
                transaction_type="INVESTMENT",
            )
            success, msg = process_transaction(tx.id)

            if success:
                # Update the plan balance
                user_savings_plan.balance += Decimal(str(amount))
                user_savings_plan.save()
                
                return Response(
                    {"details": "Transfer successful.", "balance": request.user.wallet.balance},
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response({"details": msg}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
                {"details": "Transfer failed.", "error": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class ToggleAutoTransferView(APIView):
    """Toggle auto-transfer for a specific savings plan"""
    permission_classes = [IsAuthenticated]

    def post(self, request, plan_id):
        try:
            plan = UserSavingsPlan.objects.get(id=plan_id, user=request.user)
        except UserSavingsPlan.DoesNotExist:
            return Response(
                {"details": "Savings plan not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = AutoTransferToggleSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        plan.auto_transfer_enabled = serializer.validated_data['auto_transfer_enabled']
        
        # If enabling auto-transfer, ensure transfer_amount is set
        if plan.auto_transfer_enabled and not plan.transfer_amount:
            # Default to min_investment if available
            if plan.savings_plan and plan.savings_plan.min_investment:
                plan.transfer_amount = plan.savings_plan.min_investment
            else:
                return Response(
                    {"details": "Please set a transfer amount before enabling auto-transfer"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Reset status to ACTIVE if it was PAUSED due to failed transfers
        if plan.auto_transfer_enabled and plan.status == "PAUSED":
            plan.status = "ACTIVE"
            plan.failed_transfer_count = 0
        
        plan.save()
        
        return Response(
            {
                "details": f"Auto-transfer {'enabled' if plan.auto_transfer_enabled else 'disabled'}",
                "auto_transfer_enabled": plan.auto_transfer_enabled,
                "transfer_amount": str(plan.transfer_amount) if plan.transfer_amount else None,
                "next_transfer_date": plan.next_transfer_date
            },
            status=status.HTTP_200_OK
        )


class UpdateTransferAmountView(APIView):
    """Update the auto-transfer amount for a specific savings plan"""
    permission_classes = [IsAuthenticated]

    def patch(self, request, plan_id):
        try:
            plan = UserSavingsPlan.objects.get(id=plan_id, user=request.user)
        except UserSavingsPlan.DoesNotExist:
            return Response(
                {"details": "Savings plan not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = AutoTransferAmountSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        plan.transfer_amount = serializer.validated_data['transfer_amount']
        plan.save()
        
        return Response(
            {
                "details": "Transfer amount updated successfully",
                "transfer_amount": str(plan.transfer_amount),
                "auto_transfer_enabled": plan.auto_transfer_enabled
            },
            status=status.HTTP_200_OK
        )


class CampaignInvestmentView(APIView):
    """Handle user investment into a campaign"""
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        campaign = get_object_or_404(Campaign, pk=pk)
        serializer = CampaignInvestmentSerializer(
            data=request.data, 
            context={'campaign_id': campaign.id}
        )
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        units = serializer.validated_data['units']
        savings_plan_id = serializer.validated_data['savings_plan_id']
        savings_plan = get_object_or_404(SavingsPlan, id=savings_plan_id, campaign=campaign)
        
        amount = Decimal(str(units)) * campaign.unit_price
        
        # 1. Check wallet balance
        if request.user.wallet.balance < amount:
            return Response(
                {"details": "Insufficient wallet balance."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            with transaction.atomic():
                # 2. Create and process transaction
                tx = create_transaction(
                    sender_wallet=request.user.wallet,
                    receiver_wallet=campaign.business.user.wallet,
                    amount=amount,
                    description=f"Investment of {units} units into {campaign.title}",
                    transaction_type="INVESTMENT",
                )
                
                success, msg = process_transaction(tx.id)
                
                if not success:
                    return Response({"details": msg}, status=status.HTTP_400_BAD_REQUEST)
                
                # 3. Update Campaign units
                campaign.current_units += units
                campaign.save()
                
                # 4. Create or update UserSavingsPlan
                # Calculate goal amount for the plan (example logic)
                goal_amount = Decimal(str(savings_plan.min_investment)) * Decimal(str(savings_plan.duration))
                
                user_savings_plan = create_user_savings_plan(
                    user=request.user,
                    savings_plan=savings_plan,
                    title=f"My {campaign.title} Investment",
                    goal_amount=goal_amount,
                    units_bought=units
                )
                
                user_savings_plan.balance += amount
                user_savings_plan.save()
                
                # 5. Notify the user (Integrated from previous feature)
                from notifications.utils import notify_transaction
                notify_transaction(
                    user=request.user,
                    transaction_type="INVESTMENT",
                    amount=amount,
                    description=f"Successfully invested in {campaign.title} ({units} units)"
                )
                
                return Response(
                    {
                        "details": "Investment successful",
                        "units": units,
                        "amount": str(amount),
                        "campaign_title": campaign.title,
                        "new_balance": str(request.user.wallet.balance)
                    },
                    status=status.HTTP_201_CREATED
                )
                
        except Exception as e:
            return Response(
                {"details": "Investment failed due to a system error.", "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

