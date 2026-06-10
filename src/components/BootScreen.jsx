import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BootScreen({ onBootComplete }) {
  const [phase, setPhase] = useState('orbiting'); // orbiting -> snapping -> complete
  
  useEffect(() => {
    // 1. Orbit for 2.2 seconds
    const orbitTimer = setTimeout(() => {
      setPhase('snapping');
    }, 2200);

    // 2. Snap and explode for 0.6 seconds
    const completeTimer = setTimeout(() => {
      setPhase('complete');
      
      // Play boot chime
      const audio = new Audio('/boot.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.log("Audio autoplay blocked:", e));

      // 3. Notify parent to unmount
      setTimeout(onBootComplete, 600);
    }, 2800);

    return () => {
      clearTimeout(orbitTimer);
      clearTimeout(completeTimer);
    };
  }, [onBootComplete]);

  // Geometric Fragments
  const fragments = [
    { id: 1, type: 'polygon', points: "50,0 100,25 100,75 50,100 0,75 0,25", color: "#00d2ff", size: 40, delay: 0 },
    { id: 2, type: 'rect', color: "#ff007f", size: 35, delay: 0.1 },
    { id: 3, type: 'circle', color: "#7000ff", size: 45, delay: 0.2 },
    { id: 4, type: 'polygon', points: "50,0 100,100 0,100", color: "#00ffcc", size: 30, delay: 0.15 },
    { id: 5, type: 'polygon', points: "0,0 100,0 50,100", color: "#ffea00", size: 25, delay: 0.05 },
    { id: 6, type: 'rect', color: "#ffffff", size: 20, delay: 0.25 },
  ];

  return (
    <motion.div
      key="boot-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#050505',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999,
        overflow: 'hidden',
        perspective: '1000px',
      }}
    >
      {/* Dynamic Background Glow */}
      <motion.div 
        animate={{
          scale: phase === 'orbiting' ? [1, 1.2, 1] : phase === 'snapping' ? 0.5 : 3,
          opacity: phase === 'orbiting' ? 0.3 : phase === 'snapping' ? 0.8 : 0,
        }}
        transition={{ duration: phase === 'orbiting' ? 2 : 0.5, ease: "easeInOut", repeat: phase === 'orbiting' ? Infinity : 0 }}
        style={{
          position: 'absolute',
          width: '40vw',
          height: '40vw',
          background: 'radial-gradient(circle, rgba(0, 210, 255, 0.2) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div style={{ position: 'relative', width: '300px', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Orbiting Fragments */}
        <AnimatePresence>
          {phase === 'orbiting' && fragments.map((frag, i) => {
            const angle = (i / fragments.length) * Math.PI * 2;
            const radius = 100;
            
            return (
              <motion.div
                key={frag.id}
                initial={{ 
                  x: Math.cos(angle) * radius * 3, 
                  y: Math.sin(angle) * radius * 3,
                  rotateX: 0,
                  rotateY: 0,
                  rotateZ: 0,
                  opacity: 0,
                  scale: 0
                }}
                animate={{
                  x: [Math.cos(angle) * radius * 2, Math.cos(angle + Math.PI) * radius * 1.5, Math.cos(angle + Math.PI * 2) * radius],
                  y: [Math.sin(angle) * radius * 2, Math.sin(angle + Math.PI) * radius * 1.5, Math.sin(angle + Math.PI * 2) * radius],
                  rotateX: [0, 180, 360],
                  rotateY: [0, 360, 180],
                  rotateZ: [0, 180, 360],
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  x: 0,
                  y: 0,
                  rotateX: 0,
                  rotateY: 0,
                  rotateZ: 0,
                  scale: 0.1,
                  opacity: 0,
                }}
                transition={{
                  duration: 2.2, // Match orbiting duration
                  ease: "easeInOut",
                  times: [0, 0.5, 1],
                  exit: { duration: 0.6, ease: "anticipate" } // Snapping effect
                }}
                style={{
                  position: 'absolute',
                  width: frag.size,
                  height: frag.size,
                  filter: `drop-shadow(0 0 15px ${frag.color})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg viewBox="0 0 100 100" width="100%" height="100%">
                  {frag.type === 'circle' && <circle cx="50" cy="50" r="45" fill="none" stroke={frag.color} strokeWidth="4" />}
                  {frag.type === 'rect' && <rect x="5" y="5" width="90" height="90" fill="none" stroke={frag.color} strokeWidth="4" />}
                  {frag.type === 'polygon' && <polygon points={frag.points} fill="none" stroke={frag.color} strokeWidth="4" />}
                </svg>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Final Logo Snapping & Explosion (Render unconditionally to preload) */}
        <motion.div
          initial={{ scale: 0.2, opacity: 0, rotate: -45 }}
          animate={{ 
            scale: phase === 'orbiting' ? 0.2 : (phase === 'complete' ? 1.5 : 1), 
            opacity: phase === 'orbiting' ? 0 : 1, 
            rotate: phase === 'orbiting' ? -45 : 0 
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20
          }}
        >
          <img
            src="/logo.png"
            alt="KIAN Logo"
            style={{
              width: '140px',
              height: 'auto',
              filter: 'drop-shadow(0 0 20px rgba(0, 210, 255, 0.8)) drop-shadow(0 0 40px rgba(0, 210, 255, 0.4))'
            }}
          />
        </motion.div>

        {/* Shockwave effect */}
        {phase === 'complete' && (
          <motion.div
            initial={{ scale: 0.5, opacity: 1, borderWidth: '10px' }}
            animate={{ scale: 8, opacity: 0, borderWidth: '1px' }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              position: 'absolute',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              borderStyle: 'solid',
              borderColor: '#00d2ff',
              boxShadow: '0 0 20px #00d2ff, inset 0 0 20px #00d2ff',
              zIndex: 10
            }}
          />
        )}
      </div>

      {/* Progress Bar & Tech details */}
      <motion.div
        animate={{ opacity: phase === 'complete' ? 0 : 1 }}
        style={{
          position: 'absolute',
          bottom: '10%',
          width: '300px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <div style={{ 
          width: '100%', 
          height: '2px', 
          background: 'rgba(255,255,255,0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <motion.div 
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.8, ease: "linear" }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              background: 'linear-gradient(90deg, transparent, #00d2ff, #fff)',
              boxShadow: '0 0 10px #00d2ff'
            }}
          />
        </div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'rgba(0, 210, 255, 0.8)',
            letterSpacing: '3px'
          }}
        >
          ASSEMBLING CORE COMPONENTS...
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
