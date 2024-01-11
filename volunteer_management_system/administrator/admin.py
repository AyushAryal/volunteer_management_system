from django.contrib import admin
from leaflet.admin import LeafletGeoAdmin

import federal.models
import incident.models


class ProfileAdmin(admin.ModelAdmin):
    model = incident.models.Profile
    list_display = ("__str__", "gender", "dob")


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


class MainAdminSite(admin.AdminSite):
    site_title = "Dashboard"
    site_header = "Admin Dashboard"
    index_title = "Volunteer Management System"


admin_site = MainAdminSite()

admin_site.register(federal.models.Province)
admin_site.register(federal.models.District)
admin_site.register(federal.models.Municipality)
admin_site.register(federal.models.Ward)

admin_site.register(incident.models.Profile, ProfileAdmin)
admin_site.register(incident.models.Incident, IncidentAdmin)
admin_site.register(incident.models.Programme, ProgrammeAdmin)
admin_site.register(incident.models.Job, JobAdmin)
