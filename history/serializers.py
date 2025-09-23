from rest_framework import serializers
from reversion.models import Version

class HistorySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    model = serializers.CharField(source="content_type.model")
    comment = serializers.CharField(source="revision.comment", allow_blank=True)

    description = serializers.SerializerMethodField()
    action = serializers.SerializerMethodField()
    user = serializers.CharField(source="revision.user", default="(Unknown)")
    date = serializers.DateTimeField(source="revision.date_created", format="%Y-%m-%dT%H:%M:%SZ")
    changes = serializers.SerializerMethodField()

    class Meta:
        model = Version
        fields = ["id", "model", "description", "action", "user", "date", "comment", "changes"]

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
    
    def get_changes(self, version: Version):
        comment = version.revision.comment.lower() if version.revision.comment else ""
        if not "update" in comment:
            return
        
        nonModifiedObject = version._object_version.object # The object as it was at this version.
        model_class = type(nonModifiedObject)

        modifiedVersion = (Version.objects.filter( # The version being created at this point in time.
                object_id=version.object_id,
                content_type=version.content_type,
                revision__date_created__gt=version.revision.date_created
            ).order_by('revision__date_created').first())
        print("modifiedVersion: ", modifiedVersion)

        if not modifiedVersion: # If it was the last update, compare with the current object in the DB.
            try:
                modifiedObject = model_class.objects.get(pk=version.object_id)
            except model_class.DoesNotExist:
                return []
        else:
            modifiedObject = modifiedVersion._object_version.object

        changedFields = [] # Compare field-by-field.
        for field in model_class._meta.fields:
            fieldName = field.name
            oldValue = getattr(nonModifiedObject, fieldName, None)
            newValue = getattr(modifiedObject, fieldName, None)
            if oldValue != newValue:
                changedFields.append(f"{oldValue or "🛇"} → {newValue}")

        return changedFields