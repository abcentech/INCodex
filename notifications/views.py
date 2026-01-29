from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .models import Notification
from .serializers import NotificationSerializer


class NotificationListView(APIView):
    """List all notifications for the authenticated user"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Get query parameters for filtering
        is_read = request.query_params.get('is_read', None)
        notification_type = request.query_params.get('type', None)
        
        # Base queryset
        notifications = Notification.objects.filter(user=request.user)
        
        # Apply filters
        if is_read is not None:
            is_read_bool = is_read.lower() == 'true'
            notifications = notifications.filter(is_read=is_read_bool)
        
        if notification_type:
            notifications = notifications.filter(notification_type=notification_type)
        
        # Limit to last 50 notifications
        notifications = notifications[:50]
        
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MarkNotificationReadView(APIView):
    """Mark a specific notification as read"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, notification_id):
        try:
            notification = Notification.objects.get(
                id=notification_id,
                user=request.user
            )
        except Notification.DoesNotExist:
            return Response(
                {"detail": "Notification not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        notification.mark_as_read()
        
        return Response(
            {"detail": "Notification marked as read"},
            status=status.HTTP_200_OK
        )


class MarkAllNotificationsReadView(APIView):
    """Mark all notifications as read for the authenticated user"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        updated_count = Notification.objects.filter(
            user=request.user,
            is_read=False
        ).update(is_read=True)
        
        return Response(
            {
                "detail": f"{updated_count} notifications marked as read",
                "count": updated_count
            },
            status=status.HTTP_200_OK
        )


class UnreadNotificationCountView(APIView):
    """Get count of unread notifications"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        count = Notification.objects.filter(
            user=request.user,
            is_read=False
        ).count()
        
        return Response(
            {"unread_count": count},
            status=status.HTTP_200_OK
        )
