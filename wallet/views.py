from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum
from .models import Transaction, WithdrawalRequest
from .serializers import TransactionSerializer, WithdrawalRequestSerializer , WithdrawalRequestAdminSerializer
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import get_user_model
from orders.models import Order

User = get_user_model()


class TransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)


class WalletSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        total_credit = Transaction.objects.filter(
            user=user, type='credit', status='completed'
        ).aggregate(total=Sum('amount'))['total'] or 0

        total_withdrawn = WithdrawalRequest.objects.filter(
            user=user, status='approved'
        ).aggregate(total=Sum('amount'))['total'] or 0

        pending_withdrawals = WithdrawalRequest.objects.filter(
            user=user, status='pending'
        ).aggregate(total=Sum('amount'))['total'] or 0

        available_balance = float(total_credit) - float(total_withdrawn) - float(pending_withdrawals)

        total_spent = Transaction.objects.filter(
            user=user, type='debit', status='completed'
        ).aggregate(total=Sum('amount'))['total'] or 0

        return Response({
            "total_earned": float(total_credit),
            "total_withdrawn": float(total_withdrawn),
            "pending_withdrawals": float(pending_withdrawals),
            "available_balance": available_balance,
            "total_spent": float(total_spent),
        })


class WithdrawalListCreateView(generics.ListCreateAPIView):
    serializer_class = WithdrawalRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WithdrawalRequest.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)



class AdminWithdrawalListView(generics.ListAPIView):
    serializer_class = WithdrawalRequestAdminSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if not self.request.user.is_staff:
            raise PermissionDenied("Sirf admin ye dekh sakta hai")
        return WithdrawalRequest.objects.all().order_by('-created_at')


class AdminWithdrawalActionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk, action):
        if not request.user.is_staff:
            raise PermissionDenied("Sirf admin ye action le sakta hai")

        try:
            withdrawal = WithdrawalRequest.objects.get(pk=pk)
        except WithdrawalRequest.DoesNotExist:
            return Response({"error": "Withdrawal request nahi mili"}, status=404)

        if withdrawal.status != 'pending':
            return Response({"error": "Ye request pehle se process ho chuki hai"}, status=400)

        if action == 'approve':
            withdrawal.status = 'approved'
        elif action == 'reject':
            withdrawal.status = 'rejected'
        else:
            return Response({"error": "Invalid action"}, status=400)

        withdrawal.save()
        return Response({"message": f"Withdrawal {action}d successfully"})
    

class AdminStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff:
            raise PermissionDenied("Sirf admin ye dekh sakta hai")

        total_users = User.objects.count()
        total_clients = User.objects.filter(role='client').count()
        total_freelancers = User.objects.filter(role='freelancer').count()
        total_orders = Order.objects.count()
        pending_withdrawals = WithdrawalRequest.objects.filter(status='pending').count()

        return Response({
            "total_users": total_users,
            "total_clients": total_clients,
            "total_freelancers": total_freelancers,
            "total_orders": total_orders,
            "pending_withdrawals": pending_withdrawals,
        })