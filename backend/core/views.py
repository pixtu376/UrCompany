from rest_framework import viewsets, permissions
from .models import User, Tariff, Order, Worker
from .serializers import UserSerializer, TariffSerializer, OrderSerializer, WorkerSerializer
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import permissions

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class TariffViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TariffSerializer
    
    def get_queryset(self):
        queryset = Tariff.objects.all()
        client_type = self.request.query_params.get('client_type')
        if client_type:
            queryset = queryset.filter(client_type=client_type)
        return queryset

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user']
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class WorkerViewSet(viewsets.ModelViewSet):
    queryset = Worker.objects.all()
    serializer_class = WorkerSerializer
    permission_classes = [permissions.AllowAny]
