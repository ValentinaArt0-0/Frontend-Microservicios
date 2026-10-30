import { useEffect } from 'react';
import { formatDateTime, operationLabel, serviceLabel, statusLabel } from '../labels.js';

export default function LogModal({ entry, onClose }) {
  useEffect(() => {
    const onKey = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!entry) return null;
  const isError = entry.status === 'ERROR';

  return (
    <div className="backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(e) => e.stopPropagation()}>
        <header>
          <h2 id="modal-title">Detalle del registro</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Cerrar">×</button>
        </header>
        <dl className="detail">
          <dt>ID de solicitud</dt>
          <dd className="mono">{entry.requestId}</dd>
          <dt>Servicio</dt>
          <dd>{serviceLabel(entry.service)}</dd>
          <dt>Operación</dt>
          <dd>{operationLabel(entry.operation)}</dd>
          <dt>Fecha y hora</dt>
          <dd>{formatDateTime(entry.timestamp)}</dd>
          <dt>Duración</dt>
          <dd>{entry.duration} ms</dd>
          <dt>Estado</dt>
          <dd>
            <span className={`badge badge-${entry.status.toLowerCase()}`}>{statusLabel(entry.status)}</span>
          </dd>
          <dt>{isError ? 'Mensaje de error' : 'Mensaje de respuesta'}</dt>
          <dd className={isError ? 'text-error' : ''}>{entry.message}</dd>
        </dl>
        <footer>
          <button type="button" className="btn btn-primary" onClick={onClose}>Cerrar</button>
        </footer>
      </div>
    </div>
  );
}
