import React from 'react';
import { Sidebar } from '../Sidebar.jsx';
import { NavBar } from '../NavBar.jsx';
import { Outlet } from 'react-router-dom';
import { Footer } from '../../layout/Footer.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../styles/Layout.css';  // Asegúrate de importar el archivo CSS

export const Layout = () => {
  return (
    <div className="d-flex" id="wrapper" style={{ height: '100vh', width: '100vw' }}>
      {/* Sidebar */}
      <Sidebar style={{ height: '100%' }} />

      {/* Contenido principal */}
      <div id="page-content-wrapper" className="d-flex flex-column flex-fill" style={{ width: '100%', marginTop: '100px' }}>
        {/* Navbar */}
        <NavBar />

        {/* Contenido principal */}
        <div className="container-fluid flex-grow-1" style={{ overflowY: 'auto' }}>
          <Outlet />
        </div>

        
      </div>
    </div>
  );
};