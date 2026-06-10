import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Settings } from 'lucide-react';
import { audioManager } from '../utils/audio';
import { useMediaQuery } from '../utils/useMediaQuery';

function DockIcon({ app, isOpen, isMinimized, isActive, mouseX, onAppClick }) {
  const ref = useRef(null);
  const IconComp = app.icon;

  const isMobile = useMediaQuery('(max-width: 768px)');
  const baseSize = isMobile ? 40 : 50;
  const maxSize = isMobile ? 40 : 76;

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const sizeSync = useTransform(distance, [-150, 0, 150], [baseSize, maxSize, baseSize]);
  const size = useSpring(sizeSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.div
      ref={ref}
      whileTap={{ scale: 0.95 }}
      onClick={() => { audioManager.playClick(); onAppClick(app.id); }}
      onMouseEnter={() => audioManager.playHover()}
      style={{
        width: size,
        height: size,
        borderRadius: '0px', // Sharp CAD grid block
        backgroundColor: isActive ? 'var(--icon-active-bg)' : 'var(--icon-bg)',
        backgroundImage: 'linear-gradient(var(--blueprint-grid-secondary) 1px, transparent 1px), linear-gradient(90deg, var(--blueprint-grid-secondary) 1px, transparent 1px)',
        backgroundSize: '6px 6px',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        position: 'relative',
        opacity: (isOpen && isMinimized) ? 0.5 : 1,
        boxShadow: isActive 
          ? `0 0 10px var(--blueprint-color-glow), inset 0 0 6px var(--blueprint-color-glow)`
          : `inset 0 0 6px rgba(0, 210, 255, 0.05)`,
        border: isActive ? '1px solid var(--blueprint-color)' : '1px solid var(--border-color)',
        y: useTransform(size, [baseSize, maxSize], [0, -10]),
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
    >
      {/* Soft internal gradient glow matching the icon's color */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at 50% 50%, var(--blueprint-color-glow) 0%, rgba(255,255,255,0) 70%)`,
        opacity: isActive ? 0.35 : 0.1,
        pointerEvents: 'none',
      }} />

      {/* Index Tag / Corner Number */}
      <span style={{
        position: 'absolute',
        top: '3px',
        right: '5px',
        fontSize: '7px',
        fontFamily: 'var(--font-mono)',
        color: 'var(--blueprint-color)',
        opacity: 0.8,
        fontWeight: '700',
        letterSpacing: '0.5px'
      }}>{app.indexTag}</span>

      {/* Technical Corner Brackets */}
      <div style={{ position: 'absolute', top: '2px', left: '2px', width: '3px', height: '3px', borderLeft: '1px solid var(--blueprint-color)', borderTop: '1px solid var(--blueprint-color)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '2px', left: '2px', width: '3px', height: '3px', borderLeft: '1px solid var(--blueprint-color)', borderBottom: '1px solid var(--blueprint-color)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '2px', right: '2px', width: '3px', height: '3px', borderRight: '1px solid var(--blueprint-color)', borderTop: '1px solid var(--blueprint-color)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '2px', right: '2px', width: '3px', height: '3px', borderRight: '1px solid var(--blueprint-color)', borderBottom: '1px solid var(--blueprint-color)', pointerEvents: 'none' }} />

      <IconComp size={20} color={app.iconColor} style={{ 
        filter: `drop-shadow(0 0 4px ${app.iconGlow})`,
      }} />
      
      {isOpen && (
        <div style={{
          position: 'absolute',
          bottom: '2px',
          width: '4px',
          height: '4px',
          background: 'var(--blueprint-color)',
          boxShadow: '0 0 6px var(--blueprint-color)',
        }} />
      )}
    </motion.div>
  );
}

export default function Dock({ apps, openApps, minimizedApps, activeApp, onAppClick, onToggleControlCenter }) {
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const mouseX = useMotionValue(Infinity);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (openApps.length === 0) return null;

  return (
    <div 
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 20px',
        borderRadius: '0px', // Sharp CAD Dock Frame
        background: 'var(--dock-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--border-color)',
        zIndex: 10000,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        alignItems: 'flex-end',
        height: '70px',
      }}>
      
      {/* Outer Border Dashed Line Offset */}
      <div style={{
        position: 'absolute',
        inset: '2px',
        border: '1px dashed var(--blueprint-grid-primary)',
        pointerEvents: 'none',
      }} />

      {/* Dock Scale Indicator */}
      <div style={{
        position: 'absolute',
        top: '-15px',
        left: '10px',
        fontSize: '8px',
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-muted)',
        letterSpacing: '0.5px'
      }}>
        TRAY_SCALE: 1:1
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', height: '50px', zIndex: 1 }}>
        {apps.filter(app => openApps.includes(app.id)).map(app => (
          <DockIcon 
            key={app.id} 
            app={app}
            isOpen={openApps.includes(app.id)}
            isMinimized={minimizedApps.includes(app.id)}
            isActive={activeApp === app.id && !minimizedApps.includes(app.id)}
            mouseX={mouseX}
            onAppClick={onAppClick}
          />
        ))}
      </div>
    </div>
  );
}
