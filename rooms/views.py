from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Room

class RoomListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        rooms = Room.objects.all().order_by('name')
        roomData = [
            {
                'id': room.id,
                'name': room.name,
            }
            for room in rooms
        ]
        return Response(roomData)
    
    
# def registerRoomView(request):
#     if request.method == "POST":
#         name = request.POST.get("name", "").strip()
#         if name:
#             try:
#                 Room.objects.create(name=name)
#             except IntegrityError:
#                 return render(request, "register_room.html", {"error": "Room already exists."})
#             return redirect("roomManager")
#     return redirect('roomManager')
# 
# def deleteRoomView(request):
#     if request.method == "POST":
#         room_id = request.POST.get("roomId")
#         room = get_object_or_404(Room, id=room_id)
#         room.delete()
#     return redirect('roomManager')
