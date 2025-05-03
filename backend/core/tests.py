from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import User, Tariff, Order, Worker
from django.utils import timezone
from datetime import timedelta

class CoreModelsTestCase(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(email='user1@example.com', password='password1', first_name='Иван', last_name='Иванов')
        self.user2 = User.objects.create_user(email='user2@example.com', password='password2', first_name='Петр', last_name='Петров')
        self.tariff1 = Tariff.objects.create(name='Тариф 1', short_description='Краткое описание 1', detailed_description='Подробное описание 1', price=1000)
        self.tariff2 = Tariff.objects.create(name='Тариф 2', short_description='Краткое описание 2', detailed_description='Подробное описание 2', price=2000)
        self.order1 = Order.objects.create(user=self.user1, tariff=self.tariff1, custom_name='Кастомный заказ 1', status='pending', deadline=timezone.now().date() + timedelta(days=10))
        self.order2 = Order.objects.create(user=self.user2, tariff=self.tariff2, custom_name='Кастомный заказ 2', status='in_progress', deadline=timezone.now().date() + timedelta(days=20))
        self.worker1 = Worker.objects.create(full_name='Работник Один', login='worker1', password='pass1', access_level=1, passport_number='1234567890')
        self.worker2 = Worker.objects.create(full_name='Работник Два', login='worker2', password='pass2', access_level=2, passport_number='0987654321')
        self.client.force_authenticate(user=self.user)

    def test_user_creation(self):
        self.assertEqual(User.objects.count(), 2)
        self.assertEqual(self.user1.email, 'user1@example.com')

    def test_tariff_creation(self):
        self.assertEqual(Tariff.objects.count(), 2)
        self.assertEqual(self.tariff1.name, 'Тариф 1')

    def test_order_creation(self):
        self.assertEqual(Order.objects.count(), 2)
        self.assertEqual(self.order1.custom_name, 'Кастомный заказ 1')

    def test_worker_creation(self):
        self.assertEqual(Worker.objects.count(), 2)
        self.assertEqual(self.worker1.login, 'worker1')

class CoreAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email='testuser@example.com', password='testpass')
        self.tariff = Tariff.objects.create(name='Тестовый тариф', short_description='Кратко', detailed_description='Подробно', price=1500)
        self.order = Order.objects.create(user=self.user, tariff=self.tariff, custom_name='Тестовый заказ', status='pending', deadline=timezone.now().date() + timedelta(days=5))
        self.worker = Worker.objects.create(full_name='Тест Работник', login='testworker', password='testpass', access_level=1, passport_number='111222333')
        self.client.login(email='testuser@example.com', password='testpass')


    def test_get_users(self):
        response = self.client.get(reverse('user-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) >= 1)

    def test_get_tariffs(self):
        response = self.client.get(reverse('tariff-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) >= 1)

    def test_get_orders(self):
        response = self.client.get(reverse('order-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) >= 1)

    def test_get_workers(self):
        response = self.client.get(reverse('worker-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) >= 1)
