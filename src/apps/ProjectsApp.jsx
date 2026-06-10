import React, { useState } from 'react';
import { ExternalLink, Code } from 'lucide-react';
import lobsterImg from '../assets/lobster.jpg';
import lingsCarsImg from '../assets/lingscars.jpg.png';
import sedapImg from '../assets/sedap.jpg.jpeg';

export default function ProjectsApp() {
  const projects = [
    {
      title: 'Jalan Square',
      desc: 'Jalan Square is a collaborative travel-planning app for Malaysian users that combines destination discovery, group voting, itinerary management, budgeting, and communication into one unified experience.',
      img: '/jalan-square.png.png',
      tags: ['Figma'],
      live: 'https://www.figma.com/proto/UvyZ4mWLooxRDjwbhJFRAj/Jalan-Square?node-id=451-610&t=c2dQCzUzX64cykse-1',
      github: '#'
    },
    {
      title: 'Imperfect Vessel',
      desc: 'Imperfect Vessel is an interactive web experience that explores perfectionism, self-doubt, and self-acceptance through the philosophies of Wabi-Sabi and Kintsugi. Users create abstract portraits by arranging fragmented shapes, textures, and colors, embracing imperfection as part of the creative process. Inspired by Pablo Picasso’s cubist portraits, the project encourages users to let go of control and appreciate beauty in flaws through a calm, reflective digital experience.',
      img: '/imperfect-vessel.jpg',
      tags: ['Vibe Coding', 'JavaScript', 'HTML', 'CSS'],
      live: 'https://yikian44.github.io/Imperfect-vessel-1/',
      github: '#'
    },
    {
      title: 'dailysedap',
      desc: 'Daily Sedap is an intercultural design project that explores Malaysia\'s everyday food culture through short-form TikTok videos. By documenting local mamaks, kopitiams, hawker centres, and warungs, the project highlights the often-overlooked experiences, interactions, and traditions that shape Malaysia\'s cultural identity beyond the food itself.',
      img: sedapImg,
      tags: ['CapCut'],
      live: 'https://www.tiktok.com/@dailysedap?refer=creator_embed',
      github: '#'
    },
    { 
      title: 'LING\'sCARS Redesign', 
      desc: 'LingsCars.com is a British car rental website known for its colorful, chaotic, and unconventional design, making it a notable example of UX and usability challenges.',
      img: lingsCarsImg,
      tags: ['HTML', 'CSS', 'Adobe Dreamweaver'],
      live: 'https://ganyikian-finalproject.netlify.app/',
      github: '#'
    },
    { 
      title: 'Lobster', 
      desc: 'A virtual atlas where users can explore lobsters by region and species.',
      img: lobsterImg,
      tags: ['Adobe Animate'],
      live: 'https://lobsteryikian.netlify.app/',
      github: '#'
    },
  ];

  return (
    <div style={{ color: 'var(--text-color)', height: '100%', overflowY: 'auto', paddingRight: '10px' }}>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px',
      }}>
        {projects.map((p, idx) => (
          <ProjectCard key={idx} project={p} />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '0px', 
        border: '1px solid var(--block-border)',
        background: 'var(--block-bg)',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        borderColor: isHovered ? 'var(--blueprint-color)' : 'var(--block-border)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 10px 20px rgba(0,0,0,0.4)' : 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div style={{ position: 'relative', width: '100%', height: '160px', overflow: 'hidden', borderBottom: '1px solid var(--block-border)' }}>
        <img 
          src={project.img} 
          alt={project.title} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            transition: 'transform 0.5s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            filter: isHovered ? 'grayscale(0%)' : 'grayscale(50%)' 
          }} 
        />
        
        {/* Overlay Actions on Hover */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '15px',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}>
          <a href={project.live} target="_blank" rel="noreferrer" style={actionBtnStyle}>
            <ExternalLink size={14} /> LIVE
          </a>
        </div>
      </div>

      {/* Content Container */}
      <div style={{ padding: '16px' }}>
        <h3 style={{ marginBottom: '8px', fontSize: '15px', fontFamily: 'var(--font-display)', fontWeight: 'bold', color: 'var(--blueprint-color)' }}>
          {project.title.toUpperCase()}
        </h3>
        <p style={{ 
          fontSize: '13px', 
          color: 'var(--text-color)', 
          lineHeight: '1.6', 
          fontFamily: 'var(--font-family)', 
          marginBottom: '16px', 
          minHeight: '36px',
          opacity: 0.9
        }}>
          {project.desc}
        </p>
        
        {/* Tags */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {project.tags.map(tag => (
            <span key={tag} style={{
              fontSize: '9px',
              fontFamily: 'var(--font-mono)',
              padding: '3px 6px',
              background: 'rgba(0, 210, 255, 0.1)',
              color: 'var(--blueprint-color)',
              border: '1px solid var(--blueprint-color)',
              borderRadius: '2px'
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const actionBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 12px',
  background: 'var(--blueprint-color)',
  color: '#000',
  textDecoration: 'none',
  fontSize: '11px',
  fontFamily: 'var(--font-mono)',
  fontWeight: 'bold',
  borderRadius: '2px',
  boxShadow: '0 0 8px var(--blueprint-color-glow)'
};
