from django.contrib import admin
from leaflet.admin import LeafletGeoAdmin
from . import models


class ProfileAdmin(admin.ModelAdmin):
    model = models.Profile
    list_display = ("__str__", "gender", "dob")


class JobAdmin(admin.ModelAdmin):
    model = models.Job
    list_display = ("__str__", "vacancy", "volunteer_employed", "status")

    def volunteer_employed(self, obj):
        return obj.volunteers.count()


class IncidentAdmin(LeafletGeoAdmin):
    model = models.Incident
    list_display = ("__str__", "location", "formatted_date")

    def formatted_date(self, obj):
        return obj.date.strftime("%Y-%m-%d")

    formatted_date.short_description = "Date"


class ProgrammeAdmin(admin.ModelAdmin):
    model = models.Programme
    list_display = ("__str__", "incident")


# Register your models here.
admin.site.register(models.Profile, ProfileAdmin)
admin.site.register(models.Incident, IncidentAdmin)
admin.site.register(models.Programme, ProgrammeAdmin)
admin.site.register(models.Job, JobAdmin)
admin.site.register(models.Province)
admin.site.register(models.District)
