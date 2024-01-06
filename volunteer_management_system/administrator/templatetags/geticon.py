from django import template

from django.contrib.auth import get_user_model
import federal.models
import incident.models

register = template.Library()


@register.filter()
def modelicon(model):
    return {
        get_user_model(): "fa-solid fa-user",
        incident.models.Profile: "fa-solid fa-id-card-clip",
        incident.models.Incident: "fa-solid fa-map-pin",
        incident.models.Job: "fa-solid fa-briefcase",
        federal.models.Province: "fa-solid fa-map",
    }.get(model.get("model", None), "fa-solid fa-box")


@register.filter()
def appicon(app):
    return {
        "federal": "fa-solid fa-map",
        "incident": "fa-solid fa-clock",
    }.get(app["app_label"], "fa-solid fa-box")
