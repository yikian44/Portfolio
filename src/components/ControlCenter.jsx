import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Volume2, VolumeX } from 'lucide-react';

export default function ControlCenter({ isOpen, onClose, theme, setTheme, volume, setVolume }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Invisible backdrop to close when clicking outside */}
          <div 
            style={{ position: 'fixed', inset: 0, zIndex: 10001 }} 
            onClick={onClose} 
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            style={{
              position: 'absolute',
              bottom: '90px', // Above the dock
              right: '24px',
              width: '300px',
              background: 'var(--window-bg)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid var(--border-color)',
              borderRadius: '0px', // Sharp CAD corner
              padding: '18px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              zIndex: 10002,
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {/* Outer Border Dashed Line Offset */}
            <div style={{
              position: 'absolute',
              inset: '2px',
              border: '1px dashed var(--blueprint-grid-primary)',
              pointerEvents: 'none',
            }} />

            {/* Panel Title */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-muted)', borderBottom: '1px dashed var(--border-color)', paddingBottom: '6px' }}>
              <span>SYSTEM_SETTINGS</span>
              <span>DWG: SET_04</span>
            </div>

            {/* Theme Toggle */}
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>VISUAL_MODE</span>
              <div style={{ display: 'flex', border: '1px solid var(--border-color)', padding: '2px', background: 'rgba(0,0,0,0.1)' }}>
                <button
                  onClick={() => setTheme('light')}
                  style={{
                    flex: 1,
                    background: theme === 'light' ? 'var(--blueprint-color)' : 'transparent',
                    color: theme === 'light' ? 'var(--blueprint-bg)' : 'var(--text-color)',
                    border: 'none',
                    borderRadius: '0px', // Sharp edges
                    padding: '6px 10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 'bold',
                    transition: 'all 0.2s',
                  }}
                >
                  <Sun size={12} /> LIGHT_INK
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  style={{
                    flex: 1,
                    background: theme === 'dark' ? 'var(--blueprint-color)' : 'transparent',
                    color: theme === 'dark' ? 'var(--blueprint-bg)' : 'var(--text-color)',
                    border: 'none',
                    borderRadius: '0px',
                    padding: '6px 10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 'bold',
                    transition: 'all 0.2s',
                  }}
                >
                  <Moon size={12} /> DARK_BLUE
                </button>
              </div>
            </div>

            {/* Volume Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '11px' }}>
                <span style={{ color: 'var(--text-muted)' }}>AUDIO_OUTPUT</span>
                <span style={{ color: 'var(--blueprint-color)', fontWeight: 'bold' }}>{Math.round(volume * 100)}%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {volume === 0 ? <VolumeX size={16} color="var(--blueprint-color)" /> : <Volume2 size={16} color="var(--blueprint-color)" />}
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  style={{ 
                    flex: 1, 
                    cursor: 'pointer',
                    accentColor: 'var(--blueprint-color)',
                    background: 'var(--border-color)',
                    height: '4px',
                    borderRadius: '0px',
                    outline: 'none',
                  }} 
                />
              </div>
            </div>
            
            {/* Decorative Dimensions Grid Footer */}
            <div style={{ fontSize: '8px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', paddingTop: '4px', borderTop: '1px dashed var(--border-color)' }}>
              <span>W: 300.00mm</span>
              <span>H: 156.00mm</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
