import json
import csv
import random
import os
import inspect
from datetime import datetime

import federal.models
import incident.models

import requests
from django.conf import settings
from django.db.utils import IntegrityError
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from django.contrib.gis.geos import Point
from django.contrib.gis.geos import Polygon
from django.contrib.gis.db.models import Extent
from django.core.management.base import BaseCommand

PASSWORD = os.getenv("ADMIN_PASSWORD", "shark@123")


class Command(BaseCommand):
    help = "This command populates the database with default db"

    def download_incidents(self):
        path = settings.BASE_DIR / "shared" / "incidents.json"
        if not os.path.exists(path):
            response = requests.get(
                "https://bipadportal.gov.np/api/v1/incident/?format=json&limit=1000000000"
            )

            if response.status_code == 200:
                with open(path, "wb") as file:
                    file.write(response.content)
                self.stdout.write(self.style.SUCCESS(f"Downloaded {path}"))
            else:
                raise RuntimeError("Could not get a response")

    def download_federal_geojson_files(self):
        BASE_URL = "https://bipadportal.gov.np/api/v1/"
        QUERY_PARAMS = "format=geojson&limit=1000000000"

        ENDPOINTS = ["province", "district", "municipality", "ward"]
        for endpoint in ENDPOINTS:
            path = settings.BASE_DIR / "shared" / f"{endpoint}.geojson.json"
            if not os.path.exists(path):
                self.stdout.write(self.style.SUCCESS(f"Downloading {path}"))
                response = requests.get(f"{BASE_URL}{endpoint}/?{QUERY_PARAMS}")

                if response.status_code != 200:
                    raise RuntimeError("Cannot connect to API from bipadportal.gov.np")

                with open(path, "wb") as file:
                    file.write(response.content)
                self.stdout.write(self.style.SUCCESS(f"Downloaded {path}"))
            else:
                self.stdout.write(
                    self.style.SUCCESS(
                        f"File {path} already exists, skipping download."
                    )
                )

    def create_federal_user(self, email):
        user = get_user_model().objects.create_user(
            email=email,
            password=PASSWORD,
            email_verified=True,
        )
        user.is_staff = True
        user.save()
        user.groups.add(Group.objects.get_by_natural_key("federal"))
        self.stdout.write(self.style.SUCCESS(f"Created federal user {email}"))
        return user

    def create_federal_group(self):
        federal_group, _ = Group.objects.get_or_create(name="federal")
        actions = ["add", "view", "change", "delete"]
        model_names = ["incident", "program", "job", "jobapplication"]
        for action in actions:
            for model in model_names:
                permission = f"{action}_{model}"
                federal_group.permissions.add(
                    Permission.objects.get(codename=permission)
                )
        return federal_group

    def load_provinces(self):
        filepath = settings.BASE_DIR / "shared" / "province.geojson.json"
        PROVINCES = {
            "Province No 1": "Koshi",
            "Province No 2": "Madhesh",
            "Bagmati": "Bagmati",
            "Gandaki": "Gandaki",
            "Province No 5": "Lumbini",
            "Karnali": "Karnali",
            "Sudurpashchim": "Sudurpashchim",
            "Koshi": "Koshi",
            "Madhesh": "Madhesh",
            "Lumbini": "Lumbini",
        }
        provinces = []
        with open(filepath, encoding="utf8") as j:
            geojson_obj = json.load(j)
            features = geojson_obj["features"]
            for feature in features:
                polygon = Polygon(feature["geometry"]["coordinates"][0][0])
                id = feature["id"]
                name = PROVINCES[feature["properties"]["title"]]
                email = "{}@example.com".format(name.lower().strip().replace(" ", "_"))
                admin = self.create_federal_user(email)
                province = federal.models.Province(
                    pk=id,
                    name=name,
                    shape=polygon,
                    admin=admin,
                )
                provinces.append(province)
        return provinces

    def load_districts(self):
        districts = []
        filepath = settings.BASE_DIR / "shared" / "district.geojson.json"
        with open(filepath, encoding="utf8") as j:
            geojson_obj = json.load(j)
            features = geojson_obj["features"]
            for feature in features:
                id = feature["id"]
                polygon = Polygon(feature["geometry"]["coordinates"][0][0])
                name = feature["properties"]["title"]
                province = feature["properties"]["province"]
                email = "{}@example.com".format(name.lower().strip().replace(" ", "_"))
                admin = self.create_federal_user(email)
                district = federal.models.District(
                    pk=id,
                    name=name,
                    shape=polygon,
                    province=federal.models.Province.objects.get(pk=province),
                    admin=admin,
                )
                districts.append(district)
        return districts

    def load_municipalities(self):
        municipalities = []
        filepath = settings.BASE_DIR / "shared" / "municipality.geojson.json"
        with open(filepath, encoding="utf8") as j:
            geojson_obj = json.load(j)
            features = geojson_obj["features"]
            for feature in features:
                polygon = Polygon(feature["geometry"]["coordinates"][0][0])
                id = feature["id"]
                name = feature["properties"]["title"]
                district = feature["properties"]["district"]
                district_name = federal.models.District.objects.get(pk=district).name
                email = "{}_{}@example.com".format(
                    district_name.lower().strip().replace(" ", "_"),
                    name.lower().strip().replace(" ", "_"),
                )
                admin = self.create_federal_user(email)
                municipality = federal.models.Municipality(
                    pk=id,
                    name=name,
                    shape=polygon,
                    district=federal.models.District.objects.get(pk=district),
                    admin=admin,
                )
                municipalities.append(municipality)
        return municipalities

    def load_wards(self):
        wards = []
        with open(
            settings.BASE_DIR / "shared" / "ward.geojson.json", encoding="utf8"
        ) as j:
            geojson_obj = json.load(j)
            features = geojson_obj["features"]
            for feature in features:
                polygon = Polygon(feature["geometry"]["coordinates"][0][0])
                id = feature["id"]
                name = feature["properties"]["title"]
                municipality = feature["properties"]["municipality"]
                ward = federal.models.Ward(
                    pk=id,
                    name=name,
                    shape=polygon,
                    municipality=federal.models.Municipality.objects.get(
                        pk=municipality
                    ),
                )
                wards.append(ward)
        return wards

    def uniformly_sample_point(self, qs):
        x1, y1, x2, y2 = qs.aggregate(Extent("shape"))["shape__extent"]
        max_tries = 100
        tries = 0
        while tries < max_tries:
            x = random.uniform(x1, x2)
            y = random.uniform(y1, y2)
            point = Point(x=x, y=y)
            if qs.filter(shape__contains=point):
                return point
            tries += 1
        raise RuntimeError("Too many attempts to generate random point")

    def load_old_vms_volunteer_from_row(self, i, row):
        academic_qualification_mapping = {
            "": incident.models.AcademicQualification.SecondaryLevel,
            "Primary Education": incident.models.AcademicQualification.SecondaryLevel,
            "Lower Secondary Education": incident.models.AcademicQualification.SecondaryLevel,
            "+2 Level": incident.models.AcademicQualification.SecondaryLevel,
            "SLC": incident.models.AcademicQualification.HighSchool,
            "Higher Secondary Education": incident.models.AcademicQualification.HighSchool,
            "Secondary Level": incident.models.AcademicQualification.SecondaryLevel,
            "Bachelore": incident.models.AcademicQualification.UnderGrad,
            "Bachelor": incident.models.AcademicQualification.UnderGrad,
            "Literate": incident.models.AcademicQualification.Literate,
            "Diploma": incident.models.AcademicQualification.UnderGrad,
            "Masters": incident.models.AcademicQualification.Grad,
            "Illiterate": incident.models.AcademicQualification.Illiterate,
            "Phd": incident.models.AcademicQualification.Doctorate,
        }
        gender_mapping = {
            "male": incident.models.Gender.Male,
            "female": incident.models.Gender.Female,
            "Male": incident.models.Gender.Male,
            "Female": incident.models.Gender.Female,
            "others": incident.models.Gender.Other,
            "": incident.models.Gender.Male if random.random() < 0.8 else incident.models.Gender.Female,
        }
        ward = federal.models.Ward.objects.get(pk=int(float(row["ward_id"])))
        volunteer_profile_data = {
            "first_name": row["first_name"].capitalize(),
            "last_name": row["last_name"].capitalize(),
            "gender": gender_mapping[row["gender"]],
            "date_of_birth": datetime.fromisoformat(row["date_of_birth"]),
            "blood_group": incident.models.BloodGroup.B_Positive if random.random() < 0.5 else random.choice(incident.models.BloodGroup.values),
            "active": True,
            "academic_qualification": academic_qualification_mapping[row["education"]],
            "nationality": incident.models.Nationality.National,
            "category": incident.models.VolunteerCategory.General,
            "temporary_ward": ward,
            "permanent_ward": ward,
            "point": self.uniformly_sample_point(
                federal.models.Ward.objects.filter(pk=ward.pk)
            ),
        }

        user = get_user_model().objects.create_user(
            password=PASSWORD, email=row["email"]
        )
        user.email_verified = True
        user.save()
        training_category = random.choice(incident.models.TrainingCategory.values)
        training = incident.models.Training(
            user=user,
            name=f"{training_category} Training",
            subject=f"{training_category} Training",
            category=training_category,
        )
        training.save()
        citizenship = incident.models.Citizenship(
            id=f"UNKNOWN {i}",
            user=user,
            registration_date=volunteer_profile_data["date_of_birth"],
            registration_district=ward.municipality.district,
        )
        citizenship.save()

        volunteer = incident.models.VolunteerProfile(
            user=user,
            **volunteer_profile_data,
        )
        volunteer.save()

    def load_old_vms_volunteers(self):
        profile_filepath = settings.BASE_DIR / "shared" / "old_vms_data.csv"

        with open(profile_filepath, "r") as profile_csv:
            table = csv.DictReader(profile_csv)
            successfully_loaded_volunteers = 0
            for i, row in enumerate(table):
                try:
                    self.load_old_vms_volunteer_from_row(i, row)
                    successfully_loaded_volunteers += 1
                except (ValueError,):
                    ...
            self.stdout.write(
                self.style.SUCCESS(
                    f"Loaded {successfully_loaded_volunteers} volunteers from old VMS"
                )
            )

    def match_location_by_name(self, municipality_str, ward_str):
        qs = federal.models.Municipality.objects.filter(name__iexact=municipality_str)
        if qs:
            municipality = qs.first()
            wards = federal.models.Ward.objects.filter(
                municipality=municipality, name=ward_str
            )
            if wards:
                return wards.first()
        return None

    def load_red_cross_volunteers_from_row(self, i, row):
        blood_type_mapping = {
            "O+": incident.models.BloodGroup.O_Positive,
            "O-": incident.models.BloodGroup.O_Negative,
            "B+": incident.models.BloodGroup.B_Positive,
            "B-": incident.models.BloodGroup.B_Negative,
            "AB+": incident.models.BloodGroup.AB_Positive,
            "AB-": incident.models.BloodGroup.AB_Negative,
            "A+": incident.models.BloodGroup.A_Positive,
            "A-": incident.models.BloodGroup.A_Negative,
            "": incident.models.BloodGroup.B_Positive,
        }

        academic_qualification_mapping = {
            "": incident.models.AcademicQualification.SecondaryLevel,
            "Lower Secondary Education": incident.models.AcademicQualification.SecondaryLevel,
            "Higher Secondary Education": incident.models.AcademicQualification.HighSchool,
            "Secondary Education": incident.models.AcademicQualification.SecondaryLevel,
            "Bachelor": incident.models.AcademicQualification.UnderGrad,
            "Literate": incident.models.AcademicQualification.Literate,
            "Diploma": incident.models.AcademicQualification.UnderGrad,
            "Master Degree": incident.models.AcademicQualification.Grad,
        }

        ward = self.match_location_by_name(
            row["Temporary Local Bodies"], row["Temporary Ward"]
        )

        if not ward:
            return

        volunteer_profile_data = {
            "first_name": row["First Name"].capitalize(),
            "last_name": row["Last Name"].capitalize(),
            "date_of_birth": datetime.fromisoformat(row["Date Of Birth (AD)"]),
            "blood_group": blood_type_mapping.get(
                row["Blood Group"], incident.models.BloodGroup.B_Positive
            ),
            "active": False,
            "academic_qualification": academic_qualification_mapping.get(
                row["Qualification"],
                incident.models.AcademicQualification.SecondaryLevel,
            ),
            "temporary_ward": ward,
            "permanent_ward": ward,
            "nationality": incident.models.Nationality.National,
            "category": incident.models.VolunteerCategory.General,
            "gender": incident.models.Gender.Male,
            "point": self.uniformly_sample_point(
                federal.models.Ward.objects.filter(pk=ward.pk)
            ),
        }

        user = get_user_model().objects.create_user(
            password=PASSWORD,
            email=row["Email"],
        )
        user.email_verified = True
        user.save()

        citizenship = incident.models.Citizenship(
            id=f"UNKNOWN RED_CROSS {i}",
            user=user,
            registration_date=volunteer_profile_data["date_of_birth"],
            registration_district=federal.models.District.objects.get(pk=1),
        )
        citizenship.save()

        volunteer = incident.models.VolunteerProfile(
            user=user,
            **volunteer_profile_data,
        )
        volunteer.save()

    def load_red_cross_volunteers(self):
        filepath = settings.BASE_DIR / "shared" / "red_cross_data.csv"

        with open(filepath, "r") as csvfile:
            rc_csv = csv.DictReader(
                csvfile,
            )
            successfully_loaded_volunteers = 0
            for i, row in enumerate(rc_csv):
                try:
                    self.load_red_cross_volunteers_from_row(i, row)
                    successfully_loaded_volunteers += 1
                except (IntegrityError, ValueError):
                    ...

            self.stdout.write(
                self.style.SUCCESS(
                    f"Loaded {successfully_loaded_volunteers} volunteers from red cross"
                )
            )

    # bipad incident id must match with our
    def load_incidents(self):
        filepath = settings.BASE_DIR / "shared" / "incidents.json"
        with open(filepath, encoding="utf8") as j:
            response = json.load(j)
            results = response["results"]
            incidents = []
            for result in results:
                # At point of writing only one ward in ward list
                ward_id = result["wards"][0]
                ward = federal.models.Ward.objects.get(pk=ward_id)
                date = datetime.fromisoformat(result["incidentOn"])
                incident_ = incident.models.Incident(
                    pk=result["id"],
                    name=result["title"],
                    date=date,
                    description=result["description"] or "",
                    ward=ward,
                    severity=incident.models.IncidentSeverity.Moderate,
                    point=Point(result["point"]["coordinates"]),
                )
                incidents.append(incident_)
            return incidents

    def create_site_contents(self):
        contents = [
            {
                "label": "hero",
                "content": inspect.cleandoc(
                    """
                    The National Volunteer Bureau formation and Mobilization Platform is
                    a robust platform that houses records of all volunteers based on
                    age, skills, preferences, and availability along with the
                    functionality to manage them. It is built upon the concept of
                    creating a national portal embedded with independent platforms for
                    national, provincial, district, and municipal governments with a
                    bottom-up approach of disaster data partnership focusing on the
                    principle of user centric design.
                    """
                ),
            },
            {
                "label": "overview",
                "content": inspect.cleandoc(
                    """
                    The National Volunteer Bureau formation and Mobilization Platform is
                    a robust platform that houses records of all volunteers based on
                    age, skills, preferences, and availability along with the
                    functionality to manage them. It is built upon the concept of
                    creating a national portal embedded with independent platforms for
                    national, provincial, district, and municipal governments with a
                    bottom-up approach of disaster data partnership focusing on the
                    principle of user centric design.
                    """
                ),
            },
        ]
        site_contents = []
        for content in contents:
            site_content = incident.models.SiteContent(**content)
            site_content.save()
            self.stdout.write(
                self.style.SUCCESS(f"Created site-content {content['label']}")
            )
            site_contents.append(site_content)
        return site_contents

    def create_super_user(self, email):
        user = get_user_model().objects.create_user(
            password=PASSWORD,
            email=email,
            email_verified=True,
        )
        user.is_superuser = True
        user.is_staff = True
        user.save()
        self.stdout.write(self.style.SUCCESS(f"Created superuser {email}"))
        return user

    def handle(self, *_, **__):
        if get_user_model().objects.all().count() != 0:
            self.stderr.write(self.style.ERROR("Database is not empty. Aborting."))
            return

        self.download_federal_geojson_files()
        self.download_incidents()

        self.create_federal_group()
        self.create_super_user("admin@example.com")

        self.stdout.write(self.style.SUCCESS("Creating provinces"))
        provinces = self.load_provinces()
        federal.models.Province.objects.bulk_create(provinces)

        self.stdout.write(self.style.SUCCESS("Creating districts"))
        districts = self.load_districts()
        federal.models.District.objects.bulk_create(districts)

        self.stdout.write(self.style.SUCCESS("Creating municipalities"))
        municipalities = self.load_municipalities()
        federal.models.Municipality.objects.bulk_create(municipalities)

        self.stdout.write(self.style.SUCCESS("Creating wards"))
        wards = self.load_wards()
        federal.models.Ward.objects.bulk_create(wards)

        self.stdout.write(self.style.SUCCESS("Loading incidents from bipad"))
        incidents = self.load_incidents()
        incident.models.Incident.objects.bulk_create(incidents)

        self.stdout.write(self.style.SUCCESS("Loading old vms users"))
        self.load_old_vms_volunteers()

        self.stdout.write(self.style.SUCCESS("Loading old vms users"))
        self.load_red_cross_volunteers()

        _ = self.create_site_contents()
