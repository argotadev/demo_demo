const express = require('express');
const router = express.Router();

const {
  getServicios,
  postServicio,
  putServicio,
  deleteServicio,
} = require('../controllers/serviciosController');

const {
  getCategorias,
  postCategoria,
  putCategoria,
  deleteCategoria,
} = require('../controllers/categories_servicios');

// Rutas servicios
router.get('/servicios', getServicios);
router.post('/servicios', postServicio);
router.put('/servicios/:id', putServicio);
router.delete('/servicios/:id', deleteServicio);

// Rutas categorías (dentro de servicios)
router.get('/categorias', getCategorias);
router.post('/categorias', postCategoria);
router.put('/categorias/:id', putCategoria);
router.delete('/categorias/:id', deleteCategoria);

module.exports = router;
