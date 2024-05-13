import federal.models
import incident.models
from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.sites.models import Site
from django.utils.translation import gettext_lazy as _
from leaflet.admin import LeafletGeoAdmin


def get_user_controlled_wards(user):
    wards = []
    if hasattr(user, "province_admin"):
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


class VolunteerProfileInline(admin.StackedInline):
    model = incident.models.VolunteerProfile
    readonly_fields = ("profile_image_preview",)
    can_delete = False
    extra = 0


class JobAdmin(admin.ModelAdmin):
    model = incident.models.Job
    list_display = ("__str__", "vacancy", "leader", "status")

    def leader(self, obj):
        return obj.leader

    def get_queryset(self, request):
        if request.user.is_superuser:
            return super().get_queryset(request)
        wards = get_user_controlled_wards(request.user)
        return self.model.objects.filter(program__incident__ward__in=wards)


class JobApplicationAdmin(admin.ModelAdmin):
    model = incident.models.JobApplication
    list_display = ("__str__", "job", "volunteer", "status")

    def get_queryset(self, request):
        if request.user.is_superuser:
            return super().get_queryset(request)
        wards = get_user_controlled_wards(request.user)
        return self.model.objects.filter(job__program__incident__ward__in=wards)


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


class MainAdminSite(admin.AdminSite):
    site_title = "Dashboard"
    site_header = "Admin Dashboard"
    index_title = "Volunteer Management System"


admin_site = MainAdminSite()

admin_site.register(Site)


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


admin_site.register(federal.models.Province, ProvinceAdmin)
admin_site.register(federal.models.District, DistrictAdmin)
admin_site.register(federal.models.Municipality, MunicipalityAdmin)
admin_site.register(federal.models.Ward, WardAdmin)

admin_site.register(incident.models.SiteContent)
admin_site.register(incident.models.Incident, IncidentAdmin)
admin_site.register(incident.models.Program, ProgramAdmin)
admin_site.register(incident.models.JobApplication, JobApplicationAdmin)
admin_site.register(incident.models.Job, JobAdmin)

admin_site.register(get_user_model(), UserAdmin)
