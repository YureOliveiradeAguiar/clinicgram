from rest_framework import serializers

class HistorySerializer(serializers.Serializer):
    description = serializers.SerializerMethodField()
    action = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()
    history_date = serializers.DateTimeField()

    changes = serializers.SerializerMethodField()

    def get_user(self, obj):
        return obj.history_user.username if obj.history_user else None

    def get_changes(self, obj):
        prev_record = obj.prev_record
        if not prev_record:
            return {}
        delta = obj.diff_against(prev_record)
        return {change.field: [change.old, change.new] for change in delta.changes}

    def get_description(self, obj):
        instance = obj.instance
        modelName = instance.__class__.__name__

        # Add custom summaries depending on model.
        if modelName == "Appointment":
            # Assuming Appointment has fields: client (FK) and date.
            clientName = getattr(instance.client, "name", "Sem cliente")
            startTime = getattr(instance, "startTime", None)
            if startTime:
                startTime = startTime.strftime("%d/%m/%Y às %H:%M")
            else:
               startTime = "horário indefinido"
            return f"Agendamento de {clientName} em {startTime}"
        elif modelName == "Client":
            return f"Cliente: {getattr(instance, 'name', '')}"
        elif modelName == "Place":
            return f"Local: {getattr(instance, 'name', '')}"
        return f"{modelName}"
    
    def get_action(self, obj):
        if obj.history_type == "+":
            return "Criado"
        elif obj.history_type == "~":
            return "Modificado"
        elif obj.history_type == "-":
            return "Excluído"
        return "Alterado"