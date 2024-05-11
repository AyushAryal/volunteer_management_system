from rest_framework.serializers import HyperlinkedModelSerializer, SerializerMethodField
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
    bbox = SerializerMethodField()

    def get_bbox(self, body):
        return body.shape.extent

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
    bbox = SerializerMethodField()

    def get_bbox(self, body):
        return body.shape.extent

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
    bbox = SerializerMethodField()

    def get_bbox(self, body):
        return body.shape.extent

    class Meta:
        model = models.Municipality
        exclude = ("admin", "shape")
        extra_kwargs = {
            "url": {"view_name": "api:municipality-detail"},
            "district": {"view_name": "api:district-detail"},
        }


class WardSerializer(HyperlinkedModelSerializer):
    shape = GeometryField(auto_bbox=True)

    class Meta:
        model = models.Ward
        fields = "__all__"
        extra_kwargs = {
            "url": {"view_name": "api:ward-detail"},
            "municipality": {"view_name": "api:municipality-detail"},
        }


class WardBriefSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = models.Ward
        exclude = ("shape",)
        extra_kwargs = {
            "url": {"view_name": "api:ward-detail"},
            "municipality": {"view_name": "api:municipality-detail"},
        }
