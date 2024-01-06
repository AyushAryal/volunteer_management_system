"""
URL configuration for volunteer_management_system project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path, include, re_path
from django.views.generic.base import RedirectView

from rest_framework.routers import DefaultRouter

import user.views as views


router = DefaultRouter()
router.register(prefix="profile", viewset=views.ProfileViewSet)
router.register(prefix="incident", viewset=views.IncidentViewSet)
router.register(prefix="programme", viewset=views.ProgrammeViewSet)
router.register(prefix="job", viewset=views.JobViewSet)


favicon_view = RedirectView.as_view(url="/static/favicon.ico", permanent=True)

urlpatterns = [
    path("admin/", include("administrator.urls")),
    path(
        "api/",
        include(
            router.urls,
        ),
    ),
    re_path(r"^favicon\.ico$", favicon_view),
]
