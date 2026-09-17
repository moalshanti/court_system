import random
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from .models import  EmployeeProfile , Role , CourtCase , CaseClient , Client
from django.contrib.auth import authenticate, login, logout
from django.utils import timezone
from django.contrib import messages
from django.contrib.auth.decorators import login_required

 # C:\Users\PC\Documents\django

def home(request):

    return render(request, "core/home.html")

def login_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(request , username=username , password = password)

        if user is not None : 

            login(request,user)
  
            return redirect("admin_dashboard")
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
        role = Role(2,'judge')
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

        employee_profile = EmployeeProfile(user=user,role_id=2,full_name=full_name,phone=country_code+phone[1:])
        employee_profile.save()
        
        return redirect("login")

    return render(request, "core/register.html")

@login_required
def admin_dashboard(request):
    cases_number = CourtCase.objects.count()
    return render(request, "core/admin_dashboard.html",{
        "cases_number":cases_number})

@login_required
def users_list(request):

    cases_number = CourtCase.objects.count()
    employees = EmployeeProfile.objects.select_related("user").all()
    active_users = employees.filter(user__is_active=True).count()
    inactive_users = employees.filter(user__is_active=False).count()
    admin_users = employees.filter(role_id = 1).count()

    return render(request, "core/users.html", 
                  {"employee" : employees , 
                   'active_users' : active_users ,
                   'inactive_users' : inactive_users ,
                   'admin_users' : admin_users ,
                   "cases_number":cases_number})
    

def cases(request):
    cases_number = CourtCase.objects.count()
    cases_close = CourtCase.objects.filter(status = 'مغلقة').count()
    cases_open = CourtCase.objects.filter(status = 'قيد النظر').count()

    # cases = CourtCase.objects.select_related("created_by").all

    case_client = CaseClient.objects.select_related('client', 'case').all()

    

    return render(request, "core/cases.html",{
        "cases_number" : cases_number,
        'cases_close' : cases_close,
        'cases_open' : cases_open,
        "case_client" : case_client})

def clients(request):
    cases_number = CourtCase.objects.count()
    clients = Client.objects.all()
    return render(request, "core/clients.html" , {
        'cases_number' : cases_number,
        'clients' : clients})
