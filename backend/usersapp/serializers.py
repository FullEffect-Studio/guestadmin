from rest_framework import serializers
from .models import User 
from django.contrib.auth import authenticate

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user 
        raise serializers.ValidationError("Invalid email or password")
    
class SuperUserSignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "first_name", "last_name", "password"]
        extra_kwargs = {"password":{"write_only":True}}

    def create(self, validated_data):
        return User.objects.create_superuser(**validated_data)
            
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email","first_name", "last_name", "password", "is_staff", "is_superuser"]

class RequestPasswordResetserializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate(self, attrs):
        return super().validate(attrs)
    
class PaswordResetSerializer(serializers.Serializer):
    password = serializers.CharField()