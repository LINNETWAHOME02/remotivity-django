from django.urls import path, include
from django.contrib import admin

from . import views
from .views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('getTasks/', views.get_tasks, name='getTasks'),
    path('create_tasks/', views.create_task, name='create_tasks'),
    # Access Token
    path('token/', CustomTokenObtainPairView.as_view(), name='get_token'),
    # Refresh Token
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='refresh_token'),
    # Include all the urls in the rest framework for any that might be required
    # path('application-auth/', include('rest_framework.urls')),

    path('logout/', views.logout, name='logout'),
    path('is_authenticated/', views.is_authenticated, name='is_authenticated'),
    path('register_user/', views.register_user, name='register_user'),
]