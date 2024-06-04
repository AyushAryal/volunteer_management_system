import federal.models
import incident.models
from django import template
from django.contrib.auth import get_user_model
from django.contrib.sites.models import Site

register = template.Library()


@register.filter()
def modelicon(model):
    return {
        get_user_model(): "fa-solid fa-user",
        incident.models.SiteContent: "fa-solid fa-book",
        incident.models.VolunteerProfile: "fa-solid fa-id-card-clip",
        incident.models.Incident: "fa-solid fa-user-injured",
        incident.models.Job: "fa-solid fa-briefcase",
        incident.models.JobApplication: "fa-solid fa-pen",
        incident.models.JobReport: "fa-solid fa-book-open",
        incident.models.Program: "fa-solid fa-tent",
        incident.models.Notification: "fa-solid fa-bell",
        federal.models.Province: "fa-solid fa-landmark-dome",
        federal.models.District: "fa-solid fa-landmark-dome",
        federal.models.Municipality: "fa-solid fa-landmark-dome",
        federal.models.Ward: "fa-solid fa-landmark-dome",
        Site: "fa-solid fa-globe",
    }.get(model.get("model", None), "fa-solid fa-box")


@register.filter()
def appicon(app):
    return {
        "federal": "fa-solid fa-map-location-dot",
        "incident": "fa-solid fa-clock",
        "authentication": "fa-solid fa-lock",
        "sites": "fa-solid fa-globe",
    }.get(app["app_label"], "fa-solid fa-box")
