import React, { useState } from 'react';
import { Mail, Settings, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioManager } from '../utils/audio';

const GithubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const CadCorners = () => (
  <>
    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '4px', borderLeft: '1.5px solid var(--blueprint-color)', borderTop: '1.5px solid var(--blueprint-color)', opacity: 0.8 }} />
    <div style={{ position: 'absolute', top: 0, right: 0, width: '4px', height: '4px', borderRight: '1.5px solid var(--blueprint-color)', borderTop: '1.5px solid var(--blueprint-color)', opacity: 0.8 }} />
    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '4px', height: '4px', borderLeft: '1.5px solid var(--blueprint-color)', borderBottom: '1.5px solid var(--blueprint-color)', opacity: 0.8 }} />
    <div style={{ position: 'absolute', bottom: 0, right: 0, width: '4px', height: '4px', borderRight: '1.5px solid var(--blueprint-color)', borderBottom: '1.5px solid var(--blueprint-color)', opacity: 0.8 }} />
  </>
);

export default function SocialWidget({ onToggleControlCenter }) {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: 'Settings', icon: Settings, action: onToggleControlCenter },
    { name: 'GitHub', icon: GithubIcon, url: 'https://github.com' },
    { name: 'LinkedIn', icon: LinkedinIcon, url: 'https://linkedin.com' },
    { name: 'Email', icon: Mail, url: 'mailto:hello@example.com' },
  ];

  return (
    <div style={{
      position: 'absolute',
      right: '20px',
      bottom: '20px',
      display: 'flex',
      flexDirection: 'column-reverse',
      alignItems: 'center',
      gap: '15px',
      zIndex: 10000,
      pointerEvents: 'auto',
    }}>
      {/* Main Toggle Button */}
      <motion.button
        onClick={() => { audioManager.playClick(); setIsOpen(!isOpen); }}
        style={{
          position: 'relative',
          width: '50px',
          height: '50px',
          background: 'rgba(0, 210, 255, 0.05)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--blueprint-color)',
          cursor: 'pointer',
          outline: 'none',
        }}
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(0, 210, 255, 0.15)' }}
        whileTap={{ scale: 0.9 }}
      >
        <CadCorners />
        <motion.div 
          animate={{ rotate: isOpen ? 180 : 0 }} 
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.div>
      </motion.button>

      {/* Expandable Items */}
      <AnimatePresence>
        {isOpen && links.map((link, i) => {
          const isAction = !!link.action;
          const Wrapper = isAction ? motion.button : motion.a;
          const props = isAction ? { 
            onClick: () => { audioManager.playClick(); link.action(); setIsOpen(false); } 
          } : { 
            href: link.url, target: "_blank", rel: "noreferrer",
            onClick: () => audioManager.playClick()
          };

          return (
            <Wrapper
              key={link.name}
              {...props}
              title={link.name}
              initial={{ opacity: 0, y: 20, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.5 }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 400, damping: 25 }}
              style={{
                position: 'relative',
                width: '45px',
                height: '45px',
                background: 'rgba(0, 210, 255, 0.05)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--blueprint-color)',
                cursor: 'pointer',
                textDecoration: 'none',
                outline: 'none',
              }}
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(0, 210, 255, 0.15)' }}
              whileTap={{ scale: 0.9 }}
            >
              <CadCorners />
              <link.icon size={20} />
            </Wrapper>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
