from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Client


User = get_user_model()

class ClientSerializer(serializers.ModelSerializer):
    # Nested user fields
    firstName = serializers.CharField(source='user.firstName', required=True)
    lastName = serializers.CharField(source='user.lastName', required=True)
    email = serializers.EmailField(source='user.email', required=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Client
        fields = ['id', 'firstName', 'lastName', 'name', 'email', 'password',
            'whatsapp', 'dateOfBirth', 'observation'
        ]

    def get_name(self, obj):
        return obj.name

    def create(self, validated_data):
        user_data = validated_data.pop('user', {})

        firstName = user_data.get('firstName')
        lastName = user_data.get('lastName')
        email = user_data.get('email')
        password = validated_data.pop('password')
        # Step 1: Create the user
        user = User.objects.create_user(firstName=firstName, lastName=lastName, email=email, password=password)
        # Step 2: Create the client profile
        client = Client.objects.create(user=user, **validated_data)
        return client
    
    def update(self, instance, validated_data):
        # Handle user fields first
        user_data = validated_data.pop('user', {})
        user = instance.user
        for field in ['email', 'firstName', 'lastName']:
            value = user_data.get(field)
            if value:
                setattr(user, field, value)
        password = validated_data.pop('password', None)
        if password:
            user.set_password(password)
        user.save()
        # Handle client fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance