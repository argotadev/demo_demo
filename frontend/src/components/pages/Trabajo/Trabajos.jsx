import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Button, Chip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import ModalDetalleTrabajo from '../Trabajo/ModalDetalleTrabajo';
import ModalAgregarTrabajo from '../Trabajo/ModalAgregarTrabajo';
import '../../../styles/Trabajos.css';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useAuth } from '../../../context/AuthProvider';


const API_BASE_URL = import.meta.env.VITE_API_URL;

export const Trabajos = () => {
  const [selectedTrabajoId, setSelectedTrabajoId] = useState(null);
  const [modalDetalleOpen, setModalDetalleOpen] = useState(false);
  const [modalAgregarOpen, setModalAgregarOpen] = useState(false);

  const [trabajos, setTrabajos] = useState([]);
  const [filtroId, setFiltroId] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');
  const [filtroServicio, setFiltroServicio] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroFechaInicio, setFiltroFechaInicio] = useState('');
  const [filtroFechaFin, setFiltroFechaFin] = useState('');
  const [filtroTecnico, setFiltroTecnico] = useState('');
  const [filtroMes, setFiltroMes] = useState('');


  //alertas
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success'); // success | error | warning | info

  // Array meses
  const meses = [
    { value: '', label: 'Todos' },
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

  // Servicios únicos
  const serviciosUnicos = React.useMemo(() => {
    return [...new Set(trabajos.map(t => t.servicio).filter(Boolean))];
  }, [trabajos]);

  //alertas
  const mostrarAlerta = (mensaje, severidad = 'success') => {
  setAlertMessage(mensaje);
  setAlertSeverity(severidad);
  setAlertOpen(true);
};


  // Técnicos únicos
  const tecnicosUnicos = React.useMemo(() => {
    const map = new Map();
    trabajos.forEach(t => {
      if (t.tecnico && t.tecnico.name && t.tecnico.lastname) {
        const key = `${t.tecnico.name} ${t.tecnico.lastname}`;
        if (!map.has(key)) {
          map.set(key, t.tecnico);
        }
      }
    });
    return Array.from(map.values());
  }, [trabajos]);

  // Calcular estado basado en fecha de vencimiento
  const calcularEstado = (fechaVencimiento) => {
    if (!fechaVencimiento) return 'sin-fecha';

    const hoy = new Date();
    const fechaVen = new Date(fechaVencimiento);
    const diasParaVencer = Math.floor((fechaVen - hoy) / (1000 * 60 * 60 * 24));

    if (diasParaVencer <= 0) return 'vencido';
    if (diasParaVencer <= 7) return 'por-vencer';
    return 'vigente';
  };

  // Fetch trabajos desde la API
  const fetchTrabajos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/works`);
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      const data = await response.json();

      // Transformar datos para DataGrid
      const trabajosFormateados = data.map((trabajo, index) => ({
        ...trabajo,
        id:
          trabajo._id && (trabajo._id.$oid || trabajo._id)
            ? (trabajo._id.$oid || trabajo._id).toString()
            : index.toString(),
        tecnico: trabajo.tecnico || null,
        estado: calcularEstado(trabajo.fechaVencimiento),
      }));

      setTrabajos(trabajosFormateados);
    } catch (error) {
      console.error('Error al obtener los trabajos:', error);
    }
  };

  useEffect(() => {
    fetchTrabajos();
  }, []);

  // Filtrar trabajos
  const filteredTrabajos = React.useMemo(() => {
    return trabajos.filter((trabajo) => {
      const fechaTrabajo = trabajo.fecha ? new Date(trabajo.fecha) : null;
      const fechaInicio = filtroFechaInicio ? new Date(filtroFechaInicio) : null;
      const fechaFin = filtroFechaFin ? new Date(filtroFechaFin) : null;

      const nombreCompletoTecnico = trabajo.tecnico ? `${trabajo.tecnico.name} ${trabajo.tecnico.lastname}` : '';
      const mesTrabajo = trabajo.mes || (fechaTrabajo ? fechaTrabajo.getMonth() + 1 : null);

      return (
        (filtroId === '' || trabajo.trabajoId?.toString().includes(filtroId)) &&
        (filtroCliente === '' || trabajo.cliente?.toLowerCase().includes(filtroCliente.toLowerCase())) &&
        (filtroServicio === '' || trabajo.servicio === filtroServicio) &&
        (filtroEstado === '' || trabajo.estado === filtroEstado) &&
        (!fechaInicio || (fechaTrabajo && fechaTrabajo >= fechaInicio)) &&
        (!fechaFin || (fechaTrabajo && fechaTrabajo <= fechaFin)) &&
        (filtroTecnico === '' || nombreCompletoTecnico === filtroTecnico) &&
        (filtroMes === '' || mesTrabajo === Number(filtroMes))
      );
    });
  }, [
    trabajos,
    filtroId,
    filtroCliente,
    filtroServicio,
    filtroEstado,
    filtroFechaInicio,
    filtroFechaFin,
    filtroTecnico,
    filtroMes,
  ]);

  // Columnas del DataGrid
  const columns = [
    
    {
      field: 'fecha',
      headerName: 'Fecha',
      width: 110,
      renderCell: (params) => {
        if (!params.value) return 'N/A';
        return params.value.slice(0, 10).split('-').reverse().join('/');
    },
    },
    { field: 'cliente', headerName: 'Cliente', width: 180 },
    { field: 'descripcion', headerName: 'Descripción', width: 200 },
    {
      field: 'fechaVencimiento',
      headerName: 'Vencimiento',
      width: 110,
      renderCell: (params) => {
        if (!params.value) return 'N/A';
        return params.value.slice(0, 10).split('-').reverse().join('/');
      },
    },
    {
        field: 'costo',
        headerName: 'Costo',
        width: 110,
        renderCell: (params) => {
          const costo = params.row.costo; 
          if (costo == null) return 'N/A';
          return `$${costo.toFixed(2)}`; // formato moneda
  },
    },
    {
      field: 'tecnico',
      headerName: 'Técnico',
      width: 160,
      renderCell: (params) => {
        if (!params || !params.row) return 'Sin asignar';
        const tecnico = params.row.tecnico;
        if (!tecnico) return 'Sin asignar';
        if (typeof tecnico === 'string') return 'Sin asignar';
        if (tecnico.name && tecnico.lastname) {
          return `${tecnico.name} ${tecnico.lastname}`;
        }
        return 'Sin asignar';
      },
    },
    {
      field: 'estado',
      headerName: 'Estado',
      width: 130,
      renderCell: (params) => {
        const estadoActual = calcularEstado(params.row.fechaVencimiento);

        let label = '';
        let color = 'default';

        switch (estadoActual) {
          case 'vigente':
            label = 'Vigente';
            color = 'success';
            break;
          case 'por-vencer':
            label = 'Por vencer';
            color = 'warning';
            break;
          case 'vencido':
            label = 'Vencido';
            color = 'error';
            break;
          default:
            label = 'Sin fecha';
            color = 'default';
        }

        return <Chip label={label} color={color} variant="outlined" />;
      },
    },
    {
      field: 'detalle',
      headerName: 'Acciones',
      width: 120,
      renderCell: (params) => (
        <Button
          onClick={() => {
            setSelectedTrabajoId(params.row._id);
            setModalDetalleOpen(true);
          }}
          style={{ minWidth: 'auto' }}
        >
          <VisibilityIcon color="primary" />
        </Button>
      ),
    },
  ];

  return (
    <div className="trabajos-container">
      <div className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Trabajos Realizados</h2>
        </div>

        {/* Filtros */}
        <div
          className="filtros-container"
          style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', margin: '20px 0' }}
        >
          <TextField
            label="ID Trabajo"
            variant="outlined"
            size="small"
            value={filtroId}
            onChange={(e) => setFiltroId(e.target.value)}
            style={{ width: '120px' }}
          />
          <TextField
            label="Buscar Cliente"
            variant="outlined"
            size="small"
            value={filtroCliente}
            onChange={(e) => setFiltroCliente(e.target.value)}
            style={{ minWidth: '150px' }}
          />

          {/* Dropdown Servicio */}
          <FormControl size="small" style={{ minWidth: 180 }}>
            <InputLabel id="label-servicio">Servicio</InputLabel>
            <Select
              labelId="label-servicio"
              value={filtroServicio}
              label="Servicio"
              onChange={(e) => setFiltroServicio(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {serviciosUnicos.map((servicio) => (
                <MenuItem key={servicio} value={servicio}>
                  {servicio}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Desde"
            type="date"
            size="small"
            value={filtroFechaInicio}
            onChange={(e) => setFiltroFechaInicio(e.target.value)}
            InputLabelProps={{ shrink: true }}
            style={{ width: '130px' }}
          />
          <TextField
            label="Hasta"
            type="date"
            size="small"
            value={filtroFechaFin}
            onChange={(e) => setFiltroFechaFin(e.target.value)}
            InputLabelProps={{ shrink: true }}
            style={{ width: '130px' }}
          />

          {/* Dropdown Mes */}
          <FormControl size="small" style={{ minWidth: 140 }}>
            <InputLabel id="label-mes">Mes</InputLabel>
            <Select
              labelId="label-mes"
              value={filtroMes}
              label="Mes"
              onChange={(e) => setFiltroMes(e.target.value)}
            >
              {meses.map((mes) => (
                <MenuItem key={mes.value} value={mes.value}>
                  {mes.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Dropdown Técnico */}
          <FormControl size="small" style={{ minWidth: 180 }}>
            <InputLabel id="label-tecnico">Técnico</InputLabel>
            <Select
              labelId="label-tecnico"
              value={filtroTecnico}
              label="Técnico"
              onChange={(e) => setFiltroTecnico(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {tecnicosUnicos.map((tec) => (
                <MenuItem key={`${tec.name}-${tec.lastname}`} value={`${tec.name} ${tec.lastname}`}>
                  {tec.name} {tec.lastname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Dropdown Estado */}
          <FormControl size="small" style={{ minWidth: 140 }}>
            <InputLabel id="label-estado">Estado</InputLabel>
            <Select
              labelId="label-estado"
              value={filtroEstado}
              label="Estado"
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="vigente">Vigente</MenuItem>
              <MenuItem value="por-vencer">Por vencer</MenuItem>
              <MenuItem value="vencido">Vencido</MenuItem>
            </Select>
          </FormControl>
        </div>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setModalAgregarOpen(true)}
        >
          Agregar Trabajo
        </Button>

        {/* DataGrid */}
        <div className="trabajos-grid" style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={filteredTrabajos}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
          />
        </div>
        <Snackbar
          open={alertOpen}
          autoHideDuration={3000}
          onClose={() => setAlertOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <MuiAlert elevation={6} variant="filled" onClose={() => setAlertOpen(false)} severity={alertSeverity}>
            {alertMessage}  
          </MuiAlert>
        </Snackbar>   

      </div>

      {/* Modal de detalle */}
      <ModalDetalleTrabajo
        open={modalDetalleOpen}
        onClose={() => {
          setModalDetalleOpen(false);
          fetchTrabajos();
        }}
        trabajoId={selectedTrabajoId}
      />

      {/* Modal para agregar nuevo trabajo */}
      <ModalAgregarTrabajo
        open={modalAgregarOpen}
        onClose={() => {
          setModalAgregarOpen(false);
          fetchTrabajos();
        }}
        onTrabajoGuardado={() => {
          fetchTrabajos(); // Refrescar lista después de guardar
          setModalAgregarOpen(false); // Cerrar modal
        }}
      />
      
    </div>
  );
};
