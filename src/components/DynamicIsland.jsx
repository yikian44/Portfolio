import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward } from 'lucide-react';
import { useMediaQuery } from '../utils/useMediaQuery';

const PLAYLIST = [
  {
    title: 'Lo-Fi Chill Beats',
    artist: 'Lofi Records',
    src: '/bgm.mp3', // Local file
  },
  {
    title: 'Acoustic Dreams',
    artist: 'SoundHelix Song 1',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    title: 'Synthesizer Waves',
    artist: 'SoundHelix Song 2',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    title: 'Ambient Cafe Ambient',
    artist: 'SoundHelix Song 3',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  }
];

export default function DynamicIsland({ volume = 0.5 }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Audio Visualizer Refs
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const setupAudioContext = () => {
    if (!audioCtxRef.current && audioRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContext();
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 64; // Small fftSize for chunky blueprint bars
      sourceRef.current = audioCtxRef.current.createMediaElementSource(audioRef.current);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioCtxRef.current.destination);
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const drawVisualizer = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 1.5;
      let barHeight;
      let x = 0;
      
      for(let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height;
        ctx.fillStyle = 'rgba(0, 210, 255, 0.8)';
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
        x += barWidth;
      }
    };
    draw();
  };

  useEffect(() => {
    if (isPlaying && isExpanded) {
      // Small delay to ensure canvas is mounted
      setTimeout(() => drawVisualizer(), 50);
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, isExpanded]);

  const currentTrack = PLAYLIST[currentTrackIndex];

  // Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Play/Pause logic
  const togglePlay = (e) => {
    e.stopPropagation();
    setupAudioContext();
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  // Next song logic
  const handleNextSong = (e) => {
    e.stopPropagation();
    setupAudioContext();
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  // Auto load and play on track change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.log("Audio playback failed:", err);
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrackIndex]);

  return (
    <>
      <audio 
        ref={audioRef} 
        src={currentTrack.src} 
        crossOrigin="anonymous"
        onEnded={() => {
          setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
        }}
      />
      <div 
        style={{
          position: 'absolute',
          top: isMobile ? '8px' : '16px',
          left: '0',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 11000,
        }}
      >
        <motion.div
          layout
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: 'var(--window-bg)',
            backdropFilter: 'blur(16px)',
            borderRadius: isMobile ? '24px' : '0px', // Pill shape on mobile
            pointerEvents: 'auto',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 0 12px var(--blueprint-color-glow), 0 8px 32px rgba(0, 0, 0, 0.5)',
            border: '1px solid var(--blueprint-color)',
            overflow: 'hidden',
            position: 'relative',
          }}
          initial={{ width: isMobile ? 100 : 130, height: 32 }}
          animate={{
            width: isExpanded ? (isMobile ? 'calc(100vw - 40px)' : 340) : (isMobile ? 100 : 130),
            height: isExpanded ? 64 : 32,
            padding: isExpanded ? '0 16px' : '0 10px',
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          {/* Inner Dashed Blueprint Guidelines */}
          {!isMobile && (
            <div style={{
              position: 'absolute',
              inset: '2px',
              border: '1px dashed var(--blueprint-grid-primary)',
              pointerEvents: 'none',
            }} />
          )}

          {/* Left Side: Rotating vector compass/drafting gear spinner */}
          <motion.div layout style={{ display: 'flex', alignItems: 'center', gap: '10px', zIndex: 1 }}>
            <motion.div
              animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
              transition={isPlaying ? { repeat: Infinity, duration: 8, ease: "linear" } : { duration: 0.5 }}
              style={{
                width: isExpanded ? '32px' : '20px',
                height: isExpanded ? '32px' : '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                flexShrink: 0
              }}
            >
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                {/* Outer drafting ring */}
                <circle cx="50" cy="50" r="46" fill="none" stroke="var(--blueprint-color)" strokeWidth="2" />
                {/* Inner dashed ring */}
                <circle cx="50" cy="50" r="32" fill="none" stroke="var(--blueprint-color)" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
                {/* Center dot */}
                <circle cx="50" cy="50" r="4" fill="var(--blueprint-color)" />
                {/* Compass Axes */}
                <line x1="50" y1="4" x2="50" y2="96" stroke="var(--blueprint-color)" strokeWidth="1" opacity="0.5" />
                <line x1="4" y1="50" x2="96" y2="50" stroke="var(--blueprint-color)" strokeWidth="1" opacity="0.5" />
                {/* Angle tick helper lines */}
                <line x1="18" y1="18" x2="82" y2="82" stroke="var(--blueprint-color)" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.4" />
                <line x1="18" y1="82" x2="82" y2="18" stroke="var(--blueprint-color)" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.4" />
              </svg>
            </motion.div>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: 'hidden', whiteSpace: 'nowrap', color: 'var(--text-color)', maxWidth: '170px', fontFamily: 'var(--font-mono)' }}
                >
                  <h4 style={{ margin: 0, fontSize: '11px', fontWeight: '700', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', color: 'var(--blueprint-color)' }}>
                    {currentTrack.title.toUpperCase()}
                  </h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: '9px', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {currentTrack.artist}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right Side: Equalizer / Controls */}
          <motion.div layout style={{ display: 'flex', alignItems: 'center', zIndex: 1 }}>
            <AnimatePresence mode="wait">
              {!isExpanded ? (
                <motion.div
                  key="waveform"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ display: 'flex', gap: '3px', alignItems: 'center', height: '12px', fontFamily: 'var(--font-mono)' }}
                >
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      animate={isPlaying ? { height: ['4px', '14px', '4px'] } : { height: '4px' }}
                      transition={isPlaying ? { repeat: Infinity, duration: 0.8, delay: i * 0.15 } : { duration: 0.2 }}
                      style={{ width: '2px', background: 'var(--blueprint-color)', boxShadow: '0 0 4px var(--blueprint-color-glow)' }}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="controls"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <canvas ref={canvasRef} width="60" height="20" style={{ marginRight: '10px' }} />
                  {/* Play/Pause Button */}
                  <button 
                    onClick={togglePlay}
                    style={{
                      background: 'rgba(0, 210, 255, 0.06)',
                      border: '1px solid var(--blueprint-color)',
                      borderRadius: '4px',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'var(--blueprint-color)',
                      outline: 'none',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0, 210, 255, 0.15)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0, 210, 255, 0.06)'; }}
                  >
                    {isPlaying ? <Pause size={12} color="var(--blueprint-color)" /> : <Play size={12} color="var(--blueprint-color)" style={{ marginLeft: '1.5px' }}/>}
                  </button>

                  {/* Next Song Button */}
                  <button 
                    onClick={handleNextSong}
                    style={{
                      background: 'rgba(0, 210, 255, 0.06)',
                      border: '1px solid var(--blueprint-color)',
                      borderRadius: '4px',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'var(--blueprint-color)',
                      outline: 'none',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0, 210, 255, 0.15)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0, 210, 255, 0.06)'; }}
                  >
                    <SkipForward size={12} color="var(--blueprint-color)" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </motion.div>
      </div>
    </>
  );
}
