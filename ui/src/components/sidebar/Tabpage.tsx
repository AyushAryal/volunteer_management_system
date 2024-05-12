import { TabPanel, TabView } from 'primereact/tabview';
import { Visualizations } from '@components/sidebar/Visualizations';
import { Jobs } from '@components/sidebar/Jobs';
import { Incidents } from '@components/sidebar/Incidents';

export function Tabpage() {
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
            <Incidents />
        </TabPanel>
        <TabPanel header="Jobs">
            <Jobs />
        </TabPanel>
    </TabView>;
}
