const mongoose = require('mongoose');

const TrabajoSchema = new mongoose.Schema({
  cliente: { type: String, required: true },
  servicios: [{
    servicio: String,
    categoria: String,
    costo: Number,
    descuento: Number
  }],
  descripcion: String,
  fecha: Date,
  fechaVencimiento: Date,
  tecnico: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },//Empleado que realizó el trabajo 
  observaciones: String,
  costo: { type: Number, default: 0 }, // Costo total del trabajo
  active: { type: Boolean, default: true }
}, { timestamps: true });


module.exports = mongoose.model('Trabajo', TrabajoSchema);
