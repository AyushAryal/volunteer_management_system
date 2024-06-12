import json
import os

from datetime import timedelta, datetime

import federal.models
import incident.models

import requests
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from django.contrib.gis.geos import Point
from django.contrib.gis.geos import Polygon
from django.contrib.gis.db.models import Extent
from django.core.management.base import BaseCommand
from django.utils import timezone


class Command(BaseCommand):
    def update_incident_data(self):
        path = settings.BASE_DIR / "shared" / "incidents.json"
        if os.path.exists(path):
            with open(path, "r") as json_data:
                preivious_incident_data = json.load(json_data)

                response = requests.get("https://bipadportal.gov.np/api/v1/incident/?format=json&limit=1000000000")"
                if response.status_code == 200:
                    self.stdout.write(
                        self.style.SUCCESS(f"New incident with incident ID.")
                    )
                    
                else:
                    print(response.status_code)
                    start = False
                    raise RuntimeError("Could not get a response.")

                print(data)

                for x in range(100000):
                    print([x, preivious_incident_data["results"][x]["id"]])

    def handle(self, *_, **__):
        self.update_incident_data()