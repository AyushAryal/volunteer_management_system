import json
import csv
import random
import os
import inspect
from datetime import timedelta, datetime

import federal.models
import incident.models

import requests
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from django.contrib.gis.geos import Point
from django.contrib.gis.geos import Polygon
from django.contrib.gis.db.models import Extent
from django.core.management.base import BaseCommand
from django.utils import timezone

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

    def create_volunteers(self, wards, n=1000):
        first_names = [
            "first",
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
            "last",
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
            "example.com",
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
        details.add((0, 0, 0, 2))
        while len(details) != n:
            first_name = random.randint(0, len(first_names) - 1)
            last_name = random.randint(0, len(last_names) - 1)
            domain = random.randint(0, len(domains) - 1)
            generator = random.randint(0, len(generators) - 1)
            details.add((first_name, last_name, domain, generator))
        details = list(details)

        for detail in details:
            first_name_idx, last_name_idx, domain_idx, generator_idx = detail
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

            user = get_user_model().objects.create_user(password=PASSWORD, email=email)
            user.email_verified = True
            user.save()

            citizenship = incident.models.Citizenship(
                id=incident.models.Citizenship.objects.all().count() + 1,
                user=user,
                registration_date=date_of_birth,
                registration_district=federal.models.District.objects.get(pk=1),
            )
            citizenship.save()

            ward = random.choice(wards)
            point = self.uniformly_sample_point(
                federal.models.Ward.objects.filter(pk=ward.pk)
            )

            volunteer = incident.models.VolunteerProfile(
                user=user,
                first_name=first_name.capitalize(),
                last_name=last_name.capitalize(),
                gender=gender,
                blood_group=random.choice(incident.models.BloodGroup.values),
                nationality=nationality,
                date_of_birth=date_of_birth,
                temporary_ward=ward,
                permanent_ward=ward,
                point=point,
                academic_qualification=random.choice(
                    incident.models.AcademicQualification.values
                ),
                category=random.choice(incident.models.VolunteerCategory.values),
            )
            volunteer.save()
            self.stdout.write(self.style.SUCCESS(f"Created volunteer {email}"))

    def match_municipality_by_name(self, name):
        qs = federal.models.Municipality.objects.filter(name_iexact=name)
        if qs:
            return qs.first()
        return None

    def create_red_cross_volunteers(self):
        def valid_red_cross_data(row):
            if (
                row["First Name"]
                and row["Last Name"]
                and row["Email"]
                and (row["Date Of Birth (AD)"])
                and (row["Contact Number 2"] or row["Contact Number 1"])
                and (row["Local Bodies"] or row["Temporary Local Bodies"])
                and (row["Ward"] or row["Temporary Ward"])
            ):
                return True
            return False

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
            "Literate": incident.models.AcademicQualification.SecondaryLevel,
            "Diploma": incident.models.AcademicQualification.UnderGrad,
            "Master Degree": incident.models.AcademicQualification.Grad,
        }

        filepath = "./red_cross_data.csv"

        filepath = settings.BASE_DIR / "shared" / "red_cross_data.csv"

        with open(filepath, "r") as csvfile:
            rc_csv = csv.DictReader(
                csvfile,
            )
            for row in rc_csv:
                if valid_red_cross_data(row):
                    first_name = row["First Name"]
                    last_name = row["Last Name"]
                    email = row["Email"]
                    date_of_birth = datetime.fromisoformat(row["Date Of Birth (AD)"])
                    row["Contact Number 1"]
                    row["Contact Number 2"]
                    blood_group = row["Blood Group"]
                    blood_group = blood_type_mapping[blood_group]
                    academic_qualification = row["Qualification"]
                    academic_qualification = academic_qualification_mapping[
                        academic_qualification
                    ]
                    temporary_ward = row["Temporary Ward"]
                    temporary_municipality = row["Temporary Local Bodies"]
                    permanent_ward = row["Ward"]
                    premanent_municipality = row["Local Bodies"]
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

                    ward = federal.models.Ward.objects.get(pk=1)
                    # point = self.uniformly_sample_point(
                    #     federal.models.Ward.objects.get(pk=1)
                    # )

                    volunteer = incident.models.VolunteerProfile(
                        user=user,
                        first_name=first_name.capitalize(),
                        last_name=last_name.capitalize(),
                        gender=random.choice(incident.models.Gender.values),
                        blood_group=blood_group,
                        date_of_birth=date_of_birth,
                        nationality=incident.models.Nationality.National,
                        temporary_ward=ward,
                        permanent_ward=ward,
                        academic_qualification=academic_qualification,
                        category=incident.models.VolunteerCategory.General,
                    )
                    volunteer.save()
                    self.stdout.write(self.style.SUCCESS(f"Created volunteer {email}"))

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
                    name=result["title"],
                    date=date,
                    description=result["description"] or "",
                    ward=ward,
                    severity=incident.models.IncidentSeverity.Moderate,
                    point=Point(result["point"]["coordinates"]),
                )
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
            programs.append(program)
        return programs

    def create_jobs(self, programs):
        jobs = []
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
            jobs.append(job)
        return jobs

    def create_job_applications(self, jobs, volunteers):
        job_applications = []
        for job in jobs:
            applicants = random.sample(volunteers, min(4, job.vacancy))
            for applicant in applicants:
                job_application = incident.models.JobApplication(
                    job=job,
                    volunteer=applicant,
                    status=random.choice(incident.models.JobApplicationStatus.values),
                )
                job_applications.append(job_application)
        return job_applications

    def create_job_reports(self, jobs):
        job_reports = []
        for job in jobs:
            accepted_applications = job.applications.filter(
                status=incident.models.JobApplicationStatus.Accepted
            )
            for application in accepted_applications:
                job_report = incident.models.JobReport(
                    volunteer=application.volunteer,
                    job=application.job,
                    report=f"Job Report description for {job} by {application.volunteer}",
                )
                job_reports.append(job_report)
        return job_reports

    def create_notifications(self, users):
        notifications = []
        for user in users:
            for _ in range(3):
                notification = incident.models.Notification(
                    message="Sample notification",
                    date=timezone.now(),
                    viewed=random.random() > 0.5,
                    user=user,
                )
                notifications.append(notification)
        return notifications

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

        self.stdout.write(self.style.SUCCESS("Creating programs"))
        programs = self.create_programs(
            random.sample(incidents, int(len(incidents) * 0.25))
        )
        incident.models.Program.objects.bulk_create(programs)

        self.stdout.write(self.style.SUCCESS("loading red cross users"))
        self.create_red_cross_volunteers()

        self.stdout.write(self.style.SUCCESS("Creating volunteers"))
        self.create_volunteers(wards)

        self.stdout.write(self.style.SUCCESS("Creating jobs"))
        jobs = self.create_jobs(programs)
        jobs = incident.models.Job.objects.bulk_create(jobs)

        self.stdout.write(self.style.SUCCESS("Creating job applications"))
        job_applications = self.create_job_applications(
            jobs, list(incident.models.VolunteerProfile.objects.all())
        )
        incident.models.JobApplication.objects.bulk_create(job_applications)

        self.stdout.write(self.style.SUCCESS("Creating job reports"))
        job_reports = self.create_job_reports(jobs)
        incident.models.JobReport.objects.bulk_create(job_reports)

        self.stdout.write(self.style.SUCCESS("Creating notifications"))
        notifications = self.create_notifications(list(get_user_model().objects.all()))
        incident.models.Notification.objects.bulk_create(notifications)

        _ = self.create_site_contents()
