import json
from django.core.management.base import BaseCommand
from django.conf import settings
from django.contrib.gis.geos import Polygon
from django.contrib.auth import get_user_model

from federal.models import Province, District


class Command(BaseCommand):
    help = "This command populates the database with default db"

    def load_provinces(self):
        filepath = settings.BASE_DIR / "shared" / "provinces.geojson.json"
        provinces = []
        with open(filepath, encoding="utf8") as j:
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
        filepath = settings.BASE_DIR / "shared" / "districts.geojson.json"
        with open(filepath, encoding="utf8") as j:
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

    def create_super_user(self, email, password):
        user = get_user_model().objects.create_user(
            password=password,
            email=email,
            email_verified=True,
        )
        user.is_superuser = True
        user.is_staff = True
        user.save()
        self.stdout.write(
            self.style.SUCCESS(f"Created superuser {email}, with password '{password}'")
        )
        return user

    def handle(self, *_, **__):
        self.create_super_user("admin@example.com", "shark@123")
        provinces = self.load_provinces()

        if Province.objects.all().count() == 0:
            for province in provinces:
                province.save()

        districts = self.load_districts()

        if District.objects.all().count() == 0:
            for district in districts:
                district.save()
