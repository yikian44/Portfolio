import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun } from 'lucide-react';

export default function WeatherWidget() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ x: window.innerWidth - 320, y: 30, opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, duration: 0.5 }}
      className="glass"
      style={{
        position: 'absolute',
        width: '280px',
        padding: '24px',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        zIndex: 4999,
        cursor: 'grab',
        pointerEvents: 'auto',
      }}
    >
      {/* Time */}
      <h1 style={{ margin: 0, fontSize: '48px', fontWeight: '700', letterSpacing: '-1px' }}>
        {formatTime(time)}
      </h1>
      <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>
        {formatDate(time)}
      </p>

      {/* Divider */}
      <div style={{ width: '100%', height: '1px', background: 'var(--glass-border)', margin: '8px 0' }} />

      {/* Weather Mock */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Sun size={28} color="#ffbd2e" fill="#ffbd2e" />
        <div style={{ textAlign: 'left' }}>
          <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>24°C</h4>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Sunny & Clear</p>
        </div>
      </div>
    </motion.div>
  );
}
