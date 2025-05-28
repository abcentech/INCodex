from rest_framework import serializers

from .models import Campaign, UserSavingsPlan, SavingsPlan


class CampaignSerializer(serializers.ModelSerializer):
    savings_plans_data = serializers.ListField(child=serializers.DictField(), write_only=True)
    
    class Meta:
        model = Campaign
        fields = ['id', 'title', 'business', 'description', 'start_date', 'end_date', 'risk_level', 'unit_price', 'min_units', 'total_units', 'current_units', 'savings_plans_data', 'created_at', 'updated_at']
        read_only_fields = ['business']
        
    def create(self, validated_data):
        validated_data_copy = validated_data.copy()
        savings_plans_data = validated_data_copy.pop('savings_plans_data', [])   # before campaign because 'pop' removes the data not found in a campaign
        campaign = Campaign.objects.create(**validated_data_copy)
        
        for plan_data in savings_plans_data:
            SavingsPlan.objects.create(campaign=campaign, **plan_data)
            
        return campaign
        

class SavingsPlanSerializer(serializers.ModelSerializer):
    campaign = CampaignSerializer(required=False)
    
    class Meta:
        model = SavingsPlan
        fields=['campaign', 'tier', 'contribution_frequency', 'duration', 'early_withdrawal_penalty', 'min_investment']

class UserSavingsPlanSerializer(serializers.ModelSerializer):
    savings_plan = SavingsPlanSerializer(read_only=True, required=False)
    class Meta:
        model = UserSavingsPlan
        fields = ['user', 'savings_plan', 'title', 'start_date', 'units_bought', 'balance', 'goal_amount', 'status']
        