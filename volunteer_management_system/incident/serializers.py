from functools import cached_property
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from rest_framework import serializers
from drf_extra_fields.fields import Base64ImageField
from rest_framework.fields import SerializerMethodField

import federal.models
from . import models


class Base64ImageFieldWithUrl(Base64ImageField):
    def to_representation(self, file):
        if not file:
            return ""
        return "data:image/*;base64," + super().to_representation(file)


class SiteContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.SiteContent
        fields = "__all__"


class ChoiceField(serializers.ChoiceField):
    def to_representation(self, obj):
        if obj == "" and self.allow_blank:
            return obj
        return self._choices[obj]

    def to_internal_value(self, data):
        if data == "" and self.allow_blank:
            return ""

        for key, val in self._choices.items():
            if val == data:
                return key
        self.fail("invalid_choice", input=data)


class VolunteerLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.VolunteerProfile
        fields = ("point",)


class VolunteerProfileSerializer(serializers.HyperlinkedModelSerializer):
    profile_image = Base64ImageFieldWithUrl(represent_in_base64=True, required=False)
    gender = ChoiceField(models.Gender.choices)
    blood_group = ChoiceField(models.BloodGroup.choices)
    nationality = ChoiceField(models.Nationality.choices)
    academic_qualification = ChoiceField(models.AcademicQualification.choices)
    category = ChoiceField(models.VolunteerCategory.choices)

    class Meta:
        model = models.VolunteerProfile
        fields = "__all__"
        read_only_fields = ("user", "url")
        extra_kwargs = {
            "url": {"view_name": "api:volunteer-detail"},
            "user": {"view_name": "api:user-detail"},
            "temporary_ward": {"view_name": "api:ward-detail"},
            "permanent_ward": {"view_name": "api:ward-detail"},
        }

    def validate_date_of_birth(self, date):
        today = timezone.now().date()
        age = (
            today.year - date.year - ((today.month, today.day) < (date.month, date.day))
        )
        if age < 14:
            raise serializers.ValidationError(
                "Volunteers must be at least 14 years old."
            )
        return date

    def validate(self, data):
        organization_fields = [
            "organization_name",
            "organization_phone_number",
            "organization_website",
        ]

        organization_present = any(data.get(field) for field in organization_fields)

        if organization_present and not all(
            data.get(field) is not None for field in organization_fields
        ):
            raise serializers.ValidationError(
                "If one of the organization fields is present, all must be present."
            )

        point = data.get("point")
        temporary_ward = data.get("temporary_ward")
        if point:
            ward = federal.models.Ward.objects.filter(
                shape__contains=point, pk=temporary_ward.pk
            )
            if not ward:
                raise serializers.ValidationError(
                    "Point must lie within selected temporary ward"
                )

        return data


class CitizenshipSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.CharField(validators=[])
    image = Base64ImageFieldWithUrl(represent_in_base64=True)

    def validate_registration_date(self, date):
        if date > timezone.now().date():
            raise serializers.ValidationError("Registration date is in the future.")
        return date

    def validate_image(self, image):
        if not image:
            raise serializers.ValidationError("Image is required")
        return image

    class Meta:
        model = models.Citizenship
        fields = (
            "id",
            "registration_date",
            "registration_district",
            "image",
        )
        extra_kwargs = {
            "registration_district": {"view_name": "api:district-detail"},
        }


class PassportSerializer(serializers.ModelSerializer):
    id = serializers.CharField(validators=[])
    image = Base64ImageFieldWithUrl(represent_in_base64=True)

    def validate_issue_date(self, date):
        if date > timezone.now().date():
            raise serializers.ValidationError("Issue date is in the future.")
        return date

    def validate_expiry_date(self, date):
        if date < timezone.now().date():
            raise serializers.ValidationError("Passport is expired.")
        return date

    def validate_image(self, image):
        if not image:
            raise serializers.ValidationError("Image is required")
        return image

    def validate(self, data):
        # if data.get("expiry_date") < data.get("issue_date"):
        #     raise serializers.ValidationError(
        #         "Expiry date must be greater than issue date"
        #     )
        return data

    class Meta:
        model = models.Passport
        fields = (
            "id",
            "issue_date",
            "expiry_date",
            "image",
        )


class NationalIdSerializer(serializers.ModelSerializer):
    id = serializers.CharField(validators=[])
    image = Base64ImageFieldWithUrl(represent_in_base64=True)

    def validate_registration_date(self, date):
        if date > timezone.now().date():
            raise serializers.ValidationError("Registration date is in the future.")
        return date

    def validate_image(self, image):
        if not image:
            raise serializers.ValidationError("Image is required")
        return image

    class Meta:
        model = models.NationalId
        fields = (
            "id",
            "registration_date",
            "image",
        )


class OtherIdentificationDocumentSerializer(serializers.ModelSerializer):
    image = Base64ImageFieldWithUrl(represent_in_base64=True)

    def validate_image(self, image):
        if not image:
            raise serializers.ValidationError("Image is required")
        return image

    class Meta:
        model = models.OtherIdentificationDocument
        fields = (
            "name",
            "image",
        )


class TrainingSerializer(serializers.ModelSerializer):
    image = Base64ImageFieldWithUrl(represent_in_base64=True)
    category = ChoiceField(models.TrainingCategory.choices)

    def validate_image(self, image):
        if not image:
            raise serializers.ValidationError("Image is required")
        return image

    class Meta:
        model = models.Training
        fields = ("name", "subject", "category", "image")


class CertificateSerializer(serializers.ModelSerializer):
    image = Base64ImageFieldWithUrl(represent_in_base64=True)

    def validate_image(self, image):
        if not image:
            raise serializers.ValidationError("Image is required")
        return image

    class Meta:
        model = models.Certificate
        fields = ("image",)


class VolunteerSerializer(serializers.ModelSerializer):
    volunteer = VolunteerProfileSerializer()
    citizenship = CitizenshipSerializer(required=False)
    passport = PassportSerializer(required=False)
    national_id = NationalIdSerializer(required=False)
    other_identification_document = OtherIdentificationDocumentSerializer(
        required=False
    )
    trainings = TrainingSerializer(many=True, required=False)
    certificates = CertificateSerializer(many=True, required=False)

    class Meta:
        model = get_user_model()
        fields = (
            "email",
            "password",
            "volunteer",
            "citizenship",
            "passport",
            "national_id",
            "other_identification_document",
            "trainings",
            "certificates",
        )
        extra_kwargs = {"password": {"write_only": True, "required": False}}

    def validate_password(self, password):
        validate_password(password)
        return password

    def validate(self, data):
        id_fields = (
            "citizenship",
            "passport",
            "national_id",
            "other_identification_document",
        )
        id_present = any(data.get(field) for field in id_fields)
        if not id_present:
            raise serializers.ValidationError(
                f"At least one ID ({', '.join(id_fields)}) must be present."
            )

        if data.get("volunteer")[
            "nationality"
        ] == models.Nationality.International and not data.get("passport"):
            raise serializers.ValidationError(
                "Passport required for international volunteers."
            )
        return data

    def create(self, validated_data):
        if "password" not in validated_data:
            raise serializers.ValidationError("Password is required")

        volunteer = validated_data.pop("volunteer", None)
        citizenship = validated_data.pop("citizenship", None)
        passport = validated_data.pop("passport", None)
        national_id = validated_data.pop("national_id", None)
        other_identification_document = validated_data.pop(
            "other_identification_document", None
        )
        trainings = validated_data.pop("trainings", None)
        certificates = validated_data.pop("certificates", None)

        with transaction.atomic():
            user = get_user_model().objects.create(**validated_data)
            user.set_password(validated_data["password"])
            user.save()

            if citizenship:
                models.Citizenship.objects.create(user=user, **citizenship)

            if passport:
                models.Passport.objects.create(user=user, **passport)

            if national_id:
                models.NationalId.objects.create(user=user, **national_id)

            if other_identification_document:
                models.OtherIdentificationDocument.objects.create(
                    user=user, **other_identification_document
                )

            if trainings:
                models.Training.objects.bulk_create(
                    [models.Training(user=user, **training) for training in trainings]
                )

            if certificates:
                models.Certificate.objects.bulk_create(
                    [models.Certificate(user=user, **cert) for cert in certificates]
                )

            if volunteer:
                models.VolunteerProfile.objects.create(user=user, **volunteer)

            return user

    def update(self, instance, validated_data):
        # fmt: off
        volunteer_data                     = validated_data.pop("volunteer")
        citizenship_data                   = validated_data.pop("citizenship", None)
        passport_data                      = validated_data.pop("passport", None)
        national_id_data                   = validated_data.pop("national_id", None)
        other_identification_document_data = validated_data.pop("other_identification_document", None)
        trainings_data                     = validated_data.pop("trainings", [])
        certificates_data                  = validated_data.pop("certificates", [])

        volunteer                          = instance.volunteer

        certificates                       = getattr(instance, "certificates", None)
        trainings                          = getattr(instance, "trainings", None)
        # fmt: on

        # fmt: off
        volunteer.first_name                = volunteer_data.get("first_name", volunteer.first_name)
        volunteer.last_name                 = volunteer_data.get("last_name", volunteer.last_name)
        volunteer.contact_number            = volunteer_data.get("contact_number", volunteer.contact_number)
        volunteer.profile_image             = volunteer_data.get("profile_image", volunteer.profile_image)
        volunteer.date_of_birth             = volunteer_data.get("date_of_birth", volunteer.date_of_birth)
        volunteer.gender                    = volunteer_data.get("gender", volunteer.gender)
        volunteer.blood_group               = volunteer_data.get("blood_group", volunteer.blood_group)
        volunteer.active                    = volunteer_data.get("active", volunteer.active)
        volunteer.nationality               = volunteer_data.get("nationality", volunteer.nationality)
        volunteer.permanent_ward            = volunteer_data.get("permanent_ward", volunteer.permanent_ward)
        volunteer.temporary_ward            = volunteer_data.get("temporary_ward", volunteer.temporary_ward)
        volunteer.point                     = volunteer_data.get("point", volunteer.point)
        volunteer.academic_qualification    = volunteer_data.get("academic_qualification", volunteer.academic_qualification)
        volunteer.category                  = volunteer_data.get("category", volunteer.category)
        volunteer.organization_name         = volunteer_data.get("organization_name", volunteer.organization_name)
        volunteer.organization_phone_number = volunteer_data.get("organization_phone_number", volunteer.organization_phone_number)
        volunteer.organization_website      = volunteer_data.get("organization_website", volunteer.organization_website)
        # fmt: on

        volunteer.save()
        if citizenship_data:
            if hasattr(volunteer.user, "citizenship"):
                instance.citizenship.delete()
                instance.citizenship = None
                instance.save()

            citizenship = (
                models.Citizenship(user=instance, **citizenship_data)
                if citizenship_data
                else None
            )

            if citizenship:
                citizenship.save()
                instance.citizenship = citizenship
                instance.save()
        elif hasattr(volunteer.user, "citizenship"):
            instance.citizenship.delete()
            instance.citizenship = None
            instance.save()

        if passport_data:
            if hasattr(instance, "passport"):
                instance.passport.delete()
                instance.passport = None
                instance.save()

            passport = (
                models.Passport(user=instance, **passport_data)
                if passport_data
                else None
            )

            if passport:
                passport.save()
                instance.passport = passport
                instance.save()
        elif hasattr(instance, "passport"):
            instance.passport.delete()
            instance.passport = None
            instance.save()

        if national_id_data:
            if hasattr(instance, "national_id"):
                instance.national_id.delete()
                instance.national_id = None
                instance.save()

            national_id = (
                models.NationalId(user=instance, **national_id_data)
                if national_id_data
                else None
            )

            if national_id:
                national_id.save()
                instance.national_id = national_id
                instance.save()
        elif hasattr(instance, "national_id"):
            instance.national_id.delete()
            instance.national_id = None
            instance.save()

        if other_identification_document_data:
            if hasattr(instance, "other_identification_document"):
                instance.other_identification_document.delete()
                instance.other_identification_document = None
                instance.save()

            other_identification_document = (
                models.OtherIdentificationDocument(
                    user=instance, **other_identification_document_data
                )
                if other_identification_document_data
                else None
            )

            if other_identification_document:
                other_identification_document.save()
                instance.other_identification_document = other_identification_document
                instance.save()
        elif hasattr(instance, "other_identification_document"):
            instance.other_identification_document.delete()
            instance.other_identification_document = None
            instance.save()

        if trainings is not None:
            trainings.all().delete()

        models.Training.objects.bulk_create(
            [models.Training(**training, user=instance) for training in trainings_data]
        )

        if certificates is not None:
            certificates.all().delete()

        models.Certificate.objects.bulk_create(
            [models.Certificate(**cert, user=instance) for cert in certificates_data]
        )

        return instance


class IncidentSerializer(serializers.HyperlinkedModelSerializer):
    severity = ChoiceField(models.IncidentSeverity.choices)
    programs = SerializerMethodField()
    jobs = SerializerMethodField()

    def get_programs(self, incident):
        return incident.programs.count()

    def get_jobs(self, incident):
        return sum(program.jobs.count() for program in incident.programs.all())

    class Meta:
        model = models.Incident
        fields = "__all__"
        extra_kwargs = {
            "url": {"view_name": "api:incident-detail"},
            "ward": {"view_name": "api:ward-detail"},
        }


class ProgramSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Program
        fields = "__all__"
        extra_kwargs = {
            "url": {"view_name": "api:program-detail"},
            "incident": {"view_name": "api:incident-detail"},
        }


class LeaderProfileSerializer(serializers.ModelSerializer):
    profile_image = Base64ImageFieldWithUrl(represent_in_base64=True)

    class Meta:
        model = models.VolunteerProfile
        fields = ("first_name", "last_name", "profile_image")


class JobSerializer(serializers.HyperlinkedModelSerializer):
    status = ChoiceField(models.JobStatus.choices)
    application_status = SerializerMethodField()
    filled_positions = SerializerMethodField()
    leader = LeaderProfileSerializer()

    @cached_property
    def get_job_applications(self):
        request = self.context.get("request", None)
        if request and hasattr(request.user, "volunteer"):
            return models.JobApplication.objects.filter(
                volunteer=request.user.volunteer
            )
        return models.JobApplication.objects.none()

    def get_filled_positions(self, job):
        return job.filled()

    def get_application_status(self, job):
        request = self.context.get("request", None)
        if request and hasattr(request.user, "volunteer"):
            job_applications = self.get_job_applications
            job_applications = list(
                filter(lambda application: application.job == job, job_applications)
            )
            if len(job_applications) != 0:
                return models.JobApplicationStatus(job_applications[0].status).label
        return "Not applied"

    class Meta:
        model = models.Job
        fields = "__all__"
        extra_kwargs = {
            "url": {"view_name": "api:job-detail"},
            "program": {"view_name": "api:program-detail"},
            "leader": {"view_name": "api:volunteer-detail"},
        }


class JobReportVolunteerSerializer(serializers.HyperlinkedModelSerializer):
    profile_image = Base64ImageFieldWithUrl(represent_in_base64=True, required=False)

    class Meta:
        model = models.VolunteerProfile
        fields = ("url", "first_name", "last_name", "profile_image")
        extra_kwargs = {
            "url": {"view_name": "api:volunteer-detail"},
        }


class JobReportJobSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Job
        fields = ("url", "name", "start_date", "end_date")
        extra_kwargs = {
            "url": {"view_name": "api:job-detail"},
        }


class JobReportSerializer(serializers.HyperlinkedModelSerializer):
    volunteer = JobReportVolunteerSerializer()
    job = JobReportJobSerializer()

    class Meta:
        model = models.JobReport
        fields = ("url", "volunteer", "report", "job")
        extra_kwargs = {
            "url": {"view_name": "api:job_report-detail"},
            "job": {"view_name": "api:job-detail"},
        }


class JobReportCreateSerializer(serializers.HyperlinkedModelSerializer):
    def validate(self, data):
        if "job" not in data:
            raise serializers.ValidationError("No job provided")
        if "report" not in data:
            raise serializers.ValidationError("No report provided")
        return data

    class Meta:
        model = models.JobReport
        fields = ("job", "report")
        read_only_fields = ("volunteer",)
        extra_kwargs = {
            "job": {"view_name": "api:job-detail"},
            "volunteer": {"view_name": "api:volunteer-detail"},
        }

    def create(self, validated_data):
        request = self.context.get("request", None)
        if not request:
            raise serializers.ValidationError(
                "Internal error no request context found."
            )

        if not hasattr(request.user, "volunteer"):
            raise serializers.ValidationError("Only volunteers can write reports")
        validated_data["volunteer"] = request.user.volunteer
        return super().create(validated_data)

    def update(self, instance, validated_data):
        request = self.context.get("request", None)
        if not request:
            raise serializers.ValidationError(
                "Internal error no request context found."
            )

        if not hasattr(request.user, "volunteer"):
            raise serializers.ValidationError("Only volunteers can write reports")

        if request.user.volunteer != instance.volunteer:
            raise serializers.ValidationError("You can only modify your own reports")

        job = validated_data.pop("job")
        report = validated_data.pop("report")
        instance.job = job
        instance.report = report
        instance.save()
        return instance


class NotificationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Notification
        fields = ("url", "user", "viewed", "message", "date")
        extra_kwargs = {
            "url": {"view_name": "api:notification-detail"},
            "user": {"view_name": "api:user-detail"},
        }
