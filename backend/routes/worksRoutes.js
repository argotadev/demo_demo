const express = require('express');
const router = express.Router();
const worksController = require('../controllers/worksController');

// Ruta base: /api/trabajos

router.get('/', worksController.listarTrabajos);
router.get('/:id', worksController.obtenerTrabajo);
router.post('/registrar_trabajo', worksController.registrarTrabajo);
router.put('/editar_trabajo/:id', worksController.actualizarTrabajo);
router.put('/eliminar_trabajo/:id', worksController.eliminarTrabajo); //baja logica por eso es un metodo put 

module.exports = router;
