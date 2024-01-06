from rest_framework.serializers import HyperlinkedModelSerializer
from . import models


class ProvinceSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = models.Province
        fields = "__all__"


class DistrictSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = models.District
        fields = "__all__"
