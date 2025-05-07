from rest_framework import serializers
from .models import User, Tariff, Order, Worker

from rest_framework import serializers
from .models import User, Tariff, Order, Worker

class UserSerializer(serializers.ModelSerializer):
    is_worker = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'birthDate', 'gender', 'document_type', 'document_number', 'document_issue_date', 'document_issuer', 'snils', 'address_city', 'address_street', 'address_house', 'address_building', 'address_apartment', 'is_staff', 'is_worker']
        extra_kwargs = {'password': {'write_only': True}}

    def get_is_worker(self, obj):
        return Worker.objects.filter(login=obj.email).exists()

class TariffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tariff
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    tariff = TariffSerializer(read_only=True)
    tariff_id = serializers.PrimaryKeyRelatedField(queryset=Tariff.objects.all(), source='tariff', write_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    user_full_name = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['id', 'user', 'tariff', 'tariff_id', 'user_full_name', 'custom_name', 'status', 'deadline', 'created_at']

    def get_user_full_name(self, obj):
        user = obj.user
        full_name = f"{user.last_name or ''} {user.first_name or ''} {getattr(user, 'middle_name', '')}".strip()
        return full_name if full_name else 'Не указано'

class WorkerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Worker
        fields = '__all__'
