import django_tables2
from incident.models import VolunteerProfile
from django_filters.views import FilterView
import django_filters
import federal.models
import incident.models


class VolunteerProfileFilter(django_filters.FilterSet):
    district = django_filters.ModelChoiceFilter(
        label="District",
        field_name="temporary_ward__municipality__district",
        queryset=federal.models.District.objects.all(),
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

    training_type = django_filters.ChoiceFilter(
        label="Training Type",
        field_name="training_type",
        choices=incident.models.TrainingType.choices,
    )

    class Meta:
        model = incident.models.VolunteerProfile
        fields = []


class VolunteerProfileTable(django_tables2.Table):
    name_ = django_tables2.Column(accessor="profile_image_preview_small")
    email = django_tables2.Column(accessor="user__email")

    class Meta:
        model = VolunteerProfile
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
    queryset = VolunteerProfile.objects.all().prefetch_related(
        "user", "temporary_ward", "permanent_ward"
    )
    filterset_class = VolunteerProfileFilter
    pagination_class = django_tables2.LazyPaginator
    paginate_by = 15

    def get_template_names(self):
        if self.request.htmx:
            template_name = "administrator/tables/table.html"
        else:
            template_name = "administrator/tables/volunteer_profile_table.html"

        return template_name
