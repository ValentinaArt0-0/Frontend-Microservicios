const LINKS = [
  { href: '#panel', label: 'Panel general' },
  { href: '#rendimiento', label: 'Rendimiento' },
  { href: '#registros', label: 'Registros' },
  { href: '#probar', label: 'Probar servicios' },
];

export default function Sidebar({ connected, lastUpdate }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">M</span>
        <div>
          <strong>Monitor</strong>
          <span>de microservicios</span>
        </div>
      </div>
      <nav aria-label="Secciones del panel">
        {LINKS.map((link) => (
          <a key={link.href} href={link.href}>{link.label}</a>
        ))}
      </nav>
      <div className="sidebar-footer">
        <span className={`dot ${connected ? 'dot-ok' : 'dot-bad'}`} aria-hidden="true" />
        <div>
          <strong>{connected ? 'Servidor conectado' : 'Sin conexión'}</strong>
          <span>
            {lastUpdate
              ? `Actualizado a las ${lastUpdate.toLocaleTimeString('es-CO')}`
              : 'Esperando datos…'}
          </span>
          <span>Se actualiza cada 3 segundos</span>
        </div>
      </div>
    </aside>
  );
}
