from rest_framework.serializers import ModelSerializer
from . import models


class ProfileSerializer(ModelSerializer):
    class Meta:
        model = models.Profile
        fields = "__all__"


class IncidentSerializer(ModelSerializer):
    class Meta:
        model = models.Incident
        fields = "__all__"


class ProgrammeSerializer(ModelSerializer):
    class Meta:
        model = models.Programme
        fields = "__all__"


class JobSerializer(ModelSerializer):
    class Meta:
        model = models.Job
        fields = "__all__"


class ProvinceSerializer(ModelSerializer):
    class Meta:
        model = models.Province
        fields = "__all__"


class DistrictSerializer(ModelSerializer):
    class Meta:
        model = models.District
        fields = "__all__"
