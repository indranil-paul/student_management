from statistics import mode
from django.db import models


class Student(models.Model):
    rollno: models.PositiveIntegerField()
    fname: models.CharField(max_length=100)
    lname: models.CharField(max_length=100)
    age: models.PositiveIntegerField()
    gender: models.CharField(max_length=10)
    degree: models.CharField(max_length=100)
    city: models.CharField(max_length=100)
    state: models.CharField(max_length=100)
    pincode: models.PositiveIntegerField()
    phone: models.PositiveIntegerField()
    emailid: models.EmailField()


    def __str__(self) -> str:
        return self.fname + ' ' + self.lname + ' (' + str(self.rollno) + ')'
