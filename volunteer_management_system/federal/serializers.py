from rest_framework.serializers import HyperlinkedModelSerializer
from . import models


class ProfileSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = models.Profile
        fields = "__all__"


class IncidentSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = models.Incident
        fields = "__all__"


class ProgrammeSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = models.Programme
        fields = "__all__"


class JobSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = models.Job
        fields = "__all__"


class ProvinceSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = models.Province
        fields = "__all__"


class DistrictSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = models.District
        fields = "__all__"
