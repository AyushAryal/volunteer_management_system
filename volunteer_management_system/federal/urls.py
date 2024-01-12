from rest_framework import routers

from . import views

app_name = "federal"

router = routers.DefaultRouter()

router.register("district", views.DistrictViewSet, basename="district")
router.register("province", views.ProvinceViewSet, basename="province")
router.register("municipality", views.MunicipalityViewSet, basename="municipality")
router.register("ward", views.WardViewSet, basename="ward")
