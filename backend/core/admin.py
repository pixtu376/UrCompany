from django.contrib import admin
from .models import User, Tariff, Order, Worker

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name')

@admin.register(Tariff)
class TariffAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'client_type')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('user', 'tariff', 'status', 'created_at')

@admin.register(Worker)
class WorkerAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'login', 'access_level')