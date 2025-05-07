from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email обязателен')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    birthDate = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=10, blank=True)
    document_type = models.CharField(max_length=100, blank=True)
    document_number = models.CharField(max_length=100, blank=True)
    document_issue_date = models.DateField(blank=True, null=True)
    document_issuer = models.CharField(max_length=255, blank=True)
    snils = models.CharField(max_length=20, blank=True)
    address_city = models.CharField(max_length=100, blank=True)
    address_street = models.CharField(max_length=100, blank=True)
    address_house = models.CharField(max_length=20, blank=True)
    address_building = models.CharField(max_length=20, blank=True)
    address_apartment = models.CharField(max_length=20, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    objects = UserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

    @property
    def is_worker(self):
        from .models import Worker
        return Worker.objects.filter(login=self.email).exists()

class Tariff(models.Model):
    CLIENT_TYPE_CHOICES = [
        ('individual', 'Физическое лицо'),
        ('legal', 'Юридическое лицо'),
    ]
    
    name = models.CharField(max_length=100)
    short_description = models.TextField()
    detailed_description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    client_type = models.CharField(max_length=20, choices=CLIENT_TYPE_CHOICES)

    service_info = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=100, blank=True, null=True)
    task_type = models.CharField(max_length=100, blank=True, null=True)
    payment_form = models.CharField(max_length=100, blank=True, null=True)
    
    def __str__(self):
        return self.name

class Worker(models.Model):
    full_name = models.CharField(max_length=100)
    login = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=128)
    access_level = models.IntegerField(default=1)
    passport_number = models.CharField(max_length=50)

    def __str__(self):
        return self.full_name

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'В обработке'),
        ('completed', 'Завершен'),
        ('cancelled', 'Отменен'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tariff = models.ForeignKey(Tariff, on_delete=models.CASCADE)
    custom_name = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    deadline = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.email} - {self.tariff.name}"
