from calendar import month_name
from django.shortcuts import render, redirect

from clients.models import Client
from clients.forms import ClientForm

from appointments.models import Appointment
from appointments.utils import generateScheduleData, generateIndexedCells

from places.models import Place
from places.forms import RoomForm

from django.core.serializers import serialize
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
import locale

locale.setlocale(locale.LC_TIME, 'pt_BR')

def home(request):
    logout(request)
    return render(request, "index.html")

@login_required
def dashboardView(request):
    return render(request, "dashboard.html")

@login_required
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

@login_required
def clientsView(request):
    clients = Client.objects.all().order_by('name')
    return render(request, "clients.html", {"Clients": clients})

@login_required
def schedulingView(request):
    clients = Client.objects.all().order_by('name')
    rooms = Room.objects.all().order_by('name')
    appointments = Appointment.objects.all()

    appointmentsJson = serialize('json', appointments, fields=('id', 'client', 'startTime', 'endTime', 'room'))

    dias, horarios = generateScheduleData()
    indexedCells, occupiedIndexes = generateIndexedCells(dias, horarios, appointments)
    defaultRoom = rooms.first() if rooms.exists() else ""

    context = {
        "Clients": clients,
        "Rooms": rooms,
        "Appointments": appointmentsJson,
        "dias": dias,
        "horarios": horarios,
        "indexedCells": indexedCells,
        "occupiedIndexes": occupiedIndexes,
        "defaultRoom": defaultRoom,
    }

    return render(request, 'scheduling.html', context)

@login_required
def scheduleView(request):
    clients = Client.objects.all()
    rooms = Room.objects.all()
    appointments = Appointment.objects.all().order_by('startTime')
    
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

@login_required
def roomManagerView(request):
    rooms = Room.objects.all().order_by('name')

    if request.method == "POST":
        form = RoomForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('clients')
    else:
        form = RoomForm()
    context = {
        "Rooms": rooms,
        'form': form
    }
    return render(request, 'roomManager.html', context)