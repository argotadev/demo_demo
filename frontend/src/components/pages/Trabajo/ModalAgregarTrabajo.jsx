import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthProvider';
import {
  Modal, Box, TextField, Button, Typography, Grid,
  MenuItem, Select, InputLabel, FormControl, IconButton,
  List, ListItem, ListItemText, Divider, Snackbar, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const estiloModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 550,
  maxHeight: '80vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2
};

const ModalAgregarTrabajo = ({ open, onClose, onTrabajoGuardado }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { user } = useAuth();

  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [nuevoTrabajo, setNuevoTrabajo] = useState({
    cliente: '',
    servicios: [],
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0],
    fechaVencimiento: '',
    observaciones: '',
  });

  const total = nuevoTrabajo.servicios.reduce((acc, nombreServicio) => {
    const serv = serviciosDisponibles.find(s => s.servicio === nombreServicio);
    if (!serv) return acc;
    return acc + serv.costo;
  }, 0);

  useEffect(() => {
    if (open) {
      axios.get(`${API_URL}/api/servicios/servicios`)
        .then(res => setServiciosDisponibles(res.data))
        .catch(err => console.error('Error cargando servicios:', err));
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoTrabajo(prev => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };

  const handleServiciosSelect = (e) => {
    const value = e.target.value;
    if (!nuevoTrabajo.servicios.includes(value)) {
      setNuevoTrabajo(prev => ({ ...prev, servicios: [...prev.servicios, value] }));
      setHasChanges(true);
    }
  };

  const handleEliminarServicio = (servicio) => {
    setNuevoTrabajo(prev => ({
      ...prev,
      servicios: prev.servicios.filter(s => s !== servicio)
    }));
    setHasChanges(true);
  };

  const handleGuardar = () => {
    if (!user || !user.id) {
      setSnackbar({ open: true, message: 'No se encontró el técnico (usuario)', severity: 'error' });
      return;
    }

    const token = localStorage.getItem('token');
    const trabajoAEnviar = {
      ...nuevoTrabajo,
      tecnico: user.id,
      costo: total,
      fechaVencimiento: nuevoTrabajo.fechaVencimiento === '' ? null : nuevoTrabajo.fechaVencimiento
    };

    axios.post(`${API_URL}/api/works/registrar_trabajo`, trabajoAEnviar, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(() => {
      onTrabajoGuardado();
      setSnackbar({ open: true, message: 'Trabajo agregado correctamente', severity: 'success' });
      setHasChanges(false);
      onClose();
    })
    .catch(err => {
      console.error('Error al registrar trabajo:', err.response || err);
      setSnackbar({ open: true, message: 'Error al registrar trabajo', severity: 'error' });
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={{ ...estiloModal, position: 'relative' }}>
          <IconButton
            onClick={() => onClose(hasChanges)}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" gutterBottom textAlign="center">
            REGISTRAR TRABAJO
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Cliente"
                name="cliente"
                fullWidth
                required
                value={nuevoTrabajo.cliente}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={9}>
              <FormControl fullWidth>
                <InputLabel>Agregar Servicio</InputLabel>
                <Select
                  value=""
                  onChange={handleServiciosSelect}
                  label="Agregar Servicio"
                >
                  {serviciosDisponibles.map(serv => (
                    <MenuItem key={serv._id} value={serv.servicio}>
                      {serv.servicio} - {serv.categoria} - ${serv.costo.toFixed(2)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={3} display="flex" alignItems="center" justifyContent="center">
              <Typography variant="subtitle1" fontWeight="bold">
                Total: ${total.toFixed(2)}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <List
                dense
                sx={{
                  maxHeight: 180,
                  overflowY: 'auto',
                  border: '1px solid #ddd',
                  borderRadius: 1
                }}
              >
                {nuevoTrabajo.servicios.length === 0 && (
                  <Typography variant="body2" textAlign="center" sx={{ pt: 2 }}>
                    No hay servicios seleccionados
                  </Typography>
                )}
                {nuevoTrabajo.servicios.map((servNombre) => {
                  const serv = serviciosDisponibles.find(s => s.servicio === servNombre);
                  if (!serv) return null;

                  return (
                    <div key={serv._id}>
                      <ListItem
                        secondaryAction={
                          <IconButton edge="end" aria-label="eliminar" onClick={() => handleEliminarServicio(servNombre)}>
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={`${serv.servicio} (${serv.categoria})`}
                          secondary={`Precio: $${serv.costo.toFixed(2)}`}
                        />
                      </ListItem>
                      <Divider component="li" />
                    </div>
                  );
                })}
              </List>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Descripción"
                name="descripcion"
                fullWidth
                multiline
                rows={2}
                value={nuevoTrabajo.descripcion}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                type="date"
                label="Fecha"
                name="fecha"
                fullWidth
                value={nuevoTrabajo.fecha}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                type="date"
                label="Fecha Vencimiento"
                name="fechaVencimiento"
                fullWidth
                value={nuevoTrabajo.fechaVencimiento}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Observaciones"
                name="observaciones"
                fullWidth
                multiline
                rows={2}
                value={nuevoTrabajo.observaciones}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
            <Button onClick={onClose} color="secondary">Cancelar</Button>
            <Button
              variant="contained"
              onClick={handleGuardar}
              disabled={
                nuevoTrabajo.servicios.length === 0 ||
                !nuevoTrabajo.cliente.trim()
              }
            >
              Guardar
            </Button>
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ModalAgregarTrabajo;
