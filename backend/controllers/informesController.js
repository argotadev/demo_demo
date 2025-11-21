const Sale = require('../models/Sales');
const Venta = require('../models/Sales');
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

// FUNCIONES DE INFORMES
exports.obtenerDatosInformes = async (req, res) => {
  try {
    const ventas = await Sale.find().populate('productos.productoId').lean();

    if (!ventas.length) {
      return res.status(200).json({
        metricasClave: {
          totalVentas: 0,
          totalAbonado: 0,
          totalATransferir: 0
        },
        ventasMensuales: [],
        distribucionVentas: []
      });
    }

    res.status(200).json({
      metricasClave: obtenerMetricasClave(ventas),
      ventasMensuales: obtenerVentasMensuales(ventas),
      distribucionVentas: obtenerDistribucionVentas(ventas)
    });

  } catch (error) {
    console.error('Error en obtenerDatosInformes:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const obtenerVentasMensuales = (ventas = []) => {
  const ventasPorMes = {};
  ventas.forEach((venta) => {
    const mes = new Date(venta.fecha).toLocaleString('default', { month: 'long' });
    if (!ventasPorMes[mes]) ventasPorMes[mes] = 0;
    ventasPorMes[mes] += venta.total;
  });
  return Object.keys(ventasPorMes).map(mes => ({ mes, total: ventasPorMes[mes] }));
};

const obtenerDistribucionVentas = (ventas) => {
  const distribucion = {};
  ventas.forEach((venta) => {
    venta.productos.forEach((producto) => {
      const nombreProducto = producto.productoId.name;
      if (!distribucion[nombreProducto]) distribucion[nombreProducto] = 0;
      distribucion[nombreProducto] += producto.subtotal;
    });
  });
  return Object.keys(distribucion).map(producto => ({ producto, total: distribucion[producto] }));
};

const obtenerMetricasClave = (ventas) => {
  const totalVentas = ventas.reduce((total, venta) => total + venta.total, 0);
  const totalProductosVendidos = ventas.reduce((total, venta) => total + venta.productos.length, 0);
  return { totalVentas, totalProductosVendidos };
};

// ÚLTIMAS VENTAS
exports.obtenerUltimasVentas = async (req, res) => {
  try {
    const ultimasVentas = await Sale.find()
      .populate('empleado', 'name lastname')
      .sort({ fecha: -1 })
      .lean();

    const ventasConEmpleado = ultimasVentas.map((venta) => ({
      ...venta,
      empleado: venta.empleado ? { name: venta.empleado.name, lastname: venta.empleado.lastname } : null,
      mes: venta.fecha ? new Date(venta.fecha).getMonth() + 1 : null,
    }));

    res.status(200).json(ventasConEmpleado);
  } catch (error) {
    console.error('Error al obtener las últimas ventas:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};


const Product = require('../models/Product');


//FUNCION PARA OBTENER NOMBRES DEL MES 
const getNombreMes = (mes) => {
  const date = new Date(2025, (mes ? mes - 1 : new Date().getMonth()));
  return date.toLocaleString('es-ES', { month: 'long' }).toUpperCase();
};

exports.generateSalesReport = async (req, res) => {
  try {
    const mesFiltro = Number(req.query.mes);
    const filtro = {};

    if (!isNaN(mesFiltro) && mesFiltro >= 1 && mesFiltro <= 12) {
      // Suponiendo que tienes un campo fecha o mes en la BD
      // Ejemplo para filtrar por mes (ajustar según esquema):
      filtro.fecha = {
        $gte: new Date(new Date().getFullYear(), mesFiltro - 1, 1),
        $lt: new Date(new Date().getFullYear(), mesFiltro, 1),
      };
    }

    const ventas = await Sale.find(filtro)
      .populate('empleado', 'name lastname')
      .populate('productos.productoId', 'name')
      .lean();

    const productos = await Product.find().lean();

    const workbook = new ExcelJS.Workbook();

    // Agregar logo
    const logoPath = path.resolve(__dirname, '../public/agronat-logo.png');
    const logoId = workbook.addImage({
      filename: logoPath,
      extension: 'png',
    });

    // HOJA 1: Ventas del mes
    const ventasSheet = workbook.addWorksheet('Ventas del mes');

    // Logo en A1:I4
    ventasSheet.addImage(logoId, {
      tl: { col: 0, row: 0 },
      br: { col: 9, row: 4 },
    });

    // Título: combinar A5:I5
    ventasSheet.mergeCells('A5:I5');
    const titleCell = ventasSheet.getCell('A5');
    titleCell.value = `REPORTE DE ${mesFiltro ? getNombreMes(mesFiltro) : 'MES COMPLETO'} DE ${new Date().getFullYear()}`;
    titleCell.font = { bold: true, size: 16, color: { argb: 'FF000000' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // Definir columnas y cabeceras en fila 6
    ventasSheet.columns = [
      { header: 'ID Venta', key: 'saleId', width: 15 },
      { header: 'Cliente', key: 'cliente', width: 20 },
      { header: 'Empleado', key: 'empleado', width: 20 },
      { header: 'Fecha', key: 'fecha', width: 15 },
      { header: 'Medio de Pago', key: 'medioPago', width: 15 },
      { header: 'Total', key: 'total', width: 15 },
      { header: 'Abonado', key: 'abonado', width: 10 },
      { header: 'Comprobante', key: 'comprobante', width: 15 },
      { header: 'Productos', key: 'productos', width: 50 },
    ];

    // Aplicar estilos al header fila 6
    const headerRow = ventasSheet.getRow(6);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4CAF50' },
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 20;
    headerRow.eachCell(cell => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Datos de ventas desde fila 7 en adelante
    ventas.forEach((v, i) => {
      const productosStr = v.productos.map(p => {
        const nombre = p.productoId ? p.productoId.name : 'Producto eliminado';
        return `${nombre} (x${p.cantidad}) - $${p.subtotal.toFixed(2)}`;
      }).join('; ');

      const row = ventasSheet.addRow({
        saleId: v.saleId,
        cliente: v.cliente,
        empleado: v.empleado ? `${v.empleado.name} ${v.empleado.lastname}` : 'Sin asignar',
        fecha: v.fecha ? new Date(v.fecha).toLocaleDateString('es-AR') : '',
        medioPago: v.medioPago,
        total: v.total,
        abonado: v.abonado ? 'Sí' : 'No',
        comprobante: v.comprobante,
        productos: productosStr,
      });

      if (i % 2 !== 0) {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF1F8E9' },
        };
      }

      row.eachCell(cell => {
        cell.font = { size: 12, color: { argb: 'FF000000' } };
        cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    // HOJA 2: Resumen y Stock
    const resumenSheet = workbook.addWorksheet('Resumen y Stock');

    resumenSheet.columns = [
      { header: 'Producto', key: 'producto', width: 40 },
      { header: 'Cantidad Vendida', key: 'cantidad', width: 20 },
      { header: 'Stock Actual', key: 'stock', width: 20 },
      { header: 'Stock Disponible', key: 'disponible', width: 20 },
    ];

    // Estilo header hoja 2
    const headerResumen = resumenSheet.getRow(1);
    headerResumen.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
    headerResumen.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4CAF50' },
    };
    headerResumen.alignment = { vertical: 'middle', horizontal: 'center' };
    headerResumen.height = 20;
    headerResumen.eachCell(cell => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Calcular productos vendidos
    const ventasPorProducto = {};
    ventas.forEach(venta => {
      venta.productos.forEach(item => {
        const id = item.productoId ? item.productoId._id.toString() : null;
        if (!id) return;
        ventasPorProducto[id] = (ventasPorProducto[id] || 0) + item.cantidad;
      });
    });

    productos.forEach((p, i) => {
      const cantidadVendida = ventasPorProducto[p._id.toString()] || 0;
      const row = resumenSheet.addRow({
        producto: p.name,
        cantidad: cantidadVendida,
        stock: p.stock || 0,
        disponible: (p.stock || 0) - cantidadVendida,
      });

      if (i % 2 !== 0) {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF1F8E9' },
        };
      }

      row.eachCell(cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    // Descargar Excel
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=reporte_ventas_${mesFiltro || 'completo'}.xlsx`);
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Error generando reporte de ventas:', error);
    res.status(500).json({ message: 'Error generando reporte' });
  }
};
