from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    objects = None
    name = models.CharField(max_length=20)
    description = models.CharField(max_length=200)

    # Every task is associated to a user, if user is deleted so is the task
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='task')

    start_time = models.DateTimeField(null=False)
    end_time = models.DateTimeField()

    # A model has to have a constructor
    def __str__(self):
        return self.name