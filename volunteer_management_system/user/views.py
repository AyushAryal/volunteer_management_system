from rest_framework.viewsets import ModelViewSet
from . import models
from . import serializers


class ProfileViewSet(ModelViewSet):
    queryset = models.Profile.objects.all()
    serializer_class = serializers.ProfileSerializer


class IncidentViewSet(ModelViewSet):
    queryset = models.Incident.objects.all()
    serializer_class = serializers.IncidentSerializer


class ProgrammeViewSet(ModelViewSet):
    queryset = models.Programme.objects.all()
    serializer_class = serializers.ProgrammeSerializer


class JobViewSet(ModelViewSet):
    queryset = models.Job.objects.all()
    serializer_class = serializers.JobSerializer


class ProvinceViewSet(ModelViewSet):
    queryset = models.Province.objects.all()
    serializer_class = serializers.ProvinceSerializer


class DistrictViewSet(ModelViewSet):
    queryset = models.District.objects.all()
    serializer_class = serializers.DistrictSerializer
