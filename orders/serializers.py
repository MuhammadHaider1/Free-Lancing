from rest_framework import serializers
from .models import Order
from reviews.models import Review


class OrderSerializer(serializers.ModelSerializer):

    client_name = serializers.CharField(
        source='client.username',
        read_only=True
    )

    freelancer_name = serializers.CharField(
        source='freelancer.username',
        read_only=True
    )

    review_exists = serializers.SerializerMethodField()


    class Meta:

        model = Order

        fields = [
            'id',
            'proposal',
            'client',
            'client_name',
            'freelancer',
            'freelancer_name',
            'amount',
            'status',
            'delivery_file',
            'created_at',
            'delivered_at',
            'review_exists',
        ]


        read_only_fields = [
            'client',
            'freelancer',
            'amount',
            'created_at',
            'delivered_at'
        ]


    def get_review_exists(self, obj):

        return Review.objects.filter(
            order=obj
        ).exists()