from rest_framework import routers

from . import views

app_name = "incident"

router = routers.DefaultRouter()

router.register("profile", views.ProfileViewSet, basename="profile")
router.register("incident", views.IncidentViewSet, basename="incident")
router.register("programme", views.ProgrammeViewSet, basename="programme")
router.register("job", views.JobViewSet, basename="job")
