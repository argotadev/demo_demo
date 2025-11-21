import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import api from '../../../api/axiosInstance';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryDistributionChart({ filters }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const params = {};
      if (filters?.startDate) params.startDate = filters.startDate;
      if (filters?.endDate) params.endDate = filters.endDate;
      if (filters?.year) params.year = filters.year;

      const res = await api.get('/sales/category-stats', { params });
      if (res.data && res.data.success) {
        const items = res.data.data;
        const labels = items.map((i) => i.category || 'Sin categoría');
        const values = items.map((i) => i.totalSales);
        setData({ labels, datasets: [{ data: values, backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'] }] });
      }
    };
    fetchData();
  }, [filters]);

  if (!data) return <div>Cargando distribución por categoría...</div>;

  return <Pie data={data} />;
}
