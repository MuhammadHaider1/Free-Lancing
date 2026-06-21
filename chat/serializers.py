from rest_framework import serializers
from .models import Conversation, Message


class MessageSerializer(serializers.ModelSerializer):

    sender_name = serializers.CharField(
        source='sender.username',
        read_only=True
    )

    class Meta:
        model = Message

        fields = [
            'id',
            'conversation',
            'sender',
            'sender_name',
            'text',
            'created_at',
            'is_read'
        ]

        read_only_fields = [
            'sender',
            'created_at'
        ]


class ConversationSerializer(serializers.ModelSerializer):

    messages = MessageSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Conversation

        fields = [
            'id',
            'order',
            'messages',
            'created_at'
        ]