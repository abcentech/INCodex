from django.db import models
from django.conf import settings
import uuid


class Notification(models.Model):
    """
    Model for storing user notifications
    """
    NOTIFICATION_TYPES = [
        ('TRANSACTION', 'Transaction'),
        ('SAVINGS', 'Savings'),
        ('CAMPAIGN', 'Campaign'),
        ('SYSTEM', 'System'),
        ('ACHIEVEMENT', 'Achievement'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(
        max_length=20,
        choices=NOTIFICATION_TYPES,
        default='SYSTEM'
    )
    is_read = models.BooleanField(default=False)
    action_link = models.CharField(
        max_length=500,
        blank=True,
        null=True,
        help_text="Optional link for user to take action (e.g., /dashboard/transactions)"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['user', 'is_read']),
        ]
    
    def __str__(self):
        return f"{self.user.email} - {self.title}"
    
    def mark_as_read(self):
        """Mark notification as read"""
        self.is_read = True
        self.save()
