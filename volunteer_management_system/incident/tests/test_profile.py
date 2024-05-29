from copy import deepcopy
import federal.models
import incident.models
import incident.views
from authentication.views import TokenViewSet
from django.contrib.auth import get_user_model
from django.contrib.gis.geos import Polygon
from django.test import TestCase
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APIRequestFactory, force_authenticate


class VolunteerProfileTest(TestCase):
    PASSWORD = "shark@123"

    def setup_geo(self):
        self.province_admin = get_user_model().objects.create(
            email="province@example.com"
        )
        self.province_admin.set_password(VolunteerProfileTest.PASSWORD)
        self.province = federal.models.Province.objects.create(
            name="Province",
            admin=self.province_admin,
            shape=Polygon([(0, 0), (0, 1), (1, 1), (1, 0), (0, 0)]),
        )

        self.district_admin = get_user_model().objects.create(
            email="district@example.com"
        )
        self.district_admin.set_password(VolunteerProfileTest.PASSWORD)
        self.district = federal.models.District.objects.create(
            name="District",
            province=self.province,
            admin=self.district_admin,
            shape=Polygon([(0, 0), (0, 1), (1, 1), (1, 0), (0, 0)]),
        )

        self.municipality_admin = get_user_model().objects.create(
            email="municipality@example.com"
        )
        self.municipality_admin.set_password(VolunteerProfileTest.PASSWORD)
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

    def setUp(self):
        self.email = "shark@example.com"
        self.volunteer_email = "volunteer@example.com"
        self.image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="

        self.user = get_user_model().objects.create(email=self.email)
        self.user.set_password(VolunteerProfileTest.PASSWORD)
        self.user.is_superuser = True
        self.user.save()

        self.volunteer = get_user_model().objects.create(email=self.volunteer_email)
        self.volunteer.set_password(VolunteerProfileTest.PASSWORD)
        self.volunteer.save()

        self.setup_geo()
        self.volunteer_profile = incident.models.VolunteerProfile.objects.create(
            user=self.volunteer,
            first_name="Name",
            last_name="Name",
            date_of_birth="2022-01-01",
            gender=incident.models.Gender.Male,
            nationality=incident.models.Nationality.National,
            blood_group=incident.models.BloodGroup.O_Positive,
            temporary_ward=self.ward,
            permanent_ward=self.ward,
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
        view = incident.views.VolunteerProfileViewSet.as_view({"get": "list"})

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
        view = incident.views.VolunteerProfileViewSet.as_view({"get": "retrieve"})

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
        view = incident.views.VolunteerProfileViewSet.as_view({"post": "create"})

        # Empty data
        request = factory.post("/volunteer/", data={}, format="json")
        response = view(request)
        self.assertNotEqual(response.status_code, status.HTTP_200_OK)

        data = {
            "email": "profile@example.com",
            "password": "shark@123",
            "volunteer": {
                "first_name": "Name",
                "last_name": "Name",
                "contact_number": "+9779840424017",
                "date_of_birth": "2005-01-01",
                "gender": "Male",
                "nationality": "National",
                "academics": "High School",
                "blood_group": "O Positive",
                "category": "General",
                "temporary_ward": reverse(
                    "api:ward-detail",
                    args=[self.ward.pk],
                    request=request,
                ),
                "permanent_ward": reverse(
                    "api:ward-detail",
                    args=[self.ward.pk],
                    request=request,
                ),
            },
            "citizenship": {
                "id": "123",
                "registration_date": "2001-01-01",
                "registration_district": reverse(
                    "api:district-detail",
                    args=[self.district.pk],
                    request=request,
                ),
                "image": self.image,
            },
            "passport": {
                "id": "123",
                "issue_date": "2001-01-01",
                "expiry_date": "2032-01-10",
                "image": self.image,
            },
            "national_id": {
                "id": "123",
                "registration_date": "2001-01-01",
                "registration_district": reverse(
                    "api:district-detail",
                    args=[self.district.pk],
                    request=request,
                ),
                "image": self.image,
            },
            "other_identification_document": {
                "name": "123",
                "image": self.image,
            },
            "certificates": [
                {"name": "1", "image": self.image},
                {"name": "2", "image": self.image},
            ],
        }

        # Too young
        invalid_data = deepcopy(data)
        invalid_data["volunteer"]["date_of_birth"] = "2222-01-01"
        request = factory.post("/volunteer/", data=invalid_data, format="json")
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Doesn't contain citizenship
        invalid_data = deepcopy(data)
        invalid_data["citizenship"] = None
        request = factory.post("/volunteer/", data=invalid_data, format="json")
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # International doesn't contain passport
        invalid_data = deepcopy(data)
        invalid_data["volunteer"]["nationality"] = "International"
        invalid_data["passport"] = None
        request = factory.post("/volunteer/", data=invalid_data, format="json")
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # No password
        invalid_data = deepcopy(data)
        invalid_data.pop("password")
        request = factory.post("/volunteer/", data=invalid_data, format="json")
        response = view(request)
        self.assertNotEqual(response.status_code, status.HTTP_201_CREATED)

        # Insecure password
        invalid_data = deepcopy(data)
        invalid_data["password"] = "123"
        request = factory.post("/volunteer/", data=invalid_data, format="json")
        response = view(request)
        self.assertNotEqual(response.status_code, status.HTTP_201_CREATED)

        # Expired passport
        invalid_data = deepcopy(data)
        invalid_data["passport"]["expiry_date"] = "2000-01-01"
        request = factory.post("/volunteer/", data=invalid_data, format="json")
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Invalid issue date of passport
        invalid_data = deepcopy(data)
        invalid_data["passport"]["issue_date"] = "2222-01-01"
        request = factory.post("/volunteer/", data=invalid_data, format="json")
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Invalid issue date of national id
        invalid_data = deepcopy(data)
        invalid_data["national_id"]["registration_date"] = "2222-01-01"
        request = factory.post("/volunteer/", data=invalid_data, format="json")
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Invalid issue date of citizenship
        invalid_data = deepcopy(data)
        invalid_data["citizenship"]["registration_date"] = "2222-01-01"
        request = factory.post("/volunteer/", data=invalid_data, format="json")
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Image not present
        invalid_data = deepcopy(data)
        invalid_data["citizenship"]["image"] = None
        request = factory.post("/volunteer/", data=invalid_data, format="json")
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Image invalid
        invalid_data = deepcopy(data)
        invalid_data["other_identification_document"]["image"] = "??"
        request = factory.post("/volunteer/", data=invalid_data, format="json")
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Certificate image not present
        invalid_data = deepcopy(data)
        invalid_data["certificates"][0]["image"] = None
        request = factory.post("/volunteer/", data=invalid_data, format="json")
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Valid data
        request = factory.post("/volunteer/", data=data, format="json")
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_put_volunteer_profile(self):
        factory = APIRequestFactory()
        view = incident.views.VolunteerProfileViewSet.as_view({"put": "update"})

        # Unauthenticated and invalid data
        request = factory.put(
            f"/volunteer/{self.volunteer.pk}/", data={}, format="json"
        )
        response = view(request, pk=self.volunteer.pk)
        self.assertNotEqual(response.status_code, status.HTTP_200_OK)

        data = {
            "email": "test000@example.com",
            "volunteer": {
                "first_name": "first_name",
                "last_name": "last_name",
                "date_of_birth": "1980-01-01",
                "contact_number": "+9779840424000",
                "gender": "Male",
                "nationality": "National",
                "blood_group": "A Positive",
                "category": "General",
                "temporary_ward": reverse(
                    "api:ward-detail",
                    args=[self.ward.pk],
                    request=request,
                ),
                "permanent_ward": reverse(
                    "api:ward-detail",
                    args=[self.ward.pk],
                    request=request,
                ),
                "organization_name": "organization_name",
                "organization_phone_number": "+9779840424000",
                "organization_website": "organization_website",
                "training_name": "training_name",
                "training_subject": "training_subject",
                "training_type": "Other",
            },
            "citizenship": {
                "id": "000",
                "registration_date": "2000-01-01",
                "registration_district": reverse(
                    "api:district-detail",
                    args=[self.district.pk],
                    request=request,
                ),
                "image": self.image,
            },
            "passport": {
                "id": "000",
                "issue_date": "2000-01-01",
                "expiry_date": "3000-01-01",
                "image": self.image,
            },
            "national_id": {
                "id": "000",
                "registration_date": "2000-01-01",
                "registration_district": reverse(
                    "api:district-detail",
                    args=[self.district.pk],
                    request=request,
                ),
                "image": self.image,
            },
            "other_identification_document": {"name": "000", "image": self.image},
            "certificates": [
                {"name": "0", "image": self.image},
                {"name": "1", "image": self.image},
            ],
        }

        modified_data = {
            "email": "test001@example.com",
            "volunteer": {
                "first_name": "_first_name",
                "last_name": "_last_name",
                "date_of_birth": "1980-01-02",
                "contact_number": "+9779840424001",
                "gender": "Female",
                "nationality": "International",
                "blood_group": "A Negative",
                "category": "Student",
                "temporary_ward": reverse(
                    "api:ward-detail",
                    args=[self.ward.pk],
                    request=request,
                ),
                "permanent_ward": reverse(
                    "api:ward-detail",
                    args=[self.ward.pk],
                    request=request,
                ),
                "organization_name": "_organization_name",
                "organization_phone_number": "+9779840424001",
                "organization_website": "_organization_website",
                "training_name": "_training_name",
                "training_subject": "_training_subject",
                "training_type": "Rescue",
            },
            "citizenship": {
                "id": "001",
                "registration_date": "2000-01-02",
                "registration_district": reverse(
                    "api:district-detail",
                    args=[self.district.pk],
                    request=request,
                ),
                "image": self.image,
            },
            "passport": {
                "id": "001",
                "issue_date": "2000-01-02",
                "expiry_date": "3000-01-02",
                "image": self.image,
            },
            "national_id": {
                "id": "001",
                "registration_date": "2000-01-02",
                "registration_district": reverse(
                    "api:district-detail",
                    args=[self.district.pk],
                    request=request,
                ),
                "image": self.image,
            },
            "other_identification_document": {"name": "001", "image": self.image},
            "certificates": [
                {"name": "1", "image": self.image},
                {"name": "2", "image": self.image},
            ],
        }

        # Unauthenticated, and valid data
        request = factory.put(
            f"/volunteer/{self.volunteer.pk}/", data=data, format="json"
        )
        response = view(request, pk=self.volunteer.pk)
        self.assertNotEqual(response.status_code, status.HTTP_200_OK)

        # missing document
        invalid_data = deepcopy(data)
        invalid_data["citizenship"] = None
        request = factory.put("/volunteer/", data=invalid_data, format="json")
        force_authenticate(request, self.volunteer)
        response = view(request, pk=self.volunteer.pk)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Authenticated and valid data
        request = factory.put(
            f"/volunteer/{self.volunteer.pk}/", data=data, format="json"
        )
        force_authenticate(request, self.volunteer)
        response = view(request, pk=self.volunteer.pk)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Authenticated and deleted citizenship
        modified_data_ = deepcopy(modified_data)
        modified_data_.pop("citizenship")
        request = factory.put(
            f"/volunteer/{self.volunteer.pk}/", data=modified_data_, format="json"
        )
        force_authenticate(request, self.volunteer)
        response = view(request, pk=self.volunteer.pk)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        modified_volunteer = incident.models.VolunteerProfile.objects.get(
            pk=self.volunteer.pk
        )
        self.assertEqual(hasattr(modified_volunteer.user, "citizenship"), False)

        # Authenticated and valid modified data
        request = factory.put(
            f"/volunteer/{self.volunteer.pk}/", data=modified_data, format="json"
        )
        force_authenticate(request, self.volunteer)
        response = view(request, pk=self.volunteer.pk)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
