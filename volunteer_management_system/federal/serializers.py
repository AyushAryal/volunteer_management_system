from rest_framework.serializers import HyperlinkedModelSerializer
from rest_framework_gis.fields import GeometryField

from . import models


class ProvinceSerializer(HyperlinkedModelSerializer):
    shape = GeometryField(auto_bbox=True)

    class Meta:
        model = models.Province
        exclude = ("admin",)
        extra_kwargs = {
            "url": {"view_name": "api:province-detail"},
        }


class ProvinceBriefSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = models.Province
        exclude = ("admin", "shape")
        extra_kwargs = {
            "url": {"view_name": "api:province-detail"},
        }


class DistrictSerializer(HyperlinkedModelSerializer):
    shape = GeometryField(auto_bbox=True)

    class Meta:
        model = models.District
        exclude = ("admin",)
        extra_kwargs = {
            "url": {"view_name": "api:district-detail"},
            "province": {"view_name": "api:province-detail"},
        }


class DistrictBriefSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = models.District
        exclude = ("admin", "shape")
        extra_kwargs = {
            "url": {"view_name": "api:district-detail"},
            "province": {"view_name": "api:province-detail"},
        }


class MunicipalitySerializer(HyperlinkedModelSerializer):
    shape = GeometryField(auto_bbox=True)

    class Meta:
        model = models.Municipality
        exclude = ("admin",)
        extra_kwargs = {
            "url": {"view_name": "api:municipality-detail"},
            "district": {"view_name": "api:district-detail"},
        }


class MunicipalityBriefSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = models.Municipality
        exclude = ("admin", "shape")
        extra_kwargs = {
            "url": {"view_name": "api:municipality-detail"},
            "district": {"view_name": "api:district-detail"},
        }


class WardSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = models.Ward
        exclude = ("url", "admin")
        extra_kwargs = {
            "municipality": {"view_name": "api:municipality-detail"},
        }
