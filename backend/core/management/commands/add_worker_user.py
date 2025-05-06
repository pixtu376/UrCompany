
from django.core.management.base import BaseCommand
from core.models import Worker, User
from django.contrib.auth.hashers import make_password

class Command(BaseCommand):
    help = 'Add a worker user with login and password'

    def handle(self, *args, **kwargs):
        email = 'worker@example.com'
        password = 'workerpassword'
        full_name = 'Worker User'
        access_level = 1
        passport_number = '1234567890'

        if User.objects.filter(email=email).exists():
            self.stdout.write(self.style.WARNING(f'User with email {email} already exists.'))
        else:
            user = User.objects.create_user(email=email, password=password)
            user.save()
            self.stdout.write(self.style.SUCCESS(f'User {email} created successfully.'))

        if Worker.objects.filter(login=email).exists():
            self.stdout.write(self.style.WARNING(f'Worker with login {email} already exists.'))
        else:
            worker = Worker(
                full_name=full_name,
                login=email,
                password=make_password(password),
                access_level=access_level,
                passport_number=passport_number
            )
            worker.save()
            self.stdout.write(self.style.SUCCESS(f'Worker user {email} created successfully.'))
