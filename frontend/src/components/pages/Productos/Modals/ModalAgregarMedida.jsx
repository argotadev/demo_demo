import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';
import CustomSnackbar from '../../Alert/CustomSnackbar';

const apiUrl = import.meta.env.VITE_API_URL;

const ModalAgregarMedida = ({ open, onClose, onSuccess }) => {
  const [medida, setMedida] = useState({
    name: '',
    abbreviation: ''
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
    setMedida(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!medida.name) {
        throw new Error('El nombre de la medida es requerido');
      }

      const response = await axios.post(`${apiUrl}/api/measures/register`, medida, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      //mostrar alerta de exito
      setSnackbarConfig({
        open: true,
        message: 'Categoria agregada correctamente',
        severity: 'success',
      });

      setMedida({ name: '', abbreviation: '' });

      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 1000);

    } catch (error) {
      console.error('Error al registrar medida:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al registrar la medida';
      setSnackbarConfig({
        open: true,
        message: 'Error al agregar la medida',
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
          <Typography variant="h6" mb={2}>Agregar Medida</Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              name="name"
              label="Nombre de la medida"
              fullWidth
              margin="normal"
              required
              value={medida.name}
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
              {loading ? 'Guardando...' : 'Guardar Medida'}
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

export default ModalAgregarMedida;
