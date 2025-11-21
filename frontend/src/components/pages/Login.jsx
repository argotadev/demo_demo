import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Login.css';
import { useAuth } from '../../context/AuthProvider.jsx';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { useNavigate, Navigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import api from '../../api/axiosInstance';

export const Login = () => {
  const { isLoggedIn, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  if (isLoggedIn) {
    return <Navigate to="/welcome" />;
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/user/login', { email, password });

      const { token, ...userData } = response.data;

      if (!token) {
        throw new Error('No se recibió token de autenticación');
      }

      // Guardar token y datos del usuario en el contexto
      login(token, userData);

      // Redirigir
      navigate('/welcome');
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      if (error.response) {
        if (error.response.status === 404 || error.response.status === 401) {
          setError('Usuario y contraseña incorrectos');
        } else if (error.response.data?.message) {
          setError(error.response.data.message);
        }
      } else if (error.code === 'ECONNABORTED') {
        setError('El servidor no respondió a tiempo');
      } else {
        setError('Error en el login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-login">
      <div className="wrap-login">
        <form className="login-form validate-form" onSubmit={handleSubmit}>
          <span className="login-form-title">INGRESAR</span>

          <div className="modal-input" style={{ marginBottom: '16px' }}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              variant="standard"
              InputProps={{ disableUnderline: false }}
            />
          </div>

          <div className="modal-input" style={{ marginBottom: '8px' }}>
            <TextField
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              variant="standard"
              InputProps={{
                disableUnderline: false,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility}>
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {error && (
              <div className="text-danger mt-2" style={{ fontSize: '0.875rem' }}>
                {error}
              </div>
            )}
          </div>

          <div className="container-login-form-btn">
            <div className="wrap-login-form-btn">
              <div className="login-form-bgbtn"></div>
              <button type="submit" className="login-form-btn" disabled={loading}>
                {loading ? 'Cargando...' : 'INICIAR SESIÓN'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
