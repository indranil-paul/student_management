from pyexpat import model
from django.db import models
from django.contrib.auth.models import User


class Student(models.Model):
    user = models.OneToOneField(User, null=True, on_delete=models.CASCADE)
    fname = models.CharField(max_length=100)
    lname = models.CharField(max_length=100, default='')
    dob = models.DateField()
    gender = models.CharField(max_length=10)
    degree = models.CharField(max_length=100)
    city = models.CharField(max_length=100, default='')
    state = models.CharField(max_length=100, default='')
    pincode = models.PositiveIntegerField()
    phone = models.PositiveIntegerField()
    emailid = models.EmailField()


    def __str__(self) -> str:
        return self.fname + ' ' + self.lname
