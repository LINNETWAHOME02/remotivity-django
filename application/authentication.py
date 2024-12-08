# Provides authentication credentials when a function is called instead of passing them in the authorization header
from rest_framework_simplejwt.authentication import JWTAuthentication

class CookiesJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # Get the access token from the cookie created in the custom token in views.py
        access_token = request.COOKIES.get('access_token')

        if not access_token:
            # Do not authenticate
            return None

        # Validate the access token
        validated_token = self.get_validated_token(access_token)

        try:
            #If token is successfully validated, get the user from the token
            user = self.get_user(validated_token)
        except:
            return None

        # If successful return a tuple with the user and the validated token
        return (user, validated_token)
