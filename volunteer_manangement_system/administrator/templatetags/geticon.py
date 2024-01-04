from django import template

from django.contrib.auth import get_user_model

register = template.Library()


@register.filter()
def modelicon(model):
    return {
        get_user_model(): "fa-solid fa-user",
        # Cart: "fa-solid fa-cart-shopping",
    }.get(model.get("model", None), "fa-solid fa-box")


@register.filter()
def appicon(app):
    return {
        # "user": "fa-solid fa-user",
    }.get(app["app_label"], "fa-solid fa-box")
