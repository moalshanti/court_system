import random
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from .models import  EmployeeProfile , Role
from django.contrib.auth import authenticate, login, logout
from django.utils import timezone
from django.contrib import messages
from django.contrib.auth.decorators import login_required


def home(request):

    return render(request, "core/home.html")

def login_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(request , username=username , password = password)

        if user is not None : 

            login(request,user)
  
            return redirect("home")
        else :
            messages.success(request,"erorr")

            return redirect("login_view")
        
    return render(request, "core/login.html")


def register(request):
        
    if request.method == "POST":

        full_name = request.POST.get("full_name").strip()
        username = request.POST.get("username").strip()
        email = request.POST.get("email").strip()
        password = request.POST.get("password")
        phone = request.POST.get("phone")
        country_code = request.POST.get("country_code")
        confirm_password = request.POST.get("confirm_password")
        terms = request.POST.get("terms")

                # 2. التأكد من الموافقة على الشروط
        if not terms:
            return render(request, "core/register.html", {
                "error": "يجب الموافقة على الشروط."
            })

        # 3. التأكد من تطابق كلمتي المرور
        if password != confirm_password:
            return render(request, "core/register.html", {
                "error": "كلمتا المرور غير متطابقتين."
            })

        # 4. التأكد أن username غير مستخدم
        if User.objects.filter(username=username).exists():
            return render(request, "core/register.html", {
                "error": "اسم المستخدم مستخدم بالفعل."
                })
        
        role = Role(1,'admin')
        role.save()
        
        user = User.objects.create_user(
            username=username,
            first_name=full_name,
            last_name=full_name,
            email=email,
            password=password
        )

        user.is_superuser = False
        user.is_staff = False
        user.is_active = True

        user.save()

        employee_profile = EmployeeProfile(user=user,role_id=1,full_name=full_name,phone=country_code+phone[1:])
        employee_profile.save()
        
        return redirect("login_view")

    return render(request, "core/register.html")

@login_required
def admin_dashboard(request):
    return render(request, "core/admin_dashboard.html")
    

# Create your views here.
