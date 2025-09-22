from rest_framework import serializers

from disciplines.serializers import DisciplineSerializer

from .models import Treatment
from disciplines.models import Discipline


class TreatmentSerializer(serializers.ModelSerializer):
    discipline = DisciplineSerializer(read_only=True)
    disciplineId = serializers.PrimaryKeyRelatedField(
        queryset=Discipline.objects.all(),
        source='discipline',
        required=False,
        allow_null=True
    )
    class Meta:
        model = Treatment
        fields = ['id', 'name', 'discipline', 'disciplineId', 'rooms']
        read_only_fields = ['discipline']

    def validate_rooms(self, value):
        if not value:
            raise serializers.ValidationError("Treatment must have at least one room.")
        return value