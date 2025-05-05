from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Добавляет администратора в модель User с email и паролем'

    def handle(self, *args, **kwargs):
        email = 'admin@example.com'
        password = 'adminpassword123'
        first_name = 'Админ'
        last_name = 'Пользователь'

        if User.objects.filter(email=email).exists():
            self.stdout.write(self.style.WARNING(f'Пользователь с email "{email}" уже существует.'))
        else:
            user = User.objects.create_user(
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
                is_staff=True,
                is_superuser=True,
            )
            user.save()
            self.stdout.write(self.style.SUCCESS(f'Администратор с email "{email}" успешно создан.'))
