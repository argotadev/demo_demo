import React, { useState } from 'react';
import DateRangeFilter from './DateRangeFilter';
import MonthlySalesChart from './MonthlySalesChart';
import CategoryDistributionChart from './CategoryDistributionChart';
import TopProductsChart from './TopProductsChart';

export default function ChartsDashboard() {
  const [filters, setFilters] = useState({});

  return (
    <div className="container">
      <h2>Dashboard de Gráficos</h2>
      <DateRangeFilter onChange={(f) => setFilters(f)} />

      <div className="row" style={{ marginTop: 16 }}>
        <div className="col-md-8">
          <MonthlySalesChart filters={filters} />
        </div>
        <div className="col-md-4">
          <CategoryDistributionChart filters={filters} />
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <TopProductsChart filters={filters} />
      </div>
    </div>
  );
}
