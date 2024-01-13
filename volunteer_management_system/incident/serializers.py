from django.contrib.auth import get_user_model
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
            "full_name",
            "profile_image",
            "date_of_birth",
            "gender",
            "nationality",
            "blood_group",
            "municipality",
        )
        read_only_fields = ("user",)
        extra_kwargs = {
            "user": {"view_name": "api:user-detail"},
            "municipality": {"view_name": "api:municipality-detail"},
        }


class SignupVolunteerProfileSerializer(serializers.HyperlinkedModelSerializer):
    gender = ChoiceField(models.Gender.choices)
    blood_group = ChoiceField(models.BloodGroup.choices)
    nationality = ChoiceField(models.Nationality.choices)

    class Meta:
        model = models.VolunteerProfile
        fields = (
            "full_name",
            "profile_image",
            "date_of_birth",
            "gender",
            "nationality",
            "blood_group",
            "municipality",
        )
        extra_kwargs = {
            "municipality": {"view_name": "api:municipality-detail"},
        }


class VolunteerSignupSerializer(serializers.ModelSerializer):
    volunteer = SignupVolunteerProfileSerializer()

    class Meta:
        model = get_user_model()
        fields = ("email", "password", "volunteer")
        extra_kwargs = {"password": {"write_only": True}}

    def validate_password(self, password):
        validate_password(password)
        return password

    def create(self, validated_data):
        volunteer = validated_data.pop("volunteer", None)
        with transaction.atomic():
            user = get_user_model().objects.create(**validated_data)
            user.set_password(validated_data["password"])
            user.save()

            if volunteer:
                models.VolunteerProfile.objects.create(user=user, **volunteer)
            return user


class IncidentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Incident
        fields = "__all__"
        extra_kwargs = {
            "url": {"view_name": "api:incident-detail"},
            "municipality": {"view_name": "api:municipality-detail"},
        }


class ProgramSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Program
        fields = "__all__"
        extra_kwargs = {"url": {"view_name": "api:program-detail"}}


class JobSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Job
        fields = "__all__"
        extra_kwargs = {"url": {"view_name": "api:job-detail"}}
