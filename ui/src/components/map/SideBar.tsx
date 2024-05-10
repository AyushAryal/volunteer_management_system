import { ImmutableArray, useHookstate } from '@hookstate/core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons/faClock';

import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { TabPanel, TabView } from 'primereact/tabview';

import { DataView } from 'primereact/dataview';
import { Incident, Job } from '@models/incident.ts';
import { VolunteerLoginButton } from '@components/VolunteerLoginButton.tsx';
import { get_selected_local_body } from '../../utils.ts';
import { storeState } from "@models/store.ts";
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { IncidentDetailModal } from '@components/map/IncidentDetailModal';
import { RefObject, useEffect, useState } from 'react';
import { Map } from 'leaflet';


type IncidentRibbonProps = { incident: Incident }

function IncidentRibbon({ incident }: IncidentRibbonProps) {
    let [visible, setVisible] = useState(false);

    const serverity_color_map = new Map([
        ["Critical", "var(--red-300)"],
        ["High", "var(--yellow-300)"],
        ["Moderate", "var(--teal-300)"],
        ["Low", "var(--gray-300)"],
    ]);

    const viewIncidentDetail = <IncidentDetailModal
        incident={incident.url}
        visible={visible}
        setVisible={setVisible}
    />;

    const date = new Date(incident.date);
    return (<div
        className="flex flex-column p-2 m-1 flex-wrap w-full"
        style={{
            borderLeft: `5px solid ${serverity_color_map.get(incident.severity)}`,
        }}>
        <div className="m-1"> {incident.name}</div>
        <div className="text-sm text-400 flex flex-row justify-content-between">
            <div>
                <FontAwesomeIcon icon={faClock} className="mx-2" />
                {date.toDateString()}
            </div>
            <FontAwesomeIcon icon={faAngleRight} onClick={() => setVisible(true)} />
            {visible ? viewIncidentDetail : null}
        </div>
    </div>
    );

}

function OverviewIncident() {
    const store = useHookstate(storeState);
    return <div>
        <DataView
            value={store.incidentList.get().slice()}
            itemTemplate={(incident: Incident) => <IncidentRibbon incident={incident} />}
        >
        </DataView>
    </div>
}

function OverviewJobs() {
    const store = useHookstate(storeState);

    const template = (job: Job) => {
        const start_date = new Date(job.start_date);
        const end_date = new Date(job.end_date);
        return <div className="flex flex-column flex-wrap p-2 w-full">
            <div className="m-1"> {job.name}</div>
            <div className="text-sm text-400">
                <FontAwesomeIcon icon={faClock} className="mx-2" />
                {start_date.toDateString()} - {end_date.toDateString()}
            </div>
        </div>;
    };

    return <div>
        <DataView
            value={store.jobList.get().slice()}
            itemTemplate={template}
        >
        </DataView>
    </div>
}


type Dataset = {
    label: string,
    value: number,
}

function countIncidentsInLastYearByMonth(incidents: ImmutableArray<Incident>): Dataset[] {
    const currentDate = new Date();
    const oneYearAgo = new Date(currentDate);
    oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

    const monthCounts: Dataset[] = [];
    incidents.forEach(incident => {
        let date = new Date(incident.date);
        if (date >= oneYearAgo && date <= currentDate) {
            const label = date.toISOString().slice(0, 7);
            const index = monthCounts.findIndex(entry => entry.label === label);
            if (index === -1) {
                monthCounts.push({ label, value: 1 });
            } else {
                monthCounts[index].value += 1;
            }
        }
    });

    return monthCounts;
}

export function IncidentByMonth({ chartType }: { chartType: string }) {
    const store = useHookstate(storeState);
    const dataset = countIncidentsInLastYearByMonth(store.incidentList.get());
    dataset.reverse();

    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        const data = {
            labels: dataset.map((o) => o.label),
            datasets: [
                {
                    label: 'Incident by Month',
                    data: dataset.map((o) => o.value),
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--blue-600'),
                    borderWidth: 2,
                    tension: 0.4
                },
            ]
        };
        const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, [store.incidentList]);

    return (
        <div className="card">
            <Chart type={chartType} data={chartData} options={chartOptions} />
        </div>
    )
}


function Visualizations() {
    return <div>
        <IncidentByMonth chartType="line" />
    </div>;

}

function OverviewTabpages() {
    return <TabView
        className="flex flex-column overflow-y-hidden"
        pt={{
            panelContainer: { className: "overflow-y-scroll h-full" },
            navContainer: { style: { position: "initial" } }
        }}
    >
        <TabPanel header="Visualizations">
            <Visualizations />
        </TabPanel>
        <TabPanel header="Incidents">
            <OverviewIncident />
        </TabPanel>
        <TabPanel header="Jobs">
            <OverviewJobs />
        </TabPanel>
    </TabView>;

}


type SideBarProps = { mapRef: RefObject<Map> }
export function SideBar({ mapRef }: SideBarProps) {
    let store = useHookstate(storeState);
    let federal_body = get_selected_local_body(store);

    let [visible, setVisible] = useState(false);

    useEffect(() => {
        mapRef.current?.invalidateSize(true);
    }, [visible]);

    return <div className={"relative h-screen shadow-3"} style={{ width: visible ? "80%" : "0", zIndex: 450 }}>
        <div className={`h-full overflow-x-hidden ${visible ? "" : "hidden"}`}>
            <div className="h-full flex flex-column px-3 py-2">
                <div className="flex flex-row justify-content-between ">
                    <h1 className="font-light my-1 mx-1 align-items-center"> {federal_body?.name ?? "National"} </h1>
                    <VolunteerLoginButton />
                </div>
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
                zIndex: 500,
            }}
            onClick={() => setVisible(!visible)}
        >
            <FontAwesomeIcon style={{ margin: "-50%" }} icon={`arrow-${visible ? "left" : "right"}`}></FontAwesomeIcon>
        </Button>
    </div>;
}
