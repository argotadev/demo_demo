// models/Sale.js



const mongoose = require('mongoose');
const ExcelJS = require('exceljs');


const saleSchema = new mongoose.Schema({
  cliente: { type: String, required: true }, // Nombre del cliente
  comprobante: { type: String, required: true }, // Tipo de comprobante (Boleta/Factura)
  saleId: { type: String, required: true }, // ID de la venta
  productos: [
    {
      productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Referencia al producto
      cantidad: { type: Number, required: true }, // Cantidad vendida
      precioUnitario: { type: Number, required: true }, // Precio unitario al momento de la venta
      subtotal: { type: Number, required: true }, // Subtotal (cantidad * precioUnitario)
    },
  ],
  total: { type: Number, required: true }, // Total de la venta
  medioPago: { type: String, required: true }, // Medio de pago (Efectivo, Tarjeta, etc.)
  abonado: { type: Boolean, required: true }, // Si está abonado o no

  empleado: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },//Empleado que realizó la venta
  empleadoNombre: { type: String, required: true }, // Nuevo campo

  mes: { type: Number, required: true }, // Mes (1-12) en que se hizo la venta
  fecha: { type: Date, default: Date.now }, // Fecha de la venta
});

// Métodos estáticos para agregaciones usadas por chartsController
saleSchema.statics.getMonthlyStats = async function ({ year, startDate, endDate } = {}) {
  const match = {};

  if (year) {
    const start = new Date(`${year}-01-01T00:00:00.000Z`);
    const end = new Date(`${year}-12-31T23:59:59.999Z`);
    match.fecha = { $gte: start, $lte: end };
  }

  if (startDate && endDate) {
    match.fecha = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: { $month: '$fecha' },
        totalSales: { $sum: '$total' },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id': 1 } },
  ]);
};

saleSchema.statics.getCategoryStats = async function ({ year, startDate, endDate } = {}) {
  const match = {};

  if (year) {
    const start = new Date(`${year}-01-01T00:00:00.000Z`);
    const end = new Date(`${year}-12-31T23:59:59.999Z`);
    match.fecha = { $gte: start, $lte: end };
  }

  if (startDate && endDate) {
    match.fecha = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  return this.aggregate([
    { $match: match },
    { $unwind: '$productos' },
    // Lookup product to get category
    {
      $lookup: {
        from: 'products',
        localField: 'productos.productoId',
        foreignField: '_id',
        as: 'productoInfo',
      },
    },
    { $unwind: { path: '$productoInfo', preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: '$productoInfo.category',
        totalSales: { $sum: { $multiply: ['$productos.cantidad', '$productos.precioUnitario'] } },
        totalQuantity: { $sum: '$productos.cantidad' },
      },
    },
    { $sort: { totalSales: -1 } },
  ]);
};

saleSchema.statics.getTopProducts = async function ({ limit = 10, year, startDate, endDate } = {}) {
  const match = {};

  if (year) {
    const start = new Date(`${year}-01-01T00:00:00.000Z`);
    const end = new Date(`${year}-12-31T23:59:59.999Z`);
    match.fecha = { $gte: start, $lte: end };
  }

  if (startDate && endDate) {
    match.fecha = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  return this.aggregate([
    { $match: match },
    { $unwind: '$productos' },
    {
      $group: {
        _id: '$productos.productoId',
        totalQuantity: { $sum: '$productos.cantidad' },
        totalSales: { $sum: { $multiply: ['$productos.cantidad', '$productos.precioUnitario'] } },
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        productId: '$_id',
        name: '$product.name',
        totalQuantity: 1,
        totalSales: 1,
      },
    },
    { $sort: { totalQuantity: -1 } },
    { $limit: limit },
  ]);
};

saleSchema.statics.getDailyStats = async function ({ year, month, startDate, endDate } = {}) {
  const match = {};

  if (year && month) {
    // Construir rango para el mes
    const m = String(month).padStart(2, '0');
    const start = new Date(`${year}-${m}-01T00:00:00.000Z`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    end.setMilliseconds(end.getMilliseconds() - 1);
    match.fecha = { $gte: start, $lte: end };
  } else if (startDate && endDate) {
    match.fecha = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$fecha' } },
        totalSales: { $sum: '$total' },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id': 1 } },
  ]);
};

module.exports = mongoose.model('Sale', saleSchema);