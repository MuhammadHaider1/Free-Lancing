from rest_framework import viewsets , permissions , filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import PermissionDenied

from .models import Project , Proposal
from .serializers import ProjectSerializer , ProposalSerializer

from rest_framework.decorators import action
from rest_framework.response import Response

from notifications.models import Notification

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status']
    search_fields = ['title', 'description']
    ordering_fields = ['budget', 'created_at', 'deadline']

    def get_queryset(self):

        user = self.request.user

        if user.is_authenticated:

            if user.role == 'client':
                return Project.objects.filter(
                    client=user
                )

        return Project.objects.all()

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
         if self.request.user.role != 'client':
            raise PermissionDenied("Only Client Can Create Project!")
         serializer.save(client=self.request.user)
    
    def perform_update(self, serializer):
        if serializer.instance.client != self.request.user:
            raise PermissionDenied("Only Update Your Own Project!")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.client != self.request.user:
            raise PermissionDenied("Only Delete Your Own Project!")
        instance.delete()
    


class ProposalViewSet(viewsets.ModelViewSet):
    
    serializer_class = ProposalSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'project']
    ordering_fields = ['bid_amount', 'created_at']

    def get_queryset(self):

        user = self.request.user

        if user.role == 'freelancer':
            return Proposal.objects.filter(
                freelancer=user
            )

        return Proposal.objects.filter(
            project__client=user
        )

    def get_permissions(self):
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):

        if self.request.user.role != 'freelancer':
            raise PermissionDenied(
                "Only Freelancer Can Send Proposals!"
            )


        proposal = serializer.save(
            freelancer=self.request.user
        )


        Notification.objects.create(
            user=proposal.project.client,
            message=f"{self.request.user.username} ne aap ke project par proposal bheja hai",
            notification_type="proposal"
        )

    def perform_update(self, serializer):
        if serializer.instance.freelancer != self.request.user:
            raise PermissionDenied("Only Edits Your Own Proposals!")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.freelancer != self.request.user:
            raise PermissionDenied("Only Delete Your Own Proposals!")
        instance.delete()
    
    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        proposal = self.get_object()

        if proposal.project.client != request.user:
            raise PermissionDenied(
                "Only project owner can accept proposal."
            )

        Proposal.objects.filter(
            project=proposal.project,
            status='pending'
        ).exclude(
            id=proposal.id
        ).update(status='rejected')

        proposal.status = 'accepted'
        proposal.save()

        proposal.project.status = 'in_progress'
        proposal.project.save()

        return Response({
            'message': 'Proposal accepted successfully'
        })
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        proposal = self.get_object()

        if proposal.project.client != request.user:
            raise PermissionDenied(
                "Only project owner can reject proposal."
            )

        proposal.status = 'rejected'
        proposal.save()

        return Response({
            'message': 'Proposal rejected successfully'
        })