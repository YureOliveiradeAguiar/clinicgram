from rest_framework import serializers
from reversion.models import Version

class HistorySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    model = serializers.CharField(source="content_type.model")
    comment = serializers.CharField(source="revision.comment", allow_blank=True)

    description = serializers.SerializerMethodField()
    action = serializers.SerializerMethodField()
    user = serializers.CharField(source="revision.user.username", default="(Unknown)")
    date = serializers.DateTimeField(source="revision.date_created", format="%Y-%m-%dT%H:%M:%SZ")

    class Meta:
        model = Version
        fields = ["id", "model", "description", "action", "user", "date", "comment"]

    def get_description(self, obj):
        try:
            instance = obj._object_version.object
            return str(instance)
        except Exception:
            return obj.object_repr or f"{obj.content_type.name} (deleted)"

    def get_action(self, obj):
        comment = obj.revision.comment.lower() if obj.revision.comment else ""
        if "delete" in comment:
            return "excluído"
        elif "create" in comment:
            return "criado"
        elif "update" in comment:
            return "atualizado"
        return "unknown"