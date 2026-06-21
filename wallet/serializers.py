from rest_framework import serializers
from .models import Transaction, WithdrawalRequest

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'type', 'amount', 'status', 'note', 'created_at', 'order']


class WithdrawalRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = WithdrawalRequest
        fields = ['id', 'amount', 'method', 'account_details', 'status', 'created_at']
        read_only_fields = ['status']

class WithdrawalRequestAdminSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = WithdrawalRequest
        fields = ['id', 'username', 'amount', 'method', 'account_details', 'status', 'created_at']