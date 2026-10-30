import { SERVICE_LABELS, STATUS_LABELS } from '../labels.js';

export default function Filters({ filters, onChange, onClear }) {
  const update = (key) => (event) => onChange({ ...filters, [key]: event.target.value });

  return (
    <div className="filters">
      <label>
        Servicio
        <select value={filters.service} onChange={update('service')}>
          <option value="">Todos</option>
          {Object.entries(SERVICE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label>
      <label>
        Estado
        <select value={filters.status} onChange={update('status')}>
          <option value="">Todos</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label>
      <label>
        Desde
        <input type="datetime-local" value={filters.from} onChange={update('from')} />
      </label>
      <label>
        Hasta
        <input type="datetime-local" value={filters.to} onChange={update('to')} />
      </label>
      <button type="button" className="btn btn-ghost" onClick={onClear}>Limpiar filtros</button>
    </div>
  );
}
