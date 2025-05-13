from rest_framework import serializers
from .models import User, Tariff, Order, Worker, Notification
from .models import Chat, Message
from django.contrib.auth.hashers import make_password

class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=6)

    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name', 'birthDate', 'gender', 'document_type', 'document_number', 'document_issue_date', 'document_issuer', 'snils', 'address_city', 'address_street', 'address_house', 'address_building', 'address_apartment']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

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
    worker = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'tariff', 'tariff_id', 'user_full_name', 'custom_name', 'status', 'deadline', 'created_at', 'worker']

    def get_user_full_name(self, obj):
        user = obj.user
        full_name = f"{user.last_name or ''} {user.first_name or ''} {getattr(user, 'middle_name', '')}".strip()
        return full_name if full_name else 'Не указано'

class WorkerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Worker
        fields = '__all__'

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = ['id', 'order', 'chat_type', 'user', 'worker']

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'chat', 'sender_user', 'sender_worker', 'text', 'created_at', 'is_read']
