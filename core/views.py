from django.shortcuts import render


def home(request):
    print(request)
    print(request.POST)
    print(request.POST.get("username"))
    return render(request, "core/home.html")

def login(request):
    return render(request, "core/login.html")

# Create your views here.
