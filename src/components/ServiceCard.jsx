import { serviceLabel } from '../labels.js';

const ERROR_THRESHOLD = 15;

export default function ServiceCard({ name, metrics }) {
  const total = metrics?.totalCalls ?? 0;
  const errorRate = metrics?.errorRate ?? 0;
  const successRate = metrics?.successRate ?? 0;
  const average = metrics?.averageDuration ?? 0;
  const alert = total > 0 && errorRate > ERROR_THRESHOLD;

  return (
    <article className={`card service-card ${alert ? 'service-card-alert' : ''}`}>
      <header>
        <h3>{serviceLabel(name)}</h3>
        {alert && (
          <span className="warning" role="alert">
            <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
              <path d="M10 2 19 18H1L10 2Z" fill="currentColor" />
              <rect x="9.1" y="7.5" width="1.8" height="5" fill="#fff" />
              <rect x="9.1" y="13.5" width="1.8" height="1.8" fill="#fff" />
            </svg>
            Tasa de errores alta
          </span>
        )}
      </header>
      <dl className="metrics">
        <div>
          <dt>Total de llamadas</dt>
          <dd>{total}</dd>
        </div>
        <div>
          <dt>Tasa de éxito</dt>
          <dd>{total === 0 ? '—' : `${successRate.toFixed(1)}%`}</dd>
        </div>
        <div>
          <dt>Tiempo promedio</dt>
          <dd>{total === 0 ? '—' : `${average.toFixed(0)} ms`}</dd>
        </div>
      </dl>
      {alert && (
        <p className="alert-text">
          El {errorRate.toFixed(1)}% de las llamadas falló; el límite aceptable es {ERROR_THRESHOLD}%.
        </p>
      )}
    </article>
  );
}
