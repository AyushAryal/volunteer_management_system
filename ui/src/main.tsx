import React from 'react';
import ReactDOM from 'react-dom/client';

import './assets/scss/bootstrap.scss';

import Map from './components/Map.tsx';
import LoginForm from './pages/login.tsx';
import Navbar from './components/Sidebar.tsx';
import Footer from './components/footer.tsx';
import './index.css';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Navbar/>
    <LoginForm/>
    <Map/>
    <Footer/>

  </React.StrictMode>,
);
