from django.urls import reverse

from rest_framework.test import APIClient, APITestCase
from rest_framework import status

from .models import Campaign, SavingsPlan, UserSavingsPlan

from users.models import User, Customer, Business

from wallet.models import Wallet, Transaction
