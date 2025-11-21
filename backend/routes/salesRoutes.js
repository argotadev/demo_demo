const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const { auth } = require('../middlewares/auth'); 



// Productos
router.get('/productos_disponibles', salesController.searchProducts);
router.get('/buscar_venta/:searchQuery', salesController.searchsale);
router.get('/buscar_venta_detalle/:id_venta', salesController.searchsaledetail);

// Ventas
router.post('/registrar_venta', auth, salesController.registrarVenta);
router.put('/update_state/:id', salesController.updateState);


module.exports = router;





module.exports = router;



