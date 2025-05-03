from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from core.models import Tariff, Order

User = get_user_model()

class Command(BaseCommand):
    help = 'Добавляет тестовые тарифы, тестового пользователя и заказы (корзину покупок)'

    def handle(self, *args, **kwargs):
        # Добавляем тестовые тарифы
        tariffs_data = [
            {
                'name': 'Тариф Базовый',
                'short_description': 'Базовый тариф для физических лиц',
                'detailed_description': 'Подробное описание базового тарифа.',
                'price': 500.00,
                'client_type': 'individual',
            },
            {
                'name': 'Тариф Премиум',
                'short_description': 'Премиум тариф для юридических лиц',
                'detailed_description': 'Подробное описание премиум тарифа.',
                'price': 1500.00,
                'client_type': 'corporate',
            },
            {
                'name': 'Тариф Корпоративный',
                'short_description': 'Корпоративный тариф с расширенными возможностями',
                'detailed_description': 'Подробное описание корпоративного тарифа.',
                'price': 3000.00,
                'client_type': 'corporate',
            },
        ]

        tariffs = []
        for tdata in tariffs_data:
            tariff, created = Tariff.objects.get_or_create(
                name=tdata['name'],
                defaults={
                    'short_description': tdata['short_description'],
                    'detailed_description': tdata['detailed_description'],
                    'price': tdata['price'],
                    'client_type': tdata['client_type'],
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Тариф "{tariff.name}" добавлен.'))
            else:
                self.stdout.write(self.style.WARNING(f'Тариф "{tariff.name}" уже существует.'))
            tariffs.append(tariff)

        # Добавляем тестового пользователя
        email = 'testuser@example.com'
        password = 'testpassword123'

        user, created = User.objects.get_or_create(
            email=email,
            defaults={'first_name': 'Test', 'last_name': 'User'}
        )
        if created:
            user.set_password(password)
            user.save()
            self.stdout.write(self.style.SUCCESS(f'Пользователь с email "{email}" создан.'))
        else:
            self.stdout.write(self.style.WARNING(f'Пользователь с email "{email}" уже существует.'))

        # Добавляем заказы (корзину покупок) для пользователя
        existing_orders = Order.objects.filter(user=user)
        if existing_orders.exists():
            self.stdout.write(self.style.WARNING(f'У пользователя "{email}" уже есть заказы.'))
        else:
            for tariff in tariffs:
                order = Order.objects.create(
                    user=user,
                    tariff=tariff,
                    status='active'
                )
                self.stdout.write(self.style.SUCCESS(f'Заказ для тарифа "{tariff.name}" добавлен пользователю "{email}".'))
