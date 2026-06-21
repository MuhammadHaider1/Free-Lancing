from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView  # type: ignore[import]
from .views import RegisterView, UserProfileView ,FreelancerProfileView ,FreelancerListView
from .views import FreelancerDashboardView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path(
        "freelancers/<int:pk>/",
        FreelancerProfileView.as_view()
    ),
    path(
        "freelancers/",
        FreelancerListView.as_view()
    ),
    path(
        "freelancer-dashboard/",
        FreelancerDashboardView.as_view()
    ),

]