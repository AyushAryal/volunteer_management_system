from rest_framework import viewsets

from . import models, serializers


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


class MunicipalityViewSet(
    viewsets.GenericViewSet,
    viewsets.mixins.RetrieveModelMixin,
    viewsets.mixins.ListModelMixin,
):
    queryset = models.Municipality.objects.all()
    serializer_class = serializers.MunicipalitySerializer


class WardViewSet(
    viewsets.GenericViewSet,
    viewsets.mixins.RetrieveModelMixin,
    viewsets.mixins.ListModelMixin,
):
    queryset = models.Ward.objects.all()
    serializer_class = serializers.WardSerializer
