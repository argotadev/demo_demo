import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import '../../../styles/FacturaComprobante.css'; // Importar el archivo CSS
import logo from '../../../assets/agronat-logo.png'; // Importar el logo

const FacturaComprobante = ({ venta }) => {
  const { cliente, comprobante, productos, total, pago, cambio } = venta;

  return (
    <Box className="factura">
      {/* Logo de la empresa */}
      <Box className="logo">
        <img src={logo} alt="Logo de Agronat" />
      </Box>

      {/* Encabezado de la factura */}
      <Typography variant="h1">
        {comprobante === 'Boleta' ? 'BOLETA DE VENTA' : 'FACTURA'}
      </Typography>
      <Typography variant="body1" align="center">
        {comprobante === 'Boleta' ? 'Boleta n.º 01234' : 'Factura n.º 01234'}
      </Typography>
      <Typography variant="body1" align="center">
        Fecha: {new Date().toLocaleDateString()}
      </Typography>

      {/* Información del cliente */}
      <Box className="info-cliente">
        <Typography variant="h2">Vibras</Typography>
        <Typography variant="h3">{cliente}</Typography>
        <Typography variant="body1">(55) 1234-5678</Typography>
        <Typography variant="body1">Calle Cualquiera 123, Cualquier Lugar</Typography>
      </Box>

      {/* Tabla de productos */}
      <table className="tabla-productos">
        <thead>
          <tr>
            <th>Artículo</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto, index) => (
            <tr key={index}>
              <td>{producto.name}</td>
              <td>{producto.cantidad}</td>
              <td>S/ {producto.price_final.toFixed(2)}</td>
              <td>S/ {(producto.cantidad * producto.price_final).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totales */}
      <Box className="totales">
        <div>
          <Typography>Subtotal:</Typography>
          <Typography>$ {total.toFixed(2)}</Typography>
        </div>
      </Box>

      {/* Información de pago */}
      <Box className="informacion-pago">
        <Typography variant="h3">Información de pago</Typography>
        <Typography>Isabel Mercado</Typography>
        <Typography>El Banquito</Typography>
        <Typography>Cuenta: 0702 4567 8901 2345</Typography>
        <Typography>Fecha de pago: {new Date().toLocaleDateString()}</Typography>
      </Box>

      {/* Contacto */}
      <Box className="contacto">
        <Typography variant="h3">Contacto</Typography>
        <Typography>(55) 1234-5678</Typography>
        <Typography>hola@sitlohrcelble.com</Typography>
        <Typography>Calle Cualquiera 123, Cualquier Lugar, CP: 12345</Typography>
        <Typography>www.sitlohrcelble.com</Typography>
      </Box>

      {/* Mensaje de agradecimiento */}
      <Typography className="agradecimiento">¡Gracias por su compra! 😊</Typography>
    </Box>
  );
};

export default FacturaComprobante;