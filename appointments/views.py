from django.shortcuts import redirect, get_object_or_404
from .models import Room, Appointment, Client
from django.utils.dateparse import parse_datetime

#def scheduleAppointmentView(request):
#    if request.method == "POST":
#        client_id = request.POST.get("client")
#        startTime = request.POST.get("startTime")
#        endTime = request.POST.get("endTime")
#        room_id = request.POST.get("room")
#
#        if client_id and room_id and startTime and endTime:
#            try:
#                client = Client.objects.get(id=client_id)
#                startTime = parse_datetime(startTime)
#                endTime = parse_datetime(endTime)
#                room = Room.objects.get(id=room_id)
#                
#                if startTime and endTime and room_id:
#                    Appointment.objects.create(
#                        client=client,
#                        startTime=startTime,
#                        endTime=endTime,
#                        room=room
#                    )
#                    return redirect("schedule")
#                else:
#                    print("Error: Datetime parsing failed")
#            except Client.DoesNotExist:
#                print("Error: Client not found")
#            except Room.DoesNotExist:
#                print("Error: Room not found")
#        return redirect("scheduling")
#
#def deleteAppointmentView(request, appointment_id):
#    if request.method == "POST":
#        appointment = get_object_or_404(Appointment, pk=appointment_id)
#        appointment.delete()
#        return redirect('schedule')
#    
#    return redirect('schedule')