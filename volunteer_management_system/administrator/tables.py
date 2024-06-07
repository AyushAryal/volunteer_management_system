from django.urls import reverse_lazy
from django.utils.translation import gettext_lazy as _
import django_tables2
from django_filters.views import FilterView
import django_filters
import federal.models
import incident.models


def get_user_controlled_wards(user):
    wards = []
    if user.is_superuser:
        return federal.models.Ward.objects.all()
    elif hasattr(user, "province_admin"):
        province = user.province_admin
        wards = federal.models.Ward.objects.filter(
            municipality__district__province=province
        )
    elif hasattr(user, "district_admin"):
        district = user.district_admin
        wards = federal.models.Ward.objects.filter(municipality__district=district)
    elif hasattr(user, "municipality_admin"):
        municipality = user.municipality_admin
        wards = federal.models.Ward.objects.filter(municipality=municipality)
    return wards


class VolunteerProfileFilter(django_filters.FilterSet):
    municipality = django_filters.ModelChoiceFilter(
        label="Municipality",
        field_name="temporary_ward__municipality",
        queryset=federal.models.Municipality.objects.all(),
    )

    blood_group = django_filters.ChoiceFilter(
        label="Blood Group",
        field_name="blood_group",
        choices=incident.models.BloodGroup.choices,
    )

    gender = django_filters.ChoiceFilter(
        label="Gender",
        field_name="gender",
        choices=incident.models.Gender.choices,
    )

    category = django_filters.ChoiceFilter(
        label="Category",
        field_name="category",
        choices=incident.models.VolunteerCategory.choices,
    )

    training = django_filters.ChoiceFilter(
        label="Training",
        field_name="user__trainings__category",
        choices=incident.models.TrainingCategory.choices,
    )

    class Meta:
        model = incident.models.VolunteerProfile
        fields = []


class VolunteerProfileTable(django_tables2.Table):
    url = reverse_lazy("admin:volunteer_profile_table")
    name_ = django_tables2.Column(accessor="profile_image_preview_small")
    email = django_tables2.Column(accessor="user__email")

    class Meta:
        model = incident.models.VolunteerProfile
        template_name = "administrator/tables/bootstrap5_htmx.html"
        fields = (
            "name_",
            "email",
            "gender",
            "contact_number",
            "temporary_ward",
            "permanent_ward",
            "blood_group",
            "category",
        )
        attrs = {"class": "table-striped"}


class VolunteerProfileTableView(django_tables2.SingleTableMixin, FilterView):
    table_class = VolunteerProfileTable
    queryset = incident.models.VolunteerProfile.objects.all().prefetch_related(
        "user", "temporary_ward", "permanent_ward"
    )
    filterset_class = VolunteerProfileFilter
    pagination_class = django_tables2.LazyPaginator
    paginate_by = 15
    template_name = "administrator/tables/volunteer_profile_table.html"

    def get_queryset(self):
        wards = get_user_controlled_wards(self.request.user)
        return incident.models.VolunteerProfile.objects.filter(temporary_ward__in=wards)


class JobApplicationFilter(django_filters.FilterSet):
    municipality = django_filters.ModelChoiceFilter(
        label="Municipality",
        field_name="job__program__incident__ward__municipality",
        queryset=federal.models.Municipality.objects.all(),
    )

    status = django_filters.ChoiceFilter(
        label="Status",
        field_name="status",
        choices=incident.models.JobApplicationStatus.choices,
    )

    class Meta:
        model = incident.models.JobApplication
        fields = []


class JobApplicationTable(django_tables2.Table):
    url = reverse_lazy("admin:job_application_table")
    applicant = django_tables2.Column(
        verbose_name=_("Applicant Email"),
        accessor="volunteer__user__email",
    )
    name = django_tables2.Column(
        verbose_name=_("Job"),
        accessor="job__name",
    )
    incident = django_tables2.Column(
        verbose_name=_("Incident"),
        accessor="job__program__incident__name",
    )
    leader = django_tables2.Column(
        verbose_name=_("Leader"),
        accessor="job__leader__user__email",
    )
    leader_name = django_tables2.Column(
        verbose_name=_("Leader name"),
        accessor="job__leader__first_name",
    )
    start_date = django_tables2.Column(
        verbose_name=_("Start date"),
        accessor="job__start_date",
    )
    end_date = django_tables2.Column(
        verbose_name=_("End date"),
        accessor="job__end_date",
    )
    job_status = django_tables2.Column(
        verbose_name=_("Job status"),
        accessor="job__status",
    )
    status = django_tables2.Column(
        verbose_name=_("Status"),
        accessor="status",
    )

    class Meta:
        model = incident.models.JobApplication
        template_name = "administrator/tables/bootstrap5_htmx.html"
        fields = (
            "applicant",
            "name",
            "incident",
            "leader",
            "leader_name",
            "start_date",
            "end_date",
            "job_status",
            "status",
        )
        attrs = {"class": "table-striped"}


class JobApplicationTableView(django_tables2.SingleTableMixin, FilterView):
    table_class = JobApplicationTable
    queryset = incident.models.JobApplication.objects.all().prefetch_related(
        "volunteer", "job"
    )
    filterset_class = JobApplicationFilter
    pagination_class = django_tables2.LazyPaginator
    paginate_by = 15
    template_name = "administrator/tables/job_application_table.html"

    def get_queryset(self):
        wards = get_user_controlled_wards(self.request.user)
        return incident.models.JobApplication.objects.filter(
            job__program__incident__ward__in=wards
        )
