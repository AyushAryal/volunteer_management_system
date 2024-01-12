from rest_framework.serializers import HyperlinkedModelSerializer

from . import models


class ProvinceSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = models.Province
        fields = "__all__"
        extra_kwargs = {"url": {"view_name": "api:province-detail"}}


class DistrictSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = models.District
        fields = "__all__"
        extra_kwargs = {
            "url": {"view_name": "api:district-detail"},
            "province": {"view_name": "api:province-detail"},
        }


class MunicipalitySerializer(HyperlinkedModelSerializer):
    class Meta:
        model = models.Municipality
        fields = "__all__"
        extra_kwargs = {
            "url": {"view_name": "api:municipality-detail"},
            "district": {"view_name": "api:district-detail"},
        }


class WardSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = models.Ward
        fields = "__all__"
        extra_kwargs = {
            "url": {"view_name": "api:ward-detail"},
            "municipality": {"view_name": "api:municipality-detail"},
        }
