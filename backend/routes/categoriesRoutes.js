// routes/measureRoutes.js
const express = require('express');
const router = express.Router();
const measureController = require('../controllers/measureController.js');



// Rutas para categorías
router.post('/register',  measureController.registerCategory);
router.get('/list',  measureController.listCategories);

module.exports = router;