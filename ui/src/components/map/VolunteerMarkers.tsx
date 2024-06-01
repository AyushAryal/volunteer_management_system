import { useHookstate } from '@hookstate/core'
import { VolunteerGeotag } from '@models/incident';
import { storeState } from '@models/store';
import { CircleMarker } from 'react-leaflet/CircleMarker'

export function VolunteerMarkers() {
    let volunteersGeotagList = useHookstate(storeState.volunteersGeotagList);

    let markers = (volunteersGeotagList.get() as VolunteerGeotag[]).map((geotag: VolunteerGeotag, index: number) => {
        return <CircleMarker
            fill={true}
            fillOpacity={0.6}
            color='#5472d4'
            key={index}
            center={geotag.point}
            radius={2}
            pane="markerPane"
        >
        </CircleMarker >;
    });
    return <> {...markers} </>;
}
