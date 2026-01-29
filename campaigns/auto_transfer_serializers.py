from rest_framework import serializers
from decimal import Decimal

class AutoTransferToggleSerializer(serializers.Serializer):
    """Serializer for toggling auto-transfer on/off"""
    auto_transfer_enabled = serializers.BooleanField(required=True)

class AutoTransferAmountSerializer(serializers.Serializer):
    """Serializer for updating auto-transfer amount"""
    transfer_amount = serializers.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        required=True,
        min_value=Decimal('100.00'),  # Minimum transfer amount
        help_text="Amount to transfer automatically (minimum ₦100)"
    )
