import { useState } from 'react';
import { executeOperation } from '../api.js';
import { operationLabel } from '../labels.js';

const SERVICES = {
  inventory: {
    label: 'Inventario',
    operations: {
      getStock: { productId: 'LAPTOP-001' },
      addStock: { productId: 'LAPTOP-001', quantity: 10 },
      removeStock: { productId: 'LAPTOP-001', quantity: 5 },
    },
  },
  orders: {
    label: 'Pedidos',
    operations: {
      createOrder: { productId: 'MOUSE-002', quantity: 2 },
      getOrder: { orderId: 'ORD-1001' },
    },
  },
  payments: {
    label: 'Pagos',
    operations: {
      processPayment: { orderId: 'ORD-1001', amount: 150 },
      refundPayment: { paymentId: 'PAY-0001', amount: 50 },
    },
  },
};

const pretty = (value) => JSON.stringify(value, null, 2);

export default function ServiceTester({ onExecuted }) {
  const [service, setService] = useState('inventory');
  const [operation, setOperation] = useState('getStock');
  const [bodyText, setBodyText] = useState(pretty(SERVICES.inventory.operations.getStock));
  const [forceError, setForceError] = useState(false);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);

  const changeService = (event) => {
    const next = event.target.value;
    const firstOperation = Object.keys(SERVICES[next].operations)[0];
    setService(next);
    setOperation(firstOperation);
    setBodyText(pretty(SERVICES[next].operations[firstOperation]));
    setForceError(false);
    setResult(null);
  };

  const changeOperation = (event) => {
    const next = event.target.value;
    setOperation(next);
    setBodyText(pretty(SERVICES[service].operations[next]));
    setResult(null);
  };

  const run = async () => {
    let body;
    try {
      body = JSON.parse(bodyText || '{}');
    } catch {
      setResult({ ok: false, text: 'Los parámetros no son un JSON válido.' });
      return;
    }
    if (service === 'payments' && forceError) body.forceError = true;
    setRunning(true);
    try {
      const data = await executeOperation(service, operation, body);
      setResult({ ok: true, text: pretty(data) });
      onExecuted?.('success', 'Operación ejecutada y registrada por el Proxy.');
    } catch (error) {
      setResult({
        ok: false,
        text: error.requestId ? `${error.message}\nID de solicitud: ${error.requestId}` : error.message,
      });
      onExecuted?.('error', 'La operación falló; el error quedó registrado.');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="tester">
      <div className="tester-form">
        <label>
          Servicio
          <select value={service} onChange={changeService}>
            {Object.entries(SERVICES).map(([value, item]) => (
              <option key={value} value={value}>{item.label}</option>
            ))}
          </select>
        </label>
        <label>
          Operación
          <select value={operation} onChange={changeOperation}>
            {Object.keys(SERVICES[service].operations).map((name) => (
              <option key={name} value={name}>{operationLabel(name)}</option>
            ))}
          </select>
        </label>
        <label className="wide">
          Parámetros (JSON)
          <textarea rows={5} value={bodyText} onChange={(e) => setBodyText(e.target.value)} spellCheck={false} />
        </label>
        {service === 'payments' && (
          <label className="check">
            <input type="checkbox" checked={forceError} onChange={(e) => setForceError(e.target.checked)} />
            Forzar un error en esta llamada
          </label>
        )}
        <button type="button" className="btn btn-primary" onClick={run} disabled={running}>
          {running ? 'Ejecutando…' : 'Ejecutar operación'}
        </button>
      </div>
      <div className="tester-result">
        <h3>Respuesta</h3>
        {result ? (
          <pre className={result.ok ? 'result-ok' : 'result-error'}>{result.text}</pre>
        ) : (
          <p className="muted">Ejecuta una operación para ver aquí la respuesta del servicio.</p>
        )}
      </div>
    </div>
  );
}
