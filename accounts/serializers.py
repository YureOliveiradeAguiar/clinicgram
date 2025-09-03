from rest_framework import serializers
from accounts.models import CustomUser

class WorkerSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'first_name', 'last_name', 'whatsapp', 'is_worker']