import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';
import { SearchCheck } from 'lucide-react';
import '../../../styles/ModalDetalleVenta.css';
import axios from 'axios';
import logo from '../../../assets/agronat-logo.png'; // Importar el logo


const ModalDetalleVenta = ({ open, onClose, ventaId }) => {
  const [venta, setVenta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ventas, setVentas] = useState([]);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [ventanaImpresion, setVentanaImpresion] = useState(null);

    // Usa la variable de entorno VITE_API_URL
    const apiUrl = import.meta.env.VITE_API_URL;
  
  
  

  useEffect(() => {
    if (open && ventaId) {
      setLoading(true);
      fetch(`${apiUrl}/api/sales/buscar_venta/${ventaId}`)
        .then((response) => {
          if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
          return response.json();
        })
        .then((data) => {
          setVenta(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error al obtener los detalles de la venta:', error);
          setLoading(false);
          alert('No se pudo cargar la venta.');
        });
    }
  }, [open, ventaId]);

  const fetchVentas = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/ultimas-ventas`);
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

      const data = await response.json();
      setVentas(data); 
    } catch (error) {
      console.error('Error al obtener las ventas:', error);
      alert(`Error al obtener las ventas: ${error.message}`);
    }
  };

  const obtenerDetallesVenta = async (saleId) => {
    try {
      const response = await axios.get(`${apiUrl}/api/sales/buscar_venta_detalle/${saleId}`);
      console.log('Detalles de la venta obtenidos:', response.data);
      return response.data; // Devuelve los datos de la venta
    } catch (error) {
      console.error('Error al obtener los detalles de la venta:', error);
      throw error;
    }
  };

  const imprimirVentaExistente = async (saleId) => {
    try {
        const venta = await obtenerDetallesVenta(saleId);
        
        // 1. Convertir el logo a base64 (igual que en registrar venta)
        let logoBase64 = '';
        try {
            const logoResponse = await fetch(logo);
            if (logoResponse.ok) {
                const logoBlob = await logoResponse.blob();
                logoBase64 = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(logoBlob);
                });
            }
        } catch (e) {
            console.warn('No se pudo cargar el logo:', e);
        }

        // 2. Crear HTML completo con CSS EMBEBIDO
        const facturaHTML = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>venta_${venta.saleId}</title>
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
            .client-info {
              margin: 15px 0;
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
            .total-label {
              text-align: right;
              font-weight: bold;
              border: none;
            }
            .total-value {
              font-weight: bold;
              border: 1px solid #000;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              font-style: italic;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .container {
                width: 100%;
                padding: 0;
                margin: 0;
              }
            }
          </style>
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="${logoBase64}" alt="Logo" class="logo">
              <div class="empresa-info">
                <p>Dirección: Pellegrini 1261</p>
                <p>Ciudad: Saladas-Corrientes</p>
                <p>Teléfono: 3795172153</p>
                <p>Correo: contacto@agronat.com.ar</p>
              </div>
              <div class="comprobante-info">
                <h1>N°: ${venta.saleId}</h1>
                <p>Fecha de la venta: ${new Date(venta.fecha).toLocaleDateString()}</p>
                <p>Medio de Pago: ${venta.medioPago}</p>
                <p>Atendido por: ${venta?.empleado?.name ?? ''} ${venta?.empleado?.lastname ?? ''}</p>
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
              <p>¡Gracias por su compra!</p>
            </div>
          </div>
        </body>
        </html>
`;

        // 3. Crear iframe e imprimir
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = 'none';
        iframe.style.visibility = 'hidden';
        
        document.body.appendChild(iframe);

        // 4. Cargar contenido y manejar impresión
        iframe.contentDocument.open();
        iframe.contentDocument.write(facturaHTML);
        iframe.contentDocument.close();

        // 5. Imprimir después de breve espera
        setTimeout(() => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            
            // Limpiar después de imprimir
            setTimeout(() => {
                if (document.body.contains(iframe)) {
                    document.body.removeChild(iframe);
                }
            }, 1000);
        }, 300);

    } catch (error) {
        console.error('Error al imprimir la venta existente:', error);
        setOpenErrorSnackbar(true);
    }
};


  const handleEstadoChange = async (event) => {
    if (venta.abonado) {
      alert('El estado ya está marcado como abonado y no se puede modificar.');
      return;
    }

    const nuevoEstado = event.target.checked;
    const ventaId = venta._id;

    try {
      const response = await fetch(`${apiUrl}/api/sales/update_state/${ventaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ abonado: nuevoEstado }),
      });

      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

      setVenta((prev) => ({ ...prev, abonado: nuevoEstado }));
      fetchVentas();
    } catch (error) {
      console.error('Error al actualizar el estado de la venta:', error);
      alert('No se pudo actualizar el estado.');
    }
  };

  if (!venta) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="modal-container">
        <h2>Detalle de Venta - ID: {venta.saleId}</h2>
        {loading ? (
          <div className="loading-spinner">
            <CircularProgress /> 
          </div>
        ) : (
          <div className="modal-content">
            <div className="detalles-venta">
              <p><strong>Fecha:</strong> {new Date(venta.fecha).toLocaleDateString()}</p>
              <p><strong>Total:</strong> ${venta.total}</p>
              <p><strong>Cliente:</strong> {venta.cliente}</p>
              <p><strong>Vendedor:</strong> {venta.empleado.name} {venta.empleado.lastname}</p>
              <p><strong>Comprobante:</strong> {venta.comprobante}</p>
              <p><strong>Medio de Pago:</strong> {venta.medioPago}</p>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={venta.abonado}
                    onChange={handleEstadoChange}
                    color="primary"
                    disabled={venta.abonado} // Deshabilita el checkbox si abonado es true
                  />
                }
                label={venta.abonado ? '✅ Abonado' : '⚠ Pendiente'}
              />
            </div>
            <div className="productos-vendidos">
              <h3>Productos Vendidos</h3>
              <ul>
                {venta.productos.map((producto, index) => (
                  <li key={index}>
                    <span className="producto-nombre">
                      {producto.productoId?.name || 'Producto no disponible'}
                    </span>
                    <span className="producto-precio">{producto.productoId?.description}</span>
                    <span className="producto-cantidad">{producto.cantidad}</span>
                    <span className="producto-precio">{producto.precioUnitario} $</span>
                    <span className="producto-subtotal">{producto.subtotal} $</span>
                  </li>
                ))}
              </ul>
              <div className="total-venta">
                <strong>Total:</strong> {venta.total}$
              </div>
            </div>
            <div className="modal-footer">
            <Button
              variant="contained"
              color="primary"
              startIcon={<SearchCheck size={20} />}
              onClick={() => imprimirVentaExistente(venta.saleId)} // Pasar el _id de la venta
              className="btn-inspeccionar"
            >
              Imprimir Comprobante
            </Button>
            </div>
          </div>
        )}
      </Box>
    </Modal>
  );
};

export default ModalDetalleVenta;
