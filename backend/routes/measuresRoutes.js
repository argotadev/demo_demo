// routes/measureRoutes.js
const express = require('express');
const router = express.Router();
const measureController = require('../controllers/measureController.js');

// Rutas para medidas
router.post('/register', measureController.registerMeasure);
router.get('/list', measureController.listMeasures);

module.exports = router;