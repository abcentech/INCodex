from decimal import Decimal
from campaigns.models import UserSavingsPlan
from wallet.models import Wallet, Transaction
from django.db.models import Sum
from django.utils import timezone
from datetime import timedelta

class PerformanceCalculator:
    def __init__(self, user):
        self.user = user

    def calculate_roi(self, plan):
        """Calculate ROI for a specific savings plan"""
        if plan.balance == 0:
            return Decimal('0.00')
        
        # total_invested = Sum of all deposits/transfers to this plan
        # We can approximate by looking at the goal_amount or balance 
        # (since we don't have separate historical total invested field yet, 
        # but balance represents current value)
        
        # For simplicity in this implementation, we'll assume a fixed return rate 
        # for a demo effect, but in production, we'd calculate from ledger entries.
        
        # Mocking return based on duration/tier
        return Decimal('0.12') # 12% return

    def get_portfolio_performance(self):
        """Get aggregate performance stats for the user"""
        plans = UserSavingsPlan.objects.filter(user=self.user, status='ACTIVE')
        
        total_balance = sum(p.balance for p in plans)
        
        if total_balance == 0:
            return {
                "total_value": Decimal('0.00'),
                "total_return": Decimal('0.00'),
                "average_roi": Decimal('0.00'),
                "performance_history": []
            }

        # Mocking historical growth over the last 6 months
        history = []
        now = timezone.now()
        for i in range(6, 0, -1):
            month_date = now - timedelta(days=i*30)
            history.append({
                "date": month_date.strftime("%Y-%m-%d"),
                "value": (total_balance * (Decimal('1') - (Decimal('0.02') * i))).quantize(Decimal('0.01'))
            })

        return {
            "total_value": total_balance,
            "total_return": (total_balance * Decimal('0.08')).quantize(Decimal('0.01')), # 8% total gain
            "average_roi": Decimal('0.10'),
            "performance_history": history
        }
