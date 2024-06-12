import os
import json
import tempfile
import requests
from datetime import datetime

from django.conf import settings
from django.contrib.gis.geos import Point
from celery import shared_task

import federal.models
import incident.models


def update_incidents():
    file = tempfile.NamedTemporaryFile(delete=False)
    response = requests.get(
        "https://bipadportal.gov.np/api/v1/incident/?format=json&limit=1000000000"
    )

    if response.status_code == 200:
        with open(file.name, "wb") as file:
            file.write(response.content)
    else:
        raise RuntimeError("Could not get a response")

    incidents = []
    with open(file.name, encoding="utf8") as f:
        response = json.load(f)
        results = response["results"]
        for result in results:
            ward_id = result["wards"][0]
            ward = federal.models.Ward.objects.get(pk=ward_id)
            date = datetime.fromisoformat(result["incidentOn"])
            if not ward or not result["id"]:
                print(result["id"], result["title"], ward, date)
            incident_ = incident.models.Incident(
                pk=result["id"],
                name=result["title"],
                date=date,
                description=result["description"] or "",
                ward=ward,
                severity=incident.models.IncidentSeverity.Moderate,
                point=Point(result["point"]["coordinates"]),
            )
            incidents.append(incident_)
    os.remove(file.name)
    incident.models.Incident.objects.bulk_create(
        incidents,
        update_conflicts=True,
        update_fields=("name", "date", "description", "ward", "severity", "point"),
        unique_fields=("pk",),
    )


if settings.DEBUG:

    class async_update_incidents:
        @staticmethod
        def delay(*args, **kwargs):
            return update_incidents(*args, **kwargs)

else:

    @shared_task
    def async_update_incidents():
        update_incidents()
