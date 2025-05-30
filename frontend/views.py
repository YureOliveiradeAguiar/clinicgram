from calendar import month_name
from django.shortcuts import render, redirect
from clients.models import Client
from clients.forms import ClientForm
from appointments.models import Appointment, Room
from datetime import datetime, timedelta
from django.core.serializers import serialize
import locale

locale.setlocale(locale.LC_TIME, 'pt_BR')

def home(request):
    return render(request, "index.html")

def dashboardView(request):
    return render(request, "userDashboard.html")

def registerClientView(request):
    if request.method == "POST":
        form = ClientForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('clients')
    else:
        form = ClientForm()

    monthNames = [(str(i).zfill(2), month_name[i]) for i in range(1, 13)]
    context = {
        'form': form,
        'rangeDays': range(1, 32),
        'monthNames': monthNames,
        'rangeYears': range(2025, 1900, -1)
    }
    return render(request, 'registerClient.html', context)

def clientsView(request):
    clients = Client.objects.all().order_by('name')
    return render(request, "clients.html", {"Clients": clients})

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

def generateIndexedCells(dias, horarios, appointments):
    indexedCells = []
    occupiedIndexes = set()

    index = 1
    for horario in horarios:
        row = []
        for dia in dias:
            diaDateTimeLocal = f"{dia.strftime('%Y-%m-%d')}T{horario}"
            row.append({"dia": diaDateTimeLocal, "horario": horario, "index": index})
            for appointment in appointments:
                if dia.date() == appointment.startTime.date() or dia.date() == appointment.endTime.date():
                    appointmentStartTime = appointment.startTime.strftime("%H:%M")
                    appointmentEndTime = appointment.endTime.strftime("%H:%M")
                    if appointmentStartTime <= horario < appointmentEndTime:
                        occupiedIndexes.add(index)
            index += 1
        indexedCells.append(row)

    return indexedCells, list(occupiedIndexes)

def schedulingView(request):
    clients = Client.objects.all().order_by('name')
    rooms = Room.objects.all().order_by('name')
    appointments = Appointment.objects.all()
    dias, horarios = generateScheduleData()
    indexedCells, occupiedIndexes = generateIndexedCells(dias, horarios, appointments)

    context = {
        "Clients": clients,
        "Rooms": rooms,
        "dias": dias,
        "horarios": horarios,
        "indexedCells": indexedCells,
        "occupiedIndexes": occupiedIndexes
    }

    return render(request, 'scheduling.html', context)

def scheduleView(request):
    clients = Client.objects.all()
    appointments = Appointment.objects.all()
    clientsJson = serialize('json', clients, fields=('id', 'name'))
    appointmentsJson = serialize('json', appointments, fields=('id', 'startTime', 'endTime', 'client'))

    dias, horarios = generateScheduleData()
    indexedCells, occupiedIndexes = generateIndexedCells(dias, horarios, appointments)



    context = {
        "Clients": clientsJson,
        "Appointments": appointmentsJson,
        "dias": dias,
        "horarios": horarios,
        "indexedCells": indexedCells,
        "occupiedIndexes": occupiedIndexes
    }

    return render(request, "schedule.html", context)