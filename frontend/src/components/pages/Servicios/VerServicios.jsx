import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  DataGrid, 
  GridToolbarContainer, 
  GridToolbarExport,
  GridActionsCellItem 
} from '@mui/x-data-grid';
import { 
  Button, 
  Box, 
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import '../../../styles/VerServicios.css'; 
import ModalAgregarServicio from './ModalAgregarServicio';
import ModalAgregarCategoria from './ModalAgregarCategoria';

const apiUrl = import.meta.env.VITE_API_URL;

const VerServicios = () => {
  const [servicios, setServicios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [openModalServicio, setOpenModalServicio] = useState(false);
  const [openModalCategoria, setOpenModalCategoria] = useState(false);
  const [servicioEditando, setServicioEditando] = useState(null);
  const [loading, setLoading] = useState(false);

  // Obtener servicios y categorías al montar el componente
  useEffect(() => {
    fetchServicios();
    fetchCategorias();
  }, []);

  const fetchServicios = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/api/servicios/servicios`);
      setServicios(res.data);
    } catch (error) {
      console.error('Error al obtener servicios:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorias = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/servicios/categorias`);
      setCategorias(res.data);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    }
  };

  // Guardar (crear o editar) servicio
  const handleGuardarServicio = async (servicioData) => {
    try {
      if (servicioEditando) {
        // Editar servicio
        await axios.put(`${apiUrl}/api/servicios/${servicioEditando._id}`, servicioData);
      } else {
        // Crear nuevo servicio
        await axios.post(`${apiUrl}/api/servicios/servicios`, servicioData);
      }
      setOpenModalServicio(false);
      setServicioEditando(null);
      await fetchServicios(); // actualizar lista
    } catch (error) {
      console.error('Error al guardar servicio:', error);
    }
  };

  const handleEditarServicio = (servicio) => {
    setServicioEditando(servicio);
    setOpenModalServicio(true);
  };

  const handleAgregarCategoria = async (nuevaCategoria) => {
    try {
      await axios.post(`${apiUrl}/api/servicios/categorias`, { nombre: nuevaCategoria });
      await fetchCategorias();
      setOpenModalCategoria(false);
    } catch (error) {
      console.error('Error al agregar categoría:', error);
    }
  };

  // Columnas para DataGrid
  const columns = [
    { field: 'servicio', headerName: 'Servicio', width: 200 },
    { field: 'descripcion', headerName: 'Descripción', width: 300 },
    { field: 'categoria', headerName: 'Categoría', width: 150 },
    {
      field: 'costo',
      headerName: 'Costo',
      width: 120,
      renderCell: (params) => `$${params.value.toFixed(2)}`
    },
    { field: 'descuento', headerName: 'Descuento (%)', width: 90 },
    ,
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Acciones',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Editar"
          onClick={() => handleEditarServicio(params.row)}
        />,
      ],
    },
  ];

  // Mapear servicios asegurando costo numérico y asignando id
  // Mapea servicios forzando costo numérico (0 si no viene)
        const serviciosConCostoNumerico = servicios.map(s => ({
        ...s,
        id: s._id,
        costo: s.costo != null ? Number(s.costo) : 0,
        }));

  return (
    <Box sx={{ height: '100%', width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Servicios
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Button 
          startIcon={<AddIcon />} 
          onClick={() => {
            setServicioEditando(null);
            setOpenModalServicio(true);
          }}
          variant="contained"
          color="primary"
        >
          Agregar Servicio
        </Button>
        <Button 
          startIcon={<AddIcon />} 
          onClick={() => setOpenModalCategoria(true)}
          sx={{ ml: 2 }}
          variant="contained"
          color="primary"
        >
          Agregar Categoría
        </Button>
      </Box>

      <Box sx={{ height: 600, width: '100%', bgcolor: 'background.paper' }}>
        <DataGrid
          loading={loading}
          rows={serviciosConCostoNumerico}
          columns={columns}
          components={{
            Toolbar: () => (
              <GridToolbarContainer>
                <GridToolbarExport />
              </GridToolbarContainer>
            )
          }}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          getRowId={(row) => row._id}
        />
      </Box>

      <ModalAgregarServicio
        open={openModalServicio}
        onClose={() => setOpenModalServicio(false)}
        onSave={handleGuardarServicio}
        categorias={categorias}
        servicioEditando={servicioEditando}
      />

      <ModalAgregarCategoria
        open={openModalCategoria}
        onClose={() => setOpenModalCategoria(false)}
        onSave={handleAgregarCategoria}
      />
    </Box>
  );
};

export default VerServicios;
