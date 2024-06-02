from types import DynamicClassAttribute

from django.contrib.auth import get_user, get_user_model
from django.templatetags.static import static
from django.contrib.gis.db import models as gis_models
from django.db import models
from django.utils.html import mark_safe
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

from django_ckeditor_5.fields import CKEditor5Field
from phonenumber_field.modelfields import PhoneNumberField

import federal.models


class SiteContent(models.Model):
    label = models.CharField(
        primary_key=True,
        max_length=100,
        verbose_name=_("label"),
        blank=False,
    )
    content = CKEditor5Field("content", config_name="extends")

    def __str__(self):
        return self.label


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


class TrainingCategory(models.IntegerChoices):
    (
        Rescue,
        ReliefDistribution,
        Evacuation,
        HealthAndSafety,
        Logistics,
        SoftSkills,
        Leadership,
        TeamTraining,
        Management,
        QualityTraining,
        Humanitarian,
        FamilyReunification,
        MotorVehicleOperator,
        Other,
    ) = range(14)

    @DynamicClassAttribute
    def label(self):
        label = super().label
        return {
            "Rescue": _("Rescue"),
            "Reliefdistribution": _("Relief Distribution"),
            "Evacuation": _("Evacuation"),
            "Other": _("Other"),
            "Healthandsafety": _("Health and safety"),
            "Logistics": _("Logistics"),
            "Softskills": _("Soft skills"),
            "Leadership": _("Leadership"),
            "Teamtraining": _("Team Training"),
            "Management": _("Management"),
            "Qualitytraining": _("Quality Training"),
            "Humanitarian": _("Humanitarian"),
            "Familyreunification": _("Family Reunification"),
            "Motorvehicleoperator": _("Motor Vehicle Operator"),
        }.get(label, _("None"))


class VolunteerCategory(models.IntegerChoices):
    (
        Student,
        Scout,
        RetiredAPF,
        RetiredArmy,
        RetiredGovernmentService,
        SeniorCitizen,
        Community,
        General,
    ) = range(8)

    @DynamicClassAttribute
    def label(self):
        label = super().label
        return {
            "Student": _("Student"),
            "Scout": _("Scout"),
            "Retiredapf": _("Retired APF"),
            "Retiredarmy": _("Retired Army"),
            "Retiredgovernmentservice": _("Retired Government Service"),
            "Seniorcitizen": _("Senior Citizen"),
            "Community": _("Community"),
            "General": _("General"),
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


class AcademicQualification(models.IntegerChoices):
    (
        SecondaryLevel,
        HighSchool,
        UnderGrad,
        Grad,
        Doctorate,
        PostDoc,
    ) = range(6)

    @DynamicClassAttribute
    def label(self):
        label = super().label
        return {
            "Secondarylevel": _("Secondary Level"),
            "Highschool": _("High School"),
            "Undergrad": _("Under Grad"),
            "Grad": _("Grad"),
            "Doctorate": _("Doctorate"),
            "Postdoc": _("Post Doc"),
        }.get(label, _("None"))


class BloodGroup(models.IntegerChoices):
    (
        O_Negative,
        O_Positive,
        A_Negative,
        A_Positive,
        B_Negative,
        B_Positive,
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


class Citizenship(models.Model):
    class Meta:
        verbose_name = _("Citizenship")
        verbose_name_plural = _("Citizenships")
        ordering = ("-pk",)

    id = models.CharField(primary_key=True, max_length=100, verbose_name=_("id"))

    user = models.OneToOneField(
        get_user_model(),
        on_delete=models.CASCADE,
        related_name="citizenship",
        blank=True,
        null=True,
        verbose_name=_("user"),
    )
    registration_date = models.DateField(verbose_name=_("registration date"))

    registration_district = models.ForeignKey(
        federal.models.District,
        on_delete=models.CASCADE,
        verbose_name=_("district"),
        related_name="citizens",
    )

    image = models.ImageField(
        upload_to="uploads/images/citizenships/",
        verbose_name=_("image"),
    )

    def __str__(self):
        return str(self.id)


class Passport(models.Model):
    class Meta:
        verbose_name = _("Passport")
        verbose_name_plural = _("Passports")
        ordering = ("-pk",)

    id = models.CharField(primary_key=True, max_length=100, verbose_name=_("id"))

    user = models.OneToOneField(
        get_user_model(),
        on_delete=models.CASCADE,
        related_name="passport",
        blank=True,
        null=True,
        verbose_name=_("user"),
    )

    issue_date = models.DateField(verbose_name=_("issue date"))

    expiry_date = models.DateField(verbose_name=_("expiry date"))

    image = models.ImageField(
        upload_to="uploads/images/passports/",
        verbose_name=_("image"),
    )

    def __str__(self):
        return str(self.id)


class NationalId(models.Model):
    class Meta:
        verbose_name = _("National ID")
        verbose_name_plural = _("National IDs")
        ordering = ("-pk",)

    id = models.CharField(primary_key=True, max_length=100, verbose_name=_("id"))

    user = models.OneToOneField(
        get_user_model(),
        on_delete=models.CASCADE,
        related_name="national_id",
        blank=True,
        null=True,
        verbose_name=_("user"),
    )

    registration_date = models.DateField(verbose_name=_("registration date"))

    image = models.ImageField(
        upload_to="uploads/images/national_ids/",
        verbose_name=_("image"),
    )

    def __str__(self):
        return str(self.id)


class OtherIdentificationDocument(models.Model):
    class Meta:
        verbose_name = _("Other Identification Document")
        verbose_name_plural = _("Other Identification Documents")

    user = models.OneToOneField(
        get_user_model(),
        on_delete=models.CASCADE,
        related_name="other_identification_document",
        blank=True,
        null=True,
        verbose_name=_("user"),
    )

    name = models.CharField(max_length=200)

    image = models.ImageField(
        upload_to="uploads/images/other_identification_documents/",
        verbose_name=_("image"),
    )

    def __str__(self):
        return self.name


class Certificate(models.Model):
    class Meta:
        verbose_name = _("Certificate")
        verbose_name_plural = _("Certificates")
        ordering = ("-pk",)

    user = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE,
        related_name="certificates",
        verbose_name=_("user"),
    )

    image = models.ImageField(
        upload_to="uploads/images/certificates/",
        verbose_name=_("image"),
    )


class VolunteerProfile(models.Model):
    class Meta:
        verbose_name = _("Volunteer profile")
        verbose_name_plural = _("Volunteer profiles")
        ordering = ("-pk",)

    user = models.OneToOneField(
        get_user_model(),
        on_delete=models.CASCADE,
        related_name="volunteer",
        primary_key=True,
        blank=True,
        verbose_name=_("user"),
    )

    first_name = models.CharField(max_length=100, verbose_name=_("first name"))

    last_name = models.CharField(max_length=100, verbose_name=_("last name"))

    contact_number = PhoneNumberField(verbose_name=_("contact number"))

    profile_image = models.ImageField(
        upload_to="uploads/images/profile_images/",
        blank=True,
        null=True,
        verbose_name=_("profile image"),
    )

    date_of_birth = models.DateField(verbose_name=_("date of birth"))

    gender = models.SmallIntegerField(
        choices=Gender.choices,
        verbose_name=_("gender"),
    )

    blood_group = models.SmallIntegerField(
        choices=BloodGroup.choices,
        verbose_name=_("blood type"),
    )

    nationality = models.SmallIntegerField(
        choices=Nationality.choices,
        verbose_name=_("nationality"),
    )

    permanent_ward = models.ForeignKey(
        federal.models.Ward,
        on_delete=models.CASCADE,
        verbose_name=_("permanent ward"),
        related_name="residing_volunteers",
    )

    temporary_ward = models.ForeignKey(
        federal.models.Ward,
        on_delete=models.CASCADE,
        verbose_name=_("temporary ward"),
        related_name="transient_volunteers",
    )

    point = gis_models.PointField(
        null=True,
        blank=True,
        verbose_name=_("point"),
    )

    academic_qualification = models.PositiveSmallIntegerField(
        choices=AcademicQualification.choices,
        verbose_name=_("academic qualification"),
    )

    category = models.SmallIntegerField(
        choices=VolunteerCategory.choices,
        verbose_name=_("volunteer category"),
    )

    organization_name = models.CharField(
        blank=True, max_length=100, verbose_name=_("organization name")
    )

    organization_phone_number = PhoneNumberField(
        blank=True, verbose_name=_("organization phone number")
    )

    organization_website = models.CharField(
        blank=True, max_length=100, verbose_name=_("organization website")
    )

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    def profile_image_preview_small(self):
        default_image = "shared/default_profile_image.png"
        profile_image_url = (
            self.profile_image.url if self.profile_image else static(default_image)
        )

        return mark_safe(
            f"""
            <div class="d-flex flex-row gap-3 align-items-center">
                <img 
                    class="rounded-circle border border-primary flex-shrink-0" 
                    src="{profile_image_url}" 
                    style="height: 30px; width: 30px;"/>
                <span class="flex-shrink-0"> {self} </span>
            </div>
            """
        )

    def profile_image_preview(self):
        default_image = "shared/default_profile_image.png"
        profile_image_url = (
            self.profile_image.url if self.profile_image else static(default_image)
        )

        return mark_safe(
            f"""<img 
                    src="{profile_image_url}"
                    style="height: 200px; width: 200px;"
                />
            """
        )


class Training(models.Model):
    class Meta:
        verbose_name = _("Volunteer Training")
        verbose_name_plural = _("Volunteer Trainings")
        ordering = ("-pk",)

    user = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE,
        related_name="trainings",
        verbose_name=_("user"),
    )

    name = models.CharField(max_length=100, verbose_name=_("name"))

    subject = models.CharField(max_length=100, verbose_name=_("subject"))

    category = models.SmallIntegerField(
        choices=TrainingCategory.choices,
        verbose_name=_("category"),
    )

    image = models.ImageField(
        upload_to="uploads/images/trainings/",
        verbose_name=_("image"),
    )


class IncidentSeverity(models.IntegerChoices):
    Low, Moderate, High, Critical = range(4)

    @DynamicClassAttribute
    def label(self):
        label = super().label
        return {
            "Low": _("Low"),
            "Moderate": _("Moderate"),
            "High": _("High"),
            "Critical": _("Critical"),
        }.get(label, _("None"))


class Incident(models.Model):
    class Meta:
        verbose_name = _("Incident")
        verbose_name_plural = _("Incidents")
        ordering = ("-date",)

    name = models.CharField(max_length=200, verbose_name=_("name"))

    description = CKEditor5Field("Description", config_name="extends")

    date = models.DateTimeField(verbose_name=_("date"))

    ward = models.ForeignKey(
        federal.models.Ward,
        on_delete=models.CASCADE,
        verbose_name=_("ward"),
        related_name="incidents",
    )

    severity = models.SmallIntegerField(
        choices=IncidentSeverity.choices,
        verbose_name=_("severity"),
    )

    point = gis_models.PointField(verbose_name=_("point"))

    def __str__(self):
        return str(self.name)


class Program(models.Model):
    class Meta:
        verbose_name = _("Program")
        verbose_name_plural = _("Programs")
        ordering = ("-pk",)

    name = models.CharField(max_length=200)

    description = CKEditor5Field("Description", config_name="extends")

    incident = models.ForeignKey(
        Incident,
        on_delete=models.CASCADE,
        related_name="programs",
    )

    def __str__(self):
        return str(self.name)


class Job(models.Model):
    class Meta:
        verbose_name = _("Job")
        verbose_name_plural = _("Jobs")
        ordering = ("-start_date",)

    name = models.CharField(max_length=200, verbose_name=_("name"))

    start_date = models.DateTimeField(verbose_name=_("start date"))

    end_date = models.DateTimeField(verbose_name=_("end date"))

    vacancy = models.PositiveIntegerField(verbose_name=_("vacancy"))

    description = CKEditor5Field("Description", config_name="extends")

    status = models.SmallIntegerField(
        choices=JobStatus.choices,
        verbose_name=_("status"),
    )
    program = models.ForeignKey(
        Program,
        on_delete=models.CASCADE,
        related_name="jobs",
    )
    leader = models.ForeignKey(
        VolunteerProfile,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        verbose_name=_("leader"),
        related_name="leading_jobs",  # Hard to name correctly
    )

    age_limit = models.SmallIntegerField(
        null=True,
        blank=True,
        verbose_name=_("age_limit"),
    )

    def filled(self):
        return self.applications.filter(status=JobApplicationStatus.Accepted).count()

    def __str__(self):
        return str(self.name)

    def save(self, *args, **kwargs):
        if self.pk:
            old_job = Job.objects.get(pk=self.pk)
            if old_job.leader != self.leader:
                Notification.objects.create(
                    user=self.leader.user,
                    date=timezone.now(),
                    message=f"Your have been appointed leader for {self}",
                )
        return super().save(*args, **kwargs)


class JobApplicationStatus(models.IntegerChoices):
    Accepted, Rejected, Pending, Cancelled = range(4)

    @DynamicClassAttribute
    def label(self):
        label = super().label
        return {
            "Accepted": _("Accepted"),
            "Rejected": _("Rejected"),
            "Pending": _("Pending"),
            "Cancelled": _("Cancelled"),
        }.get(label, _("None"))


class JobApplication(models.Model):
    class Meta:
        verbose_name = _("Job Application")
        verbose_name_plural = _("Job Applications")
        ordering = ("-pk",)
        constraints = [
            models.UniqueConstraint(
                fields=["volunteer", "job"], name="unique_volunteer_job"
            )
        ]

    volunteer = models.ForeignKey(
        VolunteerProfile,
        on_delete=models.CASCADE,
        verbose_name=_("volunteer"),
        related_name="job_applications",
    )

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        verbose_name=_("Job"),
        related_name="applications",
    )

    status = models.SmallIntegerField(
        choices=JobApplicationStatus.choices,
        default=JobApplicationStatus.Pending,
        verbose_name=_("status"),
    )

    def __str__(self):
        return str(self.job)

    def save(self, *args, **kwargs):
        status = JobApplicationStatus(self.status)
        if status in [
            JobApplicationStatus.Accepted,
            JobApplicationStatus.Cancelled,
            JobApplicationStatus.Rejected,
            JobApplicationStatus.Pending,
        ]:
            Notification.objects.create(
                user=self.volunteer.user,
                date=timezone.now(),
                message=f"Your application for {self.job} is {status.label}",
            )
        return super().save(*args, **kwargs)


class JobReport(models.Model):
    class Meta:
        verbose_name = _("Job Report")
        verbose_name_plural = _("Job Reports")
        ordering = ("-pk",)
        constraints = [
            models.UniqueConstraint(
                fields=["volunteer", "job"], name="unique_volunteer_job_report"
            )
        ]

    volunteer = models.ForeignKey(
        VolunteerProfile,
        on_delete=models.CASCADE,
        verbose_name=_("volunteer"),
        related_name="job_reports",
    )

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        verbose_name=_("Job"),
        related_name="reports",
    )

    report = CKEditor5Field("Report", config_name="extends")

    def __str__(self):
        return f"Report on {self.job} by {self.volunteer}"


class Notification(models.Model):
    class Meta:
        verbose_name = _("Notification")
        verbose_name_plural = _("Notifications")
        ordering = ("-date",)

    user = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE,
        related_name="notifications",
        verbose_name=_("user"),
    )

    message = models.TextField(verbose_name=_("message"))
    date = models.DateTimeField(verbose_name=_("date"))
    viewed = models.BooleanField(verbose_name=_("viewed"), default=False)

    def __str__(self):
        return self.message
