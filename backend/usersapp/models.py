from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


class UserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, password=None):
        if not email:
            raise ValueError("Email must not be blank!")
        email = self.normalize_email(email)
        user = self.model(email=email, first_name=first_name, last_name=last_name)
        user.set_password(password)
        user.save()
        return user 
    
    def create_superuser(self, email, first_name, last_name, password):
        user = self.create_user(email, first_name, last_name, password)
        user.is_verified = True
        user.staff = True 
        user.is_superuser = True
        user.save()
        return user 
    

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    is_verified = models.BooleanField(default = False)
    phone_number = models.CharField(max_length=13, null=True, blank=True)
    is_staff = models.BooleanField(default = False)
    date_addedd = models.DateTimeField(auto_now_add = True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = UserManager()
    
    def __str__(self):
        return self.first_name
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    