from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from . import models, serializers


class BriefInfoMixin:
    @action(detail=False, methods=["get"])
    def brief(self, request):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class ProvinceViewSet(
    viewsets.GenericViewSet,
    viewsets.mixins.RetrieveModelMixin,
    viewsets.mixins.ListModelMixin,
    BriefInfoMixin,
):
    queryset = models.Province.objects.all()
    serializer_class = serializers.ProvinceSerializer

    def get_serializer_class(self):
        return {
            "brief": serializers.ProvinceBriefSerializer,
        }.get(self.action, super().get_serializer_class())


class DistrictViewSet(
    viewsets.GenericViewSet,
    viewsets.mixins.RetrieveModelMixin,
    viewsets.mixins.ListModelMixin,
    BriefInfoMixin,
):
    class DistrictPaginator(PageNumberPagination):
        page_size = 50

    queryset = models.District.objects.all()
    serializer_class = serializers.DistrictSerializer
    pagination_class = DistrictPaginator
    filterset_fields = ("province",)

    def get_serializer_class(self):
        return {
            "brief": serializers.DistrictBriefSerializer,
        }.get(self.action, super().get_serializer_class())


class MunicipalityViewSet(
    viewsets.GenericViewSet,
    viewsets.mixins.RetrieveModelMixin,
    viewsets.mixins.ListModelMixin,
    BriefInfoMixin,
):
    class MunicipalityPaginator(PageNumberPagination):
        page_size = 500

    queryset = models.Municipality.objects.all()
    serializer_class = serializers.MunicipalitySerializer
    pagination_class = MunicipalityPaginator
    filterset_fields = ("district", "district__province")

    def get_serializer_class(self):
        return {
            "brief": serializers.MunicipalityBriefSerializer,
        }.get(self.action, super().get_serializer_class())


class WardViewSet(
    viewsets.GenericViewSet,
    viewsets.mixins.RetrieveModelMixin,
    viewsets.mixins.ListModelMixin,
    BriefInfoMixin,
):
    class WardPaginator(PageNumberPagination):
        page_size = 1000

    queryset = models.Ward.objects.all()
    serializer_class = serializers.WardSerializer
    pagination_class = WardPaginator
    filterset_fields = (
        "municipality",
        "municipality__district",
        "municipality__district__province",
    )

    def get_serializer_class(self):
        return {
            "brief": serializers.WardBriefSerializer,
        }.get(self.action, super().get_serializer_class())
