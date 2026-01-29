from rest_framework import serializers

from .models import Campaign, UserSavingsPlan, SavingsPlan



class SimpleSavingsPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavingsPlan
        fields = ['id', 'tier', 'contribution_frequency', 'duration', 'early_withdrawal_penalty', 'min_investment']

class CampaignSerializer(serializers.ModelSerializer):
    savings_plans_data = serializers.ListField(child=serializers.DictField(), write_only=True)
    savings_plans = SimpleSavingsPlanSerializer(source='savingsplan_set', many=True, read_only=True)
    
    class Meta:
        model = Campaign
        fields = ['id', 'title', 'business', 'description', 'start_date', 'end_date', 'risk_level', 'unit_price', 'min_units', 'total_units', 'current_units', 'savings_plans_data', 'savings_plans', 'created_at', 'updated_at']
        read_only_fields = ['business']

class CampaignDetailSerializer(CampaignSerializer):
    # For a more detailed view if needed, but for now it adds business info
    business_name = serializers.CharField(source='business.company_name', read_only=True)
    
    class Meta(CampaignSerializer.Meta):
        fields = CampaignSerializer.Meta.fields + ['business_name']

class CampaignInvestmentSerializer(serializers.Serializer):
    units = serializers.IntegerField(min_value=1)
    savings_plan_id = serializers.UUIDField()

    def validate(self, data):
        campaign_id = self.context.get('campaign_id')
        try:
            campaign = Campaign.objects.get(id=campaign_id)
        except Campaign.DoesNotExist:
            raise serializers.ValidationError("Campaign does not exist.")

        units = data['units']
        
        # Check available units
        available_units = campaign.total_units - campaign.current_units
        if units > available_units:
            raise serializers.ValidationError(f"Only {available_units} units available.")

        # Check min units
        if units < campaign.min_units:
            raise serializers.ValidationError(f"Minimum units required: {campaign.min_units}")

        try:
            savings_plan = SavingsPlan.objects.get(id=data['savings_plan_id'], campaign=campaign)
        except SavingsPlan.DoesNotExist:
            raise serializers.ValidationError("Savings plan does not exist or does not belong to this campaign.")

        return data
        
    def create(self, validated_data):
        validated_data_copy = validated_data.copy()
        savings_plans_data = validated_data_copy.pop('savings_plans_data', [])
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
        fields = [
            'id', 'user', 'savings_plan', 'title', 'start_date', 
            'next_transfer_date', 'units_bought', 'balance', 'goal_amount', 
            'goal_type', 'target_date', 'status', 'auto_transfer_enabled', 
            'transfer_amount', 'last_transfer_date', 'failed_transfer_count'
        ]
        read_only_fields = ['last_transfer_date', 'failed_transfer_count']