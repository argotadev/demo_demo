const express = require('express');
const router = express.Router();
const providerController = require('../controllers/providersController.js');
const check = require('../middlewares/auth.js');

router.post('/register', providerController.register);
router.post('/register_products', providerController.register_desde_productos);
router.get('/list', providerController.listarProveedores);

module.exports = router;