from django.db import models
from django.conf import settings
from projects.models import Proposal

class Order(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('delivered', 'Delivered'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    proposal = models.ForeignKey(Proposal, on_delete=models.CASCADE, related_name='order')
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='client_orders')
    freelancer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='freelancer_orders')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    delivery_file = models.FileField(upload_to='deliveries/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    delivered_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"Order #{self.id}"