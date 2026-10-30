import { formatTime, operationLabel, serviceLabel, statusLabel } from '../labels.js';

export default function LogsTable({ logPage, page, onPageChange, onSelect }) {
  const rows = logPage?.content ?? [];
  const totalPages = logPage?.totalPages ?? 0;

  return (
    <>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID de solicitud</th>
              <th>Servicio</th>
              <th>Operación</th>
              <th className="num">Duración</th>
              <th>Estado</th>
              <th>Hora</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="empty-cell">
                  No hay registros que coincidan con los filtros.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr
                key={row.requestId}
                className={`row row-${row.status.toLowerCase()}`}
                onClick={() => onSelect(row)}
                onKeyDown={(event) => event.key === 'Enter' && onSelect(row)}
                tabIndex={0}
                title="Ver detalle"
              >
                <td className="mono">{row.requestId.slice(0, 8)}…</td>
                <td>{serviceLabel(row.service)}</td>
                <td>{operationLabel(row.operation)}</td>
                <td className="num">{row.duration} ms</td>
                <td>
                  <span className={`badge badge-${row.status.toLowerCase()}`}>{statusLabel(row.status)}</span>
                </td>
                <td className="muted">{formatTime(row.timestamp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pager">
        <span className="muted">
          {logPage ? `${logPage.totalElements} registros` : ''}
          {totalPages > 0 ? `, página ${page + 1} de ${totalPages}` : ''}
        </span>
        <div>
          <button type="button" className="btn btn-ghost" disabled={page === 0} onClick={() => onPageChange(page - 1)}>
            Anterior
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            disabled={page + 1 >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Siguiente
          </button>
        </div>
      </div>
    </>
  );
}
