from django.utils import timezone
from datetime import timedelta
from copy import deepcopy
import federal.models
import incident.models
import incident.views
from django.contrib.auth import get_user_model
from django.contrib.gis.geos import Point, Polygon
from django.test import TestCase
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APIRequestFactory, force_authenticate


class JobReportTest(TestCase):
    PASSWORD = "shark@123"

    def setup_geo(self):
        self.province_admin = get_user_model().objects.create(
            email="province@example.com"
        )
        self.province_admin.set_password(JobReportTest.PASSWORD)
        self.province = federal.models.Province.objects.create(
            name="Province",
            admin=self.province_admin,
            shape=Polygon([(0, 0), (0, 1), (1, 1), (1, 0), (0, 0)]),
        )

        self.district_admin = get_user_model().objects.create(
            email="district@example.com"
        )
        self.district_admin.set_password(JobReportTest.PASSWORD)
        self.district = federal.models.District.objects.create(
            name="District",
            province=self.province,
            admin=self.district_admin,
            shape=Polygon([(0, 0), (0, 1), (1, 1), (1, 0), (0, 0)]),
        )

        self.municipality_admin = get_user_model().objects.create(
            email="municipality@example.com"
        )
        self.municipality_admin.set_password(JobReportTest.PASSWORD)
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
        volunteer.set_password(JobReportTest.PASSWORD)
        volunteer.save()
        profile = incident.models.VolunteerProfile.objects.create(
            user=volunteer,
            first_name="Name",
            last_name="Name",
            date_of_birth="2022-01-01",
            gender=incident.models.Gender.Male,
            nationality=incident.models.Nationality.National,
            blood_group=incident.models.BloodGroup.O_Positive,
            active=True,
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
        self.user.set_password(JobReportTest.PASSWORD)
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

    def test_get_job_report_list(self):
        factory = APIRequestFactory()
        view = incident.views.JobReportViewSet.as_view({"get": "list"})

        # Unauthenticated
        request = factory.get("/job_report")
        response = view(request)
        self.assertNotEqual(response.status_code, status.HTTP_200_OK)

        # Authenticated superuser
        force_authenticate(request, self.user)
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Authenticated normal
        force_authenticate(request, self.volunteer)
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Have not created any job reports
        self.assertEqual(len(response.data), 0)

        incident.models.JobReport.objects.create(
            job=self.job,
            volunteer=self.volunteer_profile,
            report="",
        )

        # Check if we can see OWNED reports.
        force_authenticate(request, self.volunteer)
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

        # Check if we CANNOT see OTHER reports.
        force_authenticate(request, self.volunteer2)
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

        # Volunteers can GET other's job reports if they are leaders.
        force_authenticate(request, self.leader)
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_post_job_report(self):
        factory = APIRequestFactory()
        view = incident.views.JobReportViewSet.as_view({"post": "create"})

        # Empty data
        request = factory.post("/job_report/", data={}, format="json")
        response = view(request)
        self.assertNotEqual(response.status_code, status.HTTP_200_OK)

        data = {
            "job": reverse(
                "api:job-detail",
                args=[self.job.pk],
                request=request,
            ),
            "report": "report",
        }

        # Doesn't contain job
        invalid_data = deepcopy(data)
        invalid_data.pop("job")
        request = factory.post("/volunteer/", data=invalid_data, format="json")
        force_authenticate(request, self.volunteer)
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Doesn't contain report
        invalid_data = deepcopy(data)
        invalid_data.pop("report")
        request = factory.post("/job_report/", data=invalid_data, format="json")
        force_authenticate(request, self.volunteer)
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Unauthenticated
        request = factory.post("/job_report/", data=data, format="json")
        response = view(request)
        self.assertNotEqual(response.status_code, status.HTTP_201_CREATED)

        # Valid data
        incident.models.JobReport.objects.filter(
            volunteer=self.volunteer_profile
        ).delete()
        request = factory.post("/job_report/", data=data, format="json")
        force_authenticate(request, self.volunteer)
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        reports = incident.models.JobReport.objects.filter(
            volunteer=self.volunteer_profile
        )
        self.assertEqual(reports.count(), 1)
        self.assertEqual(reports.first().job, self.job)
        self.assertEqual(reports.first().volunteer, self.volunteer_profile)

    def test_put_job_report(self):
        factory = APIRequestFactory()
        view = incident.views.JobReportViewSet.as_view({"put": "update"})

        report = incident.models.JobReport.objects.create(
            job=self.job, volunteer=self.volunteer_profile, report="report"
        )

        # Unauthenticated and invalid data
        request = factory.put(f"/job_report/{report.pk}/", data={}, format="json")
        response = view(request, pk=report.pk)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        data = {
            "job": reverse(
                "api:job-detail",
                args=[self.job.pk],
                request=request,
            ),
            "report": "report",
        }

        # Missing job
        invalid_data = deepcopy(data)
        invalid_data.pop("job")
        request = factory.put(
            f"/job_report/{report.pk}/", data=invalid_data, format="json"
        )
        force_authenticate(request, self.volunteer)
        response = view(request, pk=report.pk)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Missing report
        invalid_data = deepcopy(invalid_data)
        invalid_data.pop("report")
        request = factory.put(
            f"/job_report/{report.pk}/", data=invalid_data, format="json"
        )
        force_authenticate(request, self.volunteer)
        response = view(request, pk=report.pk)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Authenticated but invalid data
        invalid_data = deepcopy(invalid_data)
        invalid_data["job"] = "???"
        request = factory.put(
            f"/job_report/{report.pk}/", data=invalid_data, format="json"
        )
        force_authenticate(request, self.volunteer)
        response = view(request, pk=report.pk)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Authenticated as different user but valid data
        request = factory.put(f"/job_report/{report.pk}/", data=data, format="json")
        force_authenticate(request, self.volunteer2)
        response = view(request, pk=report.pk)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Authenticated and valid data
        request = factory.put(f"/job_report/{report.pk}/", data=data, format="json")
        force_authenticate(request, self.volunteer)
        response = view(request, pk=report.pk)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
