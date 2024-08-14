
from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf.urls.static import static
from django.conf import settings


schema_view = get_schema_view(
   openapi.Info(
      title="Guest House Manager",
      default_version='v1',
      description="The backend for Guest house applications.",
      terms_of_service="danquahwilliam.verelapp.com",
      contact=openapi.Contact(email="danquahwilliam@gmail.com"),
      license=openapi.License(name="William Dreams"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/", include("mainapp.urls")),
    path("user/", include("usersapp.urls")),
    path("",  schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path("auth/", include("rest_framework.urls", namespace="rest_framework"))
]

urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
