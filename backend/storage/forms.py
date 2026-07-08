from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
from .models import StorageNode


class RegistrationForm(UserCreationForm):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        placeholders = {
            "username": "Enter your username",
            "email": "Enter your email",
            "password1": "Enter your password",
            "password2": "Confirm your password",
        }

        for name, field in self.fields.items():
            field.widget.attrs.update(
                {
                    "class": "form-control",
                    "placeholder": placeholders.get(name, ""),
                }
            )
            field.help_text = ""

    email = forms.EmailField(
        required=True,
        help_text="Required. Enter a valid email address.",
    )

    class Meta:
        model = User
        fields = (
            "username",
            "email",
            "password1",
            "password2",
        )

    def clean_email(self):
        email = self.cleaned_data["email"]

        if User.objects.filter(email__iexact=email).exists():
            raise ValidationError("An account with this email already exists.")

        return email

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data["email"]

        if commit:
            user.save()

        return user


class StorageNodeForm(forms.ModelForm):

    allocated_storage = forms.IntegerField(
        min_value=1,
        label="Storage to Contribute (GB)",
    )

    class Meta:
        model = StorageNode

        fields = [
            "display_name",
            "allocated_storage",
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        placeholders = {
            "display_name": "e.g. Meet's Laptop",
            "allocated_storage": "e.g. 100",
        }

        for name, field in self.fields.items():
            field.widget.attrs.update(
                {
                    "class": "form-control",
                    "placeholder": placeholders.get(name, ""),
                }
            )

    def clean_allocated_storage(self):
        gb = self.cleaned_data["allocated_storage"]

        return gb * 1024 * 1024 * 1024
