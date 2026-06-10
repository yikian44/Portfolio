import React, { useState, useEffect } from 'react';
import { User, FolderOpen, Mail, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import AboutApp from './apps/AboutApp';
import ProjectsApp from './apps/ProjectsApp';
import ContactApp from './apps/ContactApp';
import GalleryApp from './apps/GalleryApp';

import Window from './components/Window';
import Dock from './components/Dock';
import Icon from './components/Icon';
import BootScreen from './components/BootScreen';
import DynamicIsland from './components/DynamicIsland';
import CustomCursor from './components/CustomCursor';
import ControlCenter from './components/ControlCenter';
import { audioManager } from './utils/audio';
import { useMediaQuery } from './utils/useMediaQuery';
import Toast from './components/Toast';
import WireframeLogo from './components/WireframeLogo';
import SocialWidget from './components/SocialWidget';

const APPS_CONFIG = [
  {
    id: 'about',
    title: 'About Me',
    icon: User,
    Component: AboutApp,
    iconColor: 'var(--icon-about-color)',
    iconGlow: 'var(--icon-about-glow)',
    indexTag: '01'
  },
  {
    id: 'projects',
    title: 'Projects',
    icon: FolderOpen,
    Component: ProjectsApp,
    iconColor: 'var(--icon-projects-color)',
    iconGlow: 'var(--icon-projects-glow)',
    indexTag: '02'
  },
  {
    id: 'gallery',
    title: 'Gallery',
    icon: ImageIcon,
    Component: GalleryApp,
    iconColor: 'var(--icon-gallery-color)',
    iconGlow: 'var(--icon-gallery-glow)',
    indexTag: '03'
  },
  {
    id: 'contact',
    title: 'Contact',
    icon: Mail,
    Component: ContactApp,
    iconColor: 'var(--icon-contact-color)',
    iconGlow: 'var(--icon-contact-glow)',
    indexTag: '04'
  },
];

function App() {
  const [isBooted, setIsBooted] = useState(false);
  const [openApps, setOpenApps] = useState([]);
  const [minimizedApps, setMinimizedApps] = useState([]);
  const [activeApp, setActiveApp] = useState(null);

  // New Global States
  const [theme, setTheme] = useState('light');
  const [volume, setVolume] = useState(0.5);
  const [toasts, setToasts] = useState([]);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // CAD Drawing State
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });

  // Gengar Easter Egg State
  const [gengarMode, setGengarMode] = useState('sleeping');
  const [gengarPos, setGengarPos] = useState({ x: 0, y: 0 });
  const [gengarDirection, setGengarDirection] = useState(-1); // -1 left, 1 right

  useEffect(() => {
    let interval;
    if (gengarMode === 'awake') {
      interval = setInterval(() => {
        setGengarPos(prev => {
          const maxLeft = -(window.innerWidth - 150);
          const maxTop = -(window.innerHeight - 200);
          const newX = Math.random() * maxLeft;
          const newY = Math.random() * maxTop;
          
          if (newX !== prev.x) {
            setGengarDirection(newX > prev.x ? 1 : -1);
          }
          return { x: newX, y: newY };
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [gengarMode]);

  // Sync theme with body class
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const addToast = (title, message, duration = 4000) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, title, message, duration }]);
  };

  const removeToast = React.useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleBootComplete = () => {
    setIsBooted(true);
    setTimeout(() => {
      addToast("Welcome to KIAN OS!", "System loaded successfully.");
      if (!openApps.includes('about')) {
        setOpenApps(prev => [...prev, 'about']);
        setActiveApp('about');
        setWindowOrder(prev => [...prev, 'about']);
      }
    }, 1500);
  };
  const [windowOrder, setWindowOrder] = useState([]); // Array to manage z-index

  const handleOpenApp = (id) => {
    if (!openApps.includes(id)) {
      setOpenApps([...openApps, id]);
      audioManager.playWindowOpen();
    }
    if (minimizedApps.includes(id)) {
      setMinimizedApps(minimizedApps.filter(appId => appId !== id));
    }
    focusApp(id);
  };

  const handleCloseApp = (id) => {
    setOpenApps(openApps.filter(appId => appId !== id));
    setMinimizedApps(minimizedApps.filter(appId => appId !== id));
    setWindowOrder(windowOrder.filter(appId => appId !== id));
    if (activeApp === id) {
      const remaining = windowOrder.filter(appId => appId !== id);
      setActiveApp(remaining.length > 0 ? remaining[remaining.length - 1] : null);
    }
  };

  const handleMinimizeApp = (id) => {
    if (!minimizedApps.includes(id)) {
      setMinimizedApps([...minimizedApps, id]);
    }
    const remaining = windowOrder.filter(appId => appId !== id);
    if (activeApp === id) {
      setActiveApp(remaining.length > 0 ? remaining[remaining.length - 1] : null);
    }
  };

  const focusApp = (id) => {
    if (minimizedApps.includes(id)) {
      setMinimizedApps(minimizedApps.filter(appId => appId !== id));
    }
    setActiveApp(id);
    setWindowOrder((prevOrder) => {
      const newOrder = prevOrder.filter(appId => appId !== id);
      return [...newOrder, id];
    });
  };

  const handleDockClick = (id) => {
    if (!openApps.includes(id)) {
      handleOpenApp(id);
    } else if (minimizedApps.includes(id)) {
      focusApp(id);
    } else if (activeApp === id) {
      handleMinimizeApp(id);
    } else {
      focusApp(id);
    }
  };

  // Handlers for CAD Measurement Tool
  const handleDesktopPointerDown = (e) => {
    if (isMobile) return;
    if (e.target.id === 'desktop') {
      setIsDrawing(true);
      setStartPos({ x: e.clientX, y: e.clientY });
      setCurrentPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleDesktopPointerMove = (e) => {
    if (isDrawing) {
      setCurrentPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleDesktopPointerUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
    }
  };

  // Handler for Gengar Easter Egg
  const handleGengarClick = (e) => {
    e.stopPropagation();
    if (gengarMode === 'sleeping') {
      setGengarMode('awake');
      addToast("SECURITY ALERT", "Ghost-type entity detected! Entity is now roaming.", 5000);
      audioManager.playError();
    } else {
      audioManager.playHover();
    }
  };

  return (
    <>
      <CustomCursor />
      <Toast toasts={toasts} removeToast={removeToast} />

      <AnimatePresence>
        {!isBooted && <BootScreen onBootComplete={handleBootComplete} />}
      </AnimatePresence>

      <motion.div
        id="desktop"
        onPointerDown={handleDesktopPointerDown}
        onPointerMove={handleDesktopPointerMove}
        onPointerUp={handleDesktopPointerUp}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: isBooted ? 1 : 0.9, opacity: isBooted ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}
      >
        {/* CAD Blueprint Layout Frame */}
        <div style={{
          position: 'absolute',
          inset: '16px',
          borderLeft: '1px solid var(--border-color)',
          borderRight: '1px solid var(--border-color)',
          borderBottom: '1px solid var(--border-color)',
          pointerEvents: 'none',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          {/* Top Border Segments (Split to allow Dynamic Island clearance) */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            display: 'flex',
            justifyContent: 'space-between',
            pointerEvents: 'none',
          }}>
            <div style={{ width: 'calc(50% - 180px)', height: '1px', background: 'var(--border-color)' }} />
            <div style={{ width: 'calc(50% - 180px)', height: '1px', background: 'var(--border-color)' }} />
          </div>

          {/* Top Border Ticks and coordinate labels */}
          {!isMobile && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              <span style={{ paddingLeft: '80px' }}>REF: KIAN_OS_2026 [0,0]</span>
              <span>SCALE CODE: 1.000 [1920,0]</span>
            </div>
          )}

          {/* Bottom Border Ticks */}
          {!isMobile && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '6px 12px', fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              <span>COORD_REF: [0, 1080]</span>
              <span>GRID_DIM: 1920 x 1080 [1920, 1080]</span>
            </div>
          )}
        </div>

        {/* CAD Corner Crop Marks */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', width: '20px', height: '20px', borderLeft: '1px solid var(--blueprint-color)', borderTop: '1px solid var(--blueprint-color)', pointerEvents: 'none', zIndex: 2 }} />
        <div style={{ position: 'absolute', top: '10px', right: '10px', width: '20px', height: '20px', borderRight: '1px solid var(--blueprint-color)', borderTop: '1px solid var(--blueprint-color)', pointerEvents: 'none', zIndex: 2 }} />
        <div style={{ position: 'absolute', bottom: '10px', left: '10px', width: '20px', height: '20px', borderLeft: '1px solid var(--blueprint-color)', borderBottom: '1px solid var(--blueprint-color)', pointerEvents: 'none', zIndex: 2 }} />
        <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '20px', height: '20px', borderRight: '1px solid var(--blueprint-color)', borderBottom: '1px solid var(--blueprint-color)', pointerEvents: 'none', zIndex: 2 }} />

        {/* CAD Axis Crosshairs */}
        {!isMobile && (
          <>
            <div style={{ position: 'absolute', top: '50%', left: '10px', width: '15px', height: '1px', background: 'var(--blueprint-color)', opacity: 0.5, pointerEvents: 'none', zIndex: 2 }} />
            <div style={{ position: 'absolute', top: '50%', right: '10px', width: '15px', height: '1px', background: 'var(--blueprint-color)', opacity: 0.5, pointerEvents: 'none', zIndex: 2 }} />
            <div style={{ position: 'absolute', left: '50%', top: '10px', width: '1px', height: '15px', background: 'var(--blueprint-color)', opacity: 0.5, pointerEvents: 'none', zIndex: 2 }} />
            <div style={{ position: 'absolute', left: '50%', bottom: '10px', width: '1px', height: '15px', background: 'var(--blueprint-color)', opacity: 0.5, pointerEvents: 'none', zIndex: 2 }} />
          </>
        )}

        {/* Gengar Decoration Easter Egg */}
        {!isMobile && (
          <motion.div 
          drag={gengarMode === 'awake'}
          dragMomentum={false}
          onDrag={(e, info) => {
            if (Math.abs(info.delta.x) > 0.5) {
              setGengarDirection(info.delta.x > 0 ? 1 : -1);
            }
          }}
          onClick={handleGengarClick}
          animate={gengarMode === 'awake' ? { 
            x: gengarPos.x,
            y: gengarPos.y,
            opacity: 0.8,
            scale: 1.5,
          } : {
            x: 0,
            y: 0,
            opacity: 0.5,
            scale: 1,
          }}
          transition={{ 
            type: "spring", 
            stiffness: 40, 
            damping: 15,
            opacity: { duration: 0.5 },
            scale: { duration: 0.5 }
          }}
          style={{ position: 'absolute', bottom: '100px', right: '40px', zIndex: 10, cursor: gengarMode === 'awake' ? 'grab' : 'pointer' }}
          whileDrag={{ cursor: 'grabbing', scale: 1.8 }}
        >
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/94.gif"
              alt="Gengar"
              style={{ width: '80px', transform: `scaleX(${gengarDirection})`, pointerEvents: 'none', transition: 'transform 0.2s' }}
            />
          </motion.div>
        )}

        {/* Center Interactive 3D Wireframe */}
        {isBooted && <WireframeLogo />}

        {/* Desktop Icons */}
        <div className="desktop-icons" style={isMobile ? {
          padding: '80px 20px 20px 20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '30px 10px',
          width: '100%',
          maxWidth: '500px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 5
        } : { 
          padding: '20px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '20px' 
        }}>
          {APPS_CONFIG.map(app => (
            <Icon
              key={app.id}
              id={app.id}
              icon={app.icon}
              title={app.title}
              iconColor={app.iconColor}
              iconGlow={app.iconGlow}
              indexTag={app.indexTag}
              onOpen={handleOpenApp}
            />
          ))}
        </div>

        {/* Windows Container */}
        <div id="windows-container" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 'calc(100% - 90px)', pointerEvents: 'none' }}>
          <AnimatePresence>
            {openApps.map((id) => {
              const app = APPS_CONFIG.find(a => a.id === id);
              const isMinimized = minimizedApps.includes(id);
              if (isMinimized) return null; // Unmount when minimized for now, or we can just hide it

              return (
                <Window
                  key={id}
                  app={app}
                  isActive={activeApp === id}
                  zIndex={windowOrder.indexOf(id) + 100}
                  onClose={handleCloseApp}
                  onMinimize={handleMinimizeApp}
                  onFocus={focusApp}
                />
              );
            })}
          </AnimatePresence>
        </div>

        <Dock
          apps={APPS_CONFIG}
          openApps={openApps}
          minimizedApps={minimizedApps}
          activeApp={activeApp}
          onAppClick={handleDockClick}
          onToggleControlCenter={() => setIsControlCenterOpen(!isControlCenterOpen)}
        />

        {/* Desktop Widgets */}
        <DynamicIsland volume={volume} />
        {isBooted && <SocialWidget onToggleControlCenter={() => setIsControlCenterOpen(!isControlCenterOpen)} />}

        <ControlCenter
          isOpen={isControlCenterOpen}
          onClose={() => setIsControlCenterOpen(false)}
          theme={theme}
          setTheme={setTheme}
          volume={volume}
          setVolume={setVolume}
        />

        {/* CAD Drawing Measurement Box */}
        {isDrawing && (
          <div style={{
            position: 'absolute',
            left: Math.min(startPos.x, currentPos.x),
            top: Math.min(startPos.y, currentPos.y),
            width: Math.abs(currentPos.x - startPos.x),
            height: Math.abs(currentPos.y - startPos.y),
            border: '1px dashed var(--blueprint-color)',
            backgroundColor: 'rgba(0, 210, 255, 0.05)',
            pointerEvents: 'none',
            zIndex: 9999,
          }}>
            <div style={{
              position: 'absolute',
              bottom: '-20px',
              right: '-5px',
              background: 'var(--blueprint-bg)',
              color: 'var(--blueprint-color)',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              padding: '2px 4px',
              border: '1px solid var(--blueprint-color)',
              whiteSpace: 'nowrap'
            }}>
              W: {Math.abs(currentPos.x - startPos.x)}px H: {Math.abs(currentPos.y - startPos.y)}px
            </div>
          </div>
        )}

      </motion.div>
    </>
  );
}

export default App;
