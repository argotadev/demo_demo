import React, { useEffect, useState } from 'react';
import api from '../../../api/axiosInstance';

export default function TopProductsChart({ filters }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const params = { limit: 10 };
      if (filters?.startDate) params.startDate = filters.startDate;
      if (filters?.endDate) params.endDate = filters.endDate;
      if (filters?.year) params.year = filters.year;

      const res = await api.get('/sales/top-products', { params });
      if (res.data && res.data.success) {
        setItems(res.data.data);
      }
    };
    fetchData();
  }, [filters]);

  return (
    <div>
      <h4>Top Productos</h4>
      <table className="table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.productId || it._id}>
              <td>{Array.isArray(it.name) ? it.name[0] : it.name || '—'}</td>
              <td>{it.totalQuantity}</td>
              <td>{it.totalSales?.toFixed ? it.totalSales.toFixed(2) : it.totalSales}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
