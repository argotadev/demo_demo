import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';
import CustomSnackbar from '../../Alert/CustomSnackbar';

const apiUrl = import.meta.env.VITE_API_URL;

const ModalAgregarCategoria = ({ open, onClose, onSuccess }) => {
  const [categoria, setCategoria] = useState({
    name: ''
  });

  //esto es para la alerta 
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
    setCategoria(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!categoria.name) {
        throw new Error('El nombre de la categoría es requerido');
      }

      const response = await axios.post(`${apiUrl}/api/categories/register`, categoria, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Mostrar alerta de éxito
      setSnackbarConfig({
        open: true,
        message: 'Categoria agregada correctamente',
        severity: 'success',
      });

      // Resetear formulario
      setCategoria({ name: '' });

      // Cerrar modal
      onClose();
      
      // Actualizar lista si es necesario
      if (onSuccess) onSuccess();

    } catch (error) {
      console.error('Error al registrar categoría:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al registrar la categoría';
      setSnackbarConfig({
        open: true,
        message: 'Error al agregar la categoria',
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
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4
        }}>
          <Typography variant="h6" mb={2}>Agregar Categoría</Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              name="name"
              label="Nombre de la categoría"
              fullWidth
              margin="normal"
              required
              value={categoria.name}
              onChange={handleChange}
              disabled={loading}
            />
            
            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? 'Guardando...' : 'Guardar Categoría'}
            </Button>
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

export default ModalAgregarCategoria;