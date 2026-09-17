from django.urls import path
from .views import home , login_view , register , admin_dashboard , users_list , cases , clients


urlpatterns = [
    path("home/", home, name="home"),
    path("login/", login_view, name="login"),
    path("register/", register, name="register"),
    path("admin_dashboard/", admin_dashboard, name="admin_dashboard"),
    path("users_list/", users_list, name="users_list"),
    path("cases/", cases, name="cases"),
    path("clients/", clients, name="clients"),

]