from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import Order
from .serializers import OrderSerializer 
from projects.models import Proposal
from django.utils import timezone
from rest_framework.parsers import MultiPartParser, FormParser
from notifications.models import Notification
from chat.models import Conversation
from django.db.models import Q
from wallet.models import Transaction


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status']
    ordering_fields = ['created_at', 'amount']

    def get_permissions(self):
        return [permissions.IsAuthenticated()]

    def get_queryset(self):

        if getattr(self, 'swagger_fake_view', False):
            return Order.objects.none()

        user = self.request.user

        return Order.objects.filter(
            Q(client=user) | Q(freelancer=user)
        )
    

            
    @action(detail=False, methods=['post'], url_path='accept-proposal')
    def accept_proposal(self, request):
        proposal_id = request.data.get('proposal_id')

        if not proposal_id:
            return Response({"error": "proposal_id required"}, status=400)

        try:
            proposal = Proposal.objects.get(id=proposal_id)
        except Proposal.DoesNotExist:
            return Response({"error": "Proposal nahi mila"}, status=404)

        if proposal.project.client != request.user:
            raise PermissionDenied("Sirf client proposal accept kar sakta hai!")

        if proposal.status == 'accepted':
            return Response({"error": "Proposal pehle se accept ho chuka hai"}, status=400)

        # Proposal accept karo
        proposal.status = 'accepted'
        proposal.save()

        # Order banao
        order = Order.objects.create(
            proposal=proposal,
            client=request.user,
            freelancer=proposal.freelancer,
            amount=proposal.bid_amount,
        )

        Conversation.objects.create(
            order=order
        )

        Notification.objects.create(
            user=proposal.freelancer,
            message=f"{request.user.username} ne aap ka proposal accept kar liya hai",
            notification_type="order"
        )

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=201)
    

    @action(
    detail=True,
    methods=['post'],
    parser_classes=[MultiPartParser, FormParser],
    url_path='deliver'
)
    def deliver_order(self, request, pk=None):

        order = self.get_object()

        if order.freelancer != request.user:
            raise PermissionDenied(
                "Sirf freelancer delivery submit kar sakta hai!"
            )

        if not request.FILES.get('delivery_file'):
            return Response(
                {"error":"Delivery file required"},
                status=400
            )


        order.delivery_file = request.FILES['delivery_file']
        order.status = 'delivered'
        order.delivered_at = timezone.now()
        order.save()

        Notification.objects.create(
            user=order.client,
            message=f"{request.user.username} ne order deliver kar diya hai",
            notification_type="delivery"
)

        serializer = OrderSerializer(order)

        return Response(serializer.data)
    

    @action(
    detail=True,
    methods=['post'],
    url_path='complete'
)
    def complete_order(self, request, pk=None):

        order = self.get_object()


        if order.client != request.user:
            raise PermissionDenied(
                "Sirf client complete kar sakta hai!"
            )


        if order.status != 'delivered':
            return Response(
                {"error":"Order abhi delivered nahi hai"},
                status=400
            )


        order.status = 'completed'
        order.save()

        Notification.objects.create(
            user=order.freelancer,
            message=f"{request.user.username} ne order complete kar diya hai",
            notification_type="order"
)

        serializer = OrderSerializer(order)

        return Response(serializer.data)


    @action(
    detail=True,
    methods=['post'],
    url_path='complete'
)
    def complete_order(self, request, pk=None):

        order = self.get_object()

        if order.client != request.user:
            raise PermissionDenied(
                "Sirf client complete kar sakta hai!"
            )

        if order.status != 'delivered':
            return Response(
                {"error": "Order abhi delivered nahi hai"},
                status=400
            )

        order.status = 'completed'
        order.save()

        # Freelancer ko credit
        Transaction.objects.create(
            user=order.freelancer,
            order=order,
            type='credit',
            amount=order.amount,
            status='completed',
            note=f"Payment for Order #{order.id}"
        )

        # Client ka debit record
        Transaction.objects.create(
            user=order.client,
            order=order,
            type='debit',
            amount=order.amount,
            status='completed',
            note=f"Payment for Order #{order.id}"
        )

        Notification.objects.create(
            user=order.freelancer,
            message=f"{request.user.username} ne order complete kar diya hai",
            notification_type="order"
        )

        serializer = OrderSerializer(order)

        return Response(serializer.data)