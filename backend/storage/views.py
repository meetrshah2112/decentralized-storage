from django.contrib import messages
from django.shortcuts import render, redirect
from .forms import RegistrationForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView
from django.urls import reverse_lazy
from .forms import StorageNodeForm
from .models import StorageNode


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
    return render(request, "storage/consumer_dashboard.html")


@login_required
def provider_dashboard(request):

    node = StorageNode.objects.filter(owner=request.user).first()

    return render(
        request,
        "storage/provider_dashboard.html",
        {
            "node": node,
        },
    )


@login_required
def register_storage_node(request):

    profile = request.user.profile

    if profile.role != "provider":
        messages.error(request, "Only providers can register storage nodes.")
        return redirect("consumer_dashboard")

    if StorageNode.objects.filter(owner=request.user).exists():
        messages.info(request, "You have already registered a storage node.")
        return redirect("provider_dashboard")

    if request.method == "POST":

        form = StorageNodeForm(request.POST)

        if form.is_valid():

            node = form.save(commit=False)
            node.owner = request.user
            node.save()

            messages.success(request, "Storage node registered successfully.")

            return redirect("provider_dashboard")

    else:

        form = StorageNodeForm()

    return render(
        request,
        "storage/register_storage_node.html",
        {
            "form": form,
        },
    )
