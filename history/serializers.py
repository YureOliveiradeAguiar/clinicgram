from rest_framework import serializers

class HistorySerializer(serializers.Serializer):
    id = serializers.IntegerField(source='instance.id')
    model = serializers.SerializerMethodField()
    object_id = serializers.IntegerField(source='instance.pk')
    user = serializers.SerializerMethodField()
    history_date = serializers.DateTimeField()
    changes = serializers.SerializerMethodField()

    def get_model(self, obj):
        return obj.instance.__class__.__name__

    def get_user(self, obj):
        return obj.history_user.username if obj.history_user else None

    def get_changes(self, obj):
        prev_record = obj.prev_record
        if not prev_record:
            return {}
        delta = obj.diff_against(prev_record)
        return {change.field: [change.old, change.new] for change in delta.changes}