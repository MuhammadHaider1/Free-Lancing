from django.urls import path

from .views import (
    TransactionListView,
    WalletSummaryView,
    WithdrawalListCreateView,
    AdminWithdrawalListView,
    AdminWithdrawalActionView,
    AdminStatsView,

)

urlpatterns = [
    path('transactions/', TransactionListView.as_view()),
    path('summary/', WalletSummaryView.as_view()),
    path('withdrawals/', WithdrawalListCreateView.as_view()),
    path('admin/withdrawals/', AdminWithdrawalListView.as_view()),
    path('admin/withdrawals/<int:pk>/<str:action>/', AdminWithdrawalActionView.as_view()),
    path('admin/stats/', AdminStatsView.as_view()),
]