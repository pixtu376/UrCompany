from rest_framework import viewsets, permissions
from .models import User, Tariff, Order, Worker
from .serializers import UserSerializer, TariffSerializer, OrderSerializer, WorkerSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from rest_framework import permissions

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

from rest_framework import permissions

class IsAdminUserOrReadOnly(permissions.BasePermission):
    """
    Разрешение для доступа только администраторам для записи, остальные только чтение.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

class TariffViewSet(viewsets.ModelViewSet):
    serializer_class = TariffSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        print(f"TariffViewSet.get_queryset called by user: {user} (is_staff={user.is_staff if user else 'No user'})")
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
