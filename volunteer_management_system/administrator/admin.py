from django.contrib import admin
from leaflet.admin import LeafletGeoAdmin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.sites.models import Site
from django.utils.translation import gettext_lazy as _

import federal.models
import incident.models


class ProfileInline(admin.StackedInline):
    model = incident.models.Profile
    can_delete = False
    extra = 0


class JobAdmin(admin.ModelAdmin):
    model = incident.models.Job
    list_display = ("__str__", "vacancy", "volunteer_employed", "status")

    def volunteer_employed(self, obj):
        return obj.volunteers.count()


class IncidentAdmin(LeafletGeoAdmin):
    model = incident.models.Incident
    list_display = ("__str__", "location", "formatted_date")

    def formatted_date(self, obj):
        return obj.date.strftime("%Y-%m-%d")

    formatted_date.short_description = "Date"


class ProgrammeAdmin(admin.ModelAdmin):
    model = incident.models.Programme
    list_display = ("__str__", "incident")


class UserAdmin(BaseUserAdmin):
    inlines = (ProfileInline,)
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
admin_site.register(federal.models.Ward)

admin_site.register(incident.models.Incident, IncidentAdmin)
admin_site.register(incident.models.Programme, ProgrammeAdmin)
admin_site.register(incident.models.Job, JobAdmin)
admin_site.register(get_user_model(), UserAdmin)
