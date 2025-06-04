from django import forms
from .models import Room

class RoomForm(forms.ModelForm):
    class Meta:
        model = Room
        fields = ['name']
        widgets = {
            'name': forms.TextInput(attrs={'placeholder': 'Nome da sala',
                                            'autocomplete': "off",
                                            'class': 'form-control'})
        }