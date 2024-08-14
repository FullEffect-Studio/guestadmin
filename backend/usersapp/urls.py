from django.urls import path
from .views import *

urlpatterns = [
    path("", UserListAPI.as_view()),
    path("signin/", LoginAPIVieew.as_view()),
    path("user/sup/signup", SuperUserSignAPIView.as_view()),
    path("user/pwd-reset-request/", RequestPasswordResetAPIview.as_view()),
    path("user/reset-my-pwd/<uuidb64>/<token>/", ResetPasswordAPIView.as_view(), name="reset-pwd"),
]