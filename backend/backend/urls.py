from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import UserViewSet, TariffViewSet, OrderViewSet, WorkerViewSet
from core.views_auth import urlpatterns as auth_urlpatterns

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'tariffs', TariffViewSet, basename='tariff')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'workers', WorkerViewSet, basename='worker')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include(auth_urlpatterns)),
]
