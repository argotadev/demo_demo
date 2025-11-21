import React, { useState, useEffect } from 'react';
import {
  Modal, Box, TextField, Button, Typography, Grid, MenuItem, Select,
  InputLabel, FormControl, Divider, Chip
} from '@mui/material';
import axios from 'axios';
import { grey, green, red  } from '@mui/material/colors';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800, // Aumentado para 3 columnas
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ModalAgregarProducto = ({
  open,
  onClose,
  onSave,
  productoEditando = null,
}) => {
  const [categorias, setCategorias] = useState([]);
  const [medidas, setMedidas] = useState([]);
  const [providers, setProviders] = useState([]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    quantity: 1,
    medida: '',
    provider: '',
    price_siva: 0,
    price_usd: 0,
    por_marginal: 0,
    por_descuento: 0,
    price_final: 0,
    create_at: new Date().toISOString(),
  });

  const handleDesactivar = async () => {
    try {
      await axios.put(`${API_URL}/api/product/desactivar_producto/${productoEditando.code}`);
      if (onSave) await onSave();
      onClose();
    } catch (error) {
      console.error('Error al desactivar producto:', error);
    }
  };

  // Calcular precio final automáticamente
  useEffect(() => {
    const calculateFinalPrice = () => {
      const priceSiva = parseFloat(newProduct.price_siva) || 0;
      const marginal = parseFloat(newProduct.por_marginal) || 0;
      const discount = parseFloat(newProduct.por_descuento) || 0;

      // Aplicar margen (aumento)
      const priceWithMargin = priceSiva * (1 + marginal / 100);
      
      // Aplicar descuento
      const finalPrice = priceWithMargin * (1 - discount / 100);

      setNewProduct(prev => ({
        ...prev,
        price_final: finalPrice.toFixed(2)
      }));
    };

    calculateFinalPrice();
  }, [newProduct.price_siva, newProduct.por_marginal, newProduct.por_descuento]);

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          const [catRes, medRes, provRes] = await Promise.all([
            axios.get(`${API_URL}/api/categories/list`),
            axios.get(`${API_URL}/api/measures/list`),
            axios.get(`${API_URL}/api/provider/list`)
          ]);

          setCategorias(catRes.data.data || []);
          setMedidas(medRes.data.data || []);
          setProviders(provRes.data.data.proveedores || []);

        } catch (error) {
          console.error('Error cargando datos:', error);
        }
      };

      fetchData();
    }
  }, [open]);

  useEffect(() => {
    if (productoEditando) {
      setNewProduct({
        name: productoEditando.name || '',
        description: productoEditando.description || '',
        category: productoEditando.category || '',
        quantity: productoEditando.quantity || 1,
        medida: productoEditando.medida || '',
        provider: productoEditando.provider || '',
        price_siva: productoEditando.price_siva || 0,
        price_usd: productoEditando.price_usd || 0,
        por_marginal: productoEditando.por_marginal || 0,
        por_descuento: productoEditando.por_descuento || 0,
        price_final: productoEditando.price_final || 0,
        create_at: productoEditando.create_at || new Date().toISOString(),
      });
    } else {
      setNewProduct({
        name: '',
        description: '',
        category: '',
        quantity: 1,
        medida: '',
        provider: '',
        price_siva: 0,
        price_usd: 0,
        por_marginal: 0,
        por_descuento: 0,
        price_final: 0,
        create_at: new Date().toISOString(),
      });
    }
  }, [productoEditando, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validar porcentajes (0-100)
    if ((name === 'por_marginal' || name === 'por_descuento') && (value < 0 || value > 100)) {
      return; // No actualizar si está fuera de rango
    }

    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGuardar = async () => {
    try {
      if (productoEditando) {
        await axios.put(`${API_URL}/api/product/actualizar_producto/${productoEditando.code}`, newProduct);
      } else {
        await axios.post(`${API_URL}/api/product/register`, newProduct);
      }
      if (onSave) await onSave();
      onClose();
    } catch (error) {
      console.error('Error guardando producto:', error);
    }
  };

   return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          {productoEditando ? 'Editar producto' : 'Agregar producto'}
        </Typography>

        <Grid container spacing={2}>
  {/* Columna 1 */}
  <Grid item xs={12} md={4}>
    <TextField
      label="Nombre"
      name="name"
      value={newProduct.name}
      onChange={handleChange}
      fullWidth
      margin="normal"
    />
    <TextField
      label="Descripción"
      name="description"
      value={newProduct.description}
      onChange={handleChange}
      fullWidth
      multiline
      rows={3}
      margin="normal"
    />
    <FormControl fullWidth margin="normal">
      <InputLabel>Categoría</InputLabel>
      <Select
        name="category"
        value={newProduct.category}
        onChange={handleChange}
        label="Categoría"
      >
        {categorias.map((cat) => (
          <MenuItem key={cat._id} value={cat.name}>
            {cat.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Grid>

  {/* Columna 2 */}
  <Grid item xs={12} md={4}>
    <FormControl fullWidth margin="normal">
      <InputLabel>Proveedor</InputLabel>
      <Select
        name="provider"
        value={newProduct.provider}
        onChange={handleChange}
        label="Proveedor"
      >
        {providers.map((prov) => (
          <MenuItem key={prov._id} value={prov.name}>
            {prov.name} {prov.lastname}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <TextField
      label="Cantidad"
      name="quantity"
      type="number"
      value={newProduct.quantity}
      onChange={handleChange}
      fullWidth
      margin="normal"
      inputProps={{ min: 1 }}
    />

    <FormControl fullWidth margin="normal">
      <InputLabel>Medida</InputLabel>
      <Select
        name="medida"
        value={newProduct.medida}
        onChange={handleChange}
        label="Medida"
      >
        {medidas.map((med) => (
          <MenuItem key={med._id} value={med.name}>
            {med.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Grid>

  {/* Columna 3 */}
  <Grid item xs={12} md={4}>
    <TextField
      label="Precio sin IVA"
      name="price_siva"
      type="number"
      value={newProduct.price_siva}
      onChange={handleChange}
      fullWidth
      margin="normal"
      inputProps={{ min: 0, step: "0.01" }}
    />
    <TextField
      label="Precio USD"
      name="price_usd"
      type="number"
      value={newProduct.price_usd}
      onChange={handleChange}
      fullWidth
      margin="normal"
      inputProps={{ min: 0, step: "0.01" }}
    />
    <TextField
      label="% Margen (0-100)"
      name="por_marginal"
      type="number"
      value={newProduct.por_marginal}
      onChange={handleChange}
      fullWidth
      margin="normal"
      inputProps={{ min: 0, max: 100 }}
    />
    <TextField
      label="% Descuento (0-100)"
      name="por_descuento"
      type="number"
      value={newProduct.por_descuento}
      onChange={handleChange}
      fullWidth
      margin="normal"
      inputProps={{ min: 0, max: 100 }}
    />
  </Grid>

  {/* Precio final centrado */}
  <Grid item xs={12}>
    <Divider sx={{ my: 2 }} />
    <Box display="flex" justifyContent="center" alignItems="center">
      <Typography variant="h6" sx={{ mr: 2 }}>
        Precio Final:
      </Typography>
      <Chip
        label={`$${parseFloat(newProduct.price_final).toFixed(2)}`}
        sx={{
          fontSize: '1.3rem',
          backgroundColor: green[600],
          color: 'white',
          px: 2,
          py: 1
        }}
      />
    </Box>
  </Grid>

  {/* Botones */}
  <Grid item xs={12} display="flex" justifyContent="space-between" mt={3}>
    {productoEditando && (
      <Button
        onClick={handleDesactivar}
        variant="contained"
        sx={{
          backgroundColor: red[600],
          '&:hover': { backgroundColor: red[800] }
        }}
      >
        Borrar producto
      </Button>
    )}
    <Box display="flex" gap={2}>
      <Button onClick={onClose} variant="outlined" color="error">
        Cancelar
      </Button>
      <Button onClick={handleGuardar} variant="contained" color="primary">
        Guardar
      </Button>
    </Box>
  </Grid>
</Grid>

      </Box>
    </Modal>
  );
};

export default ModalAgregarProducto;