import { useHookstate } from '@hookstate/core';

import { storeState } from '@models/store.ts';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';


export function LoadingDisplay() {
    const loaded = useHookstate(storeState.loaded);

    let loadingMessageMap = new Map<string, string>([
        ["provinceList", "Loading Provinces..."],
        ["districtList", "Loading Districts..."],
        ["municipalityList", "Loading Municipalities..."],
        ["incidentList", "Loading Incidents..."],
        ["jobList", "Loading Jobs..."],
        ["programList", "Loading Programs..."],
        ["wardList", "Loading Wards..."],
        ["notificationList", "Loading Notifications..."],
    ]);

    let messages = Object.entries(loaded)
        .filter(([_, state]) => !state.get())
        .map(([key, _]) => loadingMessageMap.get(key) ?? `Loading ${key}...`);

    let messageTemplate = (message: string) => (
        <div key={message}>
            <span> {message} </span>
            <br />
        </div>
    );

    return <Dialog
        showHeader={false}
        modal={false}
        closable={false}
        visible={messages.length != 0}
        position={"bottom-right"}
        onHide={() => { }}
        contentStyle={{ padding: "0 2rem", background: "#00000090" }}
    >
        <div className="flex align-items-center justify-content-around gap-4">
            <ProgressSpinner
                style={{
                    width: '30px',
                    height: '30px'
                }}
                pt={{
                    circle: {
                        style: {
                            animation: "p-progress-spinner-dash 1.5s ease-in-out infinite, ease-in-out infinite",
                            stroke: "white"
                        }
                    }
                }}
            />
            <h4 className="text-white"> {messages.map(messageTemplate)} </h4>
        </div>
    </Dialog>;
}
