import { useState } from 'react';

import { Button } from 'primereact/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TabPanel, TabView } from 'primereact/tabview';
import { useHookstate } from '@hookstate/core';

import { storeState } from "../models/store.ts";
import { get_selected_local_body } from '../utils.ts';


function OverviewIncident() {
    return null;
}

function OverviewJobs() {
    return null;
}

function OverviewTabpages() {
    return <TabView>
        <TabPanel header="Incidents">
            <OverviewIncident />
        </TabPanel>
        <TabPanel header="Jobs">
            <OverviewJobs />
        </TabPanel>
    </TabView>;

}



export function SideBar() {
    let [show, setShow] = useState(false);
    let store = useHookstate(storeState);

    let federal_body = get_selected_local_body(store);

    return <div className={"relative h-full shadow-3"} style={{ width: show ? "50%" : "0", zIndex: 450 }}>
        <div className={show ? "" : "hidden"}>
            <div className="flex flex-column flex-wrap px-5">
                <h1 className="font-light"> {federal_body?.name ?? "National"} </h1>
                <OverviewTabpages />
            </div>
        </div>
        <Button
            rounded
            className="absolute shadow-4"
            style={{
                top: "50%",
                right: "-20px",
                width: "40px",
                height: "40px",
                overflow: "visible",
                zIndex: 500
            }}
            onClick={() => setShow((show) => !show)}
        >
            <FontAwesomeIcon icon={`arrow-${show ? "left" : "right"}`}></FontAwesomeIcon>
        </Button>
    </div>;
}
