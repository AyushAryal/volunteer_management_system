import django_filters
import federal.models
from authentication import utils
from authentication.signals import new_verification_link
from django.contrib.auth import get_user_model
from django.db.models import Count, F
from django.utils.translation import gettext_lazy as _
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from . import models
from . import permissions as incident_permissions
from . import serializers


class SiteContentViewSet(
    viewsets.GenericViewSet,
    viewsets.mixins.RetrieveModelMixin,
    viewsets.mixins.ListModelMixin,
):
    queryset = models.SiteContent.objects.all()
    serializer_class = serializers.SiteContentSerializer

    def get_serializer_class(self):
        return {
            "brief": serializers.SiteContentSerializer,
        }.get(self.action, super().get_serializer_class())


class VolunteerProfileViewSet(
    viewsets.mixins.ListModelMixin,
    viewsets.mixins.RetrieveModelMixin,
    viewsets.mixins.CreateModelMixin,
    viewsets.mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    """
    Endpoint for profile resource. Also includes signup as a profile.

    ---
    ## POST /volunteer

    Use the POST method to create a new profile.
    **This is usually what you use to signup as a volunteer.**

    Use the OPTIONS method to view details on the fields.
    (You can use the OPTIONS button above)

    ---

    ### Example request body

    ```
    {
        "email": "profile@example.com",
        "password": "shark@123",
        "volunteer": {
            "first_name": "Name",
            "last_name": "Name",
            "profile_image": ???,
            "date_of_birth": "2022-01-01",
            "gender": "Male",
            "nationality": "National",
            "blood_group": "O Positive",
            "category": "General",
            "temporary_municipality": "http://endpoint/to/municipality/1",
            "permanent_municipality": "http://endpoint/to/municipality/1",
        },
    }
    ```

    ---

    ## PUT | PATCH /volunteer/*id*

    Use the PUT/PATCH method to update the user information
    (excluding password and email).

    *id* is the User ID. You can get this from token endpoint.

    Password and email are **sensitive**, requiring you to reenter your password.
    Use endpoints in `/user` to change these values.

    ---

    ### Example request body:
    ```
        {
            "first_name": "Name",
            "last_name": "Name",
            "profile_image": ???,
            "date_of_birth": "2022-01-01",
            "gender": "Male",
            "nationality": "National",
            "blood_group": "O Positive",
            "municipality": "???",
        }
    ```

    ---
    """

    queryset = models.VolunteerProfile.objects.all()
    serializer_class = serializers.VolunteerProfileSerializer

    def get_serializer_class(self):
        return {
            "create": serializers.VolunteerSignupSerializer,
        }.get(self.action, super().get_serializer_class())

    def get_queryset(self):
        return {"create": get_user_model().objects.all()}.get(
            self.action, super().get_queryset()
        )

    def get_permissions(self):
        permissions_classes = {
            "list": [permissions.IsAuthenticated],
            "retrieve": [incident_permissions.IsOwner],
            "create": [permissions.AllowAny],
            "update": [incident_permissions.IsOwner],
            "partial_update": [incident_permissions.IsOwner],
            "count": [permissions.AllowAny],
        }.get(self.action, [permissions.AllowAny])
        return (permission() for permission in permissions_classes)

    def list(self, request, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        if hasattr(request.user, "volunteer"):
            return Response(
                serializer_class(
                    request.user.volunteer, context={"request": request}
                ).data
            )
        return Response(
            {"detail": _("No profile present for this user")},
            status=status.HTTP_400_BAD_REQUEST,
        )

    @action(detail=False, methods=["get"])
    def count(self, request, *args, **kwargs):
        # fmt: off
        municipality = (
            models.VolunteerProfile.objects
                .values("municipality")
                .annotate(volunteer_count=Count("municipality"))
                .values(id=F("municipality"), volunteer_count=F("volunteer_count"))
        )

        district = (
            models.VolunteerProfile.objects
                .values("municipality__district")
                .annotate(volunteer_count=Count("municipality"))
                .values(id=F("municipality__district"), volunteer_count=F("volunteer_count"))
        )

        province = (
            models.VolunteerProfile.objects
                .values("municipality__district__province")
                .annotate(volunteer_count=Count("municipality"))
                .values(id=F("municipality__district__province"), volunteer_count=F("volunteer_count"))
        )
        # fmt: on

        response = {
            "province": list(province),
            "district": list(district),
            "muncipality": list(municipality),
        }

        return Response(
            response,
            status=status.HTTP_400_BAD_REQUEST,
        )

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = self.get_queryset().filter(email=response.data["email"]).first()
        link = utils.get_verification_link(request, user)
        new_verification_link.send(sender=self.__class__, link=link, user=user)
        return response


class IncidentViewSet(
    viewsets.GenericViewSet,
    viewsets.mixins.RetrieveModelMixin,
    viewsets.mixins.ListModelMixin,
):
    queryset = models.Incident.objects.all()
    serializer_class = serializers.IncidentSerializer
    pagination_class = None

    class IncidentFilter(django_filters.FilterSet):
        date = django_filters.NumericRangeFilter(field_name="date", lookup_expr="range")
        province = django_filters.ModelChoiceFilter(
            label="Province",
            field_name="municipality__district__province",
            queryset=federal.models.Province.objects.all(),
        )
        district = django_filters.ModelChoiceFilter(
            label="District",
            field_name="municipality__district",
            queryset=federal.models.District.objects.all(),
        )
        municipality = django_filters.ModelChoiceFilter(
            label="Municipality",
            field_name="municipality",
            queryset=federal.models.Municipality.objects.all(),
        )

        class Meta:
            model = models.Incident
            fields = []

    filterset_class = IncidentFilter


class ProgramViewSet(
    viewsets.GenericViewSet,
    viewsets.mixins.RetrieveModelMixin,
    viewsets.mixins.ListModelMixin,
):
    queryset = models.Program.objects.all()
    serializer_class = serializers.ProgramSerializer
    pagination_class = None

    class ProgramFilter(django_filters.FilterSet):
        incident = django_filters.ModelChoiceFilter(
            label="Incident",
            field_name="incident",
            queryset=models.Incident.objects.all(),
        )
        province = django_filters.ModelChoiceFilter(
            label="Province",
            field_name="incident__municipality__district__province",
            queryset=federal.models.Province.objects.all(),
        )
        district = django_filters.ModelChoiceFilter(
            label="District",
            field_name="incident__municipality__district",
            queryset=federal.models.District.objects.all(),
        )
        municipality = django_filters.ModelChoiceFilter(
            label="Municipality",
            field_name="incident__municipality",
            queryset=federal.models.Municipality.objects.all(),
        )

        class Meta:
            model = models.Program
            fields = []

    filterset_class = ProgramFilter


class JobViewSet(
    viewsets.GenericViewSet,
    viewsets.mixins.RetrieveModelMixin,
    viewsets.mixins.ListModelMixin,
):
    queryset = models.Job.objects.all()
    serializer_class = serializers.JobSerializer
    pagination_class = None

    @action(detail=True, methods=["post"])
    def withdraw(self, request, *args, **kwargs):
        if hasattr(request.user, "volunteer"):
            return (
                Response(
                    {
                        "detail": {
                            "You have to be logged in as a volunteer to perform this action."
                        }
                    },
                    status=status.HTTP_401_UNAUTHORIZED,
                ),
            )

        job = self.get_object()
        application = models.JobApplication.objects.filter(
            job=job,
            volunteer=request.user.volunteer,
        )

        if application.exists():
            if application.first().status != models.JobApplicationStatus.Rejected:
                application.delete()
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(
                    {"detail": _("Job application has already been processed.")},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        return Response(
            {"detail": _("Job application does not exist.")},
            status=status.HTTP_400_BAD_REQUEST,
        )

    @action(detail=True, methods=["post"])
    def apply(self, request, *args, **kwargs):
        if hasattr(request.user, "volunteer"):
            return (
                Response(
                    {
                        "detail": {
                            "You have to be logged in as a volunteer to perform this action."
                        }
                    },
                    status=status.HTTP_401_UNAUTHORIZED,
                ),
            )

        job = self.get_object()
        if not models.JobApplication.objects.filter(
            job=job,
            volunteer=request.user.volunteer,
        ).exists():
            application = models.JobApplication(
                job=job,
                volunteer=request.user.volunteer,
            )
            application.save()
            return Response(status=status.HTTP_200_OK)

        return Response(
            {"detail": _("Job application exists.")},
            status=status.HTTP_400_BAD_REQUEST,
        )

    class JobFilter(django_filters.FilterSet):
        incident = django_filters.ModelChoiceFilter(
            label="Incident",
            field_name="program__incident",
            queryset=models.Incident.objects.all(),
        )
        program = django_filters.ModelChoiceFilter(
            label="Program",
            field_name="program",
            queryset=models.Program.objects.all(),
        )
        start_date = django_filters.NumericRangeFilter(
            field_name="start_date", lookup_expr="range"
        )
        end_date = django_filters.NumericRangeFilter(
            field_name="end_date", lookup_expr="range"
        )
        province = django_filters.ModelChoiceFilter(
            label="Province",
            field_name="program__incident__municipality__district__province",
            queryset=federal.models.Province.objects.all(),
        )
        district = django_filters.ModelChoiceFilter(
            label="District",
            field_name="program__incident__municipality__district",
            queryset=federal.models.District.objects.all(),
        )
        municipality = django_filters.ModelChoiceFilter(
            label="Municipality",
            field_name="program__incident__municipality",
            queryset=federal.models.Municipality.objects.all(),
        )

        class Meta:
            model = models.Job
            fields = []

    filterset_class = JobFilter
