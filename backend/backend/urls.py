from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from core import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'orders', views.OrderViewSet)
router.register(r'workers', views.WorkerViewSet)
router.register(r'tariffs', views.TariffViewSet, basename='tariff')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
