from django.contrib.auth import get_user_model
from django.utils import timezone
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from rest_framework import serializers

from . import models


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
    gender = ChoiceField(models.Gender.choices)
    blood_group = ChoiceField(models.BloodGroup.choices)
    nationality = ChoiceField(models.Nationality.choices)

    class Meta:
        model = models.VolunteerProfile
        fields = (
            "user",
            "first_name",
            "last_name",
            "contact_number",
            "profile_image",
            "date_of_birth",
            "gender",
            "nationality",
            "blood_group",
            "temporary_municipality",
            "permanent_municipality",
        )
        read_only_fields = ("user",)
        extra_kwargs = {
            "user": {"view_name": "api:user-detail"},
            "temporary_municipality": {"view_name": "api:municipality-detail"},
            "permanent_municipality": {"view_name": "api:municipality-detail"},
        }


class SignupVolunteerProfileSerializer(serializers.HyperlinkedModelSerializer):
    gender = ChoiceField(models.Gender.choices)
    blood_group = ChoiceField(models.BloodGroup.choices)
    nationality = ChoiceField(models.Nationality.choices)
    category = ChoiceField(models.VolunteerCategory.choices)
    training_type = ChoiceField(models.TrainingType.choices, required=False)

    def validate_date_of_birth(self, date):
        today = timezone.now().date()
        age = (
            today.year - date.year - ((today.month, today.day) < (date.month, date.day))
        )
        if age < 16:
            raise serializers.ValidationError(
                "Volunteers must be at least 16 years old."
            )
        return date

    def validate(self, data):
        organization_fields = [
            "organization_name",
            "organization_phone_number",
            "organization_website",
        ]
        training_fields = ["training_name", "training_subject", "training_type"]

        organization_present = any(data.get(field) for field in organization_fields)
        training_present = any(data.get(field) for field in training_fields)

        if organization_present and not all(
            data.get(field) for field in organization_fields
        ):
            raise serializers.ValidationError(
                "If one of the organization fields is present, all must be present."
            )

        if training_present and not all(data.get(field) for field in training_fields):
            raise serializers.ValidationError(
                "If one of the training fields is present, all must be present."
            )

        return data

    class Meta:
        model = models.VolunteerProfile
        fields = (
            "first_name",
            "last_name",
            "contact_number",
            "date_of_birth",
            "gender",
            "nationality",
            "blood_group",
            "category",
            "temporary_municipality",
            "permanent_municipality",
            "organization_name",
            "organization_phone_number",
            "organization_website",
            "training_name",
            "training_subject",
            "training_type",
        )
        extra_kwargs = {
            "temporary_municipality": {"view_name": "api:municipality-detail"},
            "permanent_municipality": {"view_name": "api:municipality-detail"},
        }


class SignupCitizenshipSerializer(serializers.HyperlinkedModelSerializer):
    def validate_registration_date(self, date):
        if date > timezone.now().date():
            raise serializers.ValidationError("Registration date is in the future.")
        return date

    class Meta:
        model = models.Citizenship
        fields = (
            "id",
            "registration_date",
            "registration_district",
        )
        extra_kwargs = {
            "registration_district": {"view_name": "api:district-detail"},
        }


class SignupPassportSerializer(serializers.ModelSerializer):
    def validate_issue_date(self, date):
        if date > timezone.now().date():
            raise serializers.ValidationError("Issue date is in the future.")
        return date

    def validate_expiry_date(self, date):
        if date < timezone.now().date():
            raise serializers.ValidationError("Passport is expired.")
        return date

    def validate(self, data):
        if data.get("expiry_date") < data.get("issue_date"):
            raise serializers.ValidationError(
                "Expiry date must be greater than issue date"
            )
        return data

    class Meta:
        model = models.Passport
        fields = (
            "id",
            "issue_date",
            "expiry_date",
        )


class SignupNationalIdSerializer(serializers.ModelSerializer):
    def validate_registration_date(self, date):
        if date > timezone.now().date():
            raise serializers.ValidationError("Registration date is in the future.")
        return date

    class Meta:
        model = models.NationalId
        fields = (
            "id",
            "registration_date",
        )


class SignupCertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Certificate
        fields = ("file",)


class VolunteerSignupSerializer(serializers.ModelSerializer):
    volunteer = SignupVolunteerProfileSerializer()
    citizenship = SignupCitizenshipSerializer(required=False)
    passport = SignupPassportSerializer(required=False)
    national_id = SignupNationalIdSerializer(required=False)
    certificates = SignupCertificateSerializer(many=True, required=False)

    class Meta:
        model = get_user_model()
        fields = (
            "email",
            "password",
            "volunteer",
            "citizenship",
            "passport",
            "national_id",
            "certificates",
        )
        extra_kwargs = {"password": {"write_only": True}}

    def validate_password(self, password):
        validate_password(password)
        return password

    def validate(self, data):
        id_fields = ("citizenship", "passport", "national_id")
        id_present = any(data.get(field) for field in id_fields)
        if not id_present:
            raise serializers.ValidationError(
                f"At least one ID ({", ".join(id_fields)}) must be present."
            )

        if data.get("volunteer")["nationality"] == "International" and not data.get(
            "passport"
        ):
            raise serializers.ValidationError(
                "Passport required for international volunteers."
            )
        return data

    def create(self, validated_data):
        volunteer = validated_data.pop("volunteer", None)
        citizenship = validated_data.pop("citizenship", None)
        passport = validated_data.pop("passport", None)
        national_id = validated_data.pop("national_id", None)

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

            if volunteer:
                models.VolunteerProfile.objects.create(user=user, **volunteer)

            return user


class IncidentSerializer(serializers.HyperlinkedModelSerializer):
    severity = ChoiceField(models.IncidentSeverity.choices)

    class Meta:
        model = models.Incident
        exclude = ("url",)
        extra_kwargs = {
            "url": {"view_name": "api:incident-detail"},
            "municipality": {"view_name": "api:municipality-detail"},
        }


class ProgramSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Program
        exclude = ("url",)
        extra_kwargs = {
            "url": {"view_name": "api:program-detail"},
            "incident": {"view_name": "api:incident-detail"},
        }


class JobSerializer(serializers.HyperlinkedModelSerializer):
    status = ChoiceField(models.JobStatus.choices)

    class Meta:
        model = models.Job
        exclude = ("url",)
        extra_kwargs = {
            "url": {"view_name": "api:job-detail"},
            "program": {"view_name": "api:program-detail"},
            "volunteer": {"view_name": "api:volunteer-detail"},
        }
