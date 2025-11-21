import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Grid } from '@mui/material';
import CustomSnackbar from '../../Alert/CustomSnackbar.jsx';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const ModalAgregarProveedor = ({ open, onClose, onSuccess }) => {
  const [proveedor, setProveedor] = useState({
    name: '',
    lastname: '',
    email: '',
    cel: '',
    domicilio: {
      calle: '',
      numero: '', 
      ciudad: '',
      provincia: '',
      codigo_postal: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [snackbarConfig, setSnackbarConfig] = useState({
    open: false,
    message: '',
    severity: 'info',
    autoHideDuration: 3000
  });

  // Maneja el cierre del Snackbar
  const handleSnackbarClose = () => {
    setSnackbarConfig((prevState) => ({ ...prevState, open: false }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('domicilio.')) {
      const domicilioField = name.split('.')[1];
      setProveedor(prev => ({
        ...prev,
        domicilio: {
          ...prev.domicilio,
          [domicilioField]: value
        }
      }));
    } else {
      setProveedor(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      
      //log para saber que estoy mandando
      console.log(proveedor);
      const response = await axios.post(`${apiUrl}/api/provider/register_products`, proveedor, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Mostrar alerta de éxito
      setSnackbarConfig({
        open: true,
        message: 'Proveedor agregado correctamente',
        severity: 'success',
      });

      // Resetear formulario
      setProveedor({
        name: '',
        lastname: '',
        email: '',
        cel: '',
        domicilio: {
          calle: '',
          numero: '',
          ciudad: '',
          provincia: '',
          codigo_postal: ''
        }
      });

      // Cerrar modal
      onClose();
      
      // Actualizar lista de proveedores si se proporcionó la función
      if (onSuccess) onSuccess();

    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al registrar proveedor';
      setSnackbarConfig({
        open: true,
        message: 'Error al agregar el proveedor',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600, 
          bgcolor: 'background.paper',
          borderRadius: 2, 
          boxShadow: 24, 
          p: 4,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}>
          <Typography variant="h6" mb={2}>Agregar Nuevo Proveedor / Marca</Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  name="name"
                  label="Nombre / Marca"
                  fullWidth
                  margin="normal"
                  required
                  value={proveedor.name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="lastname"
                  label="Apellido"
                  fullWidth
                  margin="normal"
                  value={proveedor.lastname}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                  margin="normal"
                  value={proveedor.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="cel"
                  label="Teléfono/Celular"
                  fullWidth
                  margin="normal"
                  value={proveedor.cel}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" mt={2} mb={1}>Domicilio</Typography>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  name="domicilio.calle"
                  label="Calle"
                  fullWidth
                  margin="normal"
                  value={proveedor.domicilio.calle}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  name="domicilio.numero"
                  label="Número"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={proveedor.domicilio.numero}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="domicilio.ciudad"
                  label="Ciudad"
                  fullWidth
                  margin="normal"
                  value={proveedor.domicilio.ciudad}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="domicilio.provincia"
                  label="Provincia"
                  fullWidth
                  margin="normal"
                  value={proveedor.domicilio.provincia}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="domicilio.codigo_postal"
                  label="Código Postal"
                  fullWidth
                  margin="normal"
                  value={proveedor.domicilio.codigo_postal}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="success"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Proveedor'}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>

      {/* Alerta */}
      <CustomSnackbar
        snackbarConfig={snackbarConfig}
        handleSnackbarClose={handleSnackbarClose}
      />
    </>
  );
};

export default ModalAgregarProveedor;