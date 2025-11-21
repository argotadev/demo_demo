/**
 * db.js
 * 
 * Este archivo contiene la configuración para conectar la aplicación a la base de datos MongoDB.
 * 
 * Contenido:
 * - Importa las dependencias necesarias: mongoose y dotenv.
 * - Carga las variables de entorno desde el archivo .env.
 * - Define una función connectDB que intenta conectarse a la base de datos utilizando la URI especificada en las variables de entorno.
 * - Exporta la función connectDB para ser utilizada en otros archivos.
 */

const mongoose = require('mongoose');
require("dotenv").config()

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB conectado correctamente');
  } catch (err) {
    console.error('❌ Error de conexión a MongoDB:', err.message);
    // Reconexión automática después de 5 segundos
    setTimeout(connectDB, 5000);
  }
};

// Manejo de eventos de conexión
mongoose.connection.on('connected', () => {
  console.log('⚡ Conexión activa a MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('⚠️ Error en la conexión MongoDB:', err);
});

module.exports = connectDB;