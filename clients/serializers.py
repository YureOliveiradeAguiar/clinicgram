from rest_framework import serializers
from .models import Client
import re

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['id', 'name', 'whatsapp', 'dateOfBirth']

    @staticmethod
    def sanitizeField(value, maxLength=100):
        # Removes leadings or endings with blank spaces.
        value = value.strip()
        # Removes HTML tags like <script>.
        value = re.sub(r"<.*?>", "", value)
        # Removes dangerous characters.
        forbiddenChars = r"[=<>\\/\"'`$%&*{}[\]^|~#@!+:;?,]"
        value = re.sub(forbiddenChars, "", value)
        # Collapses multiple spaces into one.
        value = re.sub(r"\s+", " ", value)
        # Checks length after sanitization.
        if len(value) == 0:
            raise serializers.ValidationError("Nome inválido: campo vazio após limpeza.")
        if len(value) > maxLength:
            raise serializers.ValidationError(f"Nome inválido: ultrapassa {maxLength} caracteres.")
        return value
    
    def validate_name(self, value):
        return self.sanitizeField(value)

    def validate_whatsapp(self, value):
        return self.sanitizeField(value, 20)
    
    def validate_dateOfBirth(self, value):
        if not value:
            raise serializers.ValidationError("Data de nascimento é obrigatória.")
        return value