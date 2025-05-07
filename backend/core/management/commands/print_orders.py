from django.core.management.base import BaseCommand
from core.models import Order

class Command(BaseCommand):
    help = 'Print all orders in the database'

    def handle(self, *args, **kwargs):
        orders = Order.objects.all()
        if not orders:
            self.stdout.write('No orders found in the database.')
            return
        for order in orders:
            self.stdout.write(f'Order ID: {order.id}, User: {order.user.email}, Tariff: {order.tariff.name}, Status: {order.status}, Deadline: {order.deadline}, Custom Name: {order.custom_name}')
