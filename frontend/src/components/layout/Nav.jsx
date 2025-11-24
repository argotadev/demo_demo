import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/Login.css';

export const Nav = () => {
  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-success">
    <div className="container-fluid">
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav w-100 justify-content-around">
          <li className="nav-item">
            <NavLink to="/inicio" className="nav-link">
              Inicio
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/quiensoy" className="nav-link">
              ¿Quiénes Somos?
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/Servicios" className="nav-link">
              Servicios
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/contacto" className="nav-link">
              Contacto
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/login" className="nav-link">
              Iniciar Sesión
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  

  );
};
