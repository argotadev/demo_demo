import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridActionsCellItem, 
} from '@mui/x-data-grid';

import {
  Container, Typography, TextField, Button, Grid, Box,
  MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import '../../../styles/VerProductos.css';

//MODALES
import ModalAgregarProducto from './Modals/ModalAgregarProducto';
import ModalAgregarCategoria from './Modals/ModalAgregarCategoria';
import ModalAgregarProvider from './Modals/ModalAgregarProveedor';
import ModalAgregarMedida from './Modals/ModalAgregarMedida';

const apiUrl = import.meta.env.VITE_API_URL;

const VerProductos = () => {
  const [search, setSearch] = useState('');
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [providers, setProviders] = useState([]);
  const [openModalProducto, setOpenModalProducto] = useState(false);
  const [openModalCategoria, setOpenModalCategoria] = useState(false);
  const [openModalMedida, setOpenModalMedida] = useState(false);
  const [openModalProvider, setOpenModalProvider] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [loading, setLoading] = useState(false);

  // Estados para filtrado 
  const [filterCategory, setFilterCategory] = useState('');
  const [filterProvider, setFilterProvider] = useState('');

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, []);

  // Función mejorada para filtrado de productos
  const filteredProducts = productos.filter((product) => {
    if (!product) return false;

    const safeToLower = (str) => (str || '').toString().toLowerCase();
    const searchTerm = safeToLower(search);

    // Verificar coincidencia con el término de búsqueda
    const matchesSearch =
      safeToLower(product.name).includes(searchTerm) ||
      safeToLower(product.code).includes(searchTerm) ||
      safeToLower(product.description).includes(searchTerm);

    // Verificar coincidencia con categoría
    const matchesCategory = filterCategory
      ? safeToLower(product.category) === safeToLower(filterCategory)
      : true;

    // Verificar coincidencia con proveedor
    const matchesProvider = filterProvider
      ? safeToLower(product.provider) === safeToLower(filterProvider)
      : true;

    return matchesSearch && matchesCategory && matchesProvider;
  });

  // Productos formateados para el DataGrid (usando los productos filtrados)
  const productosFormateados = filteredProducts.map(p => ({
    ...p,
    id: p._id,
  }));

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/api/product/productos_activos`);
      setProductos(res.data.productos);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorias = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/categories/list`);
      setCategorias(res.data);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    }
  };
  const fetchProviders = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/providers/list`);
      setProvide(res.data);
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
    }
  };

  const handleGuardarProducto = async (productoData) => {
    try {
      if (productoEditando) {
        await axios.put(`${apiUrl}/api/product/actualizar_producto/${productoEditando.code}`, productoData);
      } else {
        await axios.post(`${apiUrl}/api/product/register`, productoData);
      }
      setOpenModalProducto(false);
      setProductoEditando(null);
      await fetchProductos();
    } catch (error) {
      console.error('Error al guardar producto:', error);
    }
  };

  const handleEditarProducto = (producto) => {
    setProductoEditando(producto);
    setOpenModalProducto(true);
  };

  const handleAgregarCategoria = async (nuevaCategoria) => {
    try {
      await axios.post(`${apiUrl}/api/product/categories`, { nombre: nuevaCategoria });
      await fetchCategorias();
      setOpenModalCategoria(false);
    } catch (error) {
      console.error('Error al agregar categoría:', error);
    }
  };
  const handleAgregarMedida = async (nuevaMedida) => {
    try {
      await axios.post(`${apiUrl}/api/measures/`, { nombre: nuevaCategoria });
      await fetchCategorias();
      setOpenModalCategoria(false);
    } catch (error) {
      console.error('Error al agregar categoría:', error);
    }
  };
  const handleAgregarProveedor= async (nuevoProveedor) => {
    try {
      await axios.post(`${apiUrl}/api/providers/register_products`, { name: nuevoProveedor });
      await fetchProviders();
      setOpenModalProvider(false);
    } catch (error) {
      console.error('Error al agregar proveedor:', error);
    }
  };

  const columns = [
    { field: 'code', headerName: 'ID', width: 85 },
    { field: 'name', headerName: 'Nombre', width: 125 },
    { field: 'category', headerName: 'Categoría', width: 100 },
    { field: 'description', headerName: 'Descripción', width: 100 },
    { field: 'quantity', headerName: 'Stock', width: 50 },
    { field: 'medida', headerName: 'Medida', width: 50 },
    { field: 'provider', headerName: 'Proveedor', width: 100 },
    {
      field: 'price_siva',
      headerName: 'PRECIO IVA',
      width: 120,
      renderCell: (params) => `$${params.value.toFixed(2)}`
    },
    {
      field: 'por_marginal',
      headerName: 'Margen (%)',
      width: 70,
      renderCell: (params) => `${params.value}%`
    },
    {
      field: 'por_descuento',
      headerName: 'Descuento (%)',
      width: 70,
      renderCell: (params) => `${params.value}%`
    },
    {
      field: 'price_usd',
      headerName: 'USD',
      width: 100,
      renderCell: (params) => (
        <span style={{ color: 'green' }}>USD {params.value.toFixed(2)}</span>
      )
    },
    {
      field: 'price_final',
      headerName: 'Precio Final',
      width: 100,
      renderCell: (params) => (
        <span style={{ color: 'blue' }}>${params.value.toFixed(2)}</span>
      )
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Acciones',
      width: 50,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Editar"
          onClick={() => handleEditarProducto(params.row)}
        />,
      ],
    },
  ];

  return (
    <Box sx={{ height: '100%', width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Productos
      </Typography>
      
      {/* Filtros */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Buscar producto"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              label="Categoría"
            >
              <MenuItem value="">Todas</MenuItem>
              {[...new Set(productos.map((p) => p.category).filter(Boolean))].map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Proveedor</InputLabel>
            <Select
              value={filterProvider}
              onChange={(e) => setFilterProvider(e.target.value)}
              label="Proveedor"
            >
              <MenuItem value="">Todos</MenuItem>
              {[...new Set(productos.map((p) => p.provider).filter(Boolean))].map((provider) => (
                <MenuItem key={provider} value={provider}>
                  {provider}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Button
          startIcon={<AddIcon />}
          onClick={() => {
            setProductoEditando(null);
            setOpenModalProducto(true);
          }}
          variant="contained"
          color="primary"
        >
          Agregar Producto
        </Button>
        <Button
          startIcon={<AddIcon />}
          onClick={() => setOpenModalCategoria(true)}
          sx={{ ml: 2 }}
          variant="contained"
          color="primary"
        >
          Agregar Categoria
        </Button>
        <Button
          startIcon={<AddIcon />}
          onClick={() => setOpenModalMedida(true)}
          sx={{ ml: 2 }}
          variant="contained"
          color="primary"
        >
          Agregar Medida
        </Button>
        <Button
          startIcon={<AddIcon />}
          onClick={() => setOpenModalProvider(true)}
          sx={{ ml: 2 }}
          variant="contained"
          color="primary"
        >
          Agregar Proveedor
        </Button>
      </Box>

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          loading={loading}
          rows={productosFormateados}
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
        />
      </Box>

      <ModalAgregarProducto
        open={openModalProducto}
        onClose={() => {
          setOpenModalProducto(false);
          setProductoEditando(null);
          fetchProductos(); 
        }}
        onSave={handleGuardarProducto}
        categorias={categorias}
        productoEditando={productoEditando}
      />

      <ModalAgregarCategoria
        open={openModalCategoria}
        onClose={() => setOpenModalCategoria(false)}
        onSave={handleAgregarCategoria}
      />
      <ModalAgregarMedida
        open={openModalMedida}
        onClose={() => setOpenModalMedida(false)}
        onSave={handleAgregarMedida}
      />
      <ModalAgregarProvider
        open={openModalProvider}
        onClose={() => setOpenModalProvider(false)}
        onSave={handleAgregarProveedor}
      />
    </Box>
  );
};

export default VerProductos;