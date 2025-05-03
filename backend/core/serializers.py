from rest_framework import serializers
from .models import User, Tariff, Order

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}

class TariffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tariff
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    tariff = TariffSerializer(read_only=True)
    
    class Meta:
        model = Order
        fields = '__all__'