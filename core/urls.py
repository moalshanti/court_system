from django.urls import path
from .views import home , login


urlpatterns = [
    path("home/", home, name="home"),
    path("login/", login, name="login"),
]