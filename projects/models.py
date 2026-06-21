from django.db import models
from django.conf import settings


class Project(models.Model):
    STATUS_CHOICES = [
        ('open','Open'),
        ('in_progress','In Progress'),
        ('completed','Completed'),
        ('cancelled','Cancelled'),
    ]

    client = models.ForeignKey(settings.AUTH_USER_MODEL , on_delete=models.CASCADE , related_name='projects')
    title = models.CharField(max_length=200)
    description = models.TextField()
    budget = models.DecimalField(max_digits=10 , decimal_places=2)
    deadline = models.DateField()
    status = models.CharField(max_length=20 , choices=STATUS_CHOICES , default='open')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    


class Proposal(models.Model):
    STATUS_CHOICES = [
        ('pending' , 'Pending'),
        ('accepted' , 'Accepted'),
        ('rejected' , 'Rejected'),
    ]

    class Meta:
        unique_together = [
            ('project', 'freelancer')
        ]

    project = models.ForeignKey(Project , on_delete= models.CASCADE , related_name='proposals')
    freelancer = models.ForeignKey(settings.AUTH_USER_MODEL , on_delete= models.CASCADE , related_name='proposals')
    cover_letter =models.TextField()
    bid_amount = models.DecimalField(max_digits=10 , decimal_places= 2)
    delivery_days = models.IntegerField()
    status = models.CharField(max_length=20, choices= STATUS_CHOICES , default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.freelancer} - {self.project}" 