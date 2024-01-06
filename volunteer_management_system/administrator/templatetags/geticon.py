from django import template

from django.contrib.auth import get_user_model
from user.models import (
    Profile,
    Incident,
    Job,
)

register = template.Library()


@register.filter()
def modelicon(model):
    return {
        get_user_model(): "fa-solid fa-user",
        Profile: "fa-solid fa-id-card-clip",
        Incident: "fa-solid fa-map-pin",
        Job: "fa-solid fa-briefcase",
    }.get(model.get("model", None), "fa-solid fa-box")


@register.filter()
def appicon(app):
    return {
        "user": "fa-solid fa-user",
    }.get(app["app_label"], "fa-solid fa-box")
