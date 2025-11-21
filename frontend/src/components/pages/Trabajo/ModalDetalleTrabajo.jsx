import React, { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';

const estiloModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
};

const API_URL = import.meta.env.VITE_API_URL;

const ModalDetalleTrabajo = ({ open, onClose, trabajoId }) => {
  const [trabajo, setTrabajo] = useState(null);
  const [editando, setEditando] = useState(false);
  const [descripcion, setDescripcion] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmOpen, setConfirmOpen] = useState(false);

  const obtenerTrabajo = async () => {
    try {
      const response = await fetch(`${API_URL}/api/works/${trabajoId}`);
      const data = await response.json();
      setTrabajo(data);
      setDescripcion(data.descripcion || '');
      setObservaciones(data.observaciones || '');
      setFechaVencimiento(data.fechaVencimiento?.slice(0, 10) || '');
    } catch (error) {
      console.error('Error al obtener trabajo:', error);
    }
  };

  useEffect(() => {
    if (trabajoId && open) {
      obtenerTrabajo();
    }
  }, [trabajoId, open]);

  const handleGuardarCambios = async () => {
    try {
      const response = await fetch(`${API_URL}/api/works/editar_trabajo/${trabajoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descripcion, observaciones, fechaVencimiento }),
      });

      if (response.ok) {
        setSnackbar({ open: true, message: 'Trabajo actualizado correctamente', severity: 'success' });
        setEditando(false);
        obtenerTrabajo();
      } else {
        setSnackbar({ open: true, message: 'Error al actualizar trabajo', severity: 'error' });
      }
    } catch (error) {
      console.error('Error al guardar cambios:', error);
    }
  };

  const handleEliminarTrabajo = async () => {
    try {
      const response = await fetch(`${API_URL}/api/works/eliminar_trabajo/${trabajo._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: false }),
      });

      if (response.ok) {
        setSnackbar({ open: true, message: 'Trabajo eliminado correctamente', severity: 'success' });
        setConfirmOpen(false);
        onClose();
      } else {
        setSnackbar({ open: true, message: 'Error al eliminar trabajo', severity: 'error' });
      }
    } catch (error) {
      console.error('Error al eliminar trabajo:', error);
    }
  };

  const handleCerrar = () => {
    onClose();
    setEditando(false);
  };

  if (!trabajo) return null;

  return (
    <>
      <Modal open={open} onClose={handleCerrar}>
        <Box sx={estiloModal}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Detalle del Trabajo</Typography>
            <IconButton onClick={handleCerrar}><CloseIcon /></IconButton>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12}><TextField fullWidth label="Cliente" value={trabajo.cliente} InputProps={{ readOnly: true }} /></Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Descripción"
                fullWidth
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                InputProps={{ readOnly: !editando }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Observaciones"
                fullWidth
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                InputProps={{ readOnly: !editando }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Fecha de Vencimiento"
                type="date"
                fullWidth
                value={fechaVencimiento}
                onChange={(e) => setFechaVencimiento(e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{ readOnly: !editando }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Técnico" value={`${trabajo.tecnico?.name || ''} ${trabajo.tecnico?.lastname || ''}`} InputProps={{ readOnly: true }} />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1">Servicios</Typography>
              <List dense>
                {trabajo.servicios?.map((serv, idx) => (
                  <ListItem key={idx}>
                    <ListItemText primary={`${serv.servicio} (${serv.categoria})`} />
                  </ListItem>
                ))}
              </List>
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth label="Costo total" value={`$${trabajo.costo?.toFixed(2) || '0.00'}`} InputProps={{ readOnly: true }} />
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
              {!editando ? (
                <Button variant="contained" startIcon={<EditIcon />} onClick={() => setEditando(true)}>Editar</Button>
              ) : (
                <>
                  <Button variant="contained" color="error" onClick={() => setConfirmOpen(true)}>
                    Eliminar Trabajo
                  </Button>
                  <Button variant="contained" color="success" startIcon={<CheckIcon />} onClick={handleGuardarCambios}>
                    Guardar Cambios
                  </Button>
                </>
              )}
            </Grid>
          </Grid>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
          </Snackbar>
        </Box>
      </Modal>

      {/* Dialogo Confirmacion para eliminar */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Seguro que quieres eliminar este trabajo? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary">Cancelar</Button>
          <Button onClick={handleEliminarTrabajo} color="error" variant="contained" autoFocus>
            Sí, eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalDetalleTrabajo;
