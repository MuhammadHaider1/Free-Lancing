from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = [
        ('client' , 'Client'),
        ('freelancer' , 'Freelancer'),
    ]

    role = models.CharField(max_length=20 , choices=ROLE_CHOICES)
    bio = models.TextField(blank=True)
    profile_picture= models.ImageField(upload_to = 'profiles/' , blank= True , null= True)
    created_at = models.DateTimeField(auto_now_add= True)

    def __str__(self):
        return self.username

