from django.db import models
from django.conf import settings


class Service(models.Model):
    CATEGORY_CHOICES = [
        ('web_dev' , 'Web Development'),
        ('graphic' , 'Graphic Design'),
        ('writing' , 'Content Writing'),
        ('marketing','Digital Marketing'),
        ('other','Other')
    ]

    freelancer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete= models.CASCADE , related_name='services')
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=50 , choices = CATEGORY_CHOICES)
    price = models.DecimalField(max_digits=10 , decimal_places= 2)
    delivery_days = models.IntegerField()
    image = models.ImageField(upload_to='services/' , blank= True , null= True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title