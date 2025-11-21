const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');


router.post('/register', productController.createProduct);

router.get('/productos_activos', productController.getActiveProducts); // Lista productos activos
router.get('/listar_productos', productController.listProducts); // Lista todos los productos

router.put('/actualizar_producto/:code', productController.editProduct);
router.put('/desactivar_producto/:code', productController.deactivateProduct); 


module.exports = router;
