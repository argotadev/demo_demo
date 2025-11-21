const Sale = require('../models/Sales');

// Obtener estadísticas mensuales
exports.monthlyStats = async (req, res) => {
  try {
    const { year, startDate, endDate, mode } = req.query;
    let stats;

    if (mode === 'daily') {
      // Si se solicita estadísticas diarias, redirigir a dailyStats
      return this.dailyStats(req, res);
    } else {
      // Obtener estadísticas mensuales
      stats = await Sale.getMonthlyStats({ year: year ? parseInt(year) : undefined, startDate, endDate });
    }

    // Normalizar resultado para 12 meses
    const monthly = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, totalSales: 0, count: 0 }));
    stats.forEach((s) => {
      const m = s._id;
      if (m >= 1 && m <= 12) {
        monthly[m - 1].totalSales = s.totalSales || 0;
        monthly[m - 1].count = s.count || 0;
      }
    });

    res.json({ success: true, data: monthly });
  } catch (error) {
    console.error('Error monthlyStats:', error);
    res.status(500).json({ success: false, message: 'Error obteniendo estadísticas mensuales' });
  }
};

// Obtener estadísticas diarias (para modo mensual)
exports.dailyStats = async (req, res) => {
  try {
    const { year, month, startDate, endDate } = req.query;
    const stats = await Sale.getDailyStats({ year: year ? parseInt(year) : undefined, month: month ? parseInt(month) : undefined, startDate, endDate });

    // Transformar a formato { date, totalSales, count }
    const data = stats.map((s) => ({ date: s._id, totalSales: s.totalSales || 0, count: s.count || 0 }));

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error dailyStats:', error);
    res.status(500).json({ success: false, message: 'Error obteniendo estadísticas diarias' });
  }
};

// Obtener ventas por categoría
exports.categoryStats = async (req, res) => {
  try {
    const { year, startDate, endDate } = req.query;
    const stats = await Sale.getCategoryStats({ year: year ? parseInt(year) : undefined, startDate, endDate });

    // Transformar a formato legible
    const data = stats.map((s) => ({ category: s._id || 'Sin categoría', totalSales: s.totalSales || 0, totalQuantity: s.totalQuantity || 0 }));

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error categoryStats:', error);
    res.status(500).json({ success: false, message: 'Error obteniendo estadísticas por categoría' });
  }
};

// Obtener productos más vendidos
exports.topProducts = async (req, res) => {
  try {
    const { limit = 10, year, startDate, endDate } = req.query;
    const stats = await Sale.getTopProducts({ limit: parseInt(limit), year: year ? parseInt(year) : undefined, startDate, endDate });

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error topProducts:', error);
    res.status(500).json({ success: false, message: 'Error obteniendo top productos' });
  }
};
