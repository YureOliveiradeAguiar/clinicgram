from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Client


User = get_user_model()

class ClientSerializer(serializers.ModelSerializer):
    # Nested user fields
    first_name = serializers.CharField(source="user.first_name", required=True)
    last_name = serializers.CharField(source="user.last_name", required=True)
    email = serializers.EmailField(source="user.email", required=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Client
        fields = ["id", "first_name", "last_name", "full_name", "email", "password", "whatsapp", "dateOfBirth", "observation"]

    def get_full_name(self, obj):
        return obj.full_name

    def create(self, validated_data):
        user_data = validated_data.pop("user", {})

        first_name = user_data.get("first_name")
        last_name = user_data.get("last_name")
        email = user_data.get("email")
        password = validated_data.pop("password")
        # Step 1: Create the user
        user = User.objects.create_user(first_name=first_name, last_name=last_name, email=email, password=password)
        # Step 2: Create the client profile
        client = Client.objects.create(user=user, **validated_data)
        return client
    
    def update(self, instance, validated_data):
        # Handle user fields first
        user_data = validated_data.pop("user", {})
        user = instance.user
        email = user_data.get("email")
        password = validated_data.pop("password", None)

        if email:
            user.email = email
        if password:
            user.set_password(password)
        user.save()
        # Handle client fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance