from rest_framework import generics, permissions
from .models import User
from .serializers import UserSerializer , RegisterSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from orders.models import Order
from reviews.models import Review
from services.models import Service
from django.db.models import Avg, Sum
from services.serializers import ServiceSerializer



class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class UserProfileView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
    
class FreelancerProfileView(generics.RetrieveAPIView):
    queryset = User.objects.filter(role='freelancer')
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def retrieve(self, request, *args, **kwargs):

        freelancer = self.get_object()

        user_data = UserSerializer(
            freelancer
        ).data

        services = ServiceSerializer(
            Service.objects.filter(
                freelancer=freelancer
            ),
            many=True
        ).data

        user_data["services"] = services

        return Response(user_data)
    queryset = User.objects.filter(role='freelancer')
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]


class FreelancerListView(generics.ListAPIView):

    queryset = User.objects.filter(role='freelancer')
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

class FreelancerDashboardView(APIView):

    permission_classes = [IsAuthenticated]


    def get(self, request):

        user = request.user


        if user.role != "freelancer":
            return Response(
                {"error":"Only freelancers allowed"},
                status=403
            )


        orders = Order.objects.filter(
            freelancer=user
        )


        completed_orders = orders.filter(
            status="completed"
        )


        earnings = completed_orders.aggregate(
            total=Sum("amount")
        )["total"] or 0



        reviews = Review.objects.filter(
            freelancer=user
        )


        average_rating = reviews.aggregate(
            avg=Avg("rating")
        )["avg"] or 0



        services = Service.objects.filter(
            freelancer=user
        ).count()



        return Response({

            "total_earnings": earnings,

            "active_orders": orders.filter(
                status="active"
            ).count(),

            "completed_orders": completed_orders.count(),

            "average_rating": round(
                average_rating,
                1
            ),

            "total_reviews": reviews.count(),

            "services": services

        })