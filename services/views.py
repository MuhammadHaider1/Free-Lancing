from rest_framework import viewsets , permissions , filters
from django.conf import settings
from django_filters.rest_framework import DjangoFilterBackend
from .models import Service
from .serializers import ServiceSerializer
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from rest_framework.response import Response

from freelancehub.cache_utils import (
    cache_get, cache_set, cache_delete,
    cache_delete_pattern, get_services_list_key,
    get_service_detail_key
)



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
    
    #==============Cache=================

    def list(self , request, *args, **kwargs):
         # Cache key banao — search, category, page se
        search = request.query_params.get('search', '')
        category = request.query_params.get('category', '')
        page = request.query_params.get('page', 1)
        cache_key = get_services_list_key(search, category, page)

        cached = cache_get(cache_key)
        if cached:
            return Response(cached)
        
        response = super().list(request, *args, **kwargs)

        # Redis mein save karo
        cache_set(
            cache_key,
            response.data,
            timeout=settings.CACHE_TTL['SERVICES_LIST']
        )

        return response

    # ============ INVALIDATION ============
    # Jab data change ho — cache clear karo

    def perform_create(self, serializer):
        if self.request.user.role != 'freelancer':
            raise PermissionDenied("Only Freelancer Can Create Service!")
        serializer.save(freelancer = self.request.user)
        # Naya service bana — list cache purana ho gaya
        cache_delete_pattern("*services:list:*")

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

        cache_key = f"services:my:{request.user.id}"
        cached = cache_get(cache_key)
        if cached:
            return Response(cached)


        services = Service.objects.filter(
            freelancer=request.user
        )

        serializer = self.get_serializer(
            services,
            many=True
        )

        cache_set(cache_key, serializer.data, timeout=60 * 5)


        return Response(serializer.data)
