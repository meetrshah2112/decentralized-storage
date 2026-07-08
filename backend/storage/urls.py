from django.urls import path
from .views import CustomLoginView
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("register/", views.register, name="register"),
    path("accounts/login/", CustomLoginView.as_view(), name="login"),
    path(
        "consumer/dashboard/",
        views.consumer_dashboard,
        name="consumer_dashboard",
    ),
    path(
        "provider/dashboard/",
        views.provider_dashboard,
        name="provider_dashboard",
    ),
    path(
        "provider/register-node/",
        views.register_storage_node,
        name="register_storage_node",
    ),
]
