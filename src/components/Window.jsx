import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { audioManager } from '../utils/audio';
import { useMediaQuery } from '../utils/useMediaQuery';

export default function Window({ app, isActive, onClose, onMinimize, onFocus, zIndex }) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isMaximized, setIsMaximized] = useState(false);
  const [coords, setCoords] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 750, height: 500 });
  const [isReady, setIsReady] = useState(false);
  const windowRef = useRef(null);

  useEffect(() => {
    // Delay rendering the heavy content to allow the entry animation to be perfectly smooth
    const timer = setTimeout(() => setIsReady(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const toggleMaximize = (e) => {
    e.stopPropagation();
    audioManager.playClick();
    setIsMaximized(!isMaximized);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    audioManager.playWindowClose();
    onClose(app.id);
  };

  const handleMinimize = (e) => {
    e.stopPropagation();
    audioManager.playWindowClose();
    onMinimize(app.id);
  };

  const handleDrag = () => {
    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      setCoords({
        x: Math.round(rect.left),
        y: Math.round(rect.top),
      });
    }
  };

  const forceMaximized = isMaximized || isMobile;

  return (
    <motion.div
      ref={windowRef}
      drag={!forceMaximized}
      dragMomentum={false}
      onDrag={handleDrag}
      initial={{ scale: 0.8, opacity: 0, x: isMobile ? 0 : 100, y: isMobile ? 0 : 100 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        ...(forceMaximized ? { x: 0, y: 0, width: '100%', height: '100%' } : { width: size.width, height: size.height })
      }}
      exit={{ scale: 0.8, opacity: 0, y: 200 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onMouseDown={() => onFocus(app.id)}
      onTouchStart={() => onFocus(app.id)}
      className="glass"
      style={{
        position: 'absolute',
        pointerEvents: 'auto',
        borderRadius: '0px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: zIndex,
        border: isActive ? '1px solid var(--blueprint-color)' : '1px solid var(--border-color)',
        boxShadow: isActive 
          ? '0 0 30px var(--blueprint-color-glow), 0 10px 40px rgba(0,0,0,0.5)' 
          : '0 0 15px rgba(0,0,0,0.3)',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      {!isMobile && (
        <>
          <div style={{
            position: 'absolute',
            inset: '3px',
            border: '1px dashed var(--blueprint-grid-primary)',
            pointerEvents: 'none',
            zIndex: 0,
          }} />

          <div style={{ position: 'absolute', top: '8px', left: '8px', width: '6px', height: '6px', borderLeft: '1.5px solid var(--blueprint-color)', borderTop: '1.5px solid var(--blueprint-color)', opacity: 0.5, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '8px', right: '8px', width: '6px', height: '6px', borderRight: '1.5px solid var(--blueprint-color)', borderTop: '1.5px solid var(--blueprint-color)', opacity: 0.5, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '8px', left: '8px', width: '6px', height: '6px', borderLeft: '1.5px solid var(--blueprint-color)', borderBottom: '1.5px solid var(--blueprint-color)', opacity: 0.5, pointerEvents: 'none' }} />
        </>
      )}

      {isMobile ? (
        <div 
          className="window-header-mobile" 
          style={{
            height: '55px',
            background: 'var(--window-bg)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 16px',
            borderBottom: '1px solid var(--border-color)',
            zIndex: 1,
            position: 'relative'
          }}
        >
          <button 
            onClick={handleClose} 
            style={{ 
              position: 'absolute',
              left: '16px',
              background: 'transparent',
              border: 'none',
              color: 'var(--blueprint-color)',
              fontSize: '15px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontFamily: 'var(--font-family)',
              outline: 'none',
            }}
          >
            <span style={{ fontSize: '18px', marginTop: '-2px' }}>❮</span> Back
          </button>

          <span style={{ 
            fontWeight: '600', 
            fontFamily: 'var(--font-family)', 
            fontSize: '16px', 
            letterSpacing: '0.5px',
            color: 'var(--text-color)'
          }}>
            {app.title}
          </span>
        </div>
      ) : (
        <div 
          className="window-header" 
          style={{
            height: '40px',
            background: isActive ? 'rgba(0, 210, 255, 0.06)' : 'rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 12px 0 16px',
            borderBottom: '1px solid var(--border-color)',
            cursor: isMaximized ? 'default' : 'grab',
            zIndex: 1,
            fontFamily: 'var(--font-mono)',
            color: isActive ? 'var(--blueprint-color)' : 'var(--text-color)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              fontWeight: '600', 
              fontFamily: 'var(--font-family)', 
              fontSize: '13px', 
              color: isActive ? 'var(--blueprint-color)' : 'var(--text-color)',
              letterSpacing: '0.3px'
            }}>
              {app.title}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', pointerEvents: 'auto' }}>
            <button 
              onClick={handleMinimize} 
              title="Minimize"
              style={{ 
                width: '18px', 
                height: '18px', 
                border: '1px solid var(--border-color)',
                background: 'transparent',
                color: 'var(--text-color)',
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                padding: 0,
                outline: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { audioManager.playHover(); e.currentTarget.style.background = 'rgba(0, 210, 255, 0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              -
            </button>
            
            <button 
              onClick={toggleMaximize} 
              title={isMaximized ? "Restore" : "Maximize"}
              style={{ 
                width: '18px', 
                height: '18px', 
                border: '1px solid var(--border-color)',
                background: 'transparent',
                color: 'var(--text-color)',
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '9px',
                fontFamily: 'var(--font-mono)',
                padding: 0,
                outline: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { audioManager.playHover(); e.currentTarget.style.background = 'rgba(0, 210, 255, 0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              {isMaximized ? "⧉" : "□"}
            </button>
            
            <button 
              onClick={handleClose} 
              title="Close"
              style={{ 
                width: '18px', 
                height: '18px', 
                border: '1px solid var(--border-color)',
                background: 'transparent',
                color: 'var(--text-color)',
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '9px',
                fontFamily: 'var(--font-mono)',
                padding: 0,
                outline: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { 
                audioManager.playHover();
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'; 
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.background = 'transparent'; 
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div 
        className="window-content"
        onMouseDownCapture={(e) => { e.stopPropagation(); onFocus(app.id); }}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: isMobile ? '16px' : '24px',
          background: 'var(--window-content-bg)',
          cursor: 'default',
          zIndex: 1,
        }}
      >
        {isReady ? <app.Component /> : (
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', color: 'var(--blueprint-color)', opacity: 0.5 }}>
            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              LOADING_MODULE...
            </motion.div>
          </div>
        )}
      </div>

      <div style={{
        height: '22px',
        borderTop: '1px dashed var(--border-color)',
        background: 'rgba(0, 0, 0, 0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 12px',
        fontSize: '8px',
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-muted)',
        zIndex: 1,
        pointerEvents: 'none',
      }}>
        <span>DWG_NO: KIAN_OS_0{app.indexTag}</span>
        <span>X: {coords.x}px | Y: {coords.y}px</span>
      </div>

      {!forceMaximized && (
        <motion.div
          onPan={(e, info) => {
            e.stopPropagation();
            setSize(prev => ({
              width: Math.max(300, prev.width + info.delta.x),
              height: Math.max(200, prev.height + info.delta.y)
            }));
          }}
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '20px',
            height: '20px',
            cursor: 'nwse-resize',
            zIndex: 10,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            padding: '4px',
            pointerEvents: 'auto',
          }}
        >
          <div style={{ 
            width: '0', 
            height: '0', 
            borderStyle: 'solid', 
            borderWidth: '0 0 10px 10px', 
            borderColor: 'transparent transparent var(--blueprint-color) transparent',
            opacity: 0.5
          }} />
        </motion.div>
      )}
    </motion.div>
  );
}
