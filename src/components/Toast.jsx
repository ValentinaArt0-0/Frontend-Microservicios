export default function Toast({ toast, onClose }) {
  if (!toast) return null;
  return (
    <div className={`toast toast-${toast.type}`} role="status">
      <span>{toast.text}</span>
      <button type="button" className="icon-btn" onClick={onClose} aria-label="Cerrar notificación">×</button>
    </div>
  );
}
