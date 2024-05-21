from rest_framework import routers

from . import views

app_name = "incident"

router = routers.DefaultRouter()

router.register("site_content", views.SiteContentViewSet, basename="site_content")
router.register("volunteer", views.VolunteerProfileViewSet, basename="volunteer")
router.register("incident", views.IncidentViewSet, basename="incident")
router.register("program", views.ProgramViewSet, basename="program")
router.register("job", views.JobViewSet, basename="job")
router.register("statistics", views.StatisticsViewSet, basename="statistics")
