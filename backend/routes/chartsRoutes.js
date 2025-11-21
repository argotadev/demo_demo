const express = require('express');
const router = express.Router();
const chartsController = require('../controllers/chartsController');

// Endpoints de estadísticas / gráficos
router.get('/monthly-stats', chartsController.monthlyStats);
router.get('/category-stats', chartsController.categoryStats);
router.get('/top-products', chartsController.topProducts);
router.get('/daily-stats', chartsController.dailyStats);

module.exports = router;
