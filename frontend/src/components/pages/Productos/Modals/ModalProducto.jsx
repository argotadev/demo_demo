import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, Grid, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import CustomSnackbar from '../../Alert/CustomSnackbar.jsx';

const ModalProducto = ({ openModal, handleCloseModal, selectedProduct, fetchProducts }) => {
  const [productData, setProductData] = useState({
    name: '',
    description: '', // Campo de descripción
    category: '',
    quantity: 1,
    medida: '',
    provider: '',
    price_siva: 0,
    price_usd: 0,
    por_marginal: 0, // Porcentaje marginal
    por_descuento: 0,
    price_final: 0,
    create_at: new Date().toISOString(),
  });

  const [snackbarConfig, setSnackbarConfig] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Usa la variable de entorno VITE_API_URL
  const apiUrl = import.meta.env.VITE_API_URL;

  

  // estados para las categorías, proveedores y medidas

  const [categories, setCategories] = useState([]);
  const [measures, setMeasures] = useState([]);
  const [providers, setProviders] = useState([]);


  // Actualizar el estado con los datos del producto seleccionado
  // Cargar los datos del producto seleccionado
useEffect(() => {
  if (selectedProduct) {
    setProductData({
      ...selectedProduct,
      por_marginal: selectedProduct.por_marginal || 0,
      por_descuento: selectedProduct.por_descuento || 0,
    });
  }
}, [selectedProduct]);

// Cargar datos dinámicos de los dropdowns cuando se abre el modal
useEffect(() => {
  if (openModal) {
    fetchDropdownData();
  }
}, [openModal]);


  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Cargar categorías, proveedores y medidas al montar el componente
  const fetchDropdownData = async () => {
    try {
      const [catRes, provRes, medRes] = await Promise.all([
        axios.get(`${apiUrl}/api/categories/list`),
        axios.get(`${apiUrl}/api/provider/list`),
        axios.get(`${apiUrl}/api/measures/list`)
      ]);

      setCategories(catRes.data.data.map(item => ({ _id: item._id, name: item.name })));
      setProviders(provRes.data.data.proveedores.map(item => ({ _id: item._id, name: item.name })));
      setMeasures(medRes.data.data.map(item => ({ _id: item._id, name: item.name })));
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setSnackbarConfig({
        open: true,
        message: 'Error al cargar opciones del formulario',
        severity: 'error',
      });
    }
};


  // Cerrar el Snackbar
  const handleSnackbarClose = () => {
    setSnackbarConfig((prevState) => ({ ...prevState, open: false }));
  };

  // Cálculo del precio final con descuento y margen
  useEffect(() => {
    let finalPrice = parseFloat(productData.price_siva) || 0;

    if (productData.por_marginal > 0) {
      finalPrice = finalPrice * (1 + parseFloat(productData.por_marginal) / 100);
    }

    if (productData.por_descuento > 0) {
      finalPrice = finalPrice * (1 - parseFloat(productData.por_descuento) / 100);
    }

    setProductData((prev) => ({
      ...prev,
      price_final: finalPrice.toFixed(2), // Redondear a 2 decimales
    }));
  }, [productData.price_siva, productData.por_marginal, productData.por_descuento]);

  // Manejar la sumisión del formulario (editar producto)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que el campo descripción no esté vacío
    if (!productData.description.trim()) {
      setSnackbarConfig({
        open: true,
        message: 'El campo descripción es requerido',
        severity: 'error',
      });
      return;
    }

    // Si el campo proveedor está vacío, se asigna "Proveedor" por defecto
    const provider = productData.provider.trim() || 'Proveedor';

    // Si el campo medida está vacío, se asigna "Unidades" por defecto
    const medida = productData.medida.trim() || 'Unidades';

    // Si el campo price_siva está vacío, se asigna 1 por defecto
    const price_siva = productData.price_siva || 1;

    // Si el campo por_marginal está vacío, se asigna 0 por defecto
    const por_marginal = productData.por_marginal || 0;

    // Si el campo por_descuento está vacío, se asigna 0 por defecto
    const por_descuento = productData.por_descuento || 0;

    const updatedProduct = {
      ...productData,
      provider, // Asignar el proveedor por defecto si está vacío
      medida,   // Asignar la medida por defecto si está vacía
      price_siva, // Asignar el precio IVA por defecto si está vacío
      por_marginal, // Asignar el margen por defecto si está vacío
      por_descuento, // Asignar el descuento por defecto si está vacío
    };

    try {
      await axios.put(
        `${apiUrl}/api/product/actualizar_producto/${productData.id}`,
        updatedProduct,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      

      setSnackbarConfig({
        open: true,
        message: 'Producto editado correctamente',
        severity: 'success',
      });

      setTimeout(() => {
        handleCloseModal(); // Cierra el modal después de un breve tiempo
      }, 1000);

      // Actualizar el DataGrid llamando a fetchProducts
      if (fetchProducts && typeof fetchProducts === 'function') {
        fetchProducts(); // Actualiza los productos después de la edición
      }
    } catch (error) {
      console.error('Error al editar el producto:', error);
      setSnackbarConfig({
        open: true,
        message: 'Error al editar el producto',
        severity: 'error',
      });
    }
  };

  // Manejar la eliminación del producto
  const handleDelete = async (e) => {
    e.preventDefault();

    try {
      await axios.put( `${apiUrl}/api/product/desactivar_producto/${productData.id}`);

      setSnackbarConfig({
        open: true,
        message: 'Producto eliminado correctamente',
        severity: 'success',
      });

      setTimeout(() => {
        handleCloseModal(); // Cierra el modal después de un breve tiempo
      }, 1000);

      // Actualizar el DataGrid llamando a fetchProducts
      if (fetchProducts && typeof fetchProducts === 'function') {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      setSnackbarConfig({
        open: true,
        message: 'Error al eliminar el producto',
        severity: 'error',
      });
    }
  };

  return (
    <>
      <Modal open={openModal} onClose={handleCloseModal}>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 600,
      maxHeight: '80vh',
      overflowY: 'auto',
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 4,
      borderRadius: 2,
    }}
  >
    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <EditIcon /> Editar Producto
    </Typography>

    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        {/* Primera columna */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Nombre del producto"
            name="name"
            value={productData.name}
            onChange={handleChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Descripción"
            name="description"
            value={productData.description}
            onChange={handleChange}
            margin="normal"
            required
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Categoría</InputLabel>
            <Select
              label="Categoría"
              name="category"
              value={productData.category}
              onChange={handleChange}
              required
            >
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Cantidad"
            name="quantity"
            type="number"
            value={productData.quantity}
            onChange={handleChange}
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Medida</InputLabel>
            <Select
              label="Medida"
              name="medida"
              value={productData.medida}
              onChange={handleChange}
            >
              {measures.map((measure) => (
                <MenuItem key={measure._id} value={measure._id}>
                  {measure.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Segunda columna */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Proveedor</InputLabel>
            <Select
              label="Proveedor"
              name="provider"
              value={productData.provider}
              onChange={handleChange}
            >
              {providers.map((provider) => (
                <MenuItem key={provider._id} value={provider._id}>
                  {provider.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Precio IVA"
            name="price_siva"
            type="number"
            value={productData.price_siva}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Precio USD"
            name="price_usd"
            type="number"
            value={productData.price_usd}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Porcentaje Marginal (%)"
            name="por_marginal"
            type="number"
            value={productData.por_marginal}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Descuento (%)"
            name="por_descuento"
            type="number"
            value={productData.por_descuento}
            onChange={handleChange}
            margin="normal"
            required
          />

          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: 'green',
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            <Typography variant="h6">
              Precio de venta: ${Number(productData.price_final).toFixed(2)}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        Guardar Cambios
      </Button>
      <Button type="button" variant="contained" color="error" fullWidth sx={{ mt: 2 }} onClick={handleDelete}>
        Eliminar Producto
      </Button>
    </form>
  </Box>
</Modal>


      <CustomSnackbar snackbarConfig={snackbarConfig} handleSnackbarClose={handleSnackbarClose} />
    </>
  );
};

export default ModalProducto;