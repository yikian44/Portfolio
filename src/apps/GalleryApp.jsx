import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_IMAGES = [
  {
    src: '/kian-blueprint-logo.jpg.jpg',
    title: 'KIAN Blueprint Logo',
    desc: 'A geometric, blueprint-inspired typographic logo design for KIAN.'
  },
  {
    src: '/poster.jpg',
    title: 'Future Technology Poster',
    desc: 'A futuristic event poster design featuring 3D chrome liquid textures and modern typography.'
  },
  {
    src: '/vinyl.jpg',
    title: 'Talk Me to the Moon Vinyl',
    desc: 'Album cover and vinyl record packaging design utilizing stark contrast and bold geometry.'
  },
  {
    src: '/phone-case.jpg',
    title: 'Code Your Life Case',
    desc: 'Smartphone case design with HTML/React syntax, merging developer lifestyle with everyday accessories.'
  },
  {
    src: '/tshirt.jpg',
    title: 'KIAN Apparel',
    desc: 'Personalized branding applied to apparel, featuring the KIAN logo and minimalist dynamic lines.'
  },
  {
    src: '/cd-case.jpg',
    title: 'Code Warrior Disc',
    desc: 'Software/Game physical case mockup design featuring matrix-style typography and colorful code snippets.'
  },
  {
    src: '/typo-1.jpg',
    title: 'GenCircuit Typeface',
    desc: 'Custom pixel-inspired typography design featuring geometric letterforms.'
  },
  {
    src: '/typo-2.jpg',
    title: 'Typography Quote',
    desc: 'Typographic poster featuring the quote "The devil is in the details" by Jane Jacobs.'
  },
  {
    src: '/typo-3.jpg',
    title: 'GenCircuit Character Set',
    desc: 'Comprehensive character set showcasing uppercase, lowercase, numbers, and punctuation.'
  },
  {
    src: '/typo-4.jpg',
    title: 'Code Typography',
    desc: 'Stylized HTML markup and developer contact details rendered in custom typography.'
  },
  {
    src: '/typo-5.jpg',
    title: 'GenCircuit Punctuation',
    desc: 'A classic pangram showcasing the font\'s readability and unique punctuation styling.'
  }
];

export default function GalleryApp() {
  const [selectedImg, setSelectedImg] = useState(null);

  return (
    <div style={{ height: '100%', position: 'relative', fontFamily: 'var(--font-mono)', overflow: 'hidden' }}>
      <div style={{ height: '100%', overflowY: 'auto', paddingRight: '10px', paddingBottom: '20px' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '20px', fontWeight: '600' }}>
          Visual Works Gallery
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '13px', lineHeight: '1.6' }}>
          A structured catalog of design drawings, photographic documentation, and architectural concepts. Click any image to view details.
        </p>
      
      {/* CSS Grid for Gallery */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '16px'
      }}>
        {MOCK_IMAGES.map((item, index) => (
          <GalleryItem key={index} item={item} onClick={() => setSelectedImg(item)} />
        ))}
      </div>
      </div>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
            style={{
              position: 'absolute', 
              top: 0, left: 0, right: 0, bottom: 0, // cover the app window completely
              background: 'rgba(3, 10, 22, 0.95)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
              cursor: 'zoom-out',
              padding: '40px'
            }}
          >
            <div 
              style={{ 
                position: 'absolute', 
                top: '20px', 
                right: '20px', 
                cursor: 'pointer', 
                background: 'rgba(0, 210, 255, 0.08)', 
                border: '1px solid var(--blueprint-color)',
                padding: '6px 10px', 
                fontSize: '11px',
                color: 'var(--blueprint-color)'
              }}
            >
              [ CLOSE ]
            </div>
            
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImg.src} 
              style={{ 
                maxWidth: '90%', 
                maxHeight: '70%', 
                borderRadius: '0px', 
                border: '1px solid var(--blueprint-color)',
                boxShadow: '0 0 30px rgba(0, 210, 255, 0.15)' 
              }} 
              onClick={(e) => e.stopPropagation()}
            />
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                marginTop: '24px',
                maxWidth: '600px',
                textAlign: 'center',
                color: 'var(--text-color)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ fontSize: '18px', marginBottom: '8px', fontFamily: 'var(--font-display)', color: '#ffffff' }}>
                {selectedImg.title.toUpperCase()}
              </h3>
              <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)', lineHeight: '1.6' }}>
                {selectedImg.desc}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GalleryItem({ item, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        aspectRatio: '1',
        borderRadius: '0px', 
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid var(--block-border)',
        background: 'var(--block-bg)',
        padding: '4px',
        transition: 'border-color 0.2s',
        position: 'relative',
        borderColor: isHovered ? 'var(--blueprint-color)' : 'var(--block-border)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img 
        src={item.src} 
        alt={item.title} 
        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: isHovered ? 'grayscale(0%)' : 'grayscale(40%)', transition: 'filter 0.3s' }}
        loading="lazy"
      />
      
      {/* Title Overlay on Hover */}
      <div style={{
        position: 'absolute',
        bottom: '4px',
        left: '4px',
        right: '4px',
        padding: '8px',
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(4px)',
        transform: isHovered ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.3s ease',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--blueprint-color)', fontFamily: 'var(--font-mono)' }}>{item.title}</span>
      </div>
    </motion.div>
  );
}
