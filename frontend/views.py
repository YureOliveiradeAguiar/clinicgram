from calendar import month_name
from django.shortcuts import render, redirect

from clients.models import Client
from clients.forms import ClientForm
from appointments.models import Room, Appointment
from appointments.utils import generateScheduleData, generateIndexedCells

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

def schedulingView(request):
    clients = Client.objects.all().order_by('name')
    rooms = Room.objects.all().order_by('name')
    appointments = Appointment.objects.all()
    dias, horarios = generateScheduleData()
    indexedCells, occupiedIndexes = generateIndexedCells(dias, horarios, appointments)
    defaultRoom = rooms.first() if rooms.exists() else ""

    context = {
        "Clients": clients,
        "Rooms": rooms,
        "dias": dias,
        "horarios": horarios,
        "indexedCells": indexedCells,
        "occupiedIndexes": occupiedIndexes,
        "defaultRoom": defaultRoom,
    }

    return render(request, 'scheduling.html', context)

def scheduleView(request):
    clients = Client.objects.all()
    rooms = Room.objects.all()
    appointments = Appointment.objects.all()
    clientsJson = serialize('json', clients, fields=('id', 'name'))
    roomsJson = serialize('json', rooms, fields=('id', 'name'))
    appointmentsJson = serialize('json', appointments, fields=('id', 'client', 'startTime', 'endTime', 'room'))

    dias, horarios = generateScheduleData()
    indexedCells, occupiedIndexes = generateIndexedCells(dias, horarios, appointments)


    context = {
        "Clients": clientsJson,
        "Rooms": roomsJson,
        "Appointments": appointmentsJson,
        "dias": dias,
        "horarios": horarios,
        "indexedCells": indexedCells,
        "occupiedIndexes": occupiedIndexes
    }

    return render(request, "schedule.html", context)