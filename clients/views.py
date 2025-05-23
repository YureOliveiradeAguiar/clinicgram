from django.shortcuts import redirect, get_object_or_404
from .models import Client

def deleteClientView(request, client_id):
    client = get_object_or_404(Client, id=client_id)
    client.delete()
    return redirect('clients')