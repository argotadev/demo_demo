require('dotenv').config(); // Carga las variables de entorno PRIMERO

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const worksRoutes = require('./routes/worksRoutes');
const providerRoutes = require('./routes/providersRoutes');
const salesRoutes = require('./routes/salesRoutes');
const informesRoutes = require('./routes/informesRoutes');
const measuresRoutes = require('./routes/measuresRoutes.js');
const categoriesRoutes = require('./routes/categoriesRoutes.js');
const serviciosRoutes = require('./routes/serviciosRoutes.js');
const chartsRoutes = require('./routes/chartsRoutes');

// Configuración inicial
const app = express();

// Middleware CORS (configuración segura para producción)
// Configuración CORS mejorada
const allowedOrigins = [
  process.env.FRONTEND_URL,  // Ahora usa la variable de entorno
  'https://agronat.netlify.app', // Tu dominio en Netlify
  'http://localhost:5173' 
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Origen bloqueado:', origin);  // Para debug en logs
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));  // Manejo explícito de preflight

// Tus rutas y middleware...
app.use(express.json());

// Conexión a la DB
connectDB(); // Asegúrate de que connectDB use process.env.MONGODB_URI

// Rutas
app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes);
app.use('/api/provider', providerRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/measures',measuresRoutes );
app.use('/api/categories',categoriesRoutes );
app.use('/api/servicios',serviciosRoutes); 
app.use('/api/works',worksRoutes); 
app.use('/api', informesRoutes);
app.use('/api/sales', chartsRoutes);

// Middleware de errores (agregar al final)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal en el servidor' });
});



//esto permite recibir pingueos de cronlab para que el backend no se duerma(plan gratuito de railway)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'active' });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000; // Usa el puerto del .env o 5000 por defecto
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  console.log(`Modo: ${process.env.NODE_ENV || 'development'}`);
});