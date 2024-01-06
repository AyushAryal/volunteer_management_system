from rest_framework import viewsets
from . import models
from . import serializers


class ProvinceViewSet(
    viewsets.GenericViewSet,
    viewsets.mixins.RetrieveModelMixin,
    viewsets.mixins.ListModelMixin,
):
    queryset = models.Province.objects.all()
    serializer_class = serializers.ProvinceSerializer


class DistrictViewSet(
    viewsets.GenericViewSet,
    viewsets.mixins.RetrieveModelMixin,
    viewsets.mixins.ListModelMixin,
):
    queryset = models.District.objects.all()
    serializer_class = serializers.DistrictSerializer
