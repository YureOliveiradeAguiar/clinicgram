from django import forms
from .models import Client

class ClientForm(forms.ModelForm):
    class Meta:
        model = Client
        fields = ['name', 'whatsapp', 'dateOfBirth']
        widgets = {
            'name': forms.TextInput(attrs={'placeholder': 'Nome completo do cliente',
                                            'autocomplete': "off",
                                            'class': 'form-control'}),
            'whatsapp': forms.TextInput(attrs={'placeholder': 'Nº de telefone WhatsApp',
                                                'autocomplete': "off",
                                                'class': 'form-control',
                                                'id': 'idWhatsapp'}),
            'dateOfBirth': forms.HiddenInput(attrs={'autocomplete': "off",
                                                    'class': 'form-control',
                                                    'id': 'birthDate'})
        }