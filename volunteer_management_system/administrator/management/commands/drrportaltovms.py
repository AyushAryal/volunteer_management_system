import requests


def get_Drr_incident():
    endpoint = "http://drrportal.gov.np/dataapi/incidents"
    response = requests.get(endpoint)
    if response.status_code == 200:
        results = response.json()
        incident = []
        for result in results:
            incident.append(
                {
                    "incidentId": result["IncidentID"],
                    "municipality": result["Local Government Name"],
                    "name": f"{result["Incident Type Name"]} at {result["Local Government Name"]}",
                    "description": result["Description"],
                    "date": result["Incident Date"],
                    "point": (
                        result["Incident Longitude"],
                        result["Incident Latitude"],
                    ),
                }
            )
        return incident
    else:
        raise RuntimeWarning("Could not get response from DRR portal")


def drr_incient_to_vms_incident():
    incidents = get_Drr_incident()
    print(incidents)


drr_incient_to_vms_incident()
