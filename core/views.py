from django.shortcuts import render
from .models import User ,Role


def home(request):
    print(request)
    print(request.POST)
    print(request.POST.get("username"))
    return render(request, "core/home.html")

def login(request):
    if request.method == "POST":

        full_name = request.POST.get("full_name")
        username = request.POST.get("username")
        email = request.POST.get("email")
        password = request.POST.get("password")
        confirm_password = request.POST.get("confirm_password")
        terms = request.POST.get("terms")

        role = Role(1,"admin")
        role.save()
        user = User(1,1,email,username,password,full_name)
        user.save()
    return render(request, "core/login.html")

def register(request):
    return render(request, "core/register.html")
    

# Create your views here.
