from ckeditor.fields import RichTextField
from django.contrib.auth import get_user_model
from django.contrib.gis.db import models as gis_models
from django.db import models
from django.utils.translation import gettext_lazy as _
from federal.models import Municipality, Ward


class Profile(models.Model):
    class Meta:
        verbose_name = _("Customer profile")
        verbose_name_plural = _("Customer profiles")

    user = models.OneToOneField(
        get_user_model(),
        on_delete=models.CASCADE,
        related_name="customer",
        primary_key=True,
        blank=True,
        verbose_name=_("user"),
    )
    user = models.OneToOneField(get_user_model(), on_delete=models.CASCADE)
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
    blood_type = models.CharField(
        max_length=3,
        choices=(
            ("ON", "O Negative"),
            ("OP", "O Positive"),
            ("AN", "A Negative"),
            ("AP", "A Positive"),
            ("BN", "B Negative"),
            ("BP", "B Positive"),
            ("ABN", "AB Negative"),
            ("ABP", "AB Positive"),
        ),
    )
    nationality = models.CharField(
        max_length=1,
        choices=(
            ("N", "Nepalese"),
            ("I", "International"),
        ),
    )
    municipality = models.ForeignKey(Municipality, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.name)


class Incident(models.Model):
    name = models.CharField(max_length=30)
    description = RichTextField()
    date = models.DateTimeField()
    location = models.ForeignKey(Ward, on_delete=models.CASCADE)
    point = gis_models.PointField()
    # severity = models.CharField(
    #     max_length=1,
    #     choices=(
    #         ("M", "Mild Attention"),
    #         ("I", "Immediate Attention"),
    #         ("C", "Critical Case"),
    #     ),
    # )

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
