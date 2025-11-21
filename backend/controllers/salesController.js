const Product = require("../models/Product");
const Sale = require('../models/Sales');

// Buscar productos
exports.searchProducts = async (req, res) => {
  console.log('Consulta recibida:', req.query);
  
  try {
    const { searchQuery = '' } = req.query;

    console.log('Buscando productos con query:', searchQuery);
    
    const filter = { active: true };
    if (searchQuery) {
      filter.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } }
      ];
    }

    console.log('Filtro aplicado:', filter);
    
    const products = await Product.find(filter).lean();
    
    console.log(`Productos encontrados: ${products.length}`);
    
    return res.status(200).json({
      success: true,
      productos: products,
      timestamp: new Date()
    });
    
  } catch (error) {
    console.error('Error en searchProducts:', {
      message: error.message,
      stack: error.stack,
      query: req.query
    });
    
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      errorDetails: process.env.NODE_ENV !== 'production' ? error.message : undefined
    });
  }
};

exports.updateState = async (req, res) => {
  try {
    const { id } = req.params;
    const { abonado } = req.body;

    // Validar que el campo "abonado" esté presente y sea un booleano
    if (typeof abonado !== 'boolean') {
      return res.status(400).json({ message: 'El valor de abonado debe ser un booleano' });
    }

    // Actualizar la venta
    const updatedSale = await Sale.findByIdAndUpdate(id, { abonado }, { new: true });

    if (!updatedSale) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }

    res.status(200).json(updatedSale);
  } catch (error) {
    console.error('Error al actualizar el estado de la venta:', error);
    res.status(500).json({ message: 'Error interno en el servidor', error: error.message });
  }
};


//Buscar venta especifica
exports.searchsale = async (req, res) => {
  try {
    const ventaId = req.params.searchQuery;

    // Buscar la venta y poblar los detalles del producto
    const venta = await Sale.findById(ventaId)
      .populate({
        path: 'productos.productoId',
        select: 'name description', // Selecciona los campos que necesitas del producto
      })
      .populate({
        path: 'empleado', // <-- esto es lo nuevo
        select: 'name lastname' // <-- solo lo que necesitás
      })
      .select('cliente comprobante productos total medioPago abonado fecha  saleId empleado');

    if (!venta) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }

    res.json(venta);
  } catch (error) {
    console.error('Error al buscar la venta:', error);
    res.status(500).json({ message: 'Error al obtener la venta', error: error.message });
  }
};
//Buscar venta para el detalle de la venta
exports.searchsaledetail = async (req, res) => {
  try {
    const saleId = req.params.id_venta; // Obtener el saleId desde los parámetros de la ruta

    // Buscar la venta por saleId y poblar los detalles del producto
    const venta = await Sale.findOne({ saleId }) // Buscar por saleId
    .populate({
      path: 'productos.productoId',
      select: 'name description price_final',
    })
    .populate({
      path: 'empleado',
      select: 'name lastname', // Traer solo nombre y apellido del empleado
    })
    .select('cliente comprobante productos total medioPago abonado fecha saleId empleado'); // <- importante incluir 'empleado'

  if (!venta) {
    return res.status(404).json({ message: 'Venta no encontrada' });
  }

  // Formatear los productos para incluir el precio final y el subtotal
  const productosFormateados = venta.productos.map((producto) => ({
    name: producto.productoId.name,
    cantidad: producto.cantidad,
    price_final: producto.productoId.price_final,
    subtotal: producto.cantidad * producto.productoId.price_final,
  }));

  // Devolver la venta con los productos formateados y el empleado
  res.json({
    ...venta.toObject(),
    productos: productosFormateados,
  });

  } catch (error) {
    console.error('Error al buscar la venta:', error);
    res.status(500).json({ message: 'Error al obtener la venta', error: error.message });
  }
};

// Función para generar el próximo saleId
const generarProximoSaleId = async () => {
  try {
    // Buscar la última venta
    const ultimaVenta = await Sale.findOne().sort({ saleId: -1 }); // Ordenar por saleId en orden descendente

    let proximoId = '0000000001'; // Valor por defecto si no hay ventas

    if (ultimaVenta && ultimaVenta.saleId) {
      // Convertir el último saleId a número, incrementarlo y formatearlo
      const ultimoIdNumero = parseInt(ultimaVenta.saleId, 10);
      proximoId = (ultimoIdNumero + 1).toString().padStart(10, '0'); // Formatear a 10 dígitos
    }

    return proximoId;
  } catch (error) {
    console.error('Error al generar el próximo saleId:', error);
    throw error;
  }
};

//metodo de registrar venta

exports.registrarVenta = async (req, res) => {
  const { cliente, comprobante, productos, medioPago, abonado, total } = req.body;

  try {
    if (!productos || productos.length === 0) {
      return res.status(400).json({ message: 'No hay productos en la venta.' });
    }

    const productosVenta = [];

    for (const producto of productos) {
      const productoEnDB = await Product.findById(producto._id);

      if (!productoEnDB) {
        return res.status(404).json({ message: `Producto con ID ${producto._id} no encontrado.` });
      }

      // Restar stock
      productoEnDB.quantity -= producto.cantidad;
      await productoEnDB.save();

      productosVenta.push({
        productoId: producto._id,
        cantidad: producto.cantidad,
        precioUnitario: producto.price_final,
        subtotal: producto.cantidad * producto.price_final,
      });
    }

    const saleId = await generarProximoSaleId();
    const empleadoId = req.user?.id;
    const empleadoNombre = `${req.user?.name || ''} ${req.user?.lastname || ''}`.trim();

    if (!empleadoId) {
      return res.status(401).json({ message: 'No se pudo identificar al empleado que realiza la venta.' });
    }

    const nuevaVenta = new Sale({
      cliente,
      comprobante,
      saleId,
      productos: productosVenta,
      total,
      medioPago,
      abonado,
      empleado: empleadoId,
      empleadoNombre,
      mes: new Date().getMonth() + 1, // de 1 a 12
    });

    await nuevaVenta.save();

    res.status(200).json({
      message: 'Venta registrada y stock actualizado correctamente.',
      venta: nuevaVenta,
      saleId: nuevaVenta.saleId,
    });
  } catch (error) {
    console.error('Error al registrar la venta:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

