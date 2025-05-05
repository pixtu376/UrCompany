from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Устанавливает is_staff=True для администратора с заданным email'

    def handle(self, *args, **kwargs):
        email = 'admin@example.com'
        try:
            user = User.objects.get(email=email)
            if user.is_staff:
                self.stdout.write(self.style.SUCCESS(f'Пользователь {email} уже является администратором.'))
            else:
                user.is_staff = True
                user.save()
                self.stdout.write(self.style.SUCCESS(f'Пользователю {email} установлен флаг is_staff=True.'))
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'Пользователь с email {email} не найден.'))
