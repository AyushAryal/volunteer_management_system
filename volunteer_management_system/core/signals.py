from django.contrib.sites.models import clear_site_cache
from django.db.models.signals import pre_delete, pre_save

from .models import SiteSettings

# Updating/Deleting site settings should also invalidate cache.
pre_save.connect(clear_site_cache, sender=SiteSettings)
pre_delete.connect(clear_site_cache, sender=SiteSettings)
