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
        ('pending', 'На рассмотрении'),
        ('in_progress', 'Выполняется'),
        ('under_review', 'На проверке'),
        ('cancelled', 'Отменен'),
        ('completed', 'Завершен'),
        ('failed', 'Неудача'),
        ('refunded', 'Возврат'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tariff = models.ForeignKey(Tariff, on_delete=models.CASCADE)
    custom_name = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    worker = models.ForeignKey('Worker', on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    deadline = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.email} - {self.tariff.name}"

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.email} - {self.message[:20]}"

class Chat(models.Model):
    CHAT_TYPE_CHOICES = [
        ('user', 'Чат пользователя'),
        ('worker', 'Чат работника'),
        ('common', 'Общий чат'),
    ]
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='chats')
    chat_type = models.CharField(max_length=10, choices=CHAT_TYPE_CHOICES)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chats')
    worker = models.ForeignKey(Worker, on_delete=models.CASCADE, related_name='chats')

    def __str__(self):
        return f"Chat {self.chat_type} for order {self.order.id}"

class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='messages')
    sender_user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    sender_worker = models.ForeignKey(Worker, on_delete=models.CASCADE, null=True, blank=True)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        sender = self.sender_user.email if self.sender_user else self.sender_worker.full_name if self.sender_worker else "Unknown"
        return f"Message from {sender} at {self.created_at}"
