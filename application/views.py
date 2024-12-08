from django.db.transaction import commit
from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import status

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt

from application.models import Task
from application.serializers import TaskSerializer, UserRegistrationSerializer

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Create your views here

# Creating custom tokens from the existing token classes so that we can store them in cookies instead
# of just sending them to the frontend
################## Custom Access Token ####################
class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            # super will get the class, TokenObtainPairView in this case, and post will pass the args
            response = super().post(request, *args, **kwargs)
            # store the tokens returned in the tokens variable
            tokens = response.data

            access_token = tokens['access']
            refresh_token = tokens['refresh']

            # Create a response, every api needs a response
            res = Response()
            # Add data to the response
            res.data = {'success': True}

            # If successful create the two cookies, for the access and refresh tokens
            res.set_cookie(
                'access_token',
                access_token,
                httponly = True,
                secure = True,
                samesite = None,
                path = '/'
            )
            res.set_cookie(
                'refresh_token',
                refresh_token,
                httponly=True,
                secure=True,
                samesite=None,
                path='/'
            )
            # Return the response after successful result
            return res
        except:
            return Response({'success': False})


################# Custom refresh token #####################
class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            # Get the refresh token from the cookie
            refresh_token = request.COOKIES.get('refresh_token')
            # Set the refresh token to the request
            request.data['refresh'] = refresh_token

            # super will get the class, TokenRefreshView in this case, and post will pass the args, it
            # will then give us a new access token
            response = super().post(request, *args, **kwargs)

            # store the tokens returned in the tokens variable
            tokens = response.data

            access_token = tokens['access']

            # Create a new response
            res = Response()
            res.data = {'refreshed': True}
            res.token = access_token

            # Set the new cookie
            res.set_cookie(
                'access_token',
                access_token,
                httponly = True,
                secure=True,
                samesite = None,
                path = '/',
            )
            return res
        except:
            return Response({'refreshed': False})

################# Log out function #######################
@api_view(['POST'])
def logout(request):
    try:
        # Create a response
        res = Response()
        # Set it success = True
        res.data = {'success': True}
        # Delete the tokens stored in the cookies upon successful log out
        res.delete_cookie('access_token', path='/', samesite=None)
        res.delete_cookie('refresh_token', path='/', samesite=None)

        # Return the response
        return res

    except:
        return Response({'success': False})


# Function to check if user is authenticated(grant access) or not(do not grant access)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def is_authenticated(request):
    # If authenticated, the function just works, will give the 200 OK response, otherwise throw an error
    return Response({'authenticated': True})

# Register/Create a user
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    # request the data, using the serializer, passed in from the frontend
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    # If it's not valid return an error
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Function that will get all the tasks for a specific user
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_tasks(request):
    user = request.user
    tasks = Task.objects.filter(owner=user)
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

# Register/Create a task
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_task(request):
    # request the data, using the serializer, passed in from the frontend
    serializer = TaskSerializer(data=request.data)
    if serializer.is_valid():
        task = serializer.save(commit=False)
        task.owner = request.user
        task.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    # If it's not valid return an error
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)