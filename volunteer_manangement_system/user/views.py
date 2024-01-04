from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import Profile, Incident, Programme, Job
from .serializers import (
    ProfileSerializer,
    IncidentSerializer,
    ProgrammeSerializer,
    JobSerializer,
)


class ProfileViewSet(ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer


class IncidentViewSet(ModelViewSet):
    queryset = Incident.objects.all()
    serializer_class = IncidentSerializer


class ProgrammeViewSet(ModelViewSet):
    queryset = Programme.objects.all()
    serializer_class = ProgrammeSerializer


class JobViewSet(ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer


# Create your views here.
