import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Terminal } from 'lucide-react';

export default function AboutApp() {
  const skills = [
    { name: 'UI/UX & Interaction Design' },
    { name: 'Creative Media & Visual Design' },
    { name: 'Figma' },
    { name: 'Adobe Creative Cloud' },
    { name: 'LottieFiles' },
    { name: 'React & Framer Motion' },
    { name: 'WebGL / Three.js' },
    { name: 'FlutterFlow' },
    { name: 'Godot' },
    { name: 'Firebase' },
    { name: 'Frontend Architecture' },
    { name: 'Vibe Coding' },
  ];

  const [expandedIndex, setExpandedIndex] = useState(null);

  const education = [
    { 
      year: '2024 - 2027', 
      degree: 'Bachelor in Creative Media', 
      school: 'Taylor\'s University',
      desc: 'Specializing in UI/UX'
    },
    { 
      year: '2017 - 2023', 
      degree: 'High School / Secondary Education', 
      school: 'Chung Hua Independent High School Klang',
      desc: 'Completed comprehensive secondary education.'
    }
  ];

  return (
    <div style={{ color: 'var(--text-color)', display: 'flex', flexDirection: 'column', gap: '30px', paddingRight: '10px' }}>
      
      {/* Header Profile Section */}
      <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
        <div style={{ 
          width: '90px', 
          height: '90px', 
          borderRadius: '50%', 
          border: '2px solid var(--blueprint-color)',
          overflow: 'hidden',
          padding: '4px',
          background: 'var(--block-bg)',
          flexShrink: 0
        }}>
          <img src="/logo.png" alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <div>
          <h2 style={{ fontSize: '28px', marginBottom: '8px', fontWeight: '800', fontFamily: 'var(--font-display)', letterSpacing: '1px' }}>
            GAN YI KIAN
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.6', maxWidth: '500px', fontFamily: 'var(--font-mono)' }}>
            &gt; INITIALIZING PROFILE...
            <br />
            I specialize in UI/UX design and building stunning, high-precision web applications. My focus is on integrating clean vector aesthetics, highly structured layouts, and fluid micro-animations into functional digital products.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
        {/* Skills Section */}
        <div>
          <h3 style={{ fontSize: '15px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--blueprint-color)' }}>
            <Terminal size={16} /> CREATIVE TOOLKIT
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {skills.map(skill => (
              <span key={skill.name} style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                padding: '6px 12px',
                background: 'rgba(0, 210, 255, 0.05)',
                color: 'var(--blueprint-color)',
                border: '1px solid var(--border-color)',
                borderRadius: '2px',
                boxShadow: 'inset 0 0 6px rgba(0, 210, 255, 0.05)'
              }}>
                {skill.name}
              </span>
            ))}
          </div>
        </div>

        {/* Education Section */}
        <div>
          <h3 style={{ fontSize: '15px', marginBottom: '15px', color: 'var(--blueprint-color)' }}>EDUCATION BACKGROUND</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '1px dashed var(--blueprint-color)', paddingLeft: '16px', marginLeft: '6px' }}>
            {education.map((edu, i) => (
              <div 
                key={i} 
                style={{ position: 'relative', cursor: 'pointer' }}
                onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
              >
                <div style={{ position: 'absolute', left: '-21px', top: '4px', width: '9px', height: '9px', background: expandedIndex === i ? 'var(--blueprint-color)' : 'var(--bg-color)', border: '2px solid var(--blueprint-color)', borderRadius: '50%', transition: 'background 0.3s' }} />
                <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--blueprint-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {edu.year}
                  <span>{expandedIndex === i ? '-' : '+'}</span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: '500', marginTop: '2px' }}>{edu.degree}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{edu.school}</div>
                
                <AnimatePresence>
                  {expandedIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ paddingTop: '8px', paddingBottom: '4px', fontSize: '12px', lineHeight: '1.5', color: 'var(--text-color)', fontFamily: 'var(--font-mono)' }}>
                        {edu.desc}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ marginTop: '10px', display: 'flex', gap: '15px' }}>
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); alert('Resume PDF will be downloaded here.'); }}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px',
            background: 'var(--blueprint-color)',
            color: '#000',
            textDecoration: 'none',
            fontSize: '12px',
            fontWeight: '600',
            fontFamily: 'var(--font-mono)',
            borderRadius: '2px',
            boxShadow: '0 0 10px var(--blueprint-color-glow)',
            cursor: 'pointer'
          }}
        >
          <Download size={16} /> DOWNLOAD RESUME
        </a>
      </div>

    </div>
  );
}
