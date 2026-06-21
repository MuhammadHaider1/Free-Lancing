from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source = 'client.username' , read_only = True)
    freelancer_name = serializers.CharField(source = 'freelancer.username' , read_only = True)

    class Meta:
        model = Review
        fields = [
            'id', 'order', 'client', 'client_name', 'freelancer', 
            'freelancer_name', 'rating', 'comment', 'created_at'
        ]

        read_only_fields = ['client' , 'freelancer' , 'created_at']