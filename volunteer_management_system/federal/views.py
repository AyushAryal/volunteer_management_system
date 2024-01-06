from rest_framework import viewsets
from . import models
from . import serializers


class ProfileViewSet(
    viewsets.GenericViewSet,
    viewsets.mixins.RetrieveModelMixin,
    viewsets.mixins.ListModelMixin,
):
    queryset = models.Profile.objects.all()
    serializer_class = serializers.ProfileSerializer


class IncidentViewSet(
    viewsets.GenericViewSet,
    viewsets.mixins.RetrieveModelMixin,
    viewsets.mixins.ListModelMixin,
):
    queryset = models.Incident.objects.all()
    serializer_class = serializers.IncidentSerializer


class ProgrammeViewSet(
    viewsets.GenericViewSet,
    viewsets.mixins.RetrieveModelMixin,
    viewsets.mixins.ListModelMixin,
):
    queryset = models.Programme.objects.all()
    serializer_class = serializers.ProgrammeSerializer


class JobViewSet(
    viewsets.GenericViewSet,
    viewsets.mixins.RetrieveModelMixin,
    viewsets.mixins.ListModelMixin,
):
    queryset = models.Job.objects.all()
    serializer_class = serializers.JobSerializer


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
