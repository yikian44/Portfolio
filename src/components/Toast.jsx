import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Toast({ toasts, removeToast }) {
  return (
    <div style={{
      position: 'fixed',
      top: '24px',
      right: '24px',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      pointerEvents: 'none'
    }}>
      <AnimatePresence>
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, removeToast }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast, removeToast]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      style={{
        background: 'var(--window-bg)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--blueprint-color)',
        padding: '12px 18px',
        borderRadius: '0px', // Sharp CAD corner
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        pointerEvents: 'auto',
        minWidth: '260px',
        position: 'relative',
        fontFamily: 'var(--font-mono)',
      }}
    >
      {/* Inner dashed boundary line */}
      <div style={{
        position: 'absolute',
        inset: '2px',
        border: '1px dashed var(--blueprint-grid-primary)',
        pointerEvents: 'none',
      }} />

      {/* Message Type / Header */}
      <div style={{ fontSize: '8px', color: 'var(--text-muted)', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
        <span>[SYS_NOTIFICATION]</span>
        <span>DWG_MSG_{toast.id.slice(-3)}</span>
      </div>

      <h4 style={{ margin: '0 0 2px 0', fontSize: '13px', fontWeight: '700', color: 'var(--blueprint-color)' }}>
        {toast.title.toUpperCase()}
      </h4>
      <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-color)', opacity: 0.95 }}>
        {toast.message}
      </p>
    </motion.div>
  );
}
