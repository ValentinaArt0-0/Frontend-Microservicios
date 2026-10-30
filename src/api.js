const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

async function request(path, options) {
  const response = await fetch(`${BASE_URL}${path}`, options);
  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }
  if (!response.ok) {
    const error = new Error(data?.message || `Error del servidor (${response.status})`);
    error.requestId = data?.requestId;
    throw error;
  }
  return data;
}

export function fetchSummary() {
  return request('/api/metrics/summary');
}

export function fetchLogs({ service, status, from, to, page = 0, size = 10 } = {}) {
  const params = new URLSearchParams();
  if (service) params.set('service', service);
  if (status) params.set('status', status);
  if (from) params.set('from', from.length === 16 ? `${from}:00` : from);
  if (to) params.set('to', to.length === 16 ? `${to}:59` : to);
  params.set('page', String(page));
  params.set('size', String(size));
  return request(`/api/metrics/logs?${params.toString()}`);
}

export function simulateLoad() {
  return request('/api/metrics/simulate-load', { method: 'POST' });
}

export function executeOperation(servicePath, operation, body) {
  return request(`/api/services/${servicePath}/${operation}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {}),
  });
}
