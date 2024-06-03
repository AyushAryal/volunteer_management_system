from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
import django_filters
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


class WardVectorLayer(VectorLayer):
    model = models.Ward
    id = "ward"
    geom_field = "shape"


class FederalTileView(MVTView):
    layers = [
        ProvinceVectorLayer(),
        DistrictVectorLayer(),
        MunicipalityVectorLayer(),
        WardVectorLayer(),
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


class DistrictFilter(django_filters.FilterSet):
    province = django_filters.ModelChoiceFilter(
        label="Province",
        field_name="province",
        queryset=models.Province.objects.all(),
    )

    class Meta:
        model = models.District
        fields = []


class DistrictViewSet(
    viewsets.GenericViewSet,
    viewsets.mixins.RetrieveModelMixin,
    viewsets.mixins.ListModelMixin,
    BriefInfoMixin,
):
    queryset = models.District.objects.all()
    serializer_class = serializers.DistrictSerializer
    filterset_class = DistrictFilter

    @property
    def paginator(self):
        return {
            "brief": None,
        }.get(self.action, super().paginator)

    def get_serializer_class(self):
        return {
            "brief": serializers.DistrictBriefSerializer,
        }.get(self.action, super().get_serializer_class())


class MunicipalityFilter(django_filters.FilterSet):
    province = django_filters.ModelChoiceFilter(
        label="Province",
        field_name="district__province",
        queryset=models.Province.objects.all(),
    )

    district = django_filters.ModelChoiceFilter(
        label="District",
        field_name="district",
        queryset=models.District.objects.all(),
    )

    class Meta:
        model = models.Municipality
        fields = []


class MunicipalityViewSet(
    viewsets.GenericViewSet,
    viewsets.mixins.RetrieveModelMixin,
    viewsets.mixins.ListModelMixin,
    BriefInfoMixin,
):
    queryset = models.Municipality.objects.all()
    serializer_class = serializers.MunicipalitySerializer
    filterset_class = MunicipalityFilter

    @property
    def paginator(self):
        return {
            "brief": None,
        }.get(self.action, super().paginator)

    def get_serializer_class(self):
        return {
            "brief": serializers.MunicipalityBriefSerializer,
        }.get(self.action, super().get_serializer_class())


class WardFilter(django_filters.FilterSet):
    province = django_filters.ModelChoiceFilter(
        label="Province",
        field_name="municipality__district__province",
        queryset=models.Province.objects.all(),
    )

    district = django_filters.ModelChoiceFilter(
        label="District",
        field_name="municipality__district",
        queryset=models.District.objects.all(),
    )

    municipality = django_filters.ModelChoiceFilter(
        label="Municipality",
        field_name="municipality",
        queryset=models.Municipality.objects.all(),
    )

    class Meta:
        model = models.Ward
        fields = []


class WardViewSet(
    viewsets.GenericViewSet,
    viewsets.mixins.RetrieveModelMixin,
    viewsets.mixins.ListModelMixin,
    BriefInfoMixin,
):
    queryset = models.Ward.objects.all().order_by("municipality", "name")
    serializer_class = serializers.WardSerializer
    filterset_class = WardFilter

    @property
    def paginator(self):
        return {
            "brief": None,
        }.get(self.action, super().paginator)

    def get_serializer_class(self):
        return {
            "brief": serializers.WardBriefSerializer,
        }.get(self.action, super().get_serializer_class())
