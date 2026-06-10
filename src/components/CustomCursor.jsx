import React, { useEffect, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { useMediaQuery } from '../utils/useMediaQuery';

export default function CustomCursor() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target;
      const isClickable = target.closest(
        'button, a, input, select, textarea, [style*="cursor: pointer"], [style*="cursor:pointer"], .icon'
      );
      
      if (isClickable) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY, isVisible]);

  if (isMobile || !isVisible) return null;

  return (
    <motion.div
      className="custom-cursor"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        x: cursorX,
        y: cursorY,
        width: 40,
        height: 40,
        pointerEvents: 'none',
        zIndex: 9999999,
        translateX: '-50%',
        translateY: '-50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Optional mix-blend-mode for ultra sleek look
        mixBlendMode: 'difference',
        color: 'white'
      }}
      animate={{
        rotate: isHovering ? 90 : 0,
        scale: isClicking ? 0.8 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Center Dot / Square */}
      <motion.div
        style={{
          width: '4px',
          height: '4px',
          background: 'white',
          borderRadius: isHovering ? '0px' : '50%',
        }}
        animate={{
          scale: isHovering ? 2 : 1,
          background: isHovering ? 'transparent' : 'white',
          border: isHovering ? '1px solid white' : 'none'
        }}
      />

      {/* Top Line */}
      <motion.div style={{ position: 'absolute', top: 0, width: '2px', background: 'white' }} 
        animate={{ height: isHovering ? '10px' : '6px', y: isHovering ? -4 : 0, opacity: isHovering ? 1 : 0.5 }} />
      {/* Bottom Line */}
      <motion.div style={{ position: 'absolute', bottom: 0, width: '2px', background: 'white' }} 
        animate={{ height: isHovering ? '10px' : '6px', y: isHovering ? 4 : 0, opacity: isHovering ? 1 : 0.5 }} />
      {/* Left Line */}
      <motion.div style={{ position: 'absolute', left: 0, height: '2px', background: 'white' }} 
        animate={{ width: isHovering ? '10px' : '6px', x: isHovering ? -4 : 0, opacity: isHovering ? 1 : 0.5 }} />
      {/* Right Line */}
      <motion.div style={{ position: 'absolute', right: 0, height: '2px', background: 'white' }} 
        animate={{ width: isHovering ? '10px' : '6px', x: isHovering ? 4 : 0, opacity: isHovering ? 1 : 0.5 }} />

      {/* Hover Brackets (only visible when hovering) */}
      <motion.div
        style={{ position: 'absolute', top: 4, left: 4, width: '8px', height: '8px', borderTop: '2px solid white', borderLeft: '2px solid white' }}
        animate={{ opacity: isHovering ? 1 : 0, scale: isHovering ? 1 : 0.5 }}
      />
      <motion.div
        style={{ position: 'absolute', top: 4, right: 4, width: '8px', height: '8px', borderTop: '2px solid white', borderRight: '2px solid white' }}
        animate={{ opacity: isHovering ? 1 : 0, scale: isHovering ? 1 : 0.5 }}
      />
      <motion.div
        style={{ position: 'absolute', bottom: 4, left: 4, width: '8px', height: '8px', borderBottom: '2px solid white', borderLeft: '2px solid white' }}
        animate={{ opacity: isHovering ? 1 : 0, scale: isHovering ? 1 : 0.5 }}
      />
      <motion.div
        style={{ position: 'absolute', bottom: 4, right: 4, width: '8px', height: '8px', borderBottom: '2px solid white', borderRight: '2px solid white' }}
        animate={{ opacity: isHovering ? 1 : 0, scale: isHovering ? 1 : 0.5 }}
      />

    </motion.div>
  );
}
