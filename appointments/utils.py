from datetime import datetime, timedelta
# for scheduling  and schedule views
def generateScheduleData():
    hoje = datetime.today()
    dias = [hoje + timedelta(days=i) for i in range(15)]
    
    horarios = []
    hora_atual = 8
    for i in range(25):
        minuto = (i % 2) * 30
        horarios.append(f"{hora_atual:02d}:{minuto:02d}")
        if minuto == 30:
            hora_atual += 1
    
    return dias, horarios

# for scheduling view
def generateIndexedCells(dias, horarios, appointments):
    indexedCells = []
    occupiedIndexes = set()

    index = 1
    for horario in horarios:
        row = []
        for dia in dias:
            diaDateTimeLocal = f"{dia.strftime('%Y-%m-%d')}T{horario}"
            cell = {
                "dia": diaDateTimeLocal,
                "horario": horario,
                "index": index,
                "room_id": ''
            }
            # row.append({"dia": diaDateTimeLocal, "horario": horario, "index": index})

            for appointment in appointments:
                if dia.date() == appointment.startTime.date() or dia.date() == appointment.endTime.date():
                    appointmentStartTime = appointment.startTime.strftime("%H:%M")
                    appointmentEndTime = appointment.endTime.strftime("%H:%M")
                    if appointmentStartTime <= horario < appointmentEndTime:
                        occupiedIndexes.add(index)
                        cell["room_id"] = appointment.room.id

            row.append(cell)
            index += 1
        
        indexedCells.append(row)

    return indexedCells, list(occupiedIndexes)