# Frontend: Panel de observabilidad

Dashboard en React + Vite que consume la API del backend y muestra métricas, gráfica
y registros de los tres servicios. Toda la interfaz está en español y no usa datos
simulados en el cliente: todo viene del backend.

## Requisitos
- Node 18 o superior
- El backend corriendo (por defecto en `http://localhost:8080`)

## Ejecutar en local
```bash
cp .env.example .env.local     # VITE_API_URL=http://localhost:8080
npm install
npm run dev
```
Abre `http://localhost:5173`.

Para generar la versión de producción:
```bash
npm run build
npm run preview
```

## Variables de entorno
| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL pública del backend, sin `/` al final. Se lee en `src/api.js`; no hay URLs escritas en los componentes. |

Vite incorpora la variable al compilar, así que si cambias `VITE_API_URL` en Vercel debes volver a desplegar.

## Qué incluye
- **Resumen general**: llamadas totales, exitosas, con error, tasa de errores y tiempo promedio.
- **Tarjetas por servicio** (Inventario, Pedidos, Pagos): total de llamadas, tasa de éxito y tiempo promedio. Si la tasa de errores supera el 15%, la tarjeta se pone roja y muestra una advertencia.
- **Gráfica de líneas** (Recharts): duración de las últimas 20 llamadas, con una serie por servicio.
- **Tabla de registros**: ID de solicitud, servicio, operación, duración, estado y hora. Los más recientes primero, verde para exitoso y rojo para error, con paginación.
- **Filtros**: servicio, estado y rango de fechas.
- **Detalle**: al hacer clic en una fila se abre un modal con el UUID completo, servicio, operación, fecha y hora, duración, estado y mensaje.
- **Simular carga**: llama a `POST /api/metrics/simulate-load`, actualiza métricas, gráfica y tabla, y muestra una notificación con el resultado.
- **Probar servicios**: ejecuta operaciones reales a mano, con una casilla para forzar un error en pagos.

## Actualización automática
`App.jsx` consulta `/api/metrics/summary` y `/api/metrics/logs` cada 3 segundos. Cada ciclo espera a que
termine el anterior antes de programar el siguiente, y hay un solo temporizador, así que las consultas no se acumulan.
Al cambiar un filtro o la página, los datos se refrescan de inmediato.

## Estructura
```
src/
├── App.jsx                 Estado, consulta periódica y composición de la página
├── api.js                  Llamadas HTTP al backend (usa VITE_API_URL)
├── labels.js               Textos en español, colores y formato de fechas
├── styles.css
└── components/
    ├── Sidebar.jsx         Barra lateral y estado de conexión
    ├── ServiceCard.jsx     Tarjeta de servicio con alerta de errores
    ├── PerformanceChart.jsx
    ├── Filters.jsx
    ├── LogsTable.jsx
    ├── LogModal.jsx
    ├── ServiceTester.jsx
    └── Toast.jsx
```
El código está en inglés; los textos que ve el usuario están en español.

## Despliegue en Vercel
1. En Vercel: **Add New → Project** e importa el repositorio.
2. En *Root Directory* escribe `frontend`. Vercel detecta Vite (build `npm run build`, salida `dist`).
3. En *Environment Variables* agrega `VITE_API_URL=https://TU-BACKEND.up.railway.app`.
4. Despliega. `vercel.json` redirige todas las rutas a `index.html`.
5. Agrega el dominio de Vercel en `CORS_ORIGINS` del backend en Railway.

## Problemas frecuentes
- **Aparece "No se pudo conectar con el servidor"**: revisa que el backend esté corriendo y que `VITE_API_URL` sea correcta.
- **La consola muestra un error de CORS**: agrega el dominio del frontend en `CORS_ORIGINS` del backend.
- **Los filtros de fecha no coinciden**: las marcas de tiempo usan la zona horaria del servidor (`APP_TIMEZONE`, por defecto `America/Bogota`).
