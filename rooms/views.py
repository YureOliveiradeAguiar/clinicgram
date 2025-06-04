from django.db import IntegrityError
from django.shortcuts import render, redirect, get_object_or_404
from .models import Room

def registerRoomView(request):
    if request.method == "POST":
        name = request.POST.get("name", "").strip()
        if name:
            try:
                Room.objects.create(name=name)
            except IntegrityError:
                return render(request, "register_room.html", {"error": "Room already exists."})
            return redirect("roomManager")
    return redirect('roomManager')

def deleteRoomView(request):
    if request.method == "POST":
        room_id = request.POST.get("roomId")
        room = get_object_or_404(Room, id=room_id)
        room.delete()
    return redirect('roomManager')
