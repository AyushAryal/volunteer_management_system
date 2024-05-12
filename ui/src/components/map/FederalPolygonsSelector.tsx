import { useHookstate } from "@hookstate/core";
import { storeState } from "@models/store";
import { Checkbox } from "primereact/checkbox";

export function FederalPolygonsSelector() {
    const mapControls = useHookstate(storeState.mapControls);
    return <div
        className="gap-3 bg-white p-3 text-base shadow-5 border-round-lg border-2 border-primary"
        style={{
            display: "grid",
            gridTemplateColumns: "auto auto",
        }}
    >
        <div className="flex flex-row gap-2 align-items-center">
            <Checkbox
                checked={mapControls.showProvinceBorders.get()}
                onChange={(e) => mapControls.showProvinceBorders.set(e.checked ?? false)}
            />
            <span> Provinces </span>
        </div>
        <div className="flex flex-row gap-2 align-items-center">
            <Checkbox
                checked={mapControls.showDistrictBorders.get()}
                onChange={(e) => mapControls.showDistrictBorders.set(e.checked ?? false)}
            />
            <span> Districts</span>
        </div>
        <div className="flex flex-row gap-2 align-items-center">
            <Checkbox
                checked={mapControls.showMunicipalityBorders.get()}
                onChange={(e) => mapControls.showMunicipalityBorders.set(e.checked ?? false)}
            />
            <span> Municipalities </span>
        </div>
        <div className="flex flex-row gap-2 align-items-center">
            <Checkbox
                checked={mapControls.showWardBorders.get()}
                onChange={(e) => mapControls.showWardBorders.set(e.checked ?? false)}
            />
            <span> Wards </span>
        </div>
    </div>;
}
