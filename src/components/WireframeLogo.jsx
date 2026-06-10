import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useMediaQuery } from '../utils/useMediaQuery';

export default function WireframeLogo() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const containerRef = useRef(null);
  
  // Mouse position tracking
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, isMobile]);

  // Map mouse position to rotation with a spring for smooth physics
  const springConfig = { damping: 20, stiffness: 100 };
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [45, -45]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-45, 45]), springConfig);

  return (
    <motion.div
      ref={containerRef}
      style={{
        width: '350px',
        height: '350px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        x: '-50%',
        y: '-50%',
        perspective: '1200px',
        zIndex: 0, // Behind windows
        pointerEvents: 'none', // Don't block clicks
      }}
    >
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          rotateX,
          rotateY,
        }}
      >
        {/* Core sphere/gyro rings (Static 3D shape) */}
        <Ring rotateX={70} rotateY={20} rotateZ={10} isMobile={isMobile} />
        {!isMobile && (
          <>
            <Ring rotateX={20} rotateY={70} rotateZ={30} />
            <Ring rotateX={45} rotateY={45} rotateZ={0} size={0.8} />
            <Ring rotateX={0} rotateY={90} rotateZ={45} size={0.6} />
          </>
        )}
        <Ring rotateX={90} rotateY={0} rotateZ={90} size={0.4} isMobile={isMobile} />
        
        {/* Tech crosshairs in center */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '30px', height: '1px',
          background: 'var(--blueprint-color)',
          opacity: 0.8,
          boxShadow: '0 0 8px var(--blueprint-color-glow)'
        }} />
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '1px', height: '30px',
          background: 'var(--blueprint-color)',
          opacity: 0.8,
          boxShadow: '0 0 8px var(--blueprint-color-glow)'
        }} />
        
        {/* Text overlay */}
        <div style={{
          position: 'absolute',
          bottom: '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--blueprint-color)',
          letterSpacing: '6px',
          whiteSpace: 'nowrap',
          opacity: 0.5,
          textShadow: '0 0 8px var(--blueprint-color-glow)'
        }}>
          KIAN_OS // CORE_ACTIVE
        </div>
      </motion.div>
    </motion.div>
  );
}

function Ring({ rotateX = 0, rotateY = 0, rotateZ = 0, size = 1, isMobile = false }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        top: `${50 - (size * 50)}%`,
        left: `${50 - (size * 50)}%`,
        width: `${size * 100}%`,
        height: `${size * 100}%`,
        borderRadius: '50%',
        border: '1px solid var(--blueprint-color)',
        opacity: 0.25,
        transformStyle: 'preserve-3d',
        rotateX,
        rotateY,
        rotateZ,
        boxShadow: isMobile ? 'none' : 'inset 0 0 15px rgba(0, 210, 255, 0.1), 0 0 15px rgba(0, 210, 255, 0.1)',
      }}
    >
      {/* Decorative nodes on the ring */}
      {!isMobile && (
        <>
          <div style={{ position: 'absolute', top: '-3px', left: '50%', width: '6px', height: '6px', background: 'var(--blueprint-color)', borderRadius: '50%', transform: 'translateX(-50%)', boxShadow: '0 0 5px var(--blueprint-color-glow)' }} />
          <div style={{ position: 'absolute', bottom: '-3px', left: '50%', width: '6px', height: '6px', background: 'var(--blueprint-color)', borderRadius: '50%', transform: 'translateX(-50%)', boxShadow: '0 0 5px var(--blueprint-color-glow)' }} />
        </>
      )}
    </motion.div>
  );
}
