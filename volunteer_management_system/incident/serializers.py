from django.contrib.auth import get_user_model
from django.utils import timezone
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from rest_framework import serializers
from drf_extra_fields.fields import Base64ImageField
from rest_framework.fields import SkipField

from . import models


class Base64ImageFieldWithUrl(Base64ImageField):
    def to_internal_value(self, base64_data):
        if isinstance(base64_data, str):
            if base64_data.startswith("http"):
                raise SkipField()
        return super(Base64ImageField).to_internal_value(base64_data)


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


class VolunteerProfileSerializer(serializers.HyperlinkedModelSerializer):
    profile_image = Base64ImageFieldWithUrl(required=False)
    gender = ChoiceField(models.Gender.choices)
    blood_group = ChoiceField(models.BloodGroup.choices)
    nationality = ChoiceField(models.Nationality.choices)
    category = ChoiceField(models.VolunteerCategory.choices)
    training_type = ChoiceField(models.TrainingType.choices, required=False)

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
        training_fields = [
            "training_name",
            "training_subject",
            "training_type",
        ]

        organization_present = any(data.get(field) for field in organization_fields)
        training_present = any(data.get(field) for field in training_fields)

        if organization_present and not all(
            data.get(field) is not None for field in organization_fields
        ):
            raise serializers.ValidationError(
                "If one of the organization fields is present, all must be present."
            )

        if training_present and not all(
            data.get(field) is not None for field in training_fields
        ):
            raise serializers.ValidationError(
                "If one of the training fields is present, all must be present."
            )

        return data


class CitizenshipSerializer(serializers.HyperlinkedModelSerializer):
    image = Base64ImageFieldWithUrl()

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
    image = Base64ImageFieldWithUrl()

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
    image = Base64ImageFieldWithUrl()

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
    image = Base64ImageFieldWithUrl()

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


class CertificateSerializer(serializers.ModelSerializer):
    image = Base64ImageFieldWithUrl()

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
            "certificates",
        )
        extra_kwargs = {"password": {"write_only": True}}

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
        volunteer = validated_data.pop("volunteer", None)
        citizenship = validated_data.pop("citizenship", None)
        passport = validated_data.pop("passport", None)
        national_id = validated_data.pop("national_id", None)
        other_identification_document = validated_data.pop(
            "other_identification_document", None
        )
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
        certificates_data                  = validated_data.pop("certificates", [])

        volunteer                          = instance
        citizenship                        = getattr(instance.user, "citizenship", None)
        passport                           = getattr(instance.user, "passport", None)
        national_id                        = getattr(instance.user, "national_id", None)
        other_identification_document      = getattr(instance.user, "other_identification_document", None)
        certificates                       = getattr(instance.user, "certificates", None)

        volunteer.first_name                = volunteer_data.get("first_name", volunteer.first_name) 
        volunteer.last_name                 = volunteer_data.get("last_name", volunteer.last_name) 
        volunteer.contact_number            = volunteer_data.get("contact_number", volunteer.contact_number) 
        volunteer.profile_image             = volunteer_data.get("profile_image", volunteer.profile_image) 
        volunteer.date_of_birth             = volunteer_data.get("date_of_birth", volunteer.date_of_birth) 
        volunteer.gender                    = volunteer_data.get("gender", volunteer.gender) 
        volunteer.blood_group               = volunteer_data.get("blood_group", volunteer.blood_group) 
        volunteer.nationality               = volunteer_data.get("nationality", volunteer.nationality) 
        volunteer.permanent_ward            = volunteer_data.get("permanent_ward", volunteer.permanent_ward) 
        volunteer.temporary_ward            = volunteer_data.get("temporary_ward", volunteer.temporary_ward) 
        volunteer.category                  = volunteer_data.get("category", volunteer.category) 
        volunteer.organization_name         = volunteer_data.get("organization_name", volunteer.organization_name) 
        volunteer.organization_phone_number = volunteer_data.get("organization_phone_number", volunteer.organization_phone_number) 
        volunteer.organization_website      = volunteer_data.get("organization_website", volunteer.organization_website) 
        volunteer.training_name             = volunteer_data.get("training_name", volunteer.training_name) 
        volunteer.training_subject          = volunteer_data.get("training_subject", volunteer.training_subject) 
        volunteer.training_type             = volunteer_data.get("training_type", volunteer.training_type) 

        if citizenship:
            citizenship.id                      = citizenship_data.get("id", citizenship.id)
            citizenship.registration_date       = citizenship_data.get("registration_date", citizenship.registration_date)
            citizenship.registration_district   = citizenship_data.get("registration_district", citizenship.registration_district)
            citizenship.image                   = citizenship_data.get("image", citizenship.image)

        if passport:
            passport.id                         = passport_data.get("id", passport.id)
            passport.issue_date                 = passport_data.get("issue_date", passport.issue_date)
            passport.expiry_date                = passport_data.get("expiry_date", passport.expiry_date)
            passport.image                      = passport_data.get("image", passport.image)

        if national_id:
            national_id.id                      = national_id_data.get("id", national_id.id)
            national_id.registration_date       = national_id_data.get("registration_date", national_id.registration_date)
            national_id.image                   = national_id_data.get("image", national_id.image)

        if other_identification_document:
            other_identification_document.name  = other_identification_document_data.get("name", other_identification_document.name)
            other_identification_document.image = other_identification_document_data.get("image", other_identification_document.image)
        # fmt: on

        with transaction.atomic():
            volunteer.save()

            if citizenship:
                citizenship.save()
            elif hasattr(volunteer.user, "citizenship"):
                volunteer.user.citizenship.delete()

            if passport:
                passport.save()
            elif hasattr(volunteer.user, "passport"):
                volunteer.user.passport.delete()

            if national_id:
                national_id.save()
            elif hasattr(volunteer.user, "national_id"):
                volunteer.user.national_id.delete()

            if other_identification_document:
                other_identification_document.save()
            elif hasattr(volunteer.user, "other_identification_document"):
                volunteer.user.other_identification_document.delete()

            if certificates is not None:
                certificates.all().delete()
                models.Certificate.objects.bulk_create(
                    [
                        models.Certificate(**cert, user=instance.user)
                        for cert in certificates_data
                    ]
                )

        return instance


class IncidentSerializer(serializers.HyperlinkedModelSerializer):
    severity = ChoiceField(models.IncidentSeverity.choices)

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


class JobSerializer(serializers.HyperlinkedModelSerializer):
    status = ChoiceField(models.JobStatus.choices)

    class Meta:
        model = models.Job
        fields = "__all__"
        extra_kwargs = {
            "url": {"view_name": "api:job-detail"},
            "program": {"view_name": "api:program-detail"},
            "leader": {"view_name": "api:volunteer-detail"},
        }
