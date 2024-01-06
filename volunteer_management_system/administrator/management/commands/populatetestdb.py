import json

from django.core.management.base import BaseCommand
from django.contrib.gis.geos import Polygon

from federal.models import Province, District


class Command(BaseCommand):
    help = "This command populates the database with default db"

    def load_provinces(self):
        provinces = []
        with open("shared/provinces.geojson.json", encoding="utf8") as j:
            geojson_obj = json.load(j)
            features = geojson_obj["features"]
            for feature in features:
                polygon = Polygon(feature["geometry"]["coordinates"][0][0])
                name = feature["properties"]["PROV_NAME"]
                province = Province(name=name, shape=polygon)
                provinces.append(province)
        return provinces

    def load_districts(self):
        districts = []
        with open("shared/districts.geojson.json", encoding="utf8") as j:
            geojson_obj = json.load(j)
            features = geojson_obj["features"]
            for feature in features:
                polygon = Polygon(feature["geometry"]["coordinates"][0][0])
                name = feature["properties"]["title"]
                province = feature["properties"]["province"]
                district = District(
                    name=name,
                    shape=polygon,
                    province=Province.objects.get(pk=province),
                )
                districts.append(district)
        return districts

    def handle(self, *_, **__):
        provinces = self.load_provinces()

        if Province.objects.all().count() == 0:
            for province in provinces:
                province.save()

        districts = self.load_districts()

        if District.objects.all().count() == 0:
            for district in districts:
                district.save()
