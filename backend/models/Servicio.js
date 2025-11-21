const mongoose = require('mongoose');

// Modelo Servicio
const ServicioSchema = new mongoose.Schema({
  servicio: { type: String, required: true },
  descripcion: { type: String, required: true },
  categoria: { type: String, required: true }, // Nombre de la categoría
  costo: { type: Number, required: true },
  descuento: { type: Number, default: 0 } // Descuento en porcentaje (ej: 10%)
}, { timestamps: true });

const Servicio = mongoose.model('Servicio', ServicioSchema);

// Modelo CategoriaServicio
const CategoriaServicioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true, trim: true }
}, { timestamps: true });

const CategoriaServicio = mongoose.model('CategoriaServicio', CategoriaServicioSchema);

module.exports = {
  Servicio,
  CategoriaServicio
};
