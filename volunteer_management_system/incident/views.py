from authentication import utils
from authentication.signals import new_verification_link
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from rest_framework import permissions, status, viewsets
from rest_framework.response import Response

from . import models
from . import permissions as incident_permissions
from . import serializers


class VolunteerProfileViewSet(
    viewsets.mixins.ListModelMixin,
    viewsets.mixins.RetrieveModelMixin,
    viewsets.mixins.CreateModelMixin,
    viewsets.mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    """
    Endpoint for profile resource. Also includes signup as a profile.

    ---
    ## POST /volunteer

    Use the POST method to create a new profile.
    **This is usually what you use to signup as a volunteer.**

    Use the OPTIONS method to view details on the fields.
    (You can use the OPTIONS button above)

    ---

    ### Example request body

    ```
    {
        "email": "profile@example.com",
        "password": "shark@123",
        "volunteer": {
            "full_name": "Name",
            "profile_image": ???,
            "date_of_birth": "2022-01-01",
            "gender": "Male",
            "nationality": "National",
            "blood_group": "O Positive",
            "municipality": "???",
        }
    }
    ```

    ---

    ## PUT | PATCH /volunteer/*id*

    Use the PUT/PATCH method to update the user information
    (excluding password and email).

    *id* is the User ID. You can get this from token endpoint.

    Password and email are **sensitive**, requiring you to reenter your password.
    Use endpoints in `/user` to change these values.

    ---

    ### Example request body:
    ```
        {
            "full_name": "Name",
            "profile_image": ???,
            "date_of_birth": "2022-01-01",
            "gender": "Male",
            "nationality": "National",
            "blood_group": "O Positive",
            "municipality": "???",
        }
    ```

    ---
    """

    queryset = models.VolunteerProfile.objects.all()
    serializer_class = serializers.VolunteerProfileSerializer

    def get_serializer_class(self):
        return {
            "create": serializers.VolunteerSignupSerializer,
        }.get(self.action, super().get_serializer_class())

    def get_queryset(self):
        return {"create": get_user_model().objects.all()}.get(
            self.action, super().get_queryset()
        )

    def get_permissions(self):
        permissions_classes = {
            "list": [permissions.IsAuthenticated],
            "retrieve": [incident_permissions.IsOwner],
            "create": [permissions.AllowAny],
            "update": [incident_permissions.IsOwner],
            "partial_update": [incident_permissions.IsOwner],
        }.get(self.action, [permissions.IsAdminUser])
        return (permission() for permission in permissions_classes)

    def list(self, request, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        if hasattr(request.user, "volunteer"):
            return Response(
                serializer_class(
                    request.user.volunteer, context={"request": request}
                ).data
            )
        return Response(
            {"detail": _("No profile present for this user")},
            status=status.HTTP_400_BAD_REQUEST,
        )

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = self.get_queryset().filter(email=response.data["email"]).first()
        link = utils.get_verification_link(request, user)
        new_verification_link.send(sender=self.__class__, link=link, user=user)
        return response


class IncidentViewSet(
    viewsets.GenericViewSet,
    viewsets.mixins.RetrieveModelMixin,
    viewsets.mixins.ListModelMixin,
):
    queryset = models.Incident.objects.all()
    serializer_class = serializers.IncidentSerializer
    pagination_class = None


class ProgramViewSet(
    viewsets.GenericViewSet,
    viewsets.mixins.RetrieveModelMixin,
    viewsets.mixins.ListModelMixin,
):
    queryset = models.Program.objects.all()
    serializer_class = serializers.ProgramSerializer
    pagination_class = None


class JobViewSet(
    viewsets.GenericViewSet,
    viewsets.mixins.RetrieveModelMixin,
    viewsets.mixins.ListModelMixin,
):
    queryset = models.Job.objects.all()
    serializer_class = serializers.JobSerializer
    pagination_class = None
