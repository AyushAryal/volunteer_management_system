import { IncidentDetailModal } from '@components/map/sidebar/IncidentDetailModal';
import { useHookstate } from '@hookstate/core'
import { Incident } from '@models/incident';
import { storeState } from '@models/store';
import { useState } from 'react';
import { CircleMarker } from 'react-leaflet/CircleMarker'
import { Tooltip } from 'react-leaflet/Tooltip';

export function IncidentMarkers() {
    let incidentList = useHookstate(storeState.incidentList);
    let [incidentModalUrl, setIncidentModalUrl] = useState("");

    const viewIncidentDetail = incidentModalUrl.length == 0 ? null : <IncidentDetailModal
        incident={incidentModalUrl}
        visible={incidentModalUrl.length != 0}
        setVisible={(visible: boolean) => {
            if (!visible) { setIncidentModalUrl(""); }
        }}
    />;


    let markers = (incidentList.get() as Incident[]).map((incident: Incident) => {
        return <CircleMarker
            fill={true}
            fillOpacity={0.6}
            color='#5472d4'
            key={incident.url}
            center={incident.point}
            radius={5}
            pane="markerPane"
            eventHandlers={{
                click: () => setIncidentModalUrl(incident.url),
            }}
        >
            <Tooltip opacity={0.8} className="bg-primary-50 border-round-lg">
                <div className="flex flex-column">
                    <div className="font-semibold text-base">{incident.name}</div>
                    <div className="font-semibold font-xs font-italic text-primary align-self-end">{incident.date.toDateString()}</div>
                    <div className="font-semibold">{incident.jobs} Jobs</div>
                    <div className="font-semibold">{incident.programs} Programs</div>
                </div>
            </Tooltip>
        </CircleMarker >;
    });
    return <> {...markers} {viewIncidentDetail} </>;
}
