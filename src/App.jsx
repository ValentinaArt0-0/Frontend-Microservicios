import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchLogs, fetchSummary, simulateLoad } from './api.js';
import Sidebar from './components/Sidebar.jsx';
import ServiceCard from './components/ServiceCard.jsx';
import PerformanceChart from './components/PerformanceChart.jsx';
import Filters from './components/Filters.jsx';
import LogsTable from './components/LogsTable.jsx';
import LogModal from './components/LogModal.jsx';
import Toast from './components/Toast.jsx';
import ServiceTester from './components/ServiceTester.jsx';

const POLL_INTERVAL_MS = 3000;
const PAGE_SIZE = 10;
const SERVICE_ORDER = ['InventoryService', 'OrderService', 'PaymentService'];
const EMPTY_FILTERS = { service: '', status: '', from: '', to: '' };

export default function App() {
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState([]);
  const [logPage, setLogPage] = useState(null);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);
  const [connected, setConnected] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  // The refresh function always reads the latest filters/page without being re-created.
  const queryRef = useRef({ filters, page });
  queryRef.current = { filters, page };

  const refresh = useCallback(async () => {
    const { filters: currentFilters, page: currentPage } = queryRef.current;
    try {
      const [summaryData, recentData, logsData] = await Promise.all([
        fetchSummary(),
        fetchLogs({ size: 20 }),
        fetchLogs({ ...currentFilters, page: currentPage, size: PAGE_SIZE }),
      ]);
      setSummary(summaryData);
      setRecent(recentData.content);
      setLogPage(logsData);
      setConnected(true);
      setLastUpdate(new Date());
    } catch {
      setConnected(false);
    }
  }, []);

  // Immediate refresh whenever the user changes filters or page (also performs the first load).
  useEffect(() => {
    refresh();
  }, [filters, page, refresh]);

  // Single polling loop: the next request is scheduled only after the previous one finishes,
  // so requests never pile up and only one timer exists.
  useEffect(() => {
    let cancelled = false;
    let timer;
    const loop = async () => {
      await refresh();
      if (!cancelled) timer = setTimeout(loop, POLL_INTERVAL_MS);
    };
    timer = setTimeout(loop, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [refresh]);

  // Auto-dismiss notifications.
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = useCallback((type, text) => setToast({ type, text }), []);

  const handleSimulate = async () => {
    setSimulating(true);
    try {
      const result = await simulateLoad();
      await refresh();
      showToast('success', result.message);
    } catch (error) {
      showToast('error', `No se pudo completar la simulación: ${error.message}`);
    } finally {
      setSimulating(false);
    }
  };

  const handleFilters = (next) => {
    setFilters(next);
    setPage(0);
  };

  const handleExecuted = (type, text) => {
    showToast(type, text);
    refresh();
  };

  const metricsByService = Object.fromEntries((summary?.services ?? []).map((item) => [item.service, item]));

  return (
    <div className="layout">
      <Sidebar connected={connected} lastUpdate={lastUpdate} />
      <main>
        <header className="topbar" id="panel">
          <div>
            <h1>Panel de observabilidad</h1>
            <p>Monitoreo de los servicios de inventario, pedidos y pagos a través del Proxy de auditoría.</p>
          </div>
          <button type="button" className="btn btn-primary" onClick={handleSimulate} disabled={simulating}>
            {simulating ? 'Simulando…' : 'Simular carga'}
          </button>
        </header>

        {!connected && (
          <div className="banner" role="alert">
            No se pudo conectar con el servidor. Se volverá a intentar automáticamente.
          </div>
        )}

        <section className="summary-strip" aria-label="Resumen general">
          <div><span>Llamadas totales</span><strong>{summary?.totalCalls ?? 0}</strong></div>
          <div><span>Exitosas</span><strong className="text-ok">{summary?.successCalls ?? 0}</strong></div>
          <div><span>Con error</span><strong className="text-error">{summary?.errorCalls ?? 0}</strong></div>
          <div><span>Tasa de errores</span><strong>{(summary?.errorRate ?? 0).toFixed(1)}%</strong></div>
          <div><span>Tiempo promedio</span><strong>{Math.round(summary?.averageDuration ?? 0)} ms</strong></div>
        </section>

        <section className="cards" aria-label="Servicios">
          {SERVICE_ORDER.map((name) => (
            <ServiceCard key={name} name={name} metrics={metricsByService[name]} />
          ))}
        </section>

        <section className="card" id="rendimiento">
          <h2>Tiempo de respuesta por servicio</h2>
          <p className="muted">Duración de las últimas 20 llamadas, con una serie por servicio.</p>
          <PerformanceChart recent={recent} />
        </section>

        <section className="card" id="registros">
          <h2>Registros de auditoría</h2>
          <p className="muted">Los más recientes aparecen primero. Haz clic en una fila para ver su detalle.</p>
          <Filters filters={filters} onChange={handleFilters} onClear={() => handleFilters(EMPTY_FILTERS)} />
          <LogsTable logPage={logPage} page={page} onPageChange={setPage} onSelect={setSelected} />
        </section>

        <section className="card" id="probar">
          <h2>Probar servicios</h2>
          <p className="muted">Ejecuta una operación real; el Proxy la intercepta y la registra en la tabla de arriba.</p>
          <ServiceTester onExecuted={handleExecuted} />
        </section>
      </main>

      <LogModal entry={selected} onClose={() => setSelected(null)} />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
