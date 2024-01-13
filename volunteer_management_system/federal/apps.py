from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class FederalConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "federal"
    verbose_name = _("federal")
