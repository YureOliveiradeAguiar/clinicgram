from rest_framework import serializers
from accounts.models import CustomUser

class WorkerSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'first_name', 'last_name', 'name', 'whatsapp', 'is_worker']
        
    def get_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()