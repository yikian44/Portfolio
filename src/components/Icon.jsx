import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { audioManager } from '../utils/audio';
import { useMediaQuery } from '../utils/useMediaQuery';

export default function Icon({ id, icon: IconComponent, title, iconColor, iconGlow, indexTag, onOpen }) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useTransform(x, [-0.5, 0.5], [15, -15]);
  const mouseYSpring = useTransform(y, [-0.5, 0.5], [-15, 15]);

  const handleMouseMove = (e) => {
    if (isMobile) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div 
      ref={ref}
      className="icon"
      onClick={() => { audioManager.playClick(); onOpen(id); }}
      onTouchEnd={() => { audioManager.playClick(); onOpen(id); }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => { if (!isMobile) { audioManager.playHover(); setIsHovered(true); } }}
      onMouseLeave={handleMouseLeave}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '80px',
        cursor: 'pointer',
        perspective: isMobile ? 'none' : 1000,
        rotateX: isMobile ? 0 : mouseYSpring,
        rotateY: isMobile ? 0 : mouseXSpring,
        transformStyle: isMobile ? 'flat' : "preserve-3d",
        position: 'relative',
      }}
      whileHover={isMobile ? {} : { scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {/* CAD Dynamic Projection Lines (Dashed axis lines extending outwards) */}
      {isHovered && (
        <>
          {/* Left guideline */}
          <div style={{
            position: 'absolute',
            right: '40px',
            top: '28px',
            width: '40vw',
            height: '1px',
            borderTop: '1px dashed var(--blueprint-color)',
            opacity: 0.4,
            pointerEvents: 'none',
            zIndex: -1,
          }} />
          {/* Right guideline */}
          <div style={{
            position: 'absolute',
            left: '40px',
            top: '28px',
            width: '40vw',
            height: '1px',
            borderTop: '1px dashed var(--blueprint-color)',
            opacity: 0.4,
            pointerEvents: 'none',
            zIndex: -1,
          }} />
          {/* Top guideline */}
          <div style={{
            position: 'absolute',
            left: '40px',
            bottom: '28px',
            width: '1px',
            height: '40vh',
            borderLeft: '1px dashed var(--blueprint-color)',
            opacity: 0.4,
            pointerEvents: 'none',
            zIndex: -1,
          }} />
          {/* Bottom guideline */}
          <div style={{
            position: 'absolute',
            left: '40px',
            top: '28px',
            width: '1px',
            height: '40vh',
            borderLeft: '1px dashed var(--blueprint-color)',
            opacity: 0.4,
            pointerEvents: 'none',
            zIndex: -1,
          }} />
        </>
      )}

      {/* CAD Bounding Box Container */}
      <div 
        className="app-icon-container"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '0px', // Sharp CAD grid block
          backgroundColor: 'var(--icon-bg)',
          backgroundImage: 'linear-gradient(var(--blueprint-grid-secondary) 1px, transparent 1px), linear-gradient(90deg, var(--blueprint-grid-secondary) 1px, transparent 1px)',
          backgroundSize: '8px 8px',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '8px',
          boxShadow: isHovered 
            ? `0 0 12px var(--blueprint-color-glow), inset 0 0 8px var(--blueprint-color-glow)`
            : `inset 0 0 6px rgba(0, 210, 255, 0.05)`,
          position: 'relative',
          transform: 'translateZ(20px)',
          border: isHovered ? '1px solid var(--blueprint-color)' : '1px solid var(--border-color)',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
      >
        {/* Soft internal gradient glow matching the icon's color */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, var(--blueprint-color-glow) 0%, rgba(255,255,255,0) 80%)`,
          opacity: isHovered ? 0.4 : 0.15,
          pointerEvents: 'none',
          transition: 'opacity 0.2s',
        }} />
        
        {/* Index Tag / Corner Number */}
        <span style={{
          position: 'absolute',
          top: '3px',
          right: '5px',
          fontSize: '8px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--blueprint-color)',
          opacity: 0.8,
          fontWeight: '700',
          letterSpacing: '0.5px'
        }}>{indexTag}</span>

        {/* Technical Corner Brackets */}
        <div style={{ position: 'absolute', top: '2px', left: '2px', width: '4px', height: '4px', borderLeft: '1px solid var(--blueprint-color)', borderTop: '1px solid var(--blueprint-color)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '2px', left: '2px', width: '4px', height: '4px', borderLeft: '1px solid var(--blueprint-color)', borderBottom: '1px solid var(--blueprint-color)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '2px', right: '2px', width: '4px', height: '4px', borderRight: '1px solid var(--blueprint-color)', borderTop: '1px solid var(--blueprint-color)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '2px', right: '2px', width: '4px', height: '4px', borderRight: '1px solid var(--blueprint-color)', borderBottom: '1px solid var(--blueprint-color)', pointerEvents: 'none' }} />

        {/* Hover Dimensioning Lines */}
        {isHovered && (
          <>
            {/* Top dimension bar (width) */}
            <div style={{
              position: 'absolute',
              top: '-12px',
              left: '0',
              right: '0',
              height: '1px',
              background: 'var(--blueprint-color)',
              opacity: 0.8,
            }}>
              {/* Left tick */}
              <div style={{ position: 'absolute', left: 0, top: '-2px', width: '1px', height: '5px', background: 'var(--blueprint-color)' }} />
              {/* Right tick */}
              <div style={{ position: 'absolute', right: 0, top: '-2px', width: '1px', height: '5px', background: 'var(--blueprint-color)' }} />
              {/* Dimension label */}
              <div style={{
                position: 'absolute',
                top: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '7px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--blueprint-color)',
                background: 'var(--blueprint-bg)',
                padding: '0 2px',
              }}>
                56.00mm
              </div>
            </div>

            {/* Left dimension bar (height) */}
            <div style={{
              position: 'absolute',
              left: '-12px',
              top: '0',
              bottom: '0',
              width: '1px',
              background: 'var(--blueprint-color)',
              opacity: 0.8,
            }}>
              {/* Top tick */}
              <div style={{ position: 'absolute', top: 0, left: '-2px', height: '1px', width: '5px', background: 'var(--blueprint-color)' }} />
              {/* Bottom tick */}
              <div style={{ position: 'absolute', bottom: 0, left: '-2px', height: '1px', width: '5px', background: 'var(--blueprint-color)' }} />
              {/* Dimension label */}
              <div style={{
                position: 'absolute',
                left: '-10px',
                top: '50%',
                transform: 'translateY(-50%) rotate(-90deg)',
                transformOrigin: 'center',
                fontSize: '7px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--blueprint-color)',
                background: 'var(--blueprint-bg)',
                padding: '0 2px',
                whiteSpace: 'nowrap',
              }}>
                56.00mm
              </div>
            </div>
          </>
        )}
        
        {/* Icon Component */}
        <IconComponent size={22} color={iconColor} style={{ 
          filter: `drop-shadow(0 0 4px ${iconGlow})`,
        }} />
      </div>

      {/* Outlined label with technical brackets */}
      <span style={{
        fontSize: '11px',
        fontWeight: '500',
        fontFamily: 'var(--font-mono)',
        textAlign: 'center',
        transform: 'translateZ(10px)',
        color: 'var(--text-color)',
        textShadow: 'var(--icon-text-shadow)',
        padding: '2px 8px',
        whiteSpace: 'nowrap',
        border: isHovered ? '1px solid var(--blueprint-color)' : '1px solid transparent',
        background: isHovered ? 'var(--icon-bg)' : 'transparent',
        transition: 'all 0.2s',
      }}>
        {isHovered ? `[ ${title.toUpperCase()} ]` : title}
      </span>
    </motion.div>
  );
}
