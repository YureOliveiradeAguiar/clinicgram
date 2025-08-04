from rest_framework import serializers
from reversion.models import Version

class HistorySerializer(serializers.Serializer):
    description = serializers.CharField(source="object_repr")
    action = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()
    history_date = serializers.DateTimeField(source="revision.date_created")
    changes = serializers.SerializerMethodField()

    def get_user(self, obj: Version):
        return obj.revision.user.username if obj.revision.user else None

    def get_action(self, obj: Version):
        previous_versions = Version.objects.get_for_object_reference(
            obj.content_type.model_class(), obj.object_id
        ).order_by("revision__date_created")
        
        first = previous_versions.first()
        if first and first.id == obj.id:
            return "criado"
        # If this revision has a comment like "delete", you can customize this.
        if obj.revision.comment == "delete":
            return "excluído"
        return "atualizado"

    def get_changes(self, obj: Version):
        # Find the previous version to diff against
        previous_versions = Version.objects.get_for_object_reference(
            obj.content_type.model_class(), obj.object_id
        ).order_by("revision__date_created")

        # Get index of current version
        versions = list(previous_versions)
        idx = versions.index(obj)
        if idx + 1 >= len(versions):
            return {}

        previous = versions[idx + 1]

        changes = {}
        for field, new_value in obj.field_dict.items():
            old_value = previous.field_dict.get(field)
            if old_value != new_value:
                changes[field] = [old_value, new_value]

        return changes