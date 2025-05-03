from django.contrib import admin
from .models import User, Tariff, Order, Worker

admin.site.register(User)
admin.site.register(Tariff)
admin.site.register(Order)
admin.site.register(Worker)
