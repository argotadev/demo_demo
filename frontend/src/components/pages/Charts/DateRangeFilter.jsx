import React, { useState } from 'react';

export default function DateRangeFilter({ onChange }) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const apply = () => {
    onChange({ startDate: start || undefined, endDate: end || undefined });
  };

  return (
    <div className="date-range-filter" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <div>
        <label>Desde</label>
        <input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
      </div>
      <div>
        <label>Hasta</label>
        <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
      </div>
      <button onClick={apply} className="btn btn-primary">Aplicar</button>
    </div>
  );
}
