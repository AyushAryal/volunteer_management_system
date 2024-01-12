from types import DynamicClassAttribute

from ckeditor.fields import RichTextField
from django.contrib.auth import get_user_model
from django.contrib.gis.db import models as gis_models
from django.db import models
from django.utils.html import mark_safe
from django.utils.translation import gettext_lazy as _
from federal.models import Municipality


class Nationality(models.IntegerChoices):
    National, International = range(2)

    @DynamicClassAttribute
    def label(self):
        label = super().label
        return {
            "National": _("National"),
            "International": _("International"),
        }.get(label, _("None"))


class JobStatus(models.IntegerChoices):
    Completed, InProgress, NotAssigned = range(3)

    @DynamicClassAttribute
    def label(self):
        label = super().label
        return {
            "Completed": _("Completed"),
            "Inprogress": _("In Progress"),
            "Notassigned": _("Not Assigned"),
        }.get(label, _("None"))


class Gender(models.IntegerChoices):
    Male, Female, Other = range(3)

    @DynamicClassAttribute
    def label(self):
        label = super().label
        return {
            "Male": _("Male"),
            "Female": _("Female"),
            "Other": _("Other"),
        }.get(label, _("None"))


class BloodGroup(models.IntegerChoices):
    (
        O_Negative,
        O_Positive,
        A_Negative,
        A_Positive,
        B_Positive,
        B_Negative,
        AB_Negative,
        AB_Positive,
    ) = range(8)

    @DynamicClassAttribute
    def label(self):
        label = super().label
        return {
            "O Negative": _("O Negative"),
            "O Positive": _("O Positive"),
            "A Negative": _("A Negative"),
            "A Positive": _("A Positive"),
            "B Negative": _("B Negative"),
            "B Positive": _("B Positive"),
            "Ab Negative": _("AB Negative"),
            "Ab Positive": _("AB Positive"),
        }.get(label, _("None"))


class Profile(models.Model):
    class Meta:
        verbose_name = _("Volunteer profile")
        verbose_name_plural = _("Volunteer profiles")

    user = models.OneToOneField(
        get_user_model(),
        on_delete=models.CASCADE,
        related_name="customer",
        primary_key=True,
        blank=True,
        verbose_name=_("user"),
    )

    full_name = models.CharField(
        max_length=20, null=False, blank=False, verbose_name=_("full name")
    )

    profile_image = models.ImageField(
        upload_to="uploads/images/profile_images/",
        blank=True,
        verbose_name=_("profile image"),
    )

    date_of_birth = models.DateField(
        null=True, blank=True, verbose_name=_("date of birth")
    )

    gender = models.SmallIntegerField(
        choices=Gender.choices,
        default=Gender.Male,
        verbose_name=_("gender"),
    )

    blood_group = models.SmallIntegerField(
        choices=BloodGroup.choices,
        default=BloodGroup.B_Positive,
        verbose_name=_("blood type"),
    )

    nationality = models.SmallIntegerField(
        choices=Nationality.choices,
        verbose_name=_("nationality"),
    )

    municipality = models.ForeignKey(
        Municipality, on_delete=models.CASCADE, verbose_name=_("municipality")
    )

    def __str__(self):
        return str(self.full_name)

    def profile_image_preview(self):
        return mark_safe(
            f'<img src="{self.profile_image.url}" style="max-height: 200px;" />'
        )


class Incident(models.Model):
    class Meta:
        verbose_name = _("Incident")
        verbose_name_plural = _("Incidents")

    name = models.CharField(max_length=30, verbose_name=_("name"))
    description = RichTextField(verbose_name=_("description"))
    date = models.DateTimeField(verbose_name=_("date"))
    municipality = models.ForeignKey(
        Municipality, on_delete=models.CASCADE, verbose_name=_("municipality")
    )
    point = gis_models.PointField(verbose_name=_("point"))

    def __str__(self):
        return str(self.name)


class Programme(models.Model):
    class Meta:
        verbose_name = _("Programme")
        verbose_name_plural = _("Programmes")

    name = models.CharField(max_length=30)
    description = RichTextField()
    incident = models.ForeignKey(Incident, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.name)


class Job(models.Model):
    class Meta:
        verbose_name = _("Job")
        verbose_name_plural = _("Jobs")

    name = models.CharField(max_length=64, verbose_name=_("name"))
    start_date = models.DateTimeField(verbose_name=_("start date"))
    end_date = models.DateTimeField(verbose_name=_("end date"))
    vacancy = models.PositiveIntegerField(verbose_name=_("vacancy"))
    description = RichTextField(verbose_name=_("description"))
    status = models.SmallIntegerField(
        choices=JobStatus.choices,
        verbose_name=_("status"),
    )
    programme = models.ForeignKey(Programme, on_delete=models.CASCADE)
    volunteers = models.ManyToManyField(
        Profile,
        related_name="jobs",
        blank=True,
        verbose_name=_("Volunteers Employed"),
    )

    def __str__(self):
        return str(self.name)
