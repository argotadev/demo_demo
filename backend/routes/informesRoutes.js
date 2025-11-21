const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth'); 
const informesController = require('../controllers/informesController');

// Ruta para obtener datos de informes
router.get('/informes', informesController.obtenerDatosInformes);

// Ruta para obtener las últimas ventas
router.get('/ultimas-ventas', informesController.obtenerUltimasVentas);
router.get('/reporte-ventas', auth, informesController.generateSalesReport);


module.exports = router;