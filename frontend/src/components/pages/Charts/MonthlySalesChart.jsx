import React, { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import api from '../../../api/axiosInstance';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, zoomPlugin);

export default function MonthlySalesChart({ filters }) {
  const [data, setData] = useState(null);
  const [mode, setMode] = useState('annual'); // 'annual' o 'monthly'
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {};
        if (filters?.startDate) params.startDate = filters.startDate;
        if (filters?.endDate) params.endDate = filters.endDate;
        if (filters?.year) params.year = filters.year;

        if (mode === 'annual') {
          const res = await api.get('/sales/monthly-stats', { params });
          if (res.data && res.data.success) {
            const months = res.data.data;
            const labels = months.map((m) => `M${m.month}`);
            const values = months.map((m) => m.totalSales);
            setData({ labels, datasets: [{ label: 'Ventas', data: values, borderColor: 'rgb(75,192,192)', backgroundColor: 'rgba(75,192,192,0.2)' }] });
          }
        } else {
          // modo mensual -> daily stats
          if (filters?.year && filters?.month) {
            const res = await api.get('/sales/daily-stats', { params: { year: filters.year, month: filters.month } });
            if (res.data && res.data.success) {
              const items = res.data.data;
              const labels = items.map((i) => i.date);
              const values = items.map((i) => i.totalSales);
              setData({ labels, datasets: [{ label: 'Ventas', data: values, borderColor: 'rgb(75,192,192)', backgroundColor: 'rgba(75,192,192,0.2)' }] });
            }
          } else if (filters?.startDate && filters?.endDate) {
            const res = await api.get('/sales/daily-stats', { params: { startDate: filters.startDate, endDate: filters.endDate } });
            if (res.data && res.data.success) {
              const items = res.data.data;
              const labels = items.map((i) => i.date);
              const values = items.map((i) => i.totalSales);
              setData({ labels, datasets: [{ label: 'Ventas', data: values, borderColor: 'rgb(75,192,192)', backgroundColor: 'rgba(75,192,192,0.2)' }] });
            }
          }
        }
      } catch (error) {
        console.error('Error fetching chart data', error);
      }
    };
    fetchData();
  }, [filters, mode]);

  if (!data) return <div>Cargando ventas...</div>;

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: mode === 'annual' ? 'Ventas mensuales (anual)' : 'Ventas diarias (mensual)' },
      zoom: {
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: 'x',
        },
        pan: {
          enabled: true,
          mode: 'x',
        },
      },
    },
    scales: {
      x: { display: true },
      y: { display: true },
    },
  };

  const resetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  const downloadChart = () => {
    const link = document.createElement('a');
    const canvas = chartRef.current?.canvasRef?.current;
    if (canvas) {
      link.href = canvas.toDataURL('image/png');
      link.download = `ventas-${mode}.png`;
      link.click();
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
        <label>Modo:</label>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="annual">Anual</option>
          <option value="monthly">Mensual</option>
        </select>
        <button className="btn btn-secondary" onClick={resetZoom}>Reset Zoom</button>
        <button className="btn btn-primary" onClick={downloadChart}>Descargar PNG</button>
      </div>

      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
}
