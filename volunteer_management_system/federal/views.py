from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from vectortiles.views import MVTView
from vectortiles import VectorLayer

from . import models, serializers


class ProvinceVectorLayer(VectorLayer):
    model = models.Province
    id = "province"
    geom_field = "shape"


class DistrictVectorLayer(VectorLayer):
    model = models.District
    id = "district"
    geom_field = "shape"


class MunicipalityVectorLayer(VectorLayer):
    model = models.Municipality
    id = "municipality"
    geom_field = "shape"


class FederalTileView(MVTView):
    layers = [
        ProvinceVectorLayer(),
        DistrictVectorLayer(),
        MunicipalityVectorLayer(),
    ]


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

    @property
    def paginator(self):
        return {
            "brief": None,
        }.get(self.action, super().paginator)

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
    queryset = models.District.objects.all()
    serializer_class = serializers.DistrictSerializer
    filterset_fields = ("province",)

    @property
    def paginator(self):
        return {
            "brief": None,
        }.get(self.action, super().paginator)

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
    queryset = models.Municipality.objects.all()
    serializer_class = serializers.MunicipalitySerializer
    filterset_fields = ("district", "district__province")

    @property
    def paginator(self):
        return {
            "brief": None,
        }.get(self.action, super().paginator)

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
    queryset = models.Ward.objects.all()
    serializer_class = serializers.WardSerializer
    filterset_fields = (
        "municipality",
        "municipality__district",
        "municipality__district__province",
    )

    @property
    def paginator(self):
        return {
            "brief": None,
        }.get(self.action, super().paginator)

    def get_serializer_class(self):
        return {
            "brief": serializers.WardBriefSerializer,
        }.get(self.action, super().get_serializer_class())
