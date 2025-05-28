from django.core.management.base import BaseCommand
from wallet.models import Bank
from wallet.utils import get_banks
from campaigns.models import Campaign
from users.models import User, Business  # Adjust the import according to your app name
from datetime import date

class Command(BaseCommand):
    help = 'Seed data for Bank, Campaign, and Business models'

    def handle(self, *args, **kwargs):

        # Seed data for Business model
        Business.objects.create(
            email="business@example.com",
            password="password123",
            user_type="BUSINESS",
            phone_number="08000000000",
            company_name="Example Business",
            tax_id="123456789",
            address="123 Business St, Business City"
        )
        self.stdout.write(self.style.SUCCESS('Successfully seeded Business data'))

        # Seed data for Campaign model
        business = Business.objects.first()
        campaigns = [
            {
                "business": business,
                "title": "Campaign 1",
                "description": "Description for Campaign 1",
                "start_date": date(2024, 1, 1),
                "end_date": date(2026, 12, 31),
                "risk_level": "LOW",
                "unit_price": 100.00,
                "min_units": 1,
                "max_units": 100,
            },
            {
                "business": business,
                "title": "Campaign 2",
                "description": "Description for Campaign 2",
                "start_date": date(2024, 2, 1),
                "end_date": date(2027, 11, 30),
                "risk_level": "MEDIUM",
                "unit_price": 200.00,
                "min_units": 2,
                "max_units": 200,
            },
            {
                "business": business,
                "title": "Campaign 3",
                "description": "Description for Campaign 3",
                "start_date": date(2024, 3, 1),
                "end_date": date(2028, 10, 31),
                "risk_level": "HIGH",
                "unit_price": 300.00,
                "min_units": 3,
                "max_units": 300,
            },
            {
                "business": business,
                "title": "Campaign 4",
                "description": "Description for Campaign 4",
                "start_date": date(2024, 4, 1),
                "end_date": date(2026, 9, 30),
                "risk_level": "LOW",
                "unit_price": 400.00,
                "min_units": 4,
                "max_units": 400,
            },
            {
                "business": business,
                "title": "Campaign 5",
                "description": "Description for Campaign 5",
                "start_date": date(2024, 5, 1),
                "end_date": date(2027, 8, 31),
                "risk_level": "MEDIUM",
                "unit_price": 500.00,
                "min_units": 5,
                "max_units": 500,
            },
        ]
        for campaign_data in campaigns:
            Campaign.objects.create(**campaign_data)
        self.stdout.write(self.style.SUCCESS('Successfully seeded Campaign data'))