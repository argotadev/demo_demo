import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography, Grid, IconButton, InputAdornment } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from 'axios'; // Importamos axios para las peticiones HTTP

// Usa la variable de entorno VITE_API_URL
const apiUrl = import.meta.env.VITE_API_URL;


const ModalAgregarUsuario = ({ openModal, handleCloseModal, handleAddUser }) => {
  const [newUser, setNewUser] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    domicilio: {
      calle: '',
      numero: '',
      ciudad: '',
      provincia: '',
      codigo_postal: '',
    },
    dni: '',
    cel: '',
    nickname: '',
    rol: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Comprobamos si el nombre del campo tiene un punto (para campos anidados)
    if (name.includes('.')) {
      const [parent, child] = name.split('.'); // Separar la parte antes y después del punto
      setNewUser((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value, // Actualizar solo el campo hijo
        },
      }));
    } else {
      setNewUser((prev) => ({
        ...prev,
        [name]: value, // Actualizar el campo directo
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = {
        name: newUser.name,
        lastname: newUser.lastname,
        email: newUser.email,
        password: newUser.password,
        confirmPassword: newUser.confirmPassword,
        domicilio: {
            calle: newUser.domicilio.calle,
            numero: newUser.domicilio.numero,
            ciudad: newUser.domicilio.ciudad,
            provincia: newUser.domicilio.provincia,
            codigo_postal: newUser.domicilio.codigo_postal,
        },
        dni: newUser.dni,
        cel: newUser.cel,
        nickname: newUser.nickname,
        rol: newUser.rol,
    };
    
    try {
      const response = await axios.post(
          `${apiUrl}/api/user/register`,
          data,
          {
              headers: {
                  'Content-Type': 'application/json'
              }
          }
      );

      if (response.data.status === 'success') {
          alert('Registro exitoso!');
          // Redirigir o manejar el éxito
      } else {
          throw new Error(response.data.message || 'Error en el registro');
      }
  } catch (error) {
      console.error('Error completo:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Error al registrar usuario');
  }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Modal open={openModal} onClose={handleCloseModal}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          maxHeight: '80vh',
          overflowY: 'auto',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <AddCircleOutlineIcon /> Nuevo usuario
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Primera columna */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre"
                name="name"
                value={newUser.name}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Apellido"
                name="lastname"
                value={newUser.lastname}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Correo"
                name="email"
                value={newUser.email}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Contraseña"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={newUser.password}
                onChange={handleChange}
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Confirmar Contraseña"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={newUser.confirmPassword}
                onChange={handleChange}
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={toggleConfirmPasswordVisibility} edge="end">
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Segunda columna */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Calle"
                name="domicilio.calle"
                value={newUser.domicilio.calle}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Número"
                name="domicilio.numero"
                value={newUser.domicilio.numero}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Ciudad"
                name="domicilio.ciudad"
                value={newUser.domicilio.ciudad}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Provincia"
                name="domicilio.provincia"
                value={newUser.domicilio.provincia}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="DNI"
                name="dni"
                value={newUser.dni}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Código Postal"
                name="domicilio.codigo_postal"
                value={newUser.domicilio.codigo_postal}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                select
                fullWidth
                label="Rol"
                name="rol"
                value={newUser.rol}
                onChange={handleChange}
                margin="normal"
                SelectProps={{
                  native: true, // Opcional: true para select nativo, false para estilos personalizados
                }}
              >
                <option value="">Seleccione un rol</option>
                <option value="administrador">Administrador</option>
                <option value="vendedor">Vendedor</option>
              </TextField>
            </Grid>
          </Grid>

          <Grid container spacing={2} mt={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Celular"
                name="cel"
                value={newUser.cel}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Apodo"
                name="nickname"
                value={newUser.nickname}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Agregar Usuario
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalAgregarUsuario;
