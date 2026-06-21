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
                "Sirf client review de sakta hai!"
            )

        order_id = self.request.data.get('order')

        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            raise PermissionDenied(
                "Order nahi mila!"
            )

        if order.client != self.request.user:
            raise PermissionDenied(
                "Sirf apne order ka review de sakte ho!"
            )

        if order.status != 'completed':
            raise PermissionDenied(
                "Review sirf completed order par diya ja sakta hai!"
            )

        if Review.objects.filter(order=order).exists():
            raise PermissionDenied(
                "Review pehle hi diya ja chuka hai!"
            )

        serializer.save(
            client=self.request.user,
            freelancer=order.freelancer
        )