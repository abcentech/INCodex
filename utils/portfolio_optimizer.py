from decimal import Decimal
from campaigns.models import UserSavingsPlan
from wallet.models import Wallet

class PortfolioOptimizer:
    # Target allocations { Category: { RiskProfile: Percentage } }
    TARGET_ALLOCATIONS = {
        'CONSERVATIVE': {
            'SAVINGS': Decimal('0.80'),
            'CAMPAIGNS': Decimal('0.20'),
        },
        'BALANCED': {
            'SAVINGS': Decimal('0.50'),
            'CAMPAIGNS': Decimal('0.50'),
        },
        'AGGRESIVE': {  # Matching DB typo
            'SAVINGS': Decimal('0.20'),
            'CAMPAIGNS': Decimal('0.80'),
        }
    }

    def __init__(self, user):
        self.user = user
        self.risk_profile = user.customer.risk_profile
        self.target = self.TARGET_ALLOCATIONS.get(self.risk_profile, self.TARGET_ALLOCATIONS['BALANCED'])

    def get_current_allocation(self):
        # 1. Get Wallet Balance
        wallet = Wallet.objects.get(user=self.user)
        cash = wallet.balance

        # 2. Get Savings & Campaigns
        plans = UserSavingsPlan.objects.filter(user=self.user)
        
        savings_total = Decimal('0.00')
        campaigns_total = Decimal('0.00')

        for plan in plans:
            if plan.campaign:
                campaigns_total += plan.balance
            else:
                savings_total += plan.balance

        total_assets = cash + savings_total + campaigns_total

        if total_assets == 0:
            return {
                'total_assets': Decimal('0.00'),
                'cash': Decimal('0.00'),
                'savings': Decimal('0.00'),
                'campaigns': Decimal('0.00'),
                'percentages': {
                    'cash': Decimal('0.00'),
                    'savings': Decimal('0.00'),
                    'campaigns': Decimal('0.00'),
                }
            }

        return {
            'total_assets': total_assets,
            'cash': cash,
            'savings': savings_total,
            'campaigns': campaigns_total,
            'percentages': {
                'cash': (cash / total_assets).quantize(Decimal('0.0001')),
                'savings': (savings_total / total_assets).quantize(Decimal('0.0001')),
                'campaigns': (campaigns_total / total_assets).quantize(Decimal('0.0001')),
            }
        }

    def get_recommendations(self):
        current = self.get_current_allocation()
        total_assets = current['total_assets']
        
        if total_assets == 0:
            return []

        # We combine Cash with Savings for simplification in target
        current_savings_plus_cash = current['percentages']['savings'] + current['percentages']['cash']
        current_campaigns = current['percentages']['campaigns']

        target_savings = self.target['SAVINGS']
        target_campaigns = self.target['CAMPAIGNS']

        recommendations = []

        # Check Campaigns
        diff_campaigns = target_campaigns - current_campaigns
        if abs(diff_campaigns) > Decimal('0.05'): # Only suggest if > 5% difference
            if diff_campaigns > 0:
                recommendations.append({
                    'type': 'BUY',
                    'category': 'CAMPAIGNS',
                    'message': f"Your portfolio is underweight in campaigns. Consider investing an additional ₦{(diff_campaigns * total_assets).quantize(Decimal('0.01'))} to reach your {target_campaigns*100}% target.",
                    'amount': (diff_campaigns * total_assets).quantize(Decimal('0.01'))
                })
            else:
                recommendations.append({
                    'type': 'SELL',
                    'category': 'CAMPAIGNS',
                    'message': f"Your portfolio is overweight in campaigns. You might want to diversify into fixed savings or hold more cash.",
                    'amount': (abs(diff_campaigns) * total_assets).quantize(Decimal('0.01'))
                })

        # Check Savings
        diff_savings = target_savings - current_savings_plus_cash
        if abs(diff_savings) > Decimal('0.05'):
             if diff_savings > 0:
                recommendations.append({
                    'type': 'BUY',
                    'category': 'SAVINGS',
                    'message': f"Consider increasing your fixed savings by ₦{(diff_savings * total_assets).quantize(Decimal('0.01'))} for better stability.",
                    'amount': (diff_savings * total_assets).quantize(Decimal('0.01'))
                })

        return recommendations
