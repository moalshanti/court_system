from django.urls import path
from .views import home , login_view , register , admin_dashboard


urlpatterns = [
    path("home/", home, name="home"),
    path("login/", login_view, name="login"),
    path("register/", register, name="register"),
    path("admin_dashboard/", admin_dashboard, name="admin_dashboard"),

]