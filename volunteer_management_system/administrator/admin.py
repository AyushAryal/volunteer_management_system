import csv
import federal.models
import incident.models
from django.contrib import admin
from django.contrib.auth import get_user, get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.sites.models import Site
from django.utils.translation import gettext_lazy as _
from django.utils.html import mark_safe
from django.http import HttpResponse
from leaflet.admin import LeafletGeoAdmin
from django.urls import path
from administrator.forms import (
    ProgramForm,
    JobForm,
    JobApplicationForm,
)
from administrator.tables import VolunteerProfileTableView


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


def csv_response_from_queryset(queryset, filename="export"):
    response = HttpResponse()
    response["Content-Disposition"] = f"attachment;filename={filename}.csv"
    writer = csv.writer(response)
    field_names = [field.name for field in queryset.model._meta.fields]
    writer.writerow(field_names)
    for obj in queryset:
        writer.writerow([getattr(obj, field) for field in field_names])
    return response


class MainAdminSite(admin.AdminSite):
    site_title = "Dashboard"
    site_header = "Admin Dashboard"
    index_title = "Volunteer Management System"

    def export_volunteer_csv(self, request):
        wards = get_user_controlled_wards(request.user)
        qs = incident.models.VolunteerProfile.objects.filter(temporary_ward__in=wards)
        return csv_response_from_queryset(qs)

    def get_urls(self):
        urls = super().get_urls()
        my_urls = [
            path(
                "table/",
                self.admin_view(VolunteerProfileTableView.as_view()),
                name="volunteer_profile_table",
            ),
            path(
                "export/volunteer",
                self.admin_view(self.export_volunteer_csv),
                name="export_volunteer_csv",
            ),
        ]
        return my_urls + urls

    def index(self, request, extra_context=None):
        if not extra_context:
            extra_context = {}

        extra_context[
            "volunteers"
        ] = incident.models.VolunteerProfile.objects.all().prefetch_related(
            "user",
            "temporary_ward",
            "permanent_ward",
        )
        return super().index(request, extra_context)


admin_site = MainAdminSite()

admin_site.register(Site)


class CertificateInline(admin.StackedInline):
    model = incident.models.Certificate
    can_delete = True
    extra = 0


class CitizenshipInline(admin.StackedInline):
    model = incident.models.Citizenship
    can_delete = True
    extra = 0


class PassportInline(admin.StackedInline):
    model = incident.models.Passport
    can_delete = True
    extra = 0


class NationalIdInline(admin.StackedInline):
    model = incident.models.NationalId
    can_delete = True
    extra = 0


class OtherIdentificationDocumentInline(admin.StackedInline):
    model = incident.models.OtherIdentificationDocument
    can_delete = True
    extra = 0


class VolunteerProfileInline(admin.StackedInline):
    model = incident.models.VolunteerProfile
    readonly_fields = ("profile_image_preview",)
    can_delete = False
    extra = 0

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if not hasattr(self, "cached_wards"):
            self.cached_wards = [
                (i.pk, str(i))
                for i in federal.models.Ward.objects.all().prefetch_related(
                    "municipality"
                )
            ]

        field = super(VolunteerProfileInline, self).formfield_for_foreignkey(
            db_field, request, **kwargs
        )
        if db_field.name == "permanent_ward":
            field.choices = self.cached_wards
        elif db_field.name == "temporary_ward":
            field.choices = self.cached_wards
        return field


class JobAdmin(admin.ModelAdmin):
    model = incident.models.Job
    form = JobForm

    list_display = (
        "__str__",
        "vacancy_",
        "start_date",
        "end_date",
        "leader_",
        "status",
    )
    search_fields = ("name",)

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        object_id = request.resolver_match.kwargs.get("object_id", None)
        if db_field.name == "leader" and object_id:
            job = self.get_object(request, object_id)
            accepted_applicants = incident.models.JobApplication.objects.filter(
                job=job, status=incident.models.JobApplicationStatus.Accepted
            ).values_list("volunteer_id", flat=True)
            kwargs["queryset"] = incident.models.VolunteerProfile.objects.filter(
                pk__in=accepted_applicants
            )
        return super(JobAdmin, self).formfield_for_foreignkey(
            db_field, request, **kwargs
        )

    def vacancy_(self, job):
        return f"{job.filled()}/{job.vacancy}"

    def leader_(self, job):
        return job.leader.profile_image_preview_small() if job.leader else "-"

    def get_queryset(self, request):
        if request.user.is_superuser:
            return super().get_queryset(request)
        wards = get_user_controlled_wards(request.user)
        return self.model.objects.filter(program__incident__ward__in=wards)


class JobApplicationAdmin(admin.ModelAdmin):
    model = incident.models.JobApplication
    form = JobApplicationForm
    list_display = ("__str__", "applicant", "application_status")
    search_fields = (
        "job__name",
        "volunteer__first_name",
        "volunteer__last_name",
    )

    def application_status(self, application):
        status = incident.models.JobApplicationStatus(application.status)
        color_map = {
            incident.models.JobApplicationStatus.Accepted: "text-success",
            incident.models.JobApplicationStatus.Rejected: "text-danger",
            incident.models.JobApplicationStatus.Pending: "text-secondary",
            incident.models.JobApplicationStatus.Cancelled: "text-muted",
        }
        icon_map = {
            incident.models.JobApplicationStatus.Accepted: "fa-regular fa-circle-check",
            incident.models.JobApplicationStatus.Rejected: "fa fa-xmark",
            incident.models.JobApplicationStatus.Pending: "fa fa-clock",
            incident.models.JobApplicationStatus.Cancelled: "fa fa-ban",
        }
        return mark_safe(
            f"""
            <span class="{color_map.get(status, "text-fg")}">
            <i class="{icon_map.get(status, "")}"></i>
            <strong>
            {status.label}
            </strong> </span>
            """
        )

    def applicant(self, application):
        return application.volunteer.profile_image_preview_small()

    def get_queryset(self, request):
        if request.user.is_superuser:
            return super().get_queryset(request)
        wards = get_user_controlled_wards(request.user)
        return self.model.objects.filter(job__program__incident__ward__in=wards)


class NotificationAdmin(admin.ModelAdmin):
    model = incident.models.Notification
    list_display = ("__str__", "user", "date", "viewed")


class IncidentAdmin(LeafletGeoAdmin):
    model = incident.models.Incident
    list_display = ("__str__", "ward", "formatted_date")
    search_fields = ("name", "ward__municipality__name")

    def get_form(self, request, obj, *args, **kwargs):
        return super().get_form(request, obj, *args, **kwargs)

    def formatted_date(self, incident):
        return incident.date.strftime("%Y-%m-%d")

    def get_queryset(self, request):
        if request.user.is_superuser:
            return super().get_queryset(request)
        wards = get_user_controlled_wards(request.user)
        return self.model.objects.filter(ward__in=wards)

    formatted_date.short_description = "Date"


class ProgramAdmin(admin.ModelAdmin):
    model = incident.models.Program
    form = ProgramForm
    list_display = ("__str__", "incident")
    search_fields = ("name", "incident__name", "incident__ward__municipality__name")

    def get_queryset(self, request):
        if request.user.is_superuser:
            return super().get_queryset(request)
        wards = get_user_controlled_wards(request.user)
        return self.model.objects.filter(incident__ward__in=wards)


class UserAdmin(BaseUserAdmin):
    inlines = (
        VolunteerProfileInline,
        CitizenshipInline,
        PassportInline,
        NationalIdInline,
        OtherIdentificationDocumentInline,
        CertificateInline,
    )
    list_display = ("email", "email_verified")
    list_filter = ("is_superuser", "is_active", "email_verified")
    fieldsets = (
        (_("Personal info"), {"fields": ("email", "password", "email_verified")}),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "password1", "password2"),
            },
        ),
    )
    ordering = ("email",)
    search_fields = ("email",)


class ProvinceAdmin(admin.ModelAdmin):
    model = federal.models.Province
    search_fields = ("name",)


class DistrictAdmin(admin.ModelAdmin):
    model = federal.models.District
    list_display = ("__str__", "province")
    search_fields = ("name", "province__name")


class MunicipalityAdmin(admin.ModelAdmin):
    model = federal.models.Municipality
    list_display = ("__str__", "district")
    search_fields = ("name", "district__name")


class WardAdmin(admin.ModelAdmin):
    model = federal.models.Ward
    list_display = ("__str__", "municipality")
    search_fields = ("name", "municipality__name")
    ordering = ("municipality", "name")


admin_site.register(federal.models.Province, ProvinceAdmin)
admin_site.register(federal.models.District, DistrictAdmin)
admin_site.register(federal.models.Municipality, MunicipalityAdmin)
admin_site.register(federal.models.Ward, WardAdmin)

admin_site.register(incident.models.SiteContent)
admin_site.register(incident.models.Incident, IncidentAdmin)
admin_site.register(incident.models.Program, ProgramAdmin)
admin_site.register(incident.models.JobApplication, JobApplicationAdmin)
admin_site.register(incident.models.Job, JobAdmin)
admin_site.register(incident.models.Notification, NotificationAdmin)

admin_site.register(get_user_model(), UserAdmin)
