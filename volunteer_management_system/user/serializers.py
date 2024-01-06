from rest_framework.serializers import ModelSerializer
from .models import Profile, Incident, Programme, Job, Province, District


class ProfileSerializer(ModelSerializer):
    class Meta:
        model = Profile
        fields = "__all__"


class IncidentSerializer(ModelSerializer):
    class Meta:
        model = Incident
        fields = "__all__"


class ProgrammeSerializer(ModelSerializer):
    class Meta:
        model = Programme
        fields = "__all__"


class JobSerializer(ModelSerializer):
    class Meta:
        model = Job
        fields = "__all__"


class ProvinceSerializer(ModelSerializer):
    class Meta:
        model = Province
        fields = "__all__"
