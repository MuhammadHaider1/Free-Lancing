from rest_framework import serializers
from .models import Project , Proposal


class ProposalSerializer(serializers.ModelSerializer):
    freelancer_name = serializers.CharField(source= 'freelancer.username' , read_only = True)

    project_title = serializers.CharField(
        source='project.title',
        read_only=True
    )

    class Meta:
        model = Proposal
        fields = ['id', 'project', 'project_title' ,'freelancer', 'freelancer_name', 'cover_letter', 
        'bid_amount', 'delivery_days', 'status', 'created_at']

        read_only_fields = ['freelancer', 'status', 'created_at']



class ProjectSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.username', read_only=True)
    proposals = ProposalSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'client', 'client_name', 'title', 'description', 
                  'budget', 'deadline', 'status', 'proposals', 'created_at']
        read_only_fields = ['client', 'status', 'created_at']



