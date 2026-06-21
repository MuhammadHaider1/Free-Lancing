from rest_framework import viewsets , permissions , filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Service
from .serializers import ServiceSerializer
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from rest_framework.response import Response



class ServiceViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceSerializer
    filter_backends = [DjangoFilterBackend , filters.SearchFilter , filters.OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['title', 'description']
    ordering_fields = ['price', 'created_at', 'delivery_days']

    def get_queryset(self):

        user = self.request.user

        if user.is_authenticated and user.role == 'freelancer':
            return Service.objects.filter(
                freelancer=user
            )

        return Service.objects.all()
    
    def get_permissions(self):
        if self.action in ['list' , 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
    
    def perform_create(self, serializer):
        if self.request.user.role != 'freelancer':
            raise PermissionDenied("Only Freelancer Can Create Service!")
        serializer.save(freelancer = self.request.user)

    def perform_update(self, serializer):
        if serializer.instance.freelancer != self.request.user:
            raise PermissionDenied("Only Edit Your Own Service!")
        serializer.save()
    
    def perform_destroy(self, instance):
        if instance.freelancer != self.request.user:
            raise PermissionDenied("Only Delete Your Own Service!")
        instance.delete()
    
    @action(
    detail=False,
    methods=['get'],
    url_path='my'
)
    def my_services(self, request):

        services = Service.objects.filter(
            freelancer=request.user
        )

        serializer = self.get_serializer(
            services,
            many=True
        )

        return Response(serializer.data)

        services = Service.objects.filter(
            freelancer=request.user
            )

        serializer = self.get_serializer(
                services,
                many=True
            )

        return Response(serializer.data)