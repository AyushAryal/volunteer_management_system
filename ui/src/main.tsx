import React from 'react';
import ReactDOM from 'react-dom/client';

import Map from './components/Map.tsx';
import Sidebar from './components/Sidebar.tsx';
import './index.css';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Sidebar />
  </React.StrictMode>,
);
