from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination

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
    class DistrictPaginator(PageNumberPagination):
        page_size = 50

    queryset = models.District.objects.all()
    serializer_class = serializers.DistrictSerializer
    pagination_class = DistrictPaginator


class MunicipalityViewSet(
    viewsets.GenericViewSet,
    viewsets.mixins.RetrieveModelMixin,
    viewsets.mixins.ListModelMixin,
):
    class MunicipalityPaginator(PageNumberPagination):
        page_size = 500

    queryset = models.Municipality.objects.all()
    serializer_class = serializers.MunicipalitySerializer
    pagination_class = MunicipalityPaginator


class WardViewSet(
    viewsets.GenericViewSet,
    viewsets.mixins.RetrieveModelMixin,
    viewsets.mixins.ListModelMixin,
):
    queryset = models.Ward.objects.all()
    serializer_class = serializers.WardSerializer
