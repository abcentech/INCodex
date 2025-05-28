from django.utils import timezone
from datetime import timedelta

def calculate_next_transfer_date(frequency):
    today = timezone.now().date()
    if frequency == 'DAILY':
        return today + timedelta(days=1)
    elif frequency == 'WEEKLY':
        return today + timedelta(weeks=1)
    elif frequency == 'MONTHLY':
        return today + timedelta(days=30)  # Simplified; doesn't account for varying month lengths
    else:
        raise ValueError(f"Unknown frequency: {frequency}")