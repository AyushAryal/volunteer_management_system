import json
import math
import random
import os
from datetime import timedelta

import federal.models
import incident.models

import requests
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from django.contrib.gis.db.models.functions import PointOnSurface
from django.contrib.gis.geos import Polygon
from django.core.management.base import BaseCommand
from django.utils import timezone

PASSWORD = os.getenv("ADMIN_PASSWORD", "shark@123")


class Command(BaseCommand):
    help = "This command populates the database with default db"

    def download_geojson_files(self):
        BASE_URL = "https://bipadportal.gov.np/api/v1/"
        QUERY_PARAMS = "format=geojson&limit=1000000000"

        ENDPOINTS = ["province", "district", "municipality", "ward"]
        for endpoint in ENDPOINTS:
            filename = f"{endpoint}.geojson.json"
            path = settings.BASE_DIR / "shared" / filename
            if not os.path.exists(path):
                self.stdout.write(self.style.SUCCESS(f"Downloading {filename}"))
                response = requests.get(f"{BASE_URL}{endpoint}/?{QUERY_PARAMS}")
                with open(path, "wb") as file:
                    file.write(response.content)
                    self.stdout.write(self.style.SUCCESS(f"Downloaded {filename}"))
            else:
                self.stdout.write(
                    self.style.SUCCESS(
                        f"File {filename} already exists, skipping download."
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
        files = [
            "ward.json",
            "ward2.json",
            "ward3.json",
            "ward4.json",
            "ward5.json",
            "ward6.json",
            "ward7.json",
        ]
        for file in files:
            filepath = settings.BASE_DIR / "shared" / file
            with open(filepath, encoding="utf8") as j:
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

    def create_volunteers(self, municipalities):
        volunteers = []
        first_names = [
            "ram",
            "shyam",
            "hari",
            "ayush",
            "ankit",
            "aakash",
            "bishal",
            "sishir",
            "aavash",
            "bigyan",
            "gita",
            "sita",
            "joti",
            "shushmita",
            "sneha",
            "sambriddhi",
            "fulkumari",
            "kalpana",
        ]
        genders = [
            incident.models.Gender.Male,
            incident.models.Gender.Male,
            incident.models.Gender.Male,
            incident.models.Gender.Male,
            incident.models.Gender.Male,
            incident.models.Gender.Male,
            incident.models.Gender.Male,
            incident.models.Gender.Male,
            incident.models.Gender.Male,
            incident.models.Gender.Male,
            incident.models.Gender.Female,
            incident.models.Gender.Female,
            incident.models.Gender.Female,
            incident.models.Gender.Female,
            incident.models.Gender.Female,
            incident.models.Gender.Female,
            incident.models.Gender.Female,
            incident.models.Gender.Female,
        ]
        last_names = [
            "sitaula",
            "sharma",
            "adhikari",
            "shrestha",
            "kc",
            "pandit",
            "pandey",
            "panday",
            "aryal",
            "khanal",
            "marhatta",
            "wagle",
            "gyanwali",
            "dahal",
        ]
        domains = [
            "gmail.com",
            "hotmail.com",
            "yahoo.com",
            "mail.com",
            "outlook.com",
            "live.com",
            "apple.com",
            "pm.com",
            "zoho.com",
            "aol.com",
            "icloud.com",
            "tutanota.com",
            "yandex.com",
            "inbox.com",
            "amazon.com",
        ]

        generators = [
            lambda f, s, d: f"{f}{s}@{d}",
            lambda f, s, d: f"{s}{f}@{d}",
            lambda f, s, d: f"{f}.{s}@{d}",
            lambda f, s, d: f"{s}.{f}@{d}",
            lambda f, s, d: f"{f}_{s}@{d}",
            lambda f, s, d: f"{s}_{f}@{d}",
        ]

        details = set()
        while len(details) != len(municipalities) * 3:
            first_name = random.randint(0, len(first_names) - 1)
            last_name = random.randint(0, len(last_names) - 1)
            domain = random.randint(0, len(domains) - 1)
            generator = random.randint(0, len(generators) - 1)
            details.add((first_name, last_name, domain, generator))
        details = list(details)

        for municipality in municipalities:
            for _ in range(random.randint(1, 3)):
                first_name_idx, last_name_idx, domain_idx, generator_idx = details.pop()
                gender = genders[first_name_idx]
                first_name = first_names[first_name_idx]
                last_name = last_names[last_name_idx]
                domain = domains[domain_idx]
                generator = generators[generator_idx]
                email = generator(first_name, last_name, domain)
                nationality = (
                    incident.models.Nationality.National
                    if random.random() < 0.95
                    else incident.models.Nationality.International
                )
                date_of_birth = timezone.now() - timedelta(
                    days=365 * random.randint(19, 45) + random.randint(0, 365)
                )

                user = get_user_model().objects.create_user(
                    password=PASSWORD, email=email
                )
                user.email_verified = True
                user.save()

                citizenship = incident.models.Citizenship(
                    id=incident.models.Citizenship.objects.all().count() + 1,
                    user=user,
                    registration_date=date_of_birth,
                    registration_district=federal.models.District.objects.get(pk=1),
                )
                citizenship.save()

                volunteer = incident.models.VolunteerProfile(
                    user=user,
                    first_name=first_name.capitalize(),
                    last_name=last_name.capitalize(),
                    gender=gender,
                    blood_group=random.choice(incident.models.BloodGroup.values),
                    nationality=nationality,
                    date_of_birth=date_of_birth,
                    temporary_municipality=municipality,
                    permanent_municipality=municipality,
                )
                volunteer.save()
                self.stdout.write(self.style.SUCCESS(f"Created volunteer {email}"))
        return volunteers

    def create_incidents(self, municipalities):
        incidents = []
        disasters = [
            "Earthquake",
            "Landslide",
            "Food",
            "Forest Fire",
            "Avalance",
            "Glacial Flood",
            "Volcanic Eruption",
        ]
        adjectives = [
            "Severe",
            "Mild",
            "Dangerous",
            "Devestating",
            "Violent",
            "Critical",
        ]
        for _ in range(math.floor(len(municipalities) * 0.6)):
            municipality = random.choice(municipalities)
            name = "{} {} in {}".format(
                random.choice(adjectives),
                random.choice(disasters),
                municipality.name,
            )
            point = (
                federal.models.Municipality.objects.filter(pk=municipality.pk)
                .annotate(rand_point=PointOnSurface("shape"))
                .values("rand_point")
                .first()["rand_point"]
            )

            severity = random.choice(list(incident.models.IncidentSeverity))
            incident_ = incident.models.Incident(
                name=name,
                description=name,
                municipality=municipality,
                date=timezone.now() - timedelta(days=random.randint(0, 30 * 12 * 5)),
                point=point,
                severity=severity,
            )
            incident_.save()
            self.stdout.write(self.style.SUCCESS(f"Created incident: {name}"))
            incidents.append(incident_)
        return incidents

    def create_programs(self, incidents):
        programs = []
        actions = [
            "Relief for",
            "Donatations for",
            "Rescue operations for",
            "Restoration after",
            "Reconstruction efforts after",
        ]
        for incident_ in incidents:
            name = "{} {}".format(random.choice(actions), incident_.name)
            program = incident.models.Program(
                incident=incident_,
                name=name,
                description=name,
            )
            program.save()
            self.stdout.write(self.style.SUCCESS(f"Created program: {name}"))
            programs.append(program)
        return programs

    def create_jobs(self, programs):
        jobs = []
        incident.models.Job
        for program in programs:
            start_date = program.incident.date + timedelta(days=random.randint(1, 7))
            job = incident.models.Job(
                program=program,
                start_date=start_date,
                end_date=start_date + timedelta(days=random.randint(1, 30)),
                name=program.name,
                vacancy=random.randint(1, 5),
                description=program.name,
                status=incident.models.JobStatus.NotAssigned,
            )
            job.save()
            self.stdout.write(self.style.SUCCESS(f"Created job: {program.name}"))
            jobs.append(job)
        return jobs

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
        self.download_geojson_files()
        self.create_federal_group()
        self.create_super_user("admin@example.com")

        provinces = self.load_provinces()
        if federal.models.Province.objects.all().count() == 0:
            for province in provinces:
                province.save()

        districts = self.load_districts()
        if federal.models.District.objects.all().count() == 0:
            for district in districts:
                district.save()

        municipalities = self.load_municipalities()
        if federal.models.Municipality.objects.all().count() == 0:
            for municipality in municipalities:
                municipality.save()

        wards = self.load_wards()
        if federal.models.Ward.objects.all().count() == 0:
            for ward in wards:
                ward.save()

        incidents = self.create_incidents(municipalities)
        programs = self.create_programs(incidents)
        _ = self.create_volunteers(municipalities)
        _ = self.create_jobs(programs)
