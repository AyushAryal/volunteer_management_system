from django.db import models

from django.contrib.gis.db import models as gis_models


from ckeditor.fields import RichTextField


class Profile(models.Model):
    name = models.CharField(max_length=20, null=False, blank=False)
    dob = models.DateField(null=True, blank=True)
    gender = models.CharField(
        max_length=1,
        choices=(
            ("M", "Male"),
            ("F", "Female"),
        ),
        default="M",
    )

    def __str__(self):
        return str(self.name)


class Incident(models.Model):
    name = models.CharField(max_length=30)
    description = RichTextField()
    date = models.DateTimeField()
    location = models.CharField(max_length=10)
    point = gis_models.PointField()

    def __str__(self):
        return str(self.name)


class Programme(models.Model):
    name = models.CharField(max_length=30)
    description = RichTextField()
    incident = models.ForeignKey(Incident, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.name)


class Job(models.Model):
    name = models.CharField(max_length=64)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    vacancy = models.PositiveIntegerField()
    description = RichTextField()
    status = models.CharField(
        max_length=1,
        choices=(
            ("C", "Completed"),
            ("P", "In Progress"),
            ("U", "Not Assigned"),
        ),
    )
    programme = models.ForeignKey(Programme, on_delete=models.CASCADE)
    volunteers = models.ManyToManyField(
        Profile,
        related_name="jobs",
        blank=True,
        verbose_name="Volunteers Employed",
    )

    def __str__(self):
        return str(self.name)
