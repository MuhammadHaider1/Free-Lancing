from rest_framework import serializers
from .models import Service

class ServiceSerializer(serializers.ModelSerializer):

    freelancer_name = serializers.CharField(
        source='freelancer.username',
        read_only=True
    )

    freelancer_bio = serializers.CharField(
        source='freelancer.bio',
        read_only=True
    )

    class Meta:
        model = Service
        fields = [
            'id',
            'freelancer',
            'freelancer_name',
            'freelancer_bio',
            'title',
            'description',
            'category',
            'price',
            'delivery_days',
            'image',
            'created_at'
        ]

        read_only_fields = [
            'freelancer',
            'created_at'
        ]
