import { useHookstate } from '@hookstate/core';

import { storeState } from '@models/store.ts';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useTranslation } from 'react-i18next';


export function LoadingDisplay() {
    const loaded = useHookstate(storeState.loaded);
    const { t } = useTranslation();
    let loadingMessageMap = new Map<string, string>([
        ["provinceList", t("Loading Provinces")+"..."],
        ["districtList", t("Loading Districts")+"..."],
        ["municipalityList", t("Loading Municipalities")+"..."],
        ["incidentList", t("Loading Incidents")+"..."],
        ["jobList", t("Loading Jobs")+"..."],
        ["programList", t("Loading Programs")+"..."],
        ["wardList", t("Loading Wards")+"..."],
        ["notificationList", t("Loading Notifications")+"..."],
        ["volunteersGeotagList", t("Loading volunteer locations")+"..."],
    ]);

    let messages = Object.entries(loaded)
        .filter(([_, state]) => !state.get())
        .map(([key, _]) => loadingMessageMap.get(key) ?? `${t("Loading")} ${t(key)}...`);

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
