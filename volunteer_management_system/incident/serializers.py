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
