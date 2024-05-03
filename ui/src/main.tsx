import React from 'react';
import ReactDOM from 'react-dom/client';

import 'primeflex/primeflex.css';
import 'primereact/resources/themes/viva-light/theme.css';

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
import { Signup } from './pages/Signup.tsx';


function Main() {
    const pt = {
        password: {
            root: { style: { width: "100%" } },
            input: { style: { width: "100%" } }
        },
        inputtext: {
            root: {
                style: {
                    padding: "0.5em 0.5em",
                }
            }
        }
    };
    return <React.StrictMode>
        <PrimeReactProvider value={{ pt }}>
            <Signup />
        </PrimeReactProvider>
    </React.StrictMode>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Main />);
