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
        from .serializers import UserSerializer
        serializer = UserSerializer(request.user)
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
    # filter_backends = [DjangoFilterBackend]
    # filterset_fields = ['user']
    
    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'is_worker') and user.is_worker:
            # Если пользователь работник, возвращаем все заказы без фильтрации
            return Order.objects.all()
        # Иначе возвращаем заказы только текущего пользователя
        return Order.objects.filter(user=user)

    def get_filterset(self, *args, **kwargs):
        user = self.request.user
        if hasattr(user, 'is_worker') and user.is_worker:
            # Отключаем фильтрацию для работников
            return None
        return super().get_filterset(*args, **kwargs)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def list(self, request, *args, **kwargs):
        try:
            user = request.user
            queryset = self.filter_queryset(self.get_queryset())
            print(f"OrderViewSet.list called by user: {user} (is_worker={getattr(user, 'is_worker', None)})")
            print(f"Number of orders returned: {queryset.count()}")
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            import traceback
            print("Exception in OrderViewSet.list:", e)
            traceback.print_exc()
            return Response({'detail': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class WorkerViewSet(viewsets.ModelViewSet):
    queryset = Worker.objects.all()
    serializer_class = WorkerSerializer
    permission_classes = [permissions.AllowAny]
