import datetime
import django_filters
import federal.models
from authentication import utils
from authentication.signals import new_verification_link
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
from datetime import timedelta

from django.utils import timezone

from . import models
from authentication import permissions as authentication_permissions
from . import permissions as incident_permissions
from . import serializers


class SiteContentViewSet(
    viewsets.GenericViewSet,
    viewsets.mixins.RetrieveModelMixin,
    viewsets.mixins.ListModelMixin,
):
    queryset = models.SiteContent.objects.all()
    serializer_class = serializers.SiteContentSerializer
    pagination_class = None


class VolunteerProfileFilter(django_filters.FilterSet):
    province = django_filters.ModelChoiceFilter(
        label="Province",
        field_name="temporary_ward__municipality__district__province",
        queryset=federal.models.Province.objects.all(),
    )

    district = django_filters.ModelChoiceFilter(
        label="District",
        field_name="temporary_ward__municipality__district",
        queryset=federal.models.District.objects.all(),
    )

    municipality = django_filters.ModelChoiceFilter(
        label="Municipality",
        field_name="temporary_ward__municipality",
        queryset=federal.models.Municipality.objects.all(),
    )

    ward = django_filters.ModelChoiceFilter(
        label="Ward",
        field_name="temporary_ward",
        queryset=federal.models.Ward.objects.all(),
    )

    class Meta:
        model = models.VolunteerProfile
        fields = []


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
            "temporary_ward": "http://endpoint/to/ward/1",
            "permanent_ward": "http://endpoint/to/ward/1",
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
            "category": "General",
            "temporary_ward": "http://endpoint/to/ward/1",
            "permanent_ward": "http://endpoint/to/ward/1",
        }
    ```

    ---
    """

    queryset = get_user_model().objects.filter(volunteer__isnull=False)
    serializer_class = serializers.VolunteerSerializer

    def get_queryset(self):
        return {
            "create": get_user_model().objects.all(),
        }.get(self.action, super().get_queryset())

    def get_serializer_class(self):
        return {
            "create": serializers.JobReportCreateSerializer,
            "update": serializers.JobReportCreateSerializer,
            "geotag": serializers.VolunteerLocationSerializer,  # This is used for geotag
        }.get(self.action, super().get_serializer_class())

    def get_permissions(self):
        permissions_classes = {
            "list": [permissions.IsAuthenticated],
            "retrieve": [authentication_permissions.IsOwner],
            "create": [permissions.AllowAny],
            "update": [authentication_permissions.IsOwner],
            "partial_update": [authentication_permissions.IsOwner],
            "geotag": [permissions.AllowAny],
        }.get(self.action, [permissions.AllowAny])
        return (permission() for permission in permissions_classes)

    @action(detail=False, methods=["get"])
    def geotag(self, request, *args, **kwargs):
        queryset = models.VolunteerProfile.objects.filter(point__isnull=False)
        queryset = VolunteerProfileFilter(request.GET, queryset).qs
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        if hasattr(request.user, "volunteer"):
            return Response(
                serializer_class(request.user, context={"request": request}).data
            )
        return Response(
            {"detail": _("No profile present for this user")},
            status=status.HTTP_400_BAD_REQUEST,
        )

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = self.get_queryset().filter(email=response.data["email"]).first()
        link = utils.get_verification_link(request, user)
        new_verification_link.send(sender=self.__class__, link=link, user=user)
        return response


class IncidentFilter(django_filters.FilterSet):
    date = django_filters.DateFromToRangeFilter(field_name="date", lookup_expr="range")
    province = django_filters.ModelChoiceFilter(
        label="Province",
        field_name="ward__municipality__district__province",
        queryset=federal.models.Province.objects.all(),
    )
    district = django_filters.ModelChoiceFilter(
        label="District",
        field_name="ward__municipality__district",
        queryset=federal.models.District.objects.all(),
    )
    municipality = django_filters.ModelChoiceFilter(
        label="Municipality",
        field_name="ward__municipality",
        queryset=federal.models.Municipality.objects.all(),
    )
    ward = django_filters.ModelChoiceFilter(
        label="Ward",
        field_name="ward",
        queryset=federal.models.Ward.objects.all(),
    )

    class Meta:
        model = models.Incident
        fields = []


class IncidentViewSet(
    viewsets.GenericViewSet,
    viewsets.mixins.RetrieveModelMixin,
    viewsets.mixins.ListModelMixin,
):
    queryset = (
        models.Incident.objects.all()
        .prefetch_related("programs")
        .prefetch_related("programs__jobs")
    )
    serializer_class = serializers.IncidentSerializer
    pagination_class = None
    filterset_class = IncidentFilter


class ProgramFilter(django_filters.FilterSet):
    incident = django_filters.ModelChoiceFilter(
        label="Incident",
        field_name="incident",
        queryset=models.Incident.objects.all(),
    )
    date = django_filters.DateFromToRangeFilter(
        field_name="incident__date", lookup_expr="range"
    )
    province = django_filters.ModelChoiceFilter(
        label="Province",
        field_name="incident__ward__municipality__district__province",
        queryset=federal.models.Province.objects.all(),
    )
    district = django_filters.ModelChoiceFilter(
        label="District",
        field_name="incident__ward__municipality__district",
        queryset=federal.models.District.objects.all(),
    )
    municipality = django_filters.ModelChoiceFilter(
        label="Municipality",
        field_name="incident__ward__municipality",
        queryset=federal.models.Municipality.objects.all(),
    )
    ward = django_filters.ModelChoiceFilter(
        label="Ward",
        field_name="incident__ward",
        queryset=federal.models.Ward.objects.all(),
    )

    class Meta:
        model = models.Program
        fields = []


class ProgramViewSet(
    viewsets.GenericViewSet,
    viewsets.mixins.RetrieveModelMixin,
    viewsets.mixins.ListModelMixin,
):
    queryset = models.Program.objects.all()
    serializer_class = serializers.ProgramSerializer
    pagination_class = None
    filterset_class = ProgramFilter


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
    start_date = django_filters.DateFromToRangeFilter(
        field_name="start_date", lookup_expr="range"
    )
    end_date = django_filters.DateFromToRangeFilter(
        field_name="end_date", lookup_expr="range"
    )
    province = django_filters.ModelChoiceFilter(
        label="Province",
        field_name="program__incident__ward__municipality__district__province",
        queryset=federal.models.Province.objects.all(),
    )
    district = django_filters.ModelChoiceFilter(
        label="District",
        field_name="program__incident__ward__municipality__district",
        queryset=federal.models.District.objects.all(),
    )
    municipality = django_filters.ModelChoiceFilter(
        label="Municipality",
        field_name="program__incident__ward__municipality",
        queryset=federal.models.Municipality.objects.all(),
    )
    ward = django_filters.ModelChoiceFilter(
        label="Ward",
        field_name="program__incident__ward",
        queryset=federal.models.Ward.objects.all(),
    )

    class Meta:
        model = models.Job
        fields = []


class JobViewSet(
    viewsets.GenericViewSet,
    viewsets.mixins.RetrieveModelMixin,
    viewsets.mixins.ListModelMixin,
):
    queryset = models.Job.objects.all()
    serializer_class = serializers.JobSerializer
    pagination_class = None
    filterset_class = JobFilter

    @action(detail=True, methods=["post"])
    def withdraw(self, request, *args, **kwargs):
        if not hasattr(request.user, "volunteer"):
            return Response(
                {
                    "detail": {
                        "You have to be logged in as a volunteer to perform this action."
                    }
                },
                status=status.HTTP_401_UNAUTHORIZED,
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
    def cancel(self, request, *args, **kwargs):
        if not hasattr(request.user, "volunteer"):
            return Response(
                {
                    "detail": {
                        "You have to be logged in as a volunteer to perform this action."
                    }
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        job = self.get_object()
        application = models.JobApplication.objects.filter(
            job=job,
            volunteer=request.user.volunteer,
        ).first()

        if application:
            if job.end_date < timezone.now():
                return Response(
                    {"detail": {"Job has ended."}}, status=status.HTTP_400_BAD_REQUEST
                )
            if application.status == models.JobApplicationStatus.Accepted:
                application.status = models.JobApplicationStatus.Cancelled
                application.save()
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(
                    {
                        "detail": _(
                            "Job application is either rejected, pending or cancelled."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        return Response(
            {"detail": _("Job application does not exist.")},
            status=status.HTTP_400_BAD_REQUEST,
        )

    @action(detail=True, methods=["post"])
    def apply(self, request, *args, **kwargs):
        if not hasattr(request.user, "volunteer"):
            return Response(
                {
                    "detail": {
                        "You have to be logged in as a volunteer to perform this action."
                    }
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        job = self.get_object()
        if not models.JobApplication.objects.filter(
            job=job,
            volunteer=request.user.volunteer,
        ).exists():
            empty_positions = (
                job.vacancy
                - job.applications.filter(
                    status=models.JobApplicationStatus.Accepted
                ).count()
            )
            if job.end_date < timezone.now():
                return Response(
                    {"detail": {"Job has ended."}},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if empty_positions <= 0:
                return Response(
                    {"detail": _("No vacancy")},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            dob = request.user.volunteer.date_of_birth
            if job.age_limit is not None:
                if dob.replace(year=dob.year + job.age_limit) < timezone.now():
                    return Response(
                        {"detail": _("Ineligible due to age limit")},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

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


class StatisticsViewSet(
    viewsets.GenericViewSet,
):
    class JobFilterWithEndDate(JobFilter):
        date = django_filters.DateFromToRangeFilter(
            field_name="end_date", lookup_expr="range"
        )

    def count_by_criteria(self, key, model, qs):
        qs = qs.values(key).annotate(count=Count(key))
        counts_initial = {m: 0 for m in model}
        for pair in qs:
            if pair[key] is not None:
                counts_initial[model(pair[key])] = pair["count"]
            else:
                counts_initial["None"] = pair["count"]

        return {
            (str(k.label) if k != "None" else "None"): v
            for k, v in counts_initial.items()
        }

    def count_by_date_range(self, qs, start_date=None, end_date=None, field="date"):
        if not end_date:
            end_date = timezone.now()
        if not start_date:
            start_date = end_date - timedelta(days=10)

        dt = end_date - start_date
        dt_days = None
        threshold = 20
        for division in [1, 7, 30, 30 * 3, 30 * 6, 365, 365 * 5, 365 * 10]:
            if dt.days // division < threshold:
                dt_days = division
                break

        if not dt_days:
            dt_days = (end_date - start_date).days // threshold

        dt = timedelta(days=dt_days)

        if end_date < start_date:
            return iter(())

        while start_date < end_date:
            kwargs = {field + "__gte": start_date, field + "__lte": start_date + dt}
            yield (start_date, qs.filter(**kwargs).count())
            start_date += dt

    def list(self, request, *args, **kwargs):
        volunteer_qs = VolunteerProfileFilter(request.GET).qs
        job_qs = StatisticsViewSet.JobFilterWithEndDate(request.GET).qs
        incident_qs = IncidentFilter(request.GET).qs
        program_qs = ProgramFilter(request.GET).qs

        start_date = request.GET.get("date_after", None)
        end_date = request.GET.get("date_before", None)
        if start_date:
            start_date = timezone.make_aware(
                datetime.datetime.fromisoformat(start_date)
            )
        if end_date:
            end_date = timezone.make_aware(datetime.datetime.fromisoformat(end_date))

        return Response(
            {
                "volunteers": {
                    "total": volunteer_qs.count(),
                    "gender": self.count_by_criteria(
                        "gender", models.Gender, volunteer_qs
                    ),
                    "nationality": self.count_by_criteria(
                        "nationality", models.Nationality, volunteer_qs
                    ),
                    "blood_group": self.count_by_criteria(
                        "blood_group", models.BloodGroup, volunteer_qs
                    ),
                    "academic_qualification": self.count_by_criteria(
                        "academic_qualification",
                        models.AcademicQualification,
                        volunteer_qs,
                    ),
                    "category": self.count_by_criteria(
                        "category", models.VolunteerCategory, volunteer_qs
                    ),
                },
                "jobs": {
                    "total": job_qs.count(),
                    "status": self.count_by_criteria(
                        "status", models.JobStatus, job_qs
                    ),
                    "by_time": self.count_by_date_range(
                        job_qs, start_date, end_date, field="end_date"
                    ),
                },
                "incidents": {
                    "total": incident_qs.count(),
                    "by_time": self.count_by_date_range(
                        incident_qs,
                        start_date,
                        end_date,
                    ),
                },
                "programs": {
                    "total": program_qs.count(),
                    "by_time": self.count_by_date_range(
                        program_qs, start_date, end_date, field="incident__date"
                    ),
                },
            }
        )


class JobReportFilter(django_filters.FilterSet):
    job = django_filters.ModelChoiceFilter(
        label="Job",
        field_name="job",
        queryset=models.Job.objects.all(),
    )

    class Meta:
        model = models.JobReport
        fields = []


class JobReportViewSet(
    viewsets.GenericViewSet,
    viewsets.mixins.ListModelMixin,
    viewsets.mixins.RetrieveModelMixin,
    viewsets.mixins.CreateModelMixin,
    viewsets.mixins.UpdateModelMixin,
):
    queryset = models.JobReport.objects.all()
    serializer_class = serializers.JobReportSerializer
    filterset_class = JobReportFilter
    pagination_class = None

    def get_serializer_class(self):
        return {
            "create": serializers.JobReportCreateSerializer,
            "update": serializers.JobReportCreateSerializer,
        }.get(self.action, super().get_serializer_class())

    def get_permissions(self):
        permissions_classes = {
            "list": [permissions.IsAuthenticated],
            "retrieve": [incident_permissions.IsOwner],
            "create": [incident_permissions.IsVolunteer],
            "update": [incident_permissions.IsOwner],
        }.get(self.action, [permissions.AllowAny])
        return (permission() for permission in permissions_classes)

    def get_queryset(self):
        if self.request.user.is_superuser:
            return super().get_queryset()
        if hasattr(self.request.user, "volunteer"):
            return super().get_queryset().filter(
                volunteer=self.request.user.volunteer
            ) | super().get_queryset().filter(job__leader=self.request.user.volunteer)

        return super().get_queryset().none()


class NotificationViewSet(
    viewsets.GenericViewSet,
    viewsets.mixins.ListModelMixin,
    viewsets.mixins.RetrieveModelMixin,
):
    queryset = models.Notification.objects.all()
    serializer_class = serializers.NotificationSerializer
    pagination_class = None

    def get_permissions(self):
        permissions_classes = {
            "list": [permissions.IsAuthenticated],
            "retrieve": [incident_permissions.IsOwner],
            "view": [incident_permissions.IsOwner],
        }.get(self.action, [permissions.AllowAny])
        return (permission() for permission in permissions_classes)

    def get_queryset(self):
        if self.request.user.is_superuser:
            return super().get_queryset()
        return super().get_queryset().filter(user=self.request.user)

    @action(detail=True, methods=["post"])
    def view(self, request, *args, **kwargs):
        notification = self.get_object()
        notification.viewed = True
        notification.save()
        serializer_class = self.get_serializer_class()
        return Response(
            serializer_class(notification, context={"request": request}).data
        )
