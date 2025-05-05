from django.core.management.base import BaseCommand
from core.models import Worker

class Command(BaseCommand):
    help = 'Добавляет администратора с заданным email и паролем'

    def handle(self, *args, **kwargs):
        email = 'admin@example.com'
        password = 'adminpassword123'
        full_name = 'Администратор'
        passport_number = '0000000000'
        access_level = 10  # высокий уровень доступа

        if Worker.objects.filter(login=email).exists():
            self.stdout.write(self.style.WARNING(f'Пользователь с email "{email}" уже существует.'))
        else:
            worker = Worker(
                full_name=full_name,
                login=email,
                password=password,
                passport_number=passport_number,
                access_level=access_level
            )
            worker.save()
            self.stdout.write(self.style.SUCCESS(f'Администратор с email "{email}" успешно создан.'))
