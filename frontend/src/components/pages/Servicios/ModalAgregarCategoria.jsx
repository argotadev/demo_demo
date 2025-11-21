import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
} from '@mui/material';
import axios from 'axios';

  const apiUrl = import.meta.env.VITE_API_URL;

const ModalAgregarCategoria = ({ open, onClose, onSave }) => {
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Limpiar cada vez que se abre
  useEffect(() => {
    if (open) {
      setNombre('');
      setError('');
    }
  }, [open]);

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      setError('El nombre de la categoría es obligatorio');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await axios.post(`${apiUrl}/api/servicios/categorias`, { nombre: nombre.trim() });
      onSave(nombre.trim());
      onClose();
    } catch (err) {
      console.error('Error al agregar categoría:', err);
      // Intentar obtener mensaje específico del backend
      const msg = err.response?.data?.error || 'No se pudo agregar la categoría. Puede que ya exista.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNombre('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Agregar Categoría</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField
          label="Nombre de la categoría"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          fullWidth
          margin="normal"
          autoFocus
          disabled={loading}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>Cancelar</Button>
        <Button variant="contained" onClick={handleGuardar} disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalAgregarCategoria;
