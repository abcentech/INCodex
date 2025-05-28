from django.db import models, transaction
from django.conf import settings
from django.utils import timezone
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.exceptions import ValidationError

from users.models import Business, Customer

from utils.campaigns import calculate_next_transfer_date

User = settings.AUTH_USER_MODEL

class Campaign(models.Model):
    
    RISK_LEVELS = [
        ('CONSERVATIVE', 'Conservative'),
        ('BALANCED', 'Balanced'),
        ('AGGRESIVE', 'Aggressive'),
    ]
    
    business = models.ForeignKey(Business, db_index=True, on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=20, db_index=True)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    risk_level = models.CharField(max_length=12, choices=RISK_LEVELS)
    unit_price = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    min_units = models.IntegerField(default=1)
    total_units = models.IntegerField(default=0)
    current_units = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def days_between(self):
        delta = self.end_date - self.start_date
        return delta.days
    
    def __str__(self) -> str:
        return f'Campaign: {self.title} by {self.business.company_name}'


class CampaignImages(models.Model):
    campaign = models.ForeignKey(Campaign, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='campaigns/', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self) -> str:
        return f'Image for {self.campaign.title} - {self.created_at}'
    
    def clean(self):
        # No more than 3 images per campaign
        if self.campaign.images.count() >= 3 and not self.pk:
            raise ValidationError("A campaign can have no more than 3 images")
        
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)


class SavingsPlan(models.Model):
    campaign = models.ForeignKey('Campaign', on_delete=models.SET_NULL, null=True)
    tier = models.CharField(max_length=20, db_index=True)
    contribution_frequency = models.CharField(max_length=20)
    duration = models.IntegerField(help_text="Duration in days")
    early_withdrawal_penalty = models.DecimalField(max_digits=5, decimal_places=2)
    min_investment = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        if self.campaign:
            return f"{self.get_tier_display()} Plan for {self.campaign.title}"
        
        return f"{self.user_savings} {self.get_tier_display()} Plan"

class UserSavingsPlan(models.Model):
    
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('PAUSED', 'Paused'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'), 
    ]
    
    user = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True)
    savings_plan = models.ForeignKey(SavingsPlan, related_name='user_savings', on_delete=models.CASCADE, null=True)
    title = models.CharField()
    start_date = models.DateField(auto_now_add=True)
    next_transfer_date = models.DateField()
    units_bought = models.IntegerField(null=True)   # because not all savings plans are associated with a campaign
    balance = models.DecimalField(max_digits=10, decimal_places=2)
    goal_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    
    def __str__(self):
        return f'{self.user}\'s {self.savings_plan} Plan'
    

@transaction.atomic()
def create_user_savings_plan(user, savings_plan, title, goal_amount, units_bought=None):
    user_savings_plan, created = UserSavingsPlan.objects.get_or_create(
        user=user.customer,
        savings_plan=savings_plan,
        title=title,
        defaults={
            'next_transfer_date': calculate_next_transfer_date(savings_plan.contribution_frequency),
            'units_bought': units_bought,
            'balance': 0,
            'goal_amount': goal_amount,
            'status': 'ACTIVE'
        }
    )
    
    if created:
        return user_savings_plan