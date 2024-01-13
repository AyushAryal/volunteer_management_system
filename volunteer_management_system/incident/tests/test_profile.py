from authentication.views import TokenViewSet
from django.contrib.auth import get_user_model
from django.contrib.gis.geos import Polygon
from django.test import TestCase
from federal import models as federal_models
from incident import models, views
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APIRequestFactory, force_authenticate


class VolunteerProfileTest(TestCase):
    def setup_geo(self):
        self.province = federal_models.Province.objects.create(
            name="Province",
            shape=Polygon([(0, 0), (0, 1), (1, 1), (1, 0), (0, 0)]),
        )

        self.district = federal_models.District.objects.create(
            name="District",
            province=self.province,
            shape=Polygon([(0, 0), (0, 1), (1, 1), (1, 0), (0, 0)]),
        )

        self.municipality = federal_models.Municipality.objects.create(
            name="Municipality",
            district=self.district,
        )

    def setUp(self):
        self.email = "shark@example.com"
        self.password = "123"

        self.volunteer_email = "volunteer@example.com"
        self.volunteer_password = "123"

        self.user = get_user_model().objects.create(email=self.email)
        self.user.set_password(self.password)
        self.user.is_superuser = True
        self.user.save()

        self.volunteer = get_user_model().objects.create(email=self.volunteer_email)
        self.volunteer.set_password(self.volunteer_password)
        self.volunteer.save()

        self.setup_geo()
        self.volunteer_profile = models.VolunteerProfile.objects.create(
            user=self.volunteer,
            full_name="Name",
            date_of_birth="2022-01-01",
            gender=models.Gender.Male,
            nationality=models.Nationality.National,
            blood_group=models.BloodGroup.O_Positive,
            municipality=self.municipality,
        )

    def test_get_token(self):
        factory = APIRequestFactory()
        view = TokenViewSet.as_view({"get": "list"})

        # Get token test for volunteer
        self.volunteer.email_verified = True
        self.volunteer.save()
        request = factory.get("/token/")
        force_authenticate(request, self.volunteer)
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_volunteer_profile_list(self):
        factory = APIRequestFactory()
        view = views.VolunteerProfileViewSet.as_view({"get": "list"})

        # Unauthenticated
        request = factory.get("/volunteer")
        response = view(request)
        self.assertNotEqual(response.status_code, status.HTTP_200_OK)

        # Authenticated superuser (doesn't have profile)
        force_authenticate(request, self.user)
        response = view(request)
        self.assertNotEqual(response.status_code, status.HTTP_200_OK)

        # Authenticated normal
        force_authenticate(request, self.volunteer)
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_volunteer_profile(self):
        factory = APIRequestFactory()
        view = views.VolunteerProfileViewSet.as_view({"get": "retrieve"})

        # Unauthenticated
        request = factory.get("/volunteer")
        response = view(request, pk=self.user.pk)
        self.assertNotEqual(response.status_code, status.HTTP_200_OK)

        # Authenticated volunteer
        force_authenticate(request, self.volunteer)
        response = view(request, pk=self.volunteer.pk)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Attempting to get details for different user
        response = view(request, pk=self.user.pk)
        self.assertNotEqual(response.status_code, status.HTTP_200_OK)

    def test_post_volunteer_profile(self):
        factory = APIRequestFactory()
        view = views.VolunteerProfileViewSet.as_view({"post": "create"})

        # Invalid data
        request = factory.post("/volunteer/", data={}, format="json")
        response = view(request)
        self.assertNotEqual(response.status_code, status.HTTP_200_OK)

        data = {
            "email": "profile@example.com",
            "password": "123",
            "volunteer": {
                "full_name": "Name",
                # "profile_image": "...", !!!!!!!!!!!!!!!!!!! TODO: look
                "date_of_birth": "2022-01-01",
                "gender": "Male",
                "nationality": "National",
                "blood_group": "O Positive",
                "municipality": reverse(
                    "api:municipality-detail",
                    args=[self.municipality.pk],
                    request=request,
                ),
            },
        }

        # Insecure password
        request = factory.post("/volunteer/", data=data, format="json")
        response = view(request)
        self.assertNotEqual(response.status_code, status.HTTP_201_CREATED)

        # Valid data
        data["password"] = "shark@123"
        request = factory.post("/volunteer/", data=data, format="json")
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_put_volunteer_profile(self):
        factory = APIRequestFactory()
        view = views.VolunteerProfileViewSet.as_view({"put": "update"})

        # Unauthenticated and invalid data
        request = factory.put(
            f"/volunteer/{self.volunteer.pk}/", data={}, format="json"
        )
        response = view(request, pk=self.volunteer.pk)
        self.assertNotEqual(response.status_code, status.HTTP_200_OK)

        data = {
            "full_name": "Name",
            "date_of_birth": "2022-01-01",
            "gender": "Male",
            "nationality": "National",
            "blood_group": "O Positive",
            "municipality": reverse(
                "api:municipality-detail",
                args=[self.municipality.pk],
                request=request,
            ),
        }

        # Unauthenticated, and valid data
        request = factory.put(
            f"/volunteer/{self.volunteer.pk}/", data=data, format="json"
        )
        response = view(request, pk=self.volunteer.pk)
        self.assertNotEqual(response.status_code, status.HTTP_200_OK)

        # Authenticated, but invalid data
        request = factory.put(
            f"/volunteer/{self.volunteer.pk}/", data={}, format="json"
        )
        force_authenticate(request, self.volunteer)
        response = view(request, pk=self.volunteer.pk)
        self.assertNotEqual(response.status_code, status.HTTP_200_OK)

        # Authenticated and valid data
        request = factory.put(
            f"/volunteer/{self.volunteer.pk}/", data=data, format="json"
        )
        force_authenticate(request, self.volunteer)
        response = view(request, pk=self.volunteer.pk)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
