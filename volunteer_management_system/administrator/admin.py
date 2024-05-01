import federal.models
import incident.models
from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.sites.models import Site
from django.utils.translation import gettext_lazy as _
from leaflet.admin import LeafletGeoAdmin


def get_user_controlled_municipalities(user):
    municipalities = []
    if hasattr(user, "province_admin"):
        province = user.province_admin
        municipalities = federal.models.Municipality.objects.filter(
            district__province=province
        )
    elif hasattr(user, "district_admin"):
        district = user.district_admin
        municipalities = federal.models.Municipality.objects.filter(district=district)
    elif hasattr(user, "municipality_admin"):
        district = user.municipality_admin
        municipalities = [user.municipality_admin]
    return municipalities


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
    list_display = ("__str__", "vacancy", "volunteer_employed", "status")

    def volunteer_employed(self, obj):
        return obj.volunteers.count()

    def get_queryset(self, request):
        if request.user.is_superuser:
            return super().get_queryset(request)
        municipalities = get_user_controlled_municipalities(request.user)
        return self.model.objects.filter(
            program__incident__municipality__in=municipalities
        )


class IncidentAdmin(LeafletGeoAdmin):
    model = incident.models.Incident
    list_display = ("__str__", "municipality", "formatted_date")

    def formatted_date(self, incident):
        return incident.date.strftime("%Y-%m-%d")

    def get_queryset(self, request):
        if request.user.is_superuser:
            return super().get_queryset(request)
        municipalities = get_user_controlled_municipalities(request.user)
        return self.model.objects.filter(municipality__in=municipalities)

    formatted_date.short_description = "Date"


class ProgramAdmin(admin.ModelAdmin):
    model = incident.models.Program
    list_display = ("__str__", "incident")

    def get_queryset(self, request):
        if request.user.is_superuser:
            return super().get_queryset(request)
        municipalities = get_user_controlled_municipalities(request.user)
        return self.model.objects.filter(incident__municipality__in=municipalities)


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
admin_site.register(federal.models.Province)
admin_site.register(federal.models.District)
admin_site.register(federal.models.Municipality)

admin_site.register(incident.models.Incident, IncidentAdmin)
admin_site.register(incident.models.Program, ProgramAdmin)
admin_site.register(incident.models.Job, JobAdmin)
admin_site.register(get_user_model(), UserAdmin)
