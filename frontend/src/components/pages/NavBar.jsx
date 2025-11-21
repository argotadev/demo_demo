import React, { useState } from 'react';
import '../../styles/NavBar.css';
import logo_agronat from '../../assets/agronat-logo.png';
import { useAuth } from '../../context/AuthProvider.jsx';
import { useNavigate, NavLink } from 'react-router-dom';
import { Menu, MenuItem, Typography, Divider, Box } from '@mui/material';

export const NavBar = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    logout();
    handleCloseMenu();
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Obtener el usuario autenticado
  const {user: data} = useAuth();

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark fixed-top shadow">
      <NavLink to="/welcome" className="bg-dark text-center">
        <img src={logo_agronat} alt="Logo Agronat" className="logo" />
      </NavLink>

      <ul className="navbar-nav ms-auto" style={{ display: 'flex', alignItems: 'center' }}>
        <li className="nav-item mx-3">
          <Box
            onClick={handleOpenMenu}
            sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'white' }}
          >
            <Typography sx={{ mr: 1, fontWeight: 500, color: 'success.main', fontSize: '1rem' }}>
              Hola {user?.name} {user?.lastname} !
            </Typography>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              fill="currentColor"
              className="bi bi-person-circle"
              viewBox="0 0 16 16"
            >
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
              <path
                fillRule="evenodd"
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
              />
            </svg>
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseMenu}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                borderRadius: 2,
                boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 8px',
                minWidth: 220,
                p: 1,
                bgcolor: 'background.paper',
                fontFamily: "'Roboto', sans-serif",
                fontWeight: 300,
              },
            }}
          >
            <MenuItem disabled sx={{ py: 1, fontWeight: 300, fontSize: '0.9rem' }}>
              <Typography sx={{ color: 'text.primary' }}>
                {user?.name} {user?.lastname}
              </Typography>
            </MenuItem>
            <MenuItem disabled sx={{ py: 0.5, fontWeight: 300, fontSize: '0.85rem' }}>
              <Typography sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                {user?.email}
              </Typography>
            </MenuItem>
            <Divider sx={{ my: 1 }} />
            <MenuItem
              onClick={handleLogout}
              sx={{
                fontWeight: 300,
                fontSize: '0.9rem',
                color: 'text.primary',
                '&:hover': {
                  bgcolor: 'success.light',
                  color: 'success.dark',
                },
              }}
            >
              Cerrar Sesión
            </MenuItem>
          </Menu>
        </li>
      </ul>
    </nav>
  );
};
