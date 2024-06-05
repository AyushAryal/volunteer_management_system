from django import template

register = template.Library()


@register.filter
def salutation_name(user, *args, **kwargs):
    if hasattr(user, "volunteer"):
        return user.volunteer.first_name
    return "User"
