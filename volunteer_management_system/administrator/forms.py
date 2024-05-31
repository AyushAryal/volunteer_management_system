from django import forms
from django_select2.forms import ModelSelect2Widget
from incident.models import (
    Program,
    Incident,
    Job,
    JobApplication,
    VolunteerProfile,
    JobReport,
)
from federal.models import Ward


class IncidentForm(forms.ModelForm):
    class Meta:
        model = Incident
        fields = [
            "name",
            "description",
            "ward",
            "severity",
        ]
        widgets = {
            "ward": ModelSelect2Widget(
                model=Ward,
                search_fields=[
                    "name__icontains",
                ],
                attrs={
                    "data-placeholder": "Search for a Ward",
                    "data-allow-clear": "true",
                    "data-ajax--delay": 250,  # Delay in milliseconds
                },
            ),
        }


class ProgramForm(forms.ModelForm):
    class Meta:
        model = Program
        fields = ["name", "description", "incident"]
        widgets = {
            "incident": ModelSelect2Widget(
                model=Incident,
                search_fields=[
                    "name__icontains",
                    "id__icontains",
                ],
                attrs={
                    "data-placeholder": "Search for an Incident",
                    "data-allow-clear": "true",
                    "data-ajax--delay": 250,  # Delay in milliseconds
                },
            ),
        }


class JobForm(forms.ModelForm):
    class Meta:
        model = Job
        fields = [
            "name",
            "description",
            "program",
            "start_date",
            "end_date",
            "vacancy",
            "status",
            "leader",
        ]
        widgets = {
            "program": ModelSelect2Widget(
                model=Program,
                search_fields=[
                    "name__icontains",
                    "id__icontains",
                ],
                attrs={
                    "data-placeholder": "Search for a Job",
                    "data-allow-clear": "true",
                    "data-ajax--delay": 250,  # Delay in milliseconds
                },
            ),
        }


class JobApplicationForm(forms.ModelForm):
    class Meta:
        model = JobApplication
        fields = [
            "volunteer",
            "job",
            "status",
        ]
        widgets = {
            "volunteer": ModelSelect2Widget(
                model=VolunteerProfile,
                search_fields=[
                    "user__email__icontains",
                    "first_name__icontains",
                    "last_name__icontains",
                    "contact_number__icontains",
                ],
                attrs={
                    "data-placeholder": "Search for a Volunteer",
                    "data-allow-clear": "true",
                    "data-ajax--delay": 250,  # Delay in milliseconds
                },
            ),
            "job": ModelSelect2Widget(
                model=Job,
                search_fields=["name__icontains"],
                attrs={
                    "data-placeholder": "Search for a Job",
                    "data-allow-clear": "true",
                    "data-ajax--delay": 250,  # Delay in milliseconds
                },
            ),
        }


class JobReportForm(forms.ModelForm):
    class Meta:
        model = JobReport
        fields = [
            "volunteer",
            "job",
            "report",
        ]
        widgets = {
            "volunteer": ModelSelect2Widget(
                model=VolunteerProfile,
                search_fields=[
                    "user__email__icontains",
                    "first_name__icontains",
                    "last_name__icontains",
                    "contact_number__icontains",
                ],
                attrs={
                    "data-placeholder": "Search for a Volunteer",
                    "data-allow-clear": "true",
                    "data-ajax--delay": 250,  # Delay in milliseconds
                },
            ),
            "job": ModelSelect2Widget(
                model=Job,
                search_fields=["name__icontains"],
                attrs={
                    "data-placeholder": "Search for a Job",
                    "data-allow-clear": "true",
                    "data-ajax--delay": 250,  # Delay in milliseconds
                },
            ),
        }
