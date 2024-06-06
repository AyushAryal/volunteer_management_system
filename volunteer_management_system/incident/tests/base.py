import federal.models
import incident.models
import incident.views
from django.contrib.auth import get_user_model
from django.contrib.gis.geos import Polygon, Point
from django.utils import timezone
from datetime import timedelta
from django.test import TestCase


class BaseTest(TestCase):
    PASSWORD = "9f3Fkb02F11F0#"

    def create_user(self, email):
        user = get_user_model().objects.create(email=email)
        user.set_password(BaseTest.PASSWORD)
        return user

    def create_provinces(self):
        names = {
            "Koshi",
            "Madhesh",
            "Bagmati",
            "Gandaki",
            "Lumbini",
            "Karnali",
            "Sudurpashchim",
            "Koshi",
            "Madhesh",
            "Lumbini",
        }

        shape_width = 100

        for name in names:
            user = self.craete_user(f"{name.lower()}@example.com")
            self.province = federal.models.Province.objects.create(
                name="Province",
                admin=user,
                shape=Polygon([(0, 0), (0, 1), (1, 1), (1, 0), (0, 0)]),
            )

    def setup_geo(self):
        self.province_admin = get_user_model().objects.create(
            email="province@example.com"
        )
        self.province_admin.set_password(BaseTest.PASSWORD)
        self.province = federal.models.Province.objects.create(
            name="Province",
            admin=self.province_admin,
            shape=Polygon([(0, 0), (0, 1), (1, 1), (1, 0), (0, 0)]),
        )

        self.district_admin = get_user_model().objects.create(
            email="district@example.com"
        )
        self.district_admin.set_password(BaseTest.PASSWORD)
        self.district = federal.models.District.objects.create(
            name="District",
            province=self.province,
            admin=self.district_admin,
            shape=Polygon([(0, 0), (0, 1), (1, 1), (1, 0), (0, 0)]),
        )

        self.municipality_admin = get_user_model().objects.create(
            email="municipality@example.com"
        )
        self.municipality_admin.set_password(BaseTest.PASSWORD)
        self.municipality = federal.models.Municipality.objects.create(
            name="Municipality",
            district=self.district,
            admin=self.municipality_admin,
            shape=Polygon([(0, 0), (0, 1), (1, 1), (1, 0), (0, 0)]),
        )

        self.ward = federal.models.Ward.objects.create(
            name=1,
            municipality=self.municipality,
            shape=Polygon([(0, 0), (0, 1), (1, 1), (1, 0), (0, 0)]),
        )

    def create_volunteer(self, email, ward):
        volunteer = get_user_model().objects.create(email=email)
        volunteer.set_password(BaseTest.PASSWORD)
        volunteer.save()
        profile = incident.models.VolunteerProfile.objects.create(
            user=volunteer,
            first_name="Name",
            last_name="Name",
            date_of_birth="2022-01-01",
            gender=incident.models.Gender.Male,
            nationality=incident.models.Nationality.National,
            blood_group=incident.models.BloodGroup.O_Positive,
            status=incident.models.VolunteerStatus.Active,
            temporary_ward=ward,
            permanent_ward=ward,
            academic_qualification=incident.models.AcademicQualification.Doctorate,
            category=incident.models.VolunteerCategory.Community,
        )
        return volunteer, profile

    def setUp(self):
        self.email = "shark@example.com"
        self.volunteer_email = "volunteer@example.com"
        self.volunteer2_email = "volunteer2@example.com"
        self.leader_email = "leader@example.com"
        self.image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="

        self.setup_geo()

        self.user = get_user_model().objects.create(email=self.email)
        self.user.set_password(BaseTest.PASSWORD)
        self.user.is_superuser = True
        self.user.save()

        self.volunteer, self.volunteer_profile = self.create_volunteer(
            self.volunteer_email, self.ward
        )

        self.volunteer2, self.volunteer_profile2 = self.create_volunteer(
            self.volunteer2_email, self.ward
        )

        self.leader, self.leader_profile = self.create_volunteer(
            self.leader_email, self.ward
        )

        self.incident = incident.models.Incident.objects.create(
            name="Incident",
            description="description",
            date=timezone.now(),
            ward=self.ward,
            severity=incident.models.IncidentSeverity.Moderate,
            point=Point(0, 0),
        )

        self.program = incident.models.Program.objects.create(
            name="Program",
            description="description",
            incident=self.incident,
        )

        self.job = incident.models.Job.objects.create(
            program=self.program,
            name="Job",
            vacancy=5,
            description="description",
            start_date=timezone.now(),
            end_date=timezone.now() + timedelta(days=2),
            status=incident.models.JobStatus.InProgress,
            leader=self.leader_profile,
        )

        self.job_application = incident.models.JobApplication.objects.create(
            job=self.job,
            volunteer=self.volunteer_profile,
            status=incident.models.JobApplicationStatus.Accepted,
        )
