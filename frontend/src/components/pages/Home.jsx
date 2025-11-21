import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { TextField, Button, Chip, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ModalDetalleVenta from './Ventas/ModalDetalleVenta.jsx'; 
import GenerarReporteVentas from './Ventas/GenerateReporteVentas.jsx';
import '../../styles/Home.css';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const Home = () => {
  const [selectedVentaId, setSelectedVentaId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // estados para los filtros 
  const [ventas, setVentas] = useState([]);
  const [filtroIdVenta, setFiltroIdVenta] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');
  const [filtroMedioPago, setFiltroMedioPago] = useState('');
  const [filtroEstadoAbonado, setFiltroEstadoAbonado] = useState('');
  const [filtroFechaInicio, setFiltroFechaInicio] = useState('');
  const [filtroFechaFin, setFiltroFechaFin] = useState('');
  const [filtroDiaEspecifico, setFiltroDiaEspecifico] = useState('');
  const [filtroEmpleado, setFiltroEmpleado] = useState('');
  const [filtroMes, setFiltroMes] = useState('');
  

  //estado para el reporte personalizado 
  const [mesSeleccionado, setMesSeleccionado] = useState('');


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

  // Empleados únicos que están en ventas
  const empleadosUnicos = React.useMemo(() => {
    const map = new Map();
    ventas.forEach(v => {
      if (v.empleado && v.empleado.name && v.empleado.lastname) {
        const key = `${v.empleado.name} ${v.empleado.lastname}`;
        if (!map.has(key)) {
          map.set(key, v.empleado);
        }
      }
    });
    return Array.from(map.values());
  }, [ventas]);

  const [metricas, setMetricas] = useState({
    totalVentas: 0,
    totalAbonado: 0,
    totalATransferir: 0,
  });

  



  const fetchUltimasVentas = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ultimas-ventas`);
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      const data = await response.json();
      return data.map((venta, index) => ({
        ...venta,
        id: venta._id && (venta._id.$oid || venta._id) ? (venta._id.$oid || venta._id).toString() : index.toString(),
        empleado: venta.empleado,
      }));
    } catch (error) {
      console.error('Error al obtener las últimas ventas:', error);
      return [];
    }
  };

  const fetchData = async () => {
    try {
      const responseInformes = await fetch(`${API_BASE_URL}/api/informes`);
      if (!responseInformes.ok) throw new Error(`Error ${responseInformes.status}: ${responseInformes.statusText}`);
      await responseInformes.json(); // no usamos, pero hacemos fetch para informes

      const ultimasVentas = await fetchUltimasVentas();

      const totalVentas = ultimasVentas.reduce((acc, venta) => acc + venta.total, 0);
      const totalAbonado = ultimasVentas.filter((v) => v.abonado).reduce((acc, v) => acc + v.total, 0);
      const totalATransferir = ultimasVentas.filter((v) => !v.abonado).reduce((acc, v) => acc + v.total, 0);

      setMetricas({
        totalVentas,
        totalAbonado,
        totalATransferir,
      });

      setVentas(ultimasVentas);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredVentas = React.useMemo(() => {
    return ventas.filter((venta) => {
      const fechaVenta = venta.fecha ? new Date(venta.fecha) : null;
      if (!fechaVenta || isNaN(fechaVenta)) return false;

      const fechaInicio = filtroFechaInicio ? new Date(filtroFechaInicio) : null;
      const fechaFin = filtroFechaFin ? new Date(filtroFechaFin) : null;

      const mesVenta = venta.mes || (fechaVenta ? fechaVenta.getMonth() + 1 : null);
      const nombreCompletoEmpleado = venta.empleado
        ? `${venta.empleado.name} ${venta.empleado.lastname}`
        : '';

      const pasaFiltroDiaEspecifico = () => {
        if (!filtroDiaEspecifico) return true;

        const fechaFiltro = new Date(filtroDiaEspecifico + 'T00:00:00');

        const ventaLocal = new Date(
          fechaVenta.getFullYear(),
          fechaVenta.getMonth(),
          fechaVenta.getDate()
        );

        return ventaLocal.getTime() === fechaFiltro.getTime();
      };

      const pasaFiltroRango = () => {
        if (filtroDiaEspecifico) return true;
        return (
          (!fechaInicio || fechaVenta >= fechaInicio) &&
          (!fechaFin || fechaVenta <= fechaFin)
        );
      };

      return (
        (filtroIdVenta === '' || venta.saleId?.toString().includes(filtroIdVenta)) &&
        (filtroCliente === '' || venta.cliente?.toLowerCase().includes(filtroCliente.toLowerCase())) &&
        (filtroMedioPago === '' || venta.medioPago === filtroMedioPago) &&
        (filtroEstadoAbonado === '' || (venta.abonado ? 'abonado' : 'pendiente') === filtroEstadoAbonado) &&
        pasaFiltroDiaEspecifico() &&
        pasaFiltroRango() &&
        (filtroEmpleado === '' || nombreCompletoEmpleado === filtroEmpleado) &&
        (filtroMes === '' || mesVenta === Number(filtroMes))
      );
    });
  }, [
    ventas,
    filtroIdVenta,
    filtroCliente,
    filtroMedioPago,
    filtroEstadoAbonado,
    filtroFechaInicio,
    filtroFechaFin,
    filtroEmpleado,
    filtroMes,
    filtroDiaEspecifico,
  ]);

  useEffect(() => {
    const totalVentas = filteredVentas.reduce((acc, venta) => acc + venta.total, 0);
    const totalAbonado = filteredVentas.filter((v) => v.abonado).reduce((acc, v) => acc + v.total, 0);
    const totalATransferir = filteredVentas.filter((v) => !v.abonado).reduce((acc, v) => acc + v.total, 0);

    setMetricas({ totalVentas, totalAbonado, totalATransferir });
  }, [filteredVentas]);

  const columns = [
    { field: 'saleId', headerName: 'ID', width: 110 },
    {
      field: 'fecha',
      headerName: 'Fecha',
      width: 110,
      renderCell: (params) => {
        const date = new Date(params.value);
        return date.toLocaleDateString();
      },
    },
    { field: 'cliente', headerName: 'Cliente', width: 150 },
    { field: 'medioPago', headerName: 'Medio de Pago', width: 120 },
    { field: 'total', headerName: 'Total', width: 120 },
    {
      field: 'empleado',
      headerName: 'Vendedor',
      width: 130,
      renderCell: (params) => {
        if (!params || !params.row) return 'Sin asignar';
        const emp = params.row.empleado;
        if (!emp) return 'Sin asignar';
        if (typeof emp === 'string') return 'Sin asignar';
        if (emp.name && emp.lastname) {
          return `${emp.name} ${emp.lastname}`;
        }
        return 'Sin asignar';
      },
    },
    {
      field: 'abonado',
      headerName: 'Estado',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Abonado' : 'Pendiente'}
          color={params.value ? 'success' : 'warning'}
          variant="outlined"
        />
      ),
    },
    {
      field: 'detalle',
      headerName: 'Detalle',
      width: 100,
      renderCell: (params) => (
        <Button
          onClick={() => {
            setSelectedVentaId(params.row._id);
            setModalOpen(true);
          }}
          style={{ minWidth: 'auto' }}
        >
          <VisibilityIcon color="primary" />
        </Button>
      ),
    },
  ];

  return (
    <div className="home-container">
      <div className="main-content">
        <h2>Ventas Realizadas</h2>

        {/* Métricas Totales */}
        <div className="metricas-container">
          <div className="metrica-box total">
            <h3>💰 Ganancias Totales</h3>
            <p>${metricas.totalVentas.toLocaleString()}</p>
          </div>
          <div className="metrica-box transferir">
            <h3>📩 Total a Transferir</h3>
            <p>${metricas.totalATransferir.toLocaleString()}</p>
          </div>
          <div className="metrica-box abonado">
            <h3>✅ Total Abonado</h3>
            <p>${metricas.totalAbonado.toLocaleString()}</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="filtros-container">
          <TextField
            label="ID Venta"
            variant="outlined"
            size="small"
            value={filtroIdVenta}
            onChange={(e) => setFiltroIdVenta(e.target.value)}
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
          <TextField
            label="Día exacto"
            type="date"
            size="small"
            value={filtroDiaEspecifico}
            onChange={(e) => setFiltroDiaEspecifico(e.target.value)}
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

          {/* Dropdown Empleado */}
          <FormControl size="small" style={{ minWidth: 180 }}>
            <InputLabel id="label-empleado">Empleado</InputLabel>
            <Select
              labelId="label-empleado"
              value={filtroEmpleado}
              label="Empleado"
              onChange={(e) => setFiltroEmpleado(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {empleadosUnicos.map((emp) => (
                <MenuItem
                  key={`${emp.name}-${emp.lastname}`}
                  value={`${emp.name} ${emp.lastname}`}
                >
                  {emp.name} {emp.lastname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Dropdown Estado Abonado */}
          <FormControl size="small" style={{ minWidth: 140 }}>
            <InputLabel id="label-estado">Estado</InputLabel>
            <Select
              labelId="label-estado"
              value={filtroEstadoAbonado}
              label="Estado"
              onChange={(e) => setFiltroEstadoAbonado(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="abonado">Abonado</MenuItem>
              <MenuItem value="pendiente">Pendiente</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Contenedor para DataGrid + botón */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
            marginTop: '16px',
          }}
        >
          {/* Grid con ancho más pequeño */}
          <div style={{ height: 500, flexGrow: 1, maxWidth: '100%' }}>
            <DataGrid
              rows={filteredVentas}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableSelectionOnClick
            />
          </div>

          {/* Contenedor del botón */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              minWidth: '180px',
            }}
          >
            <Box mt={2}>
              <GenerarReporteVentas />
            </Box>
        </div>
        </div>

        {/* Modal de detalle */}
        <ModalDetalleVenta
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            fetchData();
          }}
          ventaId={selectedVentaId}
        />
      </div>
    </div>
  );
};
