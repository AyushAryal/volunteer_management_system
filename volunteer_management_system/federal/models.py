from django.db import models

from django.contrib.gis.db import models as gis_models


class Province(models.Model):
    name = models.CharField(max_length=25)
    shape = gis_models.PolygonField()

    def __str__(self):
        return str(self.name)


class District(models.Model):
    name = models.CharField(max_length=25)
    province = models.ForeignKey(Province, on_delete=models.CASCADE)
    shape = gis_models.PolygonField()

    def __str__(self):
        return str(self.name)


class Municipality(models.Model):
    name = models.CharField(max_length=25)
    district = models.ForeignKey(District, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.name)
