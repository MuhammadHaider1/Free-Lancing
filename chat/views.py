from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied

from .models import Conversation, Message
from .serializers import (
    ConversationSerializer,
    MessageSerializer
)


class ConversationViewSet(viewsets.ModelViewSet):

    serializer_class = ConversationSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]


    def get_queryset(self):

        user = self.request.user

        return Conversation.objects.filter(
            order__client=user
        ) | Conversation.objects.filter(
            order__freelancer=user
        )



class MessageViewSet(viewsets.ModelViewSet):

    serializer_class = MessageSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]


    def get_queryset(self):

        return Message.objects.filter(
            conversation__order__client=self.request.user
        ) | Message.objects.filter(
            conversation__order__freelancer=self.request.user
        )


    def perform_create(self, serializer):

        conversation = serializer.validated_data['conversation']


        if (
            conversation.order.client != self.request.user
            and
            conversation.order.freelancer != self.request.user
        ):
            raise PermissionDenied(
                "You cannot send message here"
            )


        serializer.save(
            sender=self.request.user
        )