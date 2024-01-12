from rest_framework.serializers import HyperlinkedModelSerializer

from . import models


class ProfileSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = models.Profile
        fields = "__all__"
        extra_kwargs = {
            "url": {"view_name": "api:profile-detail"},
            "municipality": {"view_name": "api:municipality-detail"},
        }


class IncidentSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = models.Incident
        fields = "__all__"
        extra_kwargs = {
            "url": {"view_name": "api:incident-detail"},
            "municipality": {"view_name": "api:municipality-detail"},
        }


class ProgrammeSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = models.Programme
        fields = "__all__"
        extra_kwargs = {"url": {"view_name": "api:programme-detail"}}


class JobSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = models.Job
        fields = "__all__"
        extra_kwargs = {"url": {"view_name": "api:job-detail"}}
