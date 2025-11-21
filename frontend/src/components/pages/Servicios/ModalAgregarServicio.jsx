import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';

const API_URL = import.meta.env.VITE_API_URL;

const ModalAgregarServicio = ({
  open,
  onClose,
  servicioEditando,
  onSaveSuccess, // función para refrescar lista en componente padre después de guardar
}) => {
  const [servicio, setServicio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [costo, setCosto] = useState('');
  const [descuento, setDescuento] = useState(0);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Traer categorías al abrir modal
  useEffect(() => {
    if (open) {
      const fetchCategorias = async () => {
        try {
          const res = await axios.get(`${API_URL}/api/servicios/categorias`);
          setCategorias(res.data);
        } catch (err) {
          console.error('Error al obtener categorías:', err);
        }
      };
      fetchCategorias();
    }
  }, [open]);

  // Cargar datos para editar
  useEffect(() => {
    if (servicioEditando) {
      setServicio(servicioEditando.servicio || '');
      setDescripcion(servicioEditando.descripcion || '');
      setCategoria(servicioEditando.categoria || '');
      setCosto(servicioEditando.costo || '');
      setDescuento(servicioEditando.descuento || 0);
      setError('');
    } else {
      setServicio('');
      setDescripcion('');
      setCategoria('');
      setCosto('');
      setDescuento(0);
      setError('');
    }
  }, [servicioEditando, open]);

  // Validar descuento: solo números entre 0 y 100
  const handleDescuentoChange = (e) => {
    const val = e.target.value;
    if (val === '') {
      setDescuento('');
      return;
    }
    const num = Number(val);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      setDescuento(num);
    }
  };

  const canSave =
    servicio.trim() !== '' &&
    descripcion.trim() !== '' &&
    categoria.trim() !== '' &&
    costo !== '' &&
    !isNaN(costo) &&
    descuento !== '' &&
    descuento >= 0 &&
    descuento <= 100;

  const handleGuardar = async () => {
    if (!canSave) return;

    setLoading(true);
    setError('');

    try {
      if (servicioEditando) {
        // Editar (PUT)
        await axios.put(
          `${API_URL}/api/servicios/servicios/${servicioEditando._id}`,
          {
            servicio: servicio.trim(),
            descripcion: descripcion.trim(),
            categoria,
            costo: Number(costo),
            descuento: Number(descuento),
          }
        );
      } else {
        // Crear (POST)
        await axios.post(`${API_URL}/api/servicios/servicios`, {
          servicio: servicio.trim(),
          descripcion: descripcion.trim(),
          categoria,
          costo: Number(costo),
          descuento: Number(descuento),
        });
      }

      if (onSaveSuccess) onSaveSuccess(); // refrescar lista en padre
      onClose();
    } catch (err) {
      console.error('Error al guardar servicio:', err);
      const msg = err.response?.data?.error || 'Error al guardar servicio';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Calcular costo final con descuento
  const costoNum = Number(costo);
  const costoFinal =
    !isNaN(costoNum) && descuento >= 0 && descuento <= 100
      ? costoNum - (costoNum * descuento) / 100
      : 0;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{servicioEditando ? 'Editar Servicio' : 'Agregar Servicio'}</DialogTitle>
      <DialogContent>
        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 1 }}>
            {error}
          </Typography>
        )}
        <TextField
          label="Servicio"
          value={servicio}
          onChange={(e) => setServicio(e.target.value)}
          fullWidth
          margin="normal"
          disabled={loading}
        />
        <TextField
          label="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          fullWidth
          margin="normal"
          disabled={loading}
        />
        <TextField
          select
          label="Categoría"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          fullWidth
          margin="normal"
          required
          disabled={loading}
        >
          {categorias.length === 0 ? (
            <MenuItem value="" disabled>
              No hay categorías disponibles
            </MenuItem>
          ) : (
            categorias.map((cat) => (
              <MenuItem key={cat._id} value={cat.nombre}>
                {cat.nombre}
              </MenuItem>
            ))
          )}
        </TextField>
        <TextField
          label="Costo"
          type="number"
          value={costo}
          onChange={(e) => setCosto(e.target.value)}
          fullWidth
          margin="normal"
          inputProps={{ min: 0 }}
          disabled={loading}
        />
        <TextField
          label="Descuento (%)"
          type="number"
          value={descuento}
          onChange={handleDescuentoChange}
          fullWidth
          margin="normal"
          inputProps={{ min: 0, max: 100 }}
          helperText="Ingresa un valor entre 0 y 100"
          disabled={loading}
        />
        <Box sx={{ mt: 1 }}>
          <Typography variant="subtitle2">
            Costo final con descuento: <strong>${costoFinal.toFixed(2)}</strong>
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleGuardar}
          variant="contained"
          disabled={!canSave || loading}
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalAgregarServicio;
