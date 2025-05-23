from django.shortcuts import redirect, get_object_or_404
from .models import Appointment, Client
from django.utils.dateparse import parse_datetime

def scheduleAppointmentView(request):
    if request.method == "POST":
        client_id = request.POST.get("client")
        startTime = request.POST.get("startTime")
        endTime = request.POST.get("endTime")

        if client_id and startTime and endTime:
            try:
                client = Client.objects.get(id=client_id)
                startTime = parse_datetime(startTime)
                endTime = parse_datetime(endTime)
                
                if startTime and endTime:
                    Appointment.objects.create(
                        client=client,
                        startTime=startTime,
                        endTime=endTime,
                    )
                    return redirect("schedule")
                else:
                    print("Error: Datetime parsing failed")
            except Client.DoesNotExist:
                print("Error: Client not found")

    return redirect("schedule")

def deleteAppointmentView(request, appointment_id):
    if request.method == "POST":
        appointment = get_object_or_404(Appointment, pk=appointment_id)
        appointment.delete()
        return redirect('schedule')
    
    return redirect('schedule')
