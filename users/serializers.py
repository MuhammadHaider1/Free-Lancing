from rest_framework import serializers
from .models import User
from orders.models import Order
from reviews.models import Review
from services.models import Service


class UserSerializer(serializers.ModelSerializer):
    services_count = serializers.SerializerMethodField()
    completed_orders = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    reviews_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'role',
            'bio',
            'profile_picture',
            'created_at',
            'is_staff',
            'services_count',
            'completed_orders',
            'average_rating',
            'reviews_count'
        ]
        read_only_fields = ['created_at', 'is_staff']

    def get_services_count(self, obj):
        return Service.objects.filter(
            freelancer=obj
        ).count()

    def get_completed_orders(self, obj):
        return Order.objects.filter(
            freelancer=obj,
            status='completed'
        ).count()

    def get_average_rating(self, obj):
        reviews = Review.objects.filter(
            freelancer=obj
        )
        if not reviews.exists():
            return 0
        total = sum(review.rating for review in reviews)
        return round(total / reviews.count(), 1)

    def get_reviews_count(self, obj):
        return Review.objects.filter(
            freelancer=obj
        ).count()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(
        choices=['client', 'freelancer']
    )

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'role',
            'bio',
            'profile_picture',
            'created_at',
            'services_count',
            'completed_orders',
            'average_rating',
            'reviews_count'
        ]
        read_only_fields = ['created_at']

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data['role']
        )