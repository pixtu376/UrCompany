from django.core.management.base import BaseCommand
from core.models import Tariff

class Command(BaseCommand):
    help = 'Добавляет тестовый тариф с кириллицей для проверки кодировки'

    def handle(self, *args, **kwargs):
        tariff_name = 'Тестовый тариф'
        short_desc = 'Краткое описание тарифа с кириллицей'
        detailed_desc = 'Подробное описание тарифа с использованием кириллических символов для проверки.'
        price = 1234.56
        client_type = 'individual'

        tariff, created = Tariff.objects.get_or_create(
            name=tariff_name,
            defaults={
                'short_description': short_desc,
                'detailed_description': detailed_desc,
                'price': price,
                'client_type': client_type,
            }
        )

        if created:
            self.stdout.write(self.style.SUCCESS(f'Тариф "{tariff_name}" успешно добавлен.'))
        else:
            self.stdout.write(self.style.WARNING(f'Тариф "{tariff_name}" уже существует.'))
