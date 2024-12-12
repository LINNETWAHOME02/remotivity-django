from django.db.transaction import commit
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt

from .models import Task
from .serializers import TaskSerializer, UserRegistrationSerializer, UserSerializer

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

@api_view(['POST'])
def signin(request):
    user = get_object_or_404(User, username=request.data['username'])

    if not (user.check_password(request.data['password']) or user.password == request.data['password']):
            return Response({'message': 'Invalid credentials'}, status=400)


    token, _ = Token.objects.get_or_create(user=user)

    serializer = UserSerializer(instance=user)
    return Response({'token': token.key, 'user': serializer.data}, status=200)


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
@authentication_classes([SessionAuthentication, TokenAuthentication])
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
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_tasks(request):
    user = request.user
    tasks = Task.objects.filter(owner=user)
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

# Register/Create a task
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([SessionAuthentication, TokenAuthentication])
def create_task(request):
    # request the data, using the serializer, passed in from the frontend
    serializer = TaskSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(owner=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    # If it's not valid return an error
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Sign up
@api_view(['POST'])
def signup(request):
    # create a new user object from the request data
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()

        #  get the user object
        user = User.objects.get(username=request.data['username'])

        # hash the password
        user.set_password(request.data['password'])

        # update the user object with the hashed password
        user.save()

        # create a token for the user
        token = Token.objects.create(user=user)

        # return the token and user data
        return Response({'token': token.key, 'user': serializer.data}, status=201)
    else:
        return Response(serializer.errors,status=400)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@authentication_classes([SessionAuthentication, TokenAuthentication])
def delete_task(request, task_id):
    """
    Deletes a task by its ID.
    """
    task = get_object_or_404(Task, id=task_id)
    if task.owner != request.user:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    task.delete()
    return Response({'message': 'Task deleted successfully'}, status=status.HTTP_200_OK)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@authentication_classes([SessionAuthentication, TokenAuthentication])
def update_task(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    if task.owner != request.user:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

    # Assuming `request.data` contains fields like {'name': 'New Task Name'}
    for field, value in request.data.items():
        setattr(task, field, value)
    task.save()

    return Response({'message': 'Task updated successfully'}, status=status.HTTP_200_OK)

# Get specific task to be updated
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([SessionAuthentication, TokenAuthentication])
def get_task(request, task_id):
    task = get_object_or_404(Task, id=task_id, owner=request.user)
    serializer = TaskSerializer(task)  # Use your serializer here
    return Response(serializer.data, status=status.HTTP_200_OK)
