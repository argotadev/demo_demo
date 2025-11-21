import React from 'react';
import { NavLink } from 'react-router-dom';
import logo_agronat from '../../assets/agronat-logo.png';

export const Header = () => {
  return (
    <header className="header d-flex justify-content-center align-items-center" style={{ height: '180px', padding: '5px', backgroundColor: '#f8f9fa' }}>
      <NavLink to={'/inicio'}>
        <img src={logo_agronat} alt="logo de agronat" className=" img-fluid" style={{ maxWidth: '100%', height: 'auto' }} />
      </NavLink>
    </header>
  );
};
