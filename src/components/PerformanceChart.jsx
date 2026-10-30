import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { SERVICE_COLORS, formatTime, serviceLabel } from '../labels.js';

export default function PerformanceChart({ recent }) {
  // API returns newest first; the chart reads left (oldest) to right (newest).
  const data = recent
    .slice()
    .reverse()
    .map((entry, index) => ({
      n: index + 1,
      time: formatTime(entry.timestamp),
      [entry.service]: entry.duration,
    }));

  if (data.length === 0) {
    return (
      <div className="empty">
        Aún no hay llamadas registradas. Presiona «Simular carga» para generar actividad.
      </div>
    );
  }

  return (
    <div className="chart-box">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid stroke="#e5e8f0" strokeDasharray="3 3" />
          <XAxis
            dataKey="n"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            label={{ value: 'Últimas 20 llamadas (de la más antigua a la más reciente)', position: 'insideBottom', offset: -4, fontSize: 12, fill: '#6b7280' }}
            height={48}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#6b7280' }}
            unit=" ms"
            width={64}
          />
          <Tooltip
            labelFormatter={(n) => `Llamada ${n} a las ${data[n - 1]?.time ?? ''}`}
            formatter={(value, name) => [`${value} ms`, name]}
          />
          <Legend verticalAlign="top" height={32} />
          {Object.keys(SERVICE_COLORS).map((key) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              name={serviceLabel(key)}
              stroke={SERVICE_COLORS[key]}
              strokeWidth={2}
              dot={{ r: 3 }}
              connectNulls
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
