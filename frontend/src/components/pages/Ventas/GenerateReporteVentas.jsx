import React, { useState } from 'react';
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const meses = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' },
];

const GenerarReporteVentas = () => {
  const [mesSeleccionado, setMesSeleccionado] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleGenerarReporte = async () => {
    try {
      const mesNombre = meses.find(m => m.value === Number(mesSeleccionado))?.label || 'completo';
      const url = `${API_BASE_URL}/api/reporte-ventas${mesSeleccionado ? `?mes=${mesSeleccionado}` : ''}`;

      console.log('Intentando generar reporte...');
      console.log('URL solicitada:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      console.log('Status de la respuesta:', response.status);
      console.log('Content-Type:', response.headers.get('Content-Type'));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Texto de error recibido del backend:', errorText);
        throw new Error(`Error generando el reporte - ${response.statusText}`);
      }

      const blob = await response.blob();
      const urlBlob = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = urlBlob;
      a.download = `reporte_ventas_${mesNombre.toLowerCase()}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(urlBlob);

      console.log('Reporte descargado exitosamente');
      handleCloseModal(); // Cerramos modal al descargar
    } catch (err) {
      console.error('Error en handleGenerarReporte:', err);
      alert('Ocurrió un error al generar el reporte. Revisá la consola para más detalles.');
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<GetAppIcon />}
        onClick={handleOpenModal}
        sx={{ minWidth: 180 }}
      >
        Generar Reporte
      </Button>

      <Dialog open={modalOpen} onClose={handleCloseModal} fullWidth maxWidth="xs">
        <DialogTitle>Seleccionar mes para el reporte</DialogTitle>
        <DialogContent>
          <Box mt={1}>
            <FormControl fullWidth>
              <InputLabel>Mes</InputLabel>
              <Select
                value={mesSeleccionado}
                label="Mes"
                onChange={(e) => setMesSeleccionado(e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                {meses.map((mes) => (
                  <MenuItem key={mes.value} value={mes.value}>
                    {mes.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseModal} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleGenerarReporte} variant="contained" color="primary">
            Descargar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GenerarReporteVentas;
