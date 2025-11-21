/**
 * Usuario.js
 * 
 * Este archivo define el esquema del modelo de Proveedor para MongoDB utilizando Mongoose.
 * 
 * Contenido:
 * - Importa mongoose.
 * - Define el esquema UserSchema con los campos email y password,
 *   donde email es único y requerido.
 * - Exporta el modelo User basado en el esquema definido, que se utilizará
 *   para interactuar con la colección de usuarios en la base de datos.
 */

const mongoose = require('mongoose');

const ProviderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: false, default:"No posee"},
  email: { type: String, required: false, unique: true }, // Quitamos el default
  create_at: { type: Date, required: false, default: Date.now },
  cel: {type: String, required: false, default:"No posee"},
  domicilio: {
    calle: { type: String, required: false , default:"No posee" },
    numero: { type: Number, required: false ,default:"No posee" },
    ciudad: { type: String, required: false, default:"No posee" },
    provincia: { type: String, required: false, default:"No posee" },
    codigo_postal: { type: String, required: false, default:"No posee" }
  }
}, { collection: 'provider' });

module.exports = mongoose.model('Provider', ProviderSchema);






