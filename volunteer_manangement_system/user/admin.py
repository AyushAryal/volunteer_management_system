from django.contrib import admin
from leaflet.admin import LeafletGeoAdmin
from .models import Profile, Incident, Programme, Job


class ProfileAdmin(admin.ModelAdmin):
    model = Profile
    list_display = ("__str__", "gender", "dob")


class JobAdmin(admin.ModelAdmin):
    model = Job
    list_display = ("__str__", "vacancy", "volunteer_employed", "status")

    def volunteer_employed(self, obj):
        return obj.volunteers.count()

class IncidentAdmin(LeafletGeoAdmin):
    model = Incident
    list_display = ("__str__", "location", "formatted_date")

    def formatted_date(self, obj):
        return obj.date.strftime("%Y-%m-%d")

    formatted_date.short_description = "Date"


class ProgrammeAdmin(admin.ModelAdmin):
    model = Programme
    list_display = ("__str__", "incident")


# Register your models here.
admin.site.register(Profile, ProfileAdmin)
admin.site.register(Incident, IncidentAdmin)
admin.site.register(Programme, ProgrammeAdmin)
admin.site.register(Job, JobAdmin)
