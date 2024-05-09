import requests
import incident.models
import federal.models


def get_incident_from_bipad() -> list[dict]:
    endpoint = "https://bipadportal.gov.np/api/v1/incident/?format=json&limit=10"
    response = requests.get(endpoint)

    if response.status_code == 200:
        data = response.json()
        results = data["results"]
        incidents = []
        for result in results:
            incidents.append(
                {
                    "name": result["title"],
                    "date": result["incidentOn"],
                    "description": result["description"],
                    "municipality": federal.models.Municipality(pk=1),
                    "point": result["point"]["coordinates"],
                }
            )
        return incidents
    else:
        raise RuntimeError("Could not get a response")


def load_incident():
    incident_array = get_incident_from_bipad()
    for incident_ in incident_array:
        severity = incident.models.IncidentSeverity.Moderate
        incident_db = incident.models.Incident(**incident_, severity=severity)
        incident_db.save()
