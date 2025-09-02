from rest_framework import serializers
from accounts.models import CustomUser

class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'whatsapp', 'is_worker']