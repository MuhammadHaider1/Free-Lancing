from rest_framework import viewsets, permissions
from .models import Notification
from .serializers import NotificationSerializer

from rest_framework.decorators import action
from rest_framework.response import Response

from rest_framework.exceptions import PermissionDenied


class NotificationViewSet(viewsets.ModelViewSet):

    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]


    def get_queryset(self):

        return Notification.objects.filter(
            user=self.request.user
        ).order_by('-created_at')
    
    @action(
        detail=True,
        methods=['post'],
        url_path='read'
    )
    def mark_as_read(self, request, pk=None):

        notification = self.get_object()


        notification.is_read = True
        notification.save()


        return Response({
            "message": "Notification marked as read"
        })
    
    def perform_destroy(self, instance):

        if instance.user != self.request.user:
            raise PermissionDenied(
                "You cannot delete this notification"
            )

        instance.delete()