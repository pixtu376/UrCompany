from rest_framework import serializers
from .models import User, Tariff, Order, Worker

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'birthDate', 'gender', 'document_type', 'document_number', 'document_issue_date', 'document_issuer', 'snils', 'address_city', 'address_street', 'address_house', 'address_building', 'address_apartment']
        extra_kwargs = {'password': {'write_only': True}}

class TariffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tariff
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    tariff = TariffSerializer(read_only=True)
    tariff_id = serializers.PrimaryKeyRelatedField(queryset=Tariff.objects.all(), source='tariff', write_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Order
        fields = '__all__'

class WorkerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Worker
        fields = '__all__'
