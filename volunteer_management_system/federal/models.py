from django.contrib.gis.db import models as gis_models
from django.db import models
from django.utils.translation import gettext_lazy as _


class Province(models.Model):
    class Meta:
        verbose_name = _("Province")
        verbose_name_plural = _("Provinces")

    name = models.CharField(max_length=100, verbose_name=_("name"))

    shape = gis_models.PolygonField(verbose_name=_("shape"))

    def __str__(self):
        return str(self.name)


class District(models.Model):
    class Meta:
        verbose_name = _("District")
        verbose_name_plural = _("Districts")

    name = models.CharField(max_length=100, verbose_name=_("name"))
    province = models.ForeignKey(
        Province, on_delete=models.CASCADE, verbose_name=_("province")
    )
    shape = gis_models.PolygonField(verbose_name=_("shape"))

    def __str__(self):
        return str(self.name)


class Municipality(models.Model):
    class Meta:
        verbose_name = _("Municipality")
        verbose_name_plural = _("Municipalities")

    name = models.CharField(max_length=100, verbose_name=_("name"))
    district = models.ForeignKey(
        District, on_delete=models.CASCADE, verbose_name=_("district")
    )

    def __str__(self):
        return str(self.name)


class Ward(models.Model):
    class Meta:
        verbose_name = _("Ward")
        verbose_name_plural = _("Wards")

    name = models.CharField(max_length=100)
    municipality = models.ForeignKey(Municipality, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.name)
