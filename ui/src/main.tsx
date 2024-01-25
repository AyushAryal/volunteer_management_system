import React from 'react';
import ReactDOM from 'react-dom/client';

import 'primeflex/primeflex.css';
import "primereact/resources/themes/viva-light/theme.css";

import 'leaflet/dist/leaflet.css';

import Chart from 'chart.js/auto';

import './index.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
library.add(fas, far, fab);

import { PrimeReactProvider } from 'primereact/api';

import { Map } from './components/map/Map.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <PrimeReactProvider>
            <Map />
        </PrimeReactProvider>
    </React.StrictMode>,
);
