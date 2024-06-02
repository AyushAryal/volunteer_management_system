import { MouseEventHandler, useState } from "react";
import { SpeedDial } from "primereact/speeddial";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faFilter, faLayerGroup, faLocation } from "@fortawesome/free-solid-svg-icons";
import { Button } from "primereact/button";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { GlobalLocationSelector } from "@components/map/GlobalLocationSelector";
import { TimeFilter } from "@components/map/TimeFilter";
import { FederalPolygonsSelector } from "@components/map/FederalPolygonsSelector";


type ButtonSeverity = 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'help' | undefined;

function MapControlButton({ severity, icon, onClick }
    : { severity?: ButtonSeverity, icon: IconProp, onClick?: MouseEventHandler<HTMLButtonElement> }) {
    return <Button
        className="flex justify-content-center"
        severity={severity}
        onClick={onClick}
        style={{
            borderRadius: "50%",
            height: "2.5rem",
            width: "2.5rem",
        }}
    >
        <FontAwesomeIcon
            icon={icon}
            style={{
                fontSize: "2rem",
                height: "1.2rem",
                width: "1.2rem",
            }}
        />
    </Button>;
}

type MapControlType = "location" | "time" | "vector_layers"

export function MapControls() {
    let [currentItem, setCurrentItem] = useState<MapControlType>();
    const items = [
        {
            template: <MapControlButton
                severity="secondary"
                icon={faClock}
                onClick={() => {
                    setCurrentItem("time");
                }}
            />,
        },
        {
            template: <MapControlButton
                severity="secondary"
                icon={faLocation}
                onClick={() => {
                    setCurrentItem("location");
                }}
            />,
        },
        {
            template: <MapControlButton
                severity="secondary"
                icon={faLayerGroup}
                onClick={() => {
                    setCurrentItem("vector_layers");
                }}
            />,
        },
    ];
    let control = null;

    if (currentItem === "location") {
        control = <GlobalLocationSelector className="flex-column"/>;
    } else if (currentItem === "time") {
        control = <TimeFilter />;
    } else if (currentItem === "vector_layers") {
        control = <FederalPolygonsSelector />;
    }

    return <>
        <SpeedDial
            model={items}
            visible={true}
            direction="left"
            style={{ right: 0 }}
            hideOnClickOutside={false}
            buttonTemplate={
                (options) => <MapControlButton icon={faFilter} onClick={options.onClick} />
            }
            onHide={() => { setCurrentItem(undefined); }}
        />
        <div style={{ position: "absolute", right: "0.2rem", top: "3rem" }}>
            {control}
        </div>
    </>
}
