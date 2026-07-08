from django.contrib import messages
from django.shortcuts import render, redirect
from .forms import RegistrationForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView
from django.urls import reverse_lazy


class CustomLoginView(LoginView):
    template_name = "registration/login.html"
    redirect_authenticated_user = True

    def get_success_url(self):
        profile = self.request.user.profile

        if profile.role == "provider":
            return reverse_lazy("provider_dashboard")

        return reverse_lazy("consumer_dashboard")


def register(request):

    if request.user.is_authenticated:
        return redirect("home")

    if request.method == "POST":
        form = RegistrationForm(request.POST)

        if form.is_valid():
            form.save()

            messages.success(
                request, "Account created successfully. You can now log in."
            )

            return redirect("login")

    else:
        form = RegistrationForm()

    return render(
        request,
        "registration/register.html",
        {"form": form},
    )


@login_required
def home(request):

    if request.user.profile.role == "provider":
        return redirect("provider_dashboard")

    return redirect("consumer_dashboard")


@login_required
def consumer_dashboard(request):
    return render(request, "consumer_dashboard.html")


@login_required
def provider_dashboard(request):
    return render(request, "provider_dashboard.html")
