from django.shortcuts import render
from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
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
from .serializers import CampaignSerializer, UserSavingsPlanSerializer
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
            serializer = self.serializer_class(campaign)
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

    def get(self, request):
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

        data = self.serializer_class(data=request.data)

        savings_plan_id = data.get("savings_plan")
        units_bought = data.get("units_bought")
        amount = data.get("amount")

        try:
            savings_plan = SavingsPlan.objects.get(id=savings_plan_id)

        except SavingsPlan.DoesNotExist:
            return Response({"details": "SavingsPlan does not exist"})

        # create user savings plan
        goal_amount = float(savings_plan.min_investment) * int(
            savings_plan.duration
        )  # what if there is no campaign? so no existig savings plan, so they'll have to create one for themselves? Unless we can allow the savings plan attribute in the user savings plan to be None.

        user_savings_plan = create_user_savings_plan(
            user=request.user,
            savings_plan=savings_plan,
            goal_amount=goal_amount,
            units_bought=units_bought,
        )

        print(f"User savings plan {user_savings_plan}")

        # creating and processing transaction

        print("Creating transaction....")
        # rethink this part
        transaction = create_transaction(
            sender_wallet=request.user.wallet,
            receiver_wallet=savings_plan.campaign.business.wallet,
            amount=amount,
            description=f"Savings Plan Investment into {savings_plan.campaign.__str__()}",
            transaction_type="INVESTMENT",
        )

        print("Processing....")
        try:
            process_transaction(transaction.id)

            response_data = self.serializer_class(transaction).data

            # TODO: Send mail to user confirming their transfer

            return Response(
                {"details": "Transfer successful.", "data": response_data},
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            return Response(
                {"details": "Transfer failed.", "error": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )
