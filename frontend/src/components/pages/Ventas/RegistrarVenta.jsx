import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Autocomplete,
  FormControlLabel,
  Checkbox,
  Paper,
  Snackbar,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../../context/AuthProvider'; // ajustá ruta según ubicación
import logo from '../../../assets/agronat-logo.png'; // Importar el logo

const RegistrarVenta = () => {
  const [productosRegistrados, setProductosRegistrados] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [abonado, setAbonado] = useState(true);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [pago, setPago] = useState('');
  const [cliente, setCliente] = useState('Consumidor Final');
  const [comprobante, setComprobante] = useState('Boleta');
  const [medioPago, setMedioPago] = useState('Efectivo');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false); // Estado para el mensaje de error
  const [ventanaImpresion, setVentanaImpresion] = useState(null);

  // Obtener el usuario autenticado
  const { user } = useAuth();


  //TOKEN PARA AUTENTICACION
  const token = localStorage.getItem("token");

  //variable global para el link de la api
  const apiUrl = import.meta.env.VITE_API_URL;


  // Obtener productos disponibles
  useEffect(() => {
    fetchProductosRegistrados(searchQuery);
  }, [searchQuery]);

  const fetchProductosRegistrados = async (query = '') => {
    setLoading(true);
    try {
      console.log(`Enviando petición a: ${apiUrl}/api/sales/productos_disponibles?searchQuery=${query}`);
          console.log("Token:", token); // Debug

      
      const response = await axios.get(`${apiUrl}/api/sales/productos_disponibles`, {
        params: { searchQuery: query },
        headers: {
          'Accept': 'application/json'
        },
        timeout: 8000
      });
  
      console.log('Respuesta recibida:', response.data);
      
      if (!response.data?.productos) {
        throw new Error('Formato de respuesta inesperado');
      }
      
      setProductosRegistrados(response.data.productos);
    } catch (error) {
      console.error('Error detallado:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
        stack: error.stack
      });
      
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error al cargar productos',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Agregar producto al carrito
  const agregarProducto = (producto) => {
    if (!producto) return;

    const productoExistente = carrito.find((p) => p._id === producto._id);

    if (productoExistente) {
      const nuevoCarrito = carrito.map((p) =>
        p._id === producto._id ? { ...p, cantidad: p.cantidad + 1 } : p
      );
      setCarrito(nuevoCarrito);
    } else {
      const nuevoProducto = { ...producto, cantidad: 1 };
      setCarrito([...carrito, nuevoProducto]);
    }

    // Limpiar el input del buscador
    setSearchQuery('');

    calcularTotal();
  };

  // Aumentar cantidad de un producto en el carrito
  const aumentarCantidad = (id) => {
    const nuevoCarrito = carrito.map((p) =>
      p._id === id ? { ...p, cantidad: p.cantidad + 1 } : p
    );
    setCarrito(nuevoCarrito);
    calcularTotal();
  };

  // Disminuir cantidad de un producto en el carrito
  const disminuirCantidad = (id) => {
    const nuevoCarrito = carrito
      .map((p) =>
        p._id === id && p.cantidad > 1 ? { ...p, cantidad: p.cantidad - 1 } : p
      )
      .filter((p) => p.cantidad > 0);
    setCarrito(nuevoCarrito);
    calcularTotal();
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  
    // Eliminar el iframe si el usuario elige "No"
    if (ventanaImpresion) {
      document.body.removeChild(ventanaImpresion);
      setVentanaImpresion(null); // Limpiar el estado
    }
  };

  const handlePrintReceipt = () => {
    if (ventanaImpresion) {
      ventanaImpresion.contentWindow.print(); // Imprimir el contenido del iframe
      document.body.removeChild(ventanaImpresion); // Eliminar el iframe después de imprimir
      setVentanaImpresion(null); // Limpiar el estado
    }
    setOpenSnackbar(false); // Cerrar el Snackbar
  };

  // Calcular el total de la venta
  const calcularTotal = () => {
    const totalCalculado = carrito.reduce((acc, producto) => acc + producto.cantidad * producto.price_final, 0);
    setTotal(totalCalculado);
  };

  // Calcular el cambio
  const calcularCambio = () => {
    return Math.max(0, (pago || 0) - total).toFixed(2);
  };

  // Eliminar toda la venta
  const limpiar_carrito = () => {
    setCarrito([]);
    setTotal(0);
    setPago('');
  };

  // Función para imprimir la factura/comprobante
  // RegistrarVenta.js

  const imprimirFactura = async () => {
    if (carrito.length === 0) {
      setOpenErrorSnackbar(true);
      return;
    }
  
    const venta = {
      cliente,
      comprobante,
      productos: carrito,
      total: carrito.reduce((acc, producto) => acc + producto.cantidad * producto.price_final, 0),
      medioPago,
      abonado,
    };
  
    try {
      const response = await axios.post(`${apiUrl}/api/sales/registrar_venta`, venta, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
      
      if (response.status === 200) {
        const { saleId } = response.data;
        
        // Obtener solo el HTML base sin hacer fetch
        let facturaHTML = `
        <!DOCTYPE html>
<!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>venta_${saleId}</title>
      <style>
        body {
          font-family: 'Roboto', sans-serif;
          margin: 0;
          padding: 0;
          font-size: 12px;
        }
        .container {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          align-items: flex-start;
        }
        .logo {
          max-width: 150px;
          max-height: 100px;
        }
        .empresa-info, .comprobante-info {
          flex: 1;
          padding: 0 10px;
        }
        .invoice-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        .invoice-table th, .invoice-table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        .invoice-table th {
          background-color: #f2f2f2;
        }
        .totals {
          text-align: right;
          margin-top: 20px;
        }
        .totals table {
          float: right;
          border-collapse: collapse;
        }
        .totals table th {
          background-color: transparent;
          text-align: left;
        }
        .totals table td {
          border: 1px solid #000;
          padding: 4px 10px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          font-style: italic;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${logo}" alt="Logo" class="logo">
          <div class="empresa-info">
            <p>Dirección: Pellegrini 1261</p>
            <p>Ciudad: Saladas-Corrientes</p>
            <p>Teléfono: 3795172153</p>
            <p>Correo: agronat19@gmail.com</p>
          </div>
          <div class="comprobante-info">
            <h1>Nº: ${saleId}</h1>
            <p>Fecha de la venta: ${new Date().toLocaleDateString()}</p>
            <p>Medio de Pago: ${venta.medioPago}</p>
            <p>Atendido por: ${user?.name || ''} ${user?.lastname || ''}</p>
          </div>
        </div>

        <div class="client-info">
          <h2>Cliente:</h2>
          <p>${venta.cliente}</p>
        </div>

        <table class="invoice-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${venta.productos.map(producto => `
              <tr>
                <td>${producto.name}</td>
                <td>${producto.cantidad}</td>
                <td>$ ${producto.price_final.toFixed(2)}</td>
                <td>$ ${(producto.cantidad * producto.price_final).toFixed(2)}</td>
              </tr>
            `).join('')}
            <tr>
                  <td class="total-label" colspan="3">Total</td>
                  <td class="total-value">$ ${venta.total.toFixed(2)}</td>
                </tr>
          </tbody>
        </table>

        <div class="footer">
          <p>¡ Gracias por su compra !</p>
        </div>
      </div>
    </body>
    </html>
`;
  
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        
        iframe.contentDocument.open();
        iframe.contentDocument.write(facturaHTML);
        iframe.contentDocument.close();
  
        setOpenSnackbar(true);
        limpiar_carrito();
        setVentanaImpresion(iframe);
      }
    } catch (error) {
      console.error('Error al registrar la venta:', error);
      setOpenErrorSnackbar(true);
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 3, padding: 3 }}>
      {/* Sección izquierda: Buscador y carrito */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Buscador de productos */}
        <Autocomplete
          options={productosRegistrados}
          getOptionLabel={(option) => `${option.name} | ${option.category} | ${option.description} | ${option.provider} |  ${option.price_final}$`}
          onInputChange={(e, newValue) => setSearchQuery(newValue)}
          onChange={(event, newValue) => newValue && agregarProducto(newValue)}
          value={null} // Limpiar el valor seleccionado
          renderInput={(params) => (
            <TextField {...params} label="🔍 Buscar productos" variant="outlined" fullWidth />
          )}
          loading={loading}
        />

        {/* Carrito de compras */}
        <Paper sx={{ padding: 2, borderRadius: '8px', boxShadow: 1 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            🛒 Carrito de Compras
          </Typography>
          {/* Cabeceras de la tabla */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 1,
              borderBottom: '1px solid #e0e0e0',
              fontWeight: 'bold',
              fontSize: '0.875rem',
            }}
          >
            <Typography sx={{ flex: 2 }}>Producto</Typography>
            <Typography sx={{ flex: 1 }}>Categoría</Typography>
            <Typography sx={{ flex: 1, textAlign: 'center' }}>Cantidad</Typography>
            <Typography sx={{ flex: 1, textAlign: 'right' }}>Precio Unit.</Typography>
            <Typography sx={{ flex: 1, textAlign: 'right' }}>Subtotal</Typography>
          </Box>
          {/* Productos en el carrito */}
          {carrito.map((producto) => (
            <Box key={producto._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 1, borderBottom: '1px solid #e0e0e0', fontSize: '0.875rem' }}>
              <Typography sx={{ flex: 2 }}>{producto.name}</Typography>
              <Typography sx={{ flex: 1 }}>{producto.category}</Typography>
              <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ minWidth: '24px', padding: '4px' }}
                  onClick={() => disminuirCantidad(producto._id)}
                >
                  ➖
                </Button>
                <Typography>{producto.cantidad}</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ minWidth: '24px', padding: '4px' }}
                  onClick={() => aumentarCantidad(producto._id)}
                >
                  ➕
                </Button>
              </Box>
              <Typography sx={{ flex: 1, textAlign: 'right' }}>
                $ {producto.price_final.toFixed(2)}
              </Typography>
              <Typography sx={{ flex: 1, textAlign: 'right', fontWeight: 'bold' }}>
                $ {(producto.cantidad * producto.price_final).toFixed(2)}
              </Typography>
            </Box>
          ))}
        </Paper>
      </Box>

      {/* Sección derecha: Detalles de la venta, total y botones */}
      <Box sx={{ width: '300px', display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Paper sx={{ padding: 2, borderRadius: '8px', boxShadow: 1 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            📝 Detalles de la Venta
          </Typography>
          <TextField
            label="👤 Cliente"
            variant="outlined"
            fullWidth
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="📄 Comprobante"
            variant="outlined"
            select
            SelectProps={{ native: true }}
            fullWidth
            value={comprobante}
            onChange={(e) => setComprobante(e.target.value)}
            sx={{ mb: 2 }}
          >
            <option value="Boleta">Boleta</option>
            <option value="Factura">Factura</option>
          </TextField>
          <TextField
            label="Medios de Pago"
            variant="outlined"
            select
            SelectProps={{ native: true }}
            fullWidth
            value={medioPago}
            onChange={(e) => setMedioPago(e.target.value)}
            sx={{ mb: 2 }}
          >
            <option value="Efectivo">Efectivo</option>
            <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
            <option value="Tarjeta de Débito">Tarjeta de Débito</option>
            <option value="Transferencia Bancaria">Transferencia Bancaria</option>
          </TextField>
          <FormControlLabel
            control={<Checkbox checked={abonado} onChange={(e) => setAbonado(e.target.checked)} />}
            label="💳 Abonado"
          />
        </Paper>

        {/* Total y cambio */}
        <Paper sx={{ padding: 2, borderRadius: '8px', boxShadow: 1 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            💰 Total y Cambio
          </Typography>
          <Typography variant="body1" align="right">
            Total: $ {total.toFixed(2)}
          </Typography>
          <TextField
            label="💵 Pago"
            type="number"
            variant="outlined"
            fullWidth
            value={pago}
            onChange={(e) => setPago(e.target.value === '' ? '' : Number(e.target.value))}
            sx={{ my: 2 }}
          />
          <Typography variant="body1" align="right" sx={{ color: pago >= total ? 'green' : 'red' }}>
            Cambio: $ {calcularCambio()}
          </Typography>
        </Paper>

        {/* Botones de acción */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="error"
            onClick={limpiar_carrito}
            sx={{ flex: 1, gap: 1, fontWeight: 'bold' }}
          >
            ❌ Cancelar Venta
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={imprimirFactura}
            sx={{ flex: 1, gap: 1, fontWeight: 'bold' }}
          >
            🖨️ Generar {comprobante}
          </Button>
        </Box>
      </Box>

      {/* Notificación de éxito */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="Venta generada con éxito. Desea imprimir el comprobante?"
        action={
          <>
            <Button color="success" size="small" onClick={handlePrintReceipt}>
              Sí
            </Button>
            <Button color="red" size="small" onClick={handleCloseSnackbar}>
              No
            </Button>
          </>
        }
      />

      {/* Notificación de error */}
      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="⚠️ Error: No hay productos en el carrito."
      />
    </Box>
  );
};

export default RegistrarVenta;