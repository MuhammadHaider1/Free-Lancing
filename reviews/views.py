from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import PermissionDenied
from .models import Review
from .serializers import ReviewSerializer
from orders.models import Order

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['freelancer', 'order']
    ordering_fields = ['rating', 'created_at']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        if self.request.user.role != 'client':
            raise PermissionDenied(
                "Only clients can leave reviews."
            )

        order_id = self.request.data.get('order')

        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            raise PermissionDenied(
                "Order not found."
            )

        if order.client != self.request.user:
            raise PermissionDenied(
                "You can only review your own order."
            )

        if order.status != 'completed':
            raise PermissionDenied(
                "You can only review a completed order."
            )

        if Review.objects.filter(order=order).exists():
            raise PermissionDenied(
                "A review has already been submitted for this order."
            )

        serializer.save(
            client=self.request.user,
            freelancer=order.freelancer
        )