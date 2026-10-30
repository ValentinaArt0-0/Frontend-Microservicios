export const SERVICE_LABELS = {
  InventoryService: 'Inventario',
  OrderService: 'Pedidos',
  PaymentService: 'Pagos',
};

export const SERVICE_COLORS = {
  InventoryService: '#5b4bdb',
  OrderService: '#0ea5e9',
  PaymentService: '#f59e0b',
};

export const OPERATION_LABELS = {
  getStock: 'Consultar existencias',
  addStock: 'Agregar existencias',
  removeStock: 'Descontar existencias',
  createOrder: 'Crear pedido',
  getOrder: 'Consultar pedido',
  processPayment: 'Procesar pago',
  refundPayment: 'Reembolsar pago',
};

export const STATUS_LABELS = {
  SUCCESS: 'Exitoso',
  ERROR: 'Error',
};

export const serviceLabel = (name) => SERVICE_LABELS[name] || name;
export const operationLabel = (name) => OPERATION_LABELS[name] || name;
export const statusLabel = (name) => STATUS_LABELS[name] || name;

export function formatDateTime(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'medium' });
}

export function formatTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
