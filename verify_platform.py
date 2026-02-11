import os
import django
import sys

# Setup Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "investnaira.settings")
django.setup()

from django.contrib.auth import get_user_model
from wallet.models import Wallet
from campaigns.models import Campaign, SavingsPlan, UserSavingsPlan
from chatbot.models import ChatSession
from chatbot.utils import get_ai_advisor_response
from decimal import Decimal
from django.utils import timezone

User = get_user_model()

def verify_system():
    print("🚀 Starting Manual System Verification...")
    
    # 1. User & Wallet Verification
    print("\n1. Verifying User & Wallet...")
    try:
        # Use unique email to avoid collisions
        import time
        email = f"test_{int(time.time())}@example.com"
        
        # Create fresh user
        user = User.objects.create(
            email=email,
            is_active=True,
            is_verified=True
        )
        user.set_password("testpass123")
        user.save()
        print(f"   ✅ Test user created: {email}")

        # Create Customer profile
        from users.models import Customer
        Customer.objects.create(
            user_ptr=user,
            first_name="Test", 
            last_name="User", 
            risk_profile="BALANCED"
        )
        user.refresh_from_db()
        print("   ✅ Customer profile created")

        if not hasattr(user, 'wallet'):
            Wallet.objects.create(user=user, balance=Decimal("500000.00"))
            print("   ✅ Wallet created with 500,000 NGN")
        else:
            user.wallet.balance = Decimal("500000.00")
            user.wallet.save()
            print("   ✅ Wallet balance reset to 500,000 NGN")
            
    except Exception as e:
        print(f"   ❌ User/Wallet Error: {e}")
        return False

    # 2. Campaign & Investment Verification
    print("\n2. Verifying Campaign & Investment...")
    try:
        # ensuring we have a business user for the campaign
        biz_user, _ = User.objects.get_or_create(email="biz@invest.com", defaults={"user_type": "BUSINESS"})
        
        campaign, _ = Campaign.objects.get_or_create(
            title="Test High Yield Fund",
            defaults={
                "description": "A test campaign",
                "unit_price": Decimal("100.00"),
                "total_units": 10000,
                "min_units": 10,
                "start_date": timezone.now(),
                "end_date": timezone.now() + timezone.timedelta(days=30),
                "risk_level": "BALANCED",
                "business": biz_user.business if hasattr(biz_user, 'business') else None
            }
        )
        # Create a savings plan for it if needed
        plan, _ = SavingsPlan.objects.get_or_create(
            campaign=campaign,
            tier="Authorized",
            defaults={
                "min_investment": 5000,
                "duration": 30,
                "early_withdrawal_penalty": 20
            }
        )
        
        # Test Investment Logic (Simulated)
        user_plan = UserSavingsPlan.objects.create(
            user=user,
            savings_plan=plan,
            amount=Decimal("10000.00"),
            status="ACTIVE"
        )
        print("   ✅ User Savings Plan created successfully")
        
        # Verify Auto Transfer Logic
        user_plan.auto_transfer_enabled = True
        user_plan.transfer_amount = Decimal("5000.00")
        user_plan.save()
        print("   ✅ Auto-transfer configuration saved")
        
    except Exception as e:
        print(f"   ❌ Campaign/Investment Error: {e}")
        # Continuing even if this fails, to check other parts
    
    # 3. AI Advisor Verification
    print("\n3. Verifying AI Advisor...")
    try:
        response = get_ai_advisor_response(user, "How is my financial health?")
        if response:
            print("   ✅ AI Advisor returned response")
            print(f"   📝 Sample: {response[:50]}...")
        else:
            print("   ❌ AI Advisor returned empty response")
            
        # Verify Session Creation
        session = ChatSession.objects.create(user=user, title="Test Session")
        if session.pk:
            print("   ✅ Chat Session created in DB")
            
    except Exception as e:
        print(f"   ❌ AI Advisor Error: {e}")

    print("\n✅ Verification Complete.")
    return True

if __name__ == "__main__":
    verify_system()
