from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User

# Django uses the ORM to map python objects to the corresponding code the needs to be executed to make a
# change in the database

# From the api(we create), JSON data will be accepted that contains the fields we specify for a new user
# we want to create. Also return JSON with data about the response received from the request made

# The SERIALIZER takes the python object, User and Task in this case, and converts it into JSON data for the frontend, that
# can be used in communication with other applications

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        # Set the user's password
        user.set_password(validated_data['password'])

        # Save the user to the database
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'description', 'start_time', 'end_time']