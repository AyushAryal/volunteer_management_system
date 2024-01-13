from rest_framework.permissions import BasePermission, IsAuthenticated

from . import models


class IsVolunteer(BasePermission):
    def has_permission(self, request, _):
        return hasattr(request.user, "volunteer")


class IsOwner(IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        return request.user.is_superuser or {
            models.VolunteerProfile: self.owns_volunteer_profile,
        }[type(obj)](request, view, obj)

    def owns_volunteer_profile(self, request, _, volunteer):
        return (
            hasattr(request.user, "volunteer") and request.user.volunteer == volunteer
        )
