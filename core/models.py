from django.db import models
from django.contrib.auth.models import User

class Role(models.Model):
    role_id = models.AutoField(primary_key=True)
    role_name = models.CharField(max_length=255)

    def __str__(self):
        return self.role_name

class EmployeeProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True )
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, db_column='role_id')
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=255)

    def __str__(self):
        return self.full_name

class Client(models.Model):
    client_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=50)
    address = models.TextField()
    national_id = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class CourtCase(models.Model):
    case_id = models.AutoField(primary_key=True)
    case_number = models.CharField(max_length=100)
    case_date = models.DateField()
    status = models.CharField(max_length=50)
    # 'created_by' links to User
    created_by = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE, db_column='created_by')
    
    # Many-to-Many relationship with Client through a custom intermediate table
    clients = models.ManyToManyField(Client, through='CaseClient')

    def __str__(self):
        return self.case_number

class CaseClient(models.Model):
    case_client_id = models.AutoField(primary_key=True)
    case = models.ForeignKey(CourtCase, on_delete=models.CASCADE, db_column='case_id')
    client = models.ForeignKey(Client, on_delete=models.CASCADE, db_column='client_id')
    client_role = models.CharField(max_length=100)

class Session(models.Model):
    session_id = models.AutoField(primary_key=True)
    case = models.ForeignKey(CourtCase, on_delete=models.CASCADE, db_column='case_id')
    judge = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE, db_column='judge_id')
    session_date = models.DateTimeField()
    status = models.CharField(max_length=50)

class Document(models.Model):
    document_id = models.AutoField(primary_key=True)
    case = models.ForeignKey(CourtCase, on_delete=models.CASCADE, db_column='case_id')
    document_type = models.CharField(max_length=100)
    file_path = models.CharField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)

class Notification(models.Model):
    notification_id = models.AutoField(primary_key=True)
    employee_profile = models.ForeignKey(EmployeeProfile, null=True,on_delete=models.CASCADE, db_column='employee_profile_id')
    case = models.ForeignKey(CourtCase, on_delete=models.CASCADE, db_column='case_id')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class FileTransfer(models.Model):
    transfer_id = models.AutoField(primary_key=True)
    document = models.ForeignKey(Document, on_delete=models.CASCADE, db_column='document_id')
    # Two foreign keys to the same table require related_name
    sender = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE, related_name='sent_transfers', db_column='sender_id')
    receiver = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE, related_name='received_transfers', db_column='receiver_id')
    transfer_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50)