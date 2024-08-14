from rest_framework import status, generics
from rest_framework.response import Response
from .models import User
from .serializers import *
from rest_framework_simplejwt.tokens import RefreshToken
from .utils import Utils
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import smart_bytes, force_str, DjangoUnicodeDecodeError
from django.contrib.auth.tokens import PasswordResetTokenGenerator

class LoginAPIVieew(generics.GenericAPIView):
    serializer_class = UserLoginSerializer
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data
        try:
            user = User.objects.get(email=serializer.data["email"])
            rToken = RefreshToken.for_user(user)
            access_token = str(rToken.access_token)
            return Response({"tokens":{"refresh_token": str(rToken), "access_token": access_token}, "username":user.full_name, "user_id":user.id}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(str(e), status = status.HTTP_500_INTERNAL_SERVER_ERROR)

class SuperUserSignAPIView(generics.GenericAPIView):
    serializer_class = SuperUserSignUpSerializer
    def post(self, request):
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
class UserListAPI(generics.ListAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()


class RequestPasswordResetAPIview(generics.GenericAPIView):
    serializer_class = RequestPasswordResetserializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data
        
        if User.objects.filter(email=serializer.data["email"]).exists():
            user = User.objects.get(email = serializer.data["email"])
            EMAIL_TO = user.email
            EMAIL_SUBJECT = "Password reset email"
            current_site = get_current_site(request).domain
            uuidb64 = urlsafe_base64_encode(smart_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)
            relative_url = reverse("reset-pwd", kwargs={"token":token, "uuidb64":uuidb64})
            abs_url = "{}{}".format(current_site, relative_url)
            EMAIL_BODY ="Hi {}\nPassword reset link:\n{}".format(user.full_name, abs_url)
            payload = {"EMAIL_SUBJECT": EMAIL_SUBJECT, "EMAIL_BODY":EMAIL_BODY, "EMAIL_TO":EMAIL_TO}
            Utils.send_email(payload)

            return Response({"message":"success", "email":abs_url})
        return Response("user does not exist.")

class ResetPasswordAPIView(generics.GenericAPIView):
    serializer_class = PaswordResetSerializer
    def post(self, request, uuidb64, token):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            id = force_str(urlsafe_base64_decode(uuidb64))
            user = User.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                return Response("Invalid password reset token")
            user.set_password(serializer.data["password"])
            user.save()
            return Response("Password Reset Successful!")
        except Exception as e:
            return Response(f"some ugly error, {e}")
