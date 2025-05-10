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

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status as drf_status

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'is_worker') and user.is_worker:
            # Возвращаем заказы, кроме завершенных
            return Order.objects.exclude(status='completed')
        return Order.objects.filter(user=user)

    def get_filterset(self, *args, **kwargs):
        user = self.request.user
        if hasattr(user, 'is_worker') and user.is_worker:
            return None
        return super().get_filterset(*args, **kwargs)
    
    def perform_create(self, serializer):
        try:
            serializer.save(user=self.request.user)
        except Exception as e:
            import traceback
            traceback.print_exc()
            from rest_framework.response import Response
            from rest_framework import status as drf_status
            return Response({'detail': str(e)}, status=drf_status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        try:
            user = request.user
            queryset = self.filter_queryset(self.get_queryset())
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            import traceback
            print("Exception in OrderViewSet.list:", e)
            traceback.print_exc()
            return Response({'detail': 'Internal server error'}, status=drf_status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def take_order(self, request, pk=None):
        order = self.get_object()
        user = request.user
        if not hasattr(user, 'is_worker') or not user.is_worker:
            return Response({'detail': 'Только работник может взять заказ'}, status=drf_status.HTTP_403_FORBIDDEN)
        if order.worker is not None:
            return Response({'detail': 'Заказ уже взят'}, status=drf_status.HTTP_400_BAD_REQUEST)
        worker = Worker.objects.filter(login=user.email).first()
        if not worker:
            return Response({'detail': 'Работник не найден'}, status=drf_status.HTTP_404_NOT_FOUND)
        order.worker = worker
        order.status = 'in_progress'
        order.save()
        # Создаем уведомление для пользователя
        from .models import Notification
        Notification.objects.create(
            user=order.user,
            order=order,
            message=f"Ваш заказ #{order.id} взят в работу."
        )
        serializer = self.get_serializer(order)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def finish_order(self, request, pk=None):
        order = self.get_object()
        user = request.user
        if not hasattr(user, 'is_worker') or not user.is_worker:
            return Response({'detail': 'Только работник может завершить заказ'}, status=drf_status.HTTP_403_FORBIDDEN)
        worker = Worker.objects.filter(login=user.email).first()
        if order.worker != worker:
            return Response({'detail': 'Вы не можете завершить этот заказ'}, status=drf_status.HTTP_403_FORBIDDEN)
        order.status = 'completed'
        order.save()
        # Создаем уведомление для пользователя
        from .models import Notification
        Notification.objects.create(
            user=order.user,
            order=order,
            message=f"Ваш заказ #{order.id} завершен."
        )
        serializer = self.get_serializer(order)
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        order = self.get_object()
        user = request.user
        if hasattr(user, 'is_worker') and user.is_worker:
            worker = Worker.objects.filter(login=user.email).first()
            if order.worker != worker:
                return Response({'detail': 'Вы не можете изменять статус этого заказа'}, status=drf_status.HTTP_403_FORBIDDEN)
        else:
            # Пользователь не может менять статус
            if 'status' in request.data:
                return Response({'detail': 'Вы не можете изменять статус'}, status=drf_status.HTTP_403_FORBIDDEN)
        response = super().partial_update(request, *args, **kwargs)
        # Если статус изменился, создаем уведомление
        if 'status' in request.data:
            from .models import Notification
            Notification.objects.create(
                user=order.user,
                order=order,
                message=f"Статус вашего заказа #{order.id} изменен на {order.get_status_display()}."
            )
        return response

class WorkerViewSet(viewsets.ModelViewSet):
    queryset = Worker.objects.all()
    serializer_class = WorkerSerializer
    permission_classes = [permissions.AllowAny]

from rest_framework import viewsets

from .models import Notification
from .serializers import UserSerializer, TariffSerializer, OrderSerializer, WorkerSerializer

from .serializers import NotificationSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Notification.objects.filter(user=user).order_by('-created_at')

    def partial_update(self, request, *args, **kwargs):
        notification = self.get_object()
        if notification.user != request.user:
            from rest_framework.response import Response
            from rest_framework import status
            return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        return super().partial_update(request, *args, **kwargs)
