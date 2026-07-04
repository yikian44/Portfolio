import { useState, useEffect, useRef, useCallback, MouseEvent, createContext, useContext, MutableRefObject } from "react";
import { Linkedin, Dribbble, BookMarked, Mail, ArrowRight, ArrowUpRight, ArrowUp, ChevronDown, Globe, Clock, Layers } from "lucide-react";
import { motion } from "motion/react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { RouterProvider, createHashRouter, Outlet, useOutletContext, useNavigate, useLocation } from "react-router";
import logoImg from "@/imports/new-logo.png";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import ProjectDetail from "./pages/ProjectDetail";
import { PROJECTS as PROJECTS_DATA } from "./data/projects";

gsap.registerPlugin(ScrollTrigger);

/* ─── Data (re-exported from data/projects.ts) ──────────────── */
const PROJECTS = PROJECTS_DATA;

/* ─── Transition context ────────────────────────────────────────
   Provides a navigate-with-wipe function to all child components
   so they don't need to couple directly to the overlay ref.      */
const TransitionCtx = createContext<(path: string) => void>(() => {});
function useTransitionNavigate() { return useContext(TransitionCtx); }

/* ─── Preloader ─────────────────────────────────────────────────
   Shows on first load. KIAN letters reveal via clip-path,
   a progress line draws across, then the whole overlay slides up. */
function Preloader({ onComplete }: { onComplete: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const tl = gsap.timeline({
      delay: 0.2,
      onComplete: () => {
        gsap.to(ref.current, {
          yPercent: -100, duration: 0.75, ease: "power4.in",
          onComplete,
        });
      },
    });
    tl.fromTo(".pre-letter",
      { clipPath: "inset(100% 0 0 0)" },
      { clipPath: "inset(0% 0 0 0)", duration: 0.8, stagger: 0.07, ease: "power4.out" },
    )
    .fromTo(".pre-meta",
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power2.out" },
      "-=0.3"
    )
    .fromTo(".pre-progress",
      { scaleX: 0, transformOrigin: "left" },
      { scaleX: 1, duration: 1, ease: "power3.inOut" },
      "-=0.2"
    );
  }, [onComplete]);

  return (
    <div ref={ref} className="fixed inset-0 z-[300] flex flex-col justify-between px-8 md:px-14 pb-10 pt-20"
      style={{ background: "#d4ccd0" }}>
      {/* Blueprint grid */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.13 }}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="psg" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#1640d3" strokeWidth="0.3" />
            </pattern>
            <pattern id="plg" width="120" height="120" patternUnits="userSpaceOnUse">
              <rect width="120" height="120" fill="url(#psg)" />
              <path d="M 120 0 L 0 0 0 120" fill="none" stroke="#1640d3" strokeWidth="0.85" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#plg)" />
        </svg>
      </div>

      {/* Top label */}
      <div className="relative flex justify-between items-start">
        <p className="pre-meta font-mono text-[9px] uppercase tracking-[0.3em] opacity-0" style={{ color: "#1640d3" }}>
          Portfolio — 2025
        </p>
        <p className="pre-meta font-mono text-[9px] uppercase tracking-widest opacity-0" style={{ color: "rgba(15,12,14,0.35)" }}>
          Loading
        </p>
      </div>

      {/* KIAN letters */}
      <div className="relative flex-1 flex flex-col justify-end pb-4">
        <div className="overflow-hidden flex items-end">
          {["K", "I", "A", "N"].map((char, i) => (
            <span key={i} className="pre-letter block font-display font-bold leading-[0.85] select-none"
              style={{
                fontSize: "clamp(5rem, 20vw, 18rem)",
                color: "#0f0c0e",
                letterSpacing: "-0.025em",
                clipPath: "inset(100% 0 0 0)",
              }}>
              {char}
            </span>
          ))}
        </div>

        {/* Progress */}
        <div className="mt-5 flex items-center gap-3">
          <p className="pre-meta font-mono text-[9px] uppercase tracking-widest opacity-0" style={{ color: "rgba(15,12,14,0.35)" }}>
            UI/UX Designer
          </p>
          <div className="flex-1 h-px" style={{ background: "rgba(15,12,14,0.12)" }}>
            <div className="pre-progress h-full" style={{ background: "#1640d3", opacity: 0.5 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page transition overlay ───────────────────────────────────
   Electric-blue panel that wipes right-to-left on navigation.   */
function TransitionOverlay({ primaryColor }: { primaryColor: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} className="transition-overlay fixed inset-0 z-[250] pointer-events-none"
      style={{ background: primaryColor, transform: "translateX(105%)" }} />
  );
}

/* ─── Live data widget ──────────────────────────────────────────
   Fixed bottom-right: real-time clock + cursor XY coordinates,
   styled as a blueprint engineering status bar.                  */
function LiveWidget({ primaryColor }: { primaryColor: string }) {
  const [time, setTime] = useState("");
  const pos = useRef({ x: 0, y: 0 });
  const displayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const tick = () => {
      const n = new Date();
      setTime(
        `${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}:${String(n.getSeconds()).padStart(2, "0")}`
      );
    };
    tick();
    const id = setInterval(tick, 1000);

    const onMove = (e: globalThis.MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (displayRef.current) {
        displayRef.current.textContent =
          `X: ${String(e.clientX).padStart(4, "0")}  Y: ${String(e.clientY).padStart(4, "0")}`;
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => { clearInterval(id); window.removeEventListener("mousemove", onMove); };
  }, []);

  return (
    <div className="fixed bottom-5 right-8 z-[65] pointer-events-none select-none hidden md:flex flex-col items-end gap-0.5">
      <span className="font-mono text-[8px] uppercase tracking-widest" style={{ color: `${primaryColor}70` }}>
        {time}
      </span>
      <span ref={displayRef} className="font-mono text-[8px] uppercase tracking-widest"
        style={{ color: `${primaryColor}45` }}>
        X: 0000  Y: 0000
      </span>
    </div>
  );
}

/* ─── Idle ambient mode ─────────────────────────────────────────
   After 6 s of no interaction, expands the glow, dims cursor,
   and slows the Three.js scene. Any interaction exits it.        */
function useIdleAmbient() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let ambient = false;

    const enter = () => {
      ambient = true;
      gsap.to(".ambient-glow", { scale: 1.8, opacity: 0.55, duration: 2.5, ease: "power2.inOut" });
      gsap.to(".cursor-dot", { scale: 0, duration: 0.8, ease: "power2.in" });
      gsap.to(".cursor-ring", { scale: 1.4, borderColor: "rgba(22,64,211,0.2)", duration: 1.5 });
      gsap.to(".blueprint-overlay", { opacity: 0.22, duration: 2 });
    };

    const exit = () => {
      if (!ambient) return;
      ambient = false;
      gsap.to(".ambient-glow", { scale: 1, opacity: 1, duration: 0.6, ease: "power2.out" });
      gsap.to(".cursor-dot", { scale: 1, duration: 0.4 });
      gsap.to(".cursor-ring", { scale: 1, borderColor: "rgba(22,64,211,0.45)", duration: 0.4 });
      gsap.to(".blueprint-overlay", { opacity: 0.14, duration: 0.6 });
    };

    const reset = () => {
      exit();
      clearTimeout(timer);
      timer = setTimeout(enter, 6000);
    };

    const events = ["mousemove", "scroll", "keydown", "touchstart"] as const;
    events.forEach(e => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => {
      clearTimeout(timer);
      events.forEach(e => window.removeEventListener(e, reset));
    };
  }, []);
}

const ROLES = ["UI/UX Designer", "Creative Technologist", "WebGL Developer", "Design Systems Lead"];
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!%";

/* ─── Lenis ─────────────────────────────────────────────────── */
function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    (window as any).lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { lenis.destroy(); gsap.ticker.remove(tick); delete (window as any).lenis; };
  }, []);
}

/* ─── Device detection ──────────────────────────────────────── */
function useIsTouch() {
  const [val, setVal] = useState(false);
  useEffect(() => {
    setVal(window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window);
  }, []);
  return val;
}


/* ─── Scroll Velocity Skew ──────────────────────────────────
   Reads frame-to-frame scroll delta, lerps to a skewY value,
   and applies it directly to the hero / about / contact sections
   (WorkSection is excluded to avoid conflicting with GSAP pin). */
function useScrollSkew() {
  useEffect(() => {
    let lastY = window.scrollY;
    let skew = 0;

    const tick = () => {
      const y = window.scrollY;
      const vel = (y - lastY) * 0.055;
      lastY = y;
      skew += (Math.max(-4, Math.min(4, vel)) - skew) * 0.14;

      const s = skew.toFixed(3);
      (["#hero", "#about", "#contact"] as const).forEach(id => {
        const el = document.querySelector(id) as HTMLElement | null;
        if (el) el.style.transform = `skewY(${s}deg)`;
      });
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      ["#hero", "#about", "#contact"].forEach(id => {
        const el = document.querySelector(id) as HTMLElement | null;
        if (el) el.style.transform = "";
      });
    };
  }, []);
}

/* ─── Text Scramble ─────────────────────────────────────────── */
function useTextScramble(original: string, active: boolean) {
  const [text, setText] = useState(original);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!active) { setText(original); return; }
    frameRef.current = 0;
    const total = Math.ceil(original.length * 1.6);
    timerRef.current = setInterval(() => {
      frameRef.current++;
      const resolved = Math.floor((frameRef.current / total) * original.length);
      setText(
        original.split("").map((ch, i) => {
          if (ch === " ") return " ";
          if (i < resolved) return ch;
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }).join("")
      );
      if (frameRef.current >= total) { setText(original); clearInterval(timerRef.current!); }
    }, 28);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [active, original]);

  return text;
}

/* ─── Typewriter ─────────────────────────────────────────────
   Cycles through ROLES with per-character type + delete rhythm. */
function TypewriterText({ color }: { color: string }) {
  const [display, setDisplay] = useState("");
  const [idx, setIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const pauseRef = useRef(false);

  useEffect(() => {
    if (pauseRef.current) return;
    const target = ROLES[idx];
    const speed = deleting ? 38 : 72;

    const id = setTimeout(() => {
      if (!deleting) {
        if (display.length < target.length) {
          setDisplay(target.slice(0, display.length + 1));
        } else {
          pauseRef.current = true;
          setTimeout(() => { pauseRef.current = false; setDeleting(true); }, 2200);
        }
      } else {
        if (display.length > 0) {
          setDisplay(display.slice(0, -1));
        } else {
          setDeleting(false);
          setIdx(i => (i + 1) % ROLES.length);
        }
      }
    }, speed);

    return () => clearTimeout(id);
  }, [display, deleting, idx]);

  return (
    <span className="font-mono text-[9px] uppercase tracking-[0.28em]" style={{ color }}>
      {display}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.5, repeatType: "mirror", ease: "linear" }}
      >|</motion.span>
    </span>
  );
}

/* ─── Film Grain ────────────────────────────────────────────── */
const GRAIN_CSS = `@keyframes grain-shift {
  0%{transform:translate(0,0)} 11%{transform:translate(-4%,-9%)}
  22%{transform:translate(6%,3%)} 33%{transform:translate(-9%,6%)}
  44%{transform:translate(4%,-7%)} 55%{transform:translate(-6%,9%)}
  66%{transform:translate(8%,-4%)} 77%{transform:translate(-5%,7%)}
  88%{transform:translate(9%,-8%)} 100%{transform:translate(0,0)}}`;

function FilmGrain({ isDark }: { isDark: boolean }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    const TILE = 300;
    const c = document.createElement("canvas");
    c.width = c.height = TILE;
    const ctx = c.getContext("2d")!;
    const d = ctx.createImageData(TILE, TILE);
    for (let i = 0; i < d.data.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      d.data[i] = v; d.data[i + 1] = v; d.data[i + 2] = v;
      d.data[i + 3] = (Math.random() * 38) | 0;
    }
    ctx.putImageData(d, 0, 0);
    setUrl(c.toDataURL());
  }, []);
  if (!url) return null;
  return (
    <>
      <style>{GRAIN_CSS}</style>
      <div className="fixed pointer-events-none z-[70]" style={{
        inset: "-50%", width: "200%", height: "200%",
        backgroundImage: `url(${url})`, backgroundRepeat: "repeat",
        backgroundSize: "300px 300px",
        opacity: isDark ? 0.07 : 0.042,
        mixBlendMode: isDark ? "screen" : "overlay",
        animation: "grain-shift 0.35s steps(1) infinite",
      }} />
    </>
  );
}

/* ─── Mouse Glow ─────────────────────────────────────────────
   Large 500px radial gradient blob that lazily follows the cursor.
   Uses multiply/screen blend so it integrates with the blueprint. */
function MouseGlow({ isDark, primaryColor }: { isDark: boolean; primaryColor: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onMove = (e: globalThis.MouseEvent) => {
      gsap.to(ref.current, { x: e.clientX - 250, y: e.clientY - 250, duration: 1.2, ease: "power3.out" });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return (
    <div ref={ref} className="ambient-glow fixed top-0 left-0 pointer-events-none z-[2]" style={{
      width: "500px", height: "500px", borderRadius: "50%",
      background: `radial-gradient(circle, ${primaryColor}18 0%, transparent 65%)`,
      mixBlendMode: isDark ? "screen" : "multiply",
    }} />
  );
}

/* ─── Magnetic ──────────────────────────────────────────────── */
function Magnetic({ children, strength = 0.38, disabled = false }: {
  children: React.ReactNode; strength?: number; disabled?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const onMove = useCallback((e: MouseEvent<HTMLSpanElement>) => {
    if (disabled) return;
    const r = ref.current!.getBoundingClientRect();
    gsap.to(ref.current, {
      x: (e.clientX - r.left - r.width / 2) * strength,
      y: (e.clientY - r.top - r.height / 2) * strength,
      duration: 0.35, ease: "power2.out",
    });
  }, [strength, disabled]);
  const onLeave = useCallback(() => {
    if (disabled) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.75, ease: "elastic.out(1,0.45)" });
  }, [disabled]);
  return (
    <span ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ display: "inline-block" }}>
      {children}
    </span>
  );
}

/* ─── Custom Cursor ─────────────────────────────────────────── */
function Cursor({ primaryColor }: { primaryColor: string }) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -200, y: -200 });
  const ring = useRef({ x: -200, y: -200 });
  const hovering = useRef(false);

  useEffect(() => {
    document.body.style.cursor = "none";
    const onMove = (e: globalThis.MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${e.clientX - 3}px,${e.clientY - 3}px)`;
    };
    const onEnter = () => { hovering.current = true; };
    const onLeave = () => { hovering.current = false; };
    document.addEventListener("mousemove", onMove);
    const els = document.querySelectorAll("a,button,[data-hover]");
    els.forEach(el => { el.addEventListener("mouseenter", onEnter); el.addEventListener("mouseleave", onLeave); });
    let id: number;
    const tick = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.1;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.1;
      if (ringRef.current) {
        const sz = hovering.current ? 54 : 34;
        ringRef.current.style.transform = `translate(${ring.current.x - sz / 2}px,${ring.current.y - sz / 2}px)`;
        ringRef.current.style.width = `${sz}px`;
        ringRef.current.style.height = `${sz}px`;
        ringRef.current.style.borderColor = hovering.current ? primaryColor : `${primaryColor}77`;
      }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => {
      document.body.style.cursor = "";
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(id);
      els.forEach(el => { el.removeEventListener("mouseenter", onEnter); el.removeEventListener("mouseleave", onLeave); });
    };
  }, [primaryColor]);

  return (
    <>
      <div ref={dotRef} className="cursor-dot fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[9999]"
        style={{ background: primaryColor }} />
      <div ref={ringRef} className="cursor-ring fixed top-0 left-0 rounded-full border pointer-events-none z-[9998]"
        style={{ transition: "width 0.25s ease, height 0.25s ease, border-color 0.2s ease" }} />
    </>
  );
}

/* ─── Blueprint Grid ────────────────────────────────────────── */
function BlueprintGrid({ primaryColor }: { primaryColor: string }) {
  return (
    <div className="blueprint-overlay fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.14 }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="sg" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke={primaryColor} strokeWidth="0.3" />
          </pattern>
          <pattern id="lg" width="120" height="120" patternUnits="userSpaceOnUse">
            <rect width="120" height="120" fill="url(#sg)" />
            <path d="M 120 0 L 0 0 0 120" fill="none" stroke={primaryColor} strokeWidth="0.85" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#lg)" />
      </svg>
    </div>
  );
}

/* ─── Three.js Hero Canvas ──────────────────────────────────── */
function HeroCanvas({ isDark, scrollProgressRef }: { isDark: boolean; scrollProgressRef?: React.MutableRefObject<number> }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const lineMatRefs = useRef<THREE.LineBasicMaterial[]>([]);
  const pMatRef = useRef<THREE.PointsMaterial | null>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, el.offsetWidth / el.offsetHeight, 0.1, 200);
    camera.position.z = 24;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(el.offsetWidth, el.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const mkMat = (op: number) => {
      const m = new THREE.LineBasicMaterial({ color: 0x1640d3, transparent: true, opacity: op });
      lineMatRefs.current.push(m);
      return m;
    };
    const ico = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(7, 1)), mkMat(0.28));
    ico.position.set(4, 1, 0); scene.add(ico);
    const oct = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.OctahedronGeometry(3.5)), mkMat(0.16));
    oct.position.set(-8, -3, -4); scene.add(oct);
    const box = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(2, 2, 2)), mkMat(0.22));
    box.position.set(-5, 5, -2); scene.add(box);

    const pPos = new Float32Array(280 * 3);
    for (let i = 0; i < pPos.length; i++) pPos[i] = (Math.random() - 0.5) * 50;
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    pMatRef.current = new THREE.PointsMaterial({ color: 0x1640d3, size: 0.07, transparent: true, opacity: 0.5 });
    scene.add(new THREE.Points(pGeo, pMatRef.current));

    const target = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
    const onMouse = (e: globalThis.MouseEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2.5;
      target.y = (e.clientY / window.innerHeight - 0.5) * -1.5;
    };
    window.addEventListener("mousemove", onMouse);

    let animId: number;
    const timer = new THREE.Timer();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      timer.update();
      const t = timer.getElapsed();

      if (scrollProgressRef) {
        const prog = scrollProgressRef.current;
        const fade = Math.max(0, 1 - prog * 1.4);
        const scale = Math.max(0.001, 1 - prog * 0.35);

        ico.scale.setScalar(scale);
        oct.scale.setScalar(scale);
        box.scale.setScalar(scale);

        if (lineMatRefs.current[0]) lineMatRefs.current[0].opacity = fade * 0.28;
        if (lineMatRefs.current[1]) lineMatRefs.current[1].opacity = fade * 0.16;
        if (lineMatRefs.current[2]) lineMatRefs.current[2].opacity = fade * 0.22;
        if (pMatRef.current) pMatRef.current.opacity = fade * 0.5;
      }

      ico.rotation.set(t * 0.12, t * 0.18, 0);
      oct.rotation.set(t * 0.1, t * 0.22, 0);
      box.rotation.set(t * 0.3, t * 0.2, 0);
      cur.x += (target.x - cur.x) * 0.04;
      cur.y += (target.y - cur.y) * 0.04;
      camera.position.set(cur.x, cur.y, 24);
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };
    animate();

    const ro = new ResizeObserver(() => {
      camera.aspect = el.offsetWidth / el.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.offsetWidth, el.offsetHeight);
    });
    ro.observe(el);

    return () => {
      cancelAnimationFrame(animId); timer.dispose(); ro.disconnect();
      window.removeEventListener("mousemove", onMouse);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  useEffect(() => {
    const hex = isDark ? 0x5b86ef : 0x1640d3;
    lineMatRefs.current.forEach(m => m.color.setHex(hex));
    if (pMatRef.current) pMatRef.current.color.setHex(hex);
  }, [isDark]);

  return <div ref={mountRef} className="hero-canvas absolute inset-0 z-0" />;
}

/* ─── Hero ──────────────────────────────────────────────────
   Letters reveal via clip-path wipe (not opacity/y).
   Subtitle uses TypewriterText cycling component.
   ScrollTrigger parallax on canvas vs text block.           */
function Nav({ isDark, onToggleDark, primaryColor }: {
  isDark: boolean; onToggleDark: () => void; primaryColor: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    if (pathname !== "/") {
      navigate("/");
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 400);
    } else {
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 320);
    }
  };

  const textFg = isDark ? "#dce3f6" : "#0f0c0e";
  const bgColor = isDark ? "#0c0f1e" : "#d4ccd0";
  const mutedColor = isDark ? "rgba(220,227,246,0.4)" : "rgba(15,12,14,0.45)";

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50" style={{
        padding: scrolled ? "0.875rem 0" : "1.75rem 0",
        background: scrolled ? (isDark ? "rgba(12,15,30,0.88)" : "rgba(212,204,208,0.88)") : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? `1px solid ${isDark ? "rgba(91,134,239,0.08)" : "rgba(22,64,211,0.08)"}` : "none",
        transition: "padding 0.4s ease, background 0.4s ease",
      }}>
        <div className="px-8 md:px-14 flex items-center justify-between">
          <div className="w-9 h-9">
            <ImageWithFallback src={logoImg} alt="KIAN" className="w-full h-full object-contain" />
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8 md:gap-10">
            {(["work", "about", "contact"] as const).map(id => (
              <button key={id} onClick={() => scrollTo(id)} className="group relative" data-hover>
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] transition-colors duration-300"
                  style={{ color: mutedColor }}>
                  {id}
                </span>
                <span className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                  style={{ background: primaryColor }} />
              </button>
            ))}
            <button onClick={onToggleDark} data-hover
              className="w-8 h-8 flex items-center justify-center"
              style={{ color: mutedColor }} aria-label="Toggle dark mode">
              <DarkToggleIcon isDark={isDark} />
            </button>
          </div>

          {/* Mobile: dark toggle + hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <button onClick={onToggleDark} className="w-8 h-8 flex items-center justify-center"
              style={{ color: mutedColor }} aria-label="Toggle dark mode">
              <DarkToggleIcon isDark={isDark} />
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="w-8 h-8 flex flex-col items-center justify-center gap-1.5"
              aria-label="Open menu"
            >
              <span className="w-5 h-px block" style={{ background: textFg }} />
              <span className="w-5 h-px block" style={{ background: textFg }} />
              <span className="w-3 h-px block" style={{ background: textFg }} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen overlay menu */}
      <div
        className="fixed inset-0 z-[100] flex flex-col md:hidden"
        style={{
          background: bgColor,
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "all" : "none",
          transition: "opacity 0.35s ease",
        }}
      >
        {/* Top row */}
        <div className="flex items-center justify-between px-8 pt-6">
          <div className="w-9 h-9">
            <ImageWithFallback src={logoImg} alt="KIAN" className="w-full h-full object-contain" />
          </div>
          <button onClick={() => setMenuOpen(false)} className="w-10 h-10 flex items-center justify-center"
            style={{ color: textFg }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <div className="flex flex-col justify-center flex-1 px-8 gap-0">
          {(["work", "about", "contact"] as const).map((id, i) => (
            <button key={id} onClick={() => scrollTo(id)}
              className="flex items-baseline gap-4 py-5 border-b text-left"
              style={{ borderColor: `${primaryColor}18` }}>
              <span className="font-mono text-[9px] uppercase tracking-widest flex-shrink-0"
                style={{ color: primaryColor }}>0{i + 1}</span>
              <span className="font-display font-bold capitalize"
                style={{ fontSize: "clamp(2.5rem, 11vw, 4rem)", letterSpacing: "-0.025em", color: textFg }}>
                {id}
              </span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-8 pb-10 flex items-center justify-between">
          <p className="font-mono text-[8px] uppercase tracking-widest" style={{ color: `${primaryColor}55` }}>
            © 2025 KIAN
          </p>
          <p className="font-mono text-[8px] uppercase tracking-widest" style={{ color: `${primaryColor}55` }}>
            hello@kian.design
          </p>
        </div>
      </div>
    </>
  );
}

/* ─── Hero ──────────────────────────────────────────────────
   Letters reveal via clip-path wipe (not opacity/y).
   Subtitle uses TypewriterText cycling component.
   ScrollTrigger parallax on canvas vs text block.           */
function Hero({ isDark, primaryColor }: { isDark: boolean; primaryColor: string }) {
  const textFg = isDark ? "#dce3f6" : "#0f0c0e";
  const muted = isDark ? "rgba(220,227,246,0.35)" : "rgba(15,12,14,0.28)";
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });
      tl.from(".hero-mark", { opacity: 0, scale: 0.75, rotation: -12, duration: 1.3, ease: "power4.out" })
        .from(".hero-rule", { scaleX: 0, transformOrigin: "left", duration: 1, ease: "power4.out" }, "-=0.7")
        /* Clip-path wipe: fromTo so inline-style initial value is ignored */
        .fromTo(".hero-letter",
          { clipPath: "inset(100% 0 0 0)" },
          { clipPath: "inset(0% 0 0 0)", duration: 1, stagger: 0.07, ease: "power4.out" },
          "-=0.6"
        )
        .from([".hero-meta", ".hero-bottom"], { opacity: 0, y: 10, duration: 0.8, stagger: 0.1, ease: "power2.out" }, "-=0.5");

      /* Parallax: canvas moves up 2× faster than text */
      gsap.to(".hero-canvas", {
        y: -140, ease: "none",
        scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero-text-block", {
        y: -60, ease: "none",
        scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
      });
      /* Three.js scroll progress — updates ref read by HeroCanvas */
      ScrollTrigger.create({
        trigger: "#hero", start: "top top", end: "bottom top",
        onUpdate: (st) => { scrollProgressRef.current = st.progress; },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" className="relative z-10 min-h-screen flex flex-col justify-between px-8 md:px-14 pt-28 pb-10">
      {/* Three.js canvas — scroll progress drives fade/scale */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <HeroCanvas isDark={isDark} scrollProgressRef={scrollProgressRef} />
      </div>

      {/* Top meta */}
      <div className="hero-meta relative z-10 flex justify-between items-start mt-4">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] mb-2" style={{ color: primaryColor }}>
            Portfolio — 2025
          </p>
          <TypewriterText color={muted} />
        </div>
        <div className="text-right flex flex-col items-end gap-1.5">
          <p className="font-mono text-[9px] uppercase tracking-[0.28em]" style={{ color: muted }}>
            Open to opportunities
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: primaryColor }} />
            <span className="font-mono text-[9px]" style={{ color: primaryColor }}>Available now</span>
          </div>
        </div>
      </div>

      {/* Registration mark */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div className="hero-mark relative w-20 h-20" style={{ color: `${primaryColor}20` }}>
          <div className="absolute inset-0 border border-current" />
          <div className="absolute top-3 left-3 right-3 bottom-3 border border-current" />
          <div className="absolute inset-0 flex items-center"><div className="w-full h-px bg-current" /></div>
          <div className="absolute inset-0 flex justify-center"><div className="h-full w-px bg-current" /></div>
          <div className="absolute top-1/2 left-1/2 w-2.5 h-2.5 border border-current"
            style={{ transform: "translate(-50%,-50%) rotate(45deg)" }} />
        </div>
      </div>

      {/* Name + rule */}
      <div className="hero-text-block relative z-10">
        <div className="hero-rule h-px mb-5" style={{ background: primaryColor, opacity: 0.2 }} />
        <div className="flex items-end">
          {["K", "I", "A", "N"].map((char, i) => (
            <span key={i} className="hero-letter block font-display font-bold leading-[0.82] select-none"
              style={{
                fontSize: "clamp(4.5rem, 20vw, 20rem)",
                color: textFg, letterSpacing: "-0.025em",
                clipPath: "inset(100% 0 0 0)", // initial — GSAP animates this away
              }}>
              {char}
            </span>
          ))}
          <div className="ml-auto pb-2 text-right hidden md:block">
            <p className="font-body text-sm leading-relaxed" style={{ color: muted }}>
              Crafting digital<br />experiences that matter
            </p>
          </div>
        </div>
        <div className="hero-bottom flex items-center justify-between mt-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em]" style={{ color: muted }}>
            8 years — 40+ projects — 12 countries
          </p>
          <div className="flex items-center gap-2" style={{ color: muted }}>
            <span className="font-mono text-[9px] uppercase tracking-widest">Scroll</span>
            <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}>
              <ChevronDown size={14} strokeWidth={1.2} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Project Card ───────────────────────────────────────────
   Text scramble + 3D tilt via GSAP rotateX/Y on mouse move.  */
function ProjectCard({ project, isDark, primaryColor, isTouch }: {
  project: typeof PROJECTS[number]; isDark: boolean; primaryColor: string; isTouch: boolean;
}) {
  const transitionTo = useTransitionNavigate();
  const [hovered, setHovered] = useState(false);
  const title = useTextScramble(project.title, hovered);
  const textFg = isDark ? "#dce3f6" : "#0f0c0e";
  const muted = isDark ? "rgba(220,227,246,0.32)" : "rgba(15,12,14,0.3)";

  const onTiltMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (isTouch) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(el, { rotateY: x * 10, rotateX: -y * 7, transformPerspective: 900, duration: 0.45, ease: "power2.out" });
  }, [isTouch]);

  const onTiltLeave = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (isTouch) return;
    gsap.to(e.currentTarget, { rotateY: 0, rotateX: 0, duration: 0.9, ease: "elastic.out(1,0.4)" });
  }, [isTouch]);

  return (
    <div
      className="relative flex-shrink-0 flex flex-col overflow-hidden"
      style={{
        width: "clamp(320px, 42vw, 520px)",
        height: "calc(100vh - 120px)",
        borderWidth: "1px", borderStyle: "solid",
        borderColor: hovered ? `${primaryColor}55` : (isDark ? "rgba(91,134,239,0.12)" : "rgba(22,64,211,0.1)"),
        background: isDark ? "rgba(20,24,40,0.6)" : "rgba(212,204,208,0.55)",
        transition: "border-color 0.3s ease",
        transformStyle: "preserve-3d",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={(e) => { setHovered(false); onTiltLeave(e); }}
      onMouseMove={onTiltMove}
      onClick={() => transitionTo(`/project/${project.slug}`)}
      data-hover
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ flex: "0 0 56%" }}>
        <img src={project.img} alt={project.title} className="w-full h-full object-cover"
          style={{
            filter: isDark ? "saturate(0.6) contrast(1.1)" : "saturate(0.7) contrast(1.05)",
            transform: hovered ? "scale(1.04)" : "scale(1)",
            transition: "transform 0.7s cubic-bezier(0.22,1,0.36,1)",
          }} />
        <div className="absolute inset-0" style={{
          background: isDark
            ? "linear-gradient(to bottom, transparent 60%, rgba(12,15,30,0.85))"
            : "linear-gradient(to bottom, transparent 60%, rgba(212,204,208,0.9))",
        }} />
        <span className="absolute top-5 left-5 font-mono text-[10px] tracking-widest" style={{ color: primaryColor }}>
          {project.idx}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-col justify-between flex-1 p-7">
        <div>
          <h3 className="font-display font-bold leading-none mb-2"
            style={{
              fontSize: "clamp(1.6rem, 2.8vw, 2.4rem)", letterSpacing: "-0.02em",
              color: hovered ? primaryColor : textFg,
              transition: "color 0.3s ease", fontVariantNumeric: "tabular-nums",
            }}>
            {title}
          </h3>
          <p className="font-mono text-[9px] uppercase tracking-[0.22em]" style={{ color: muted }}>
            {project.category}
          </p>
        </div>
        <div>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.map(tag => (
              <span key={tag} className="font-mono text-[8px] uppercase tracking-widest px-2 py-1"
                style={{
                  border: `1px solid ${hovered ? primaryColor + "55" : primaryColor + "22"}`,
                  color: hovered ? primaryColor : muted,
                  transition: "border-color 0.3s, color 0.3s",
                }}>
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px]" style={{ color: muted }}>{project.year}</span>
            <div style={{
              color: hovered ? primaryColor : muted,
              transform: hovered ? "translateX(5px)" : "translateX(0)",
              transition: "transform 0.3s ease, color 0.3s ease",
            }}>
              <ArrowRight size={16} strokeWidth={1.1} />
            </div>
          </div>
        </div>
      </div>

      {/* Corner marks */}
      {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos, i) => (
        <div key={i} className={`absolute ${pos} w-5 h-5 pointer-events-none`}
          style={{ opacity: hovered ? 1 : 0, transition: "opacity 0.3s" }}>
          <div className="absolute top-0 left-0 w-full h-px" style={{ background: primaryColor }} />
          <div className="absolute top-0 left-0 h-full w-px" style={{ background: primaryColor }} />
        </div>
      ))}
    </div>
  );
}

/* ─── Mobile Project Card ───────────────────────────────────── */
function MobileProjectCard({ project, isDark, primaryColor }: {
  project: typeof PROJECTS[number]; isDark: boolean; primaryColor: string;
}) {
  const transitionTo = useTransitionNavigate();
  const textFg = isDark ? "#dce3f6" : "#0f0c0e";
  const muted = isDark ? "rgba(220,227,246,0.32)" : "rgba(15,12,14,0.3)";
  return (
    <div
      className="overflow-hidden"
      onClick={() => transitionTo(`/project/${project.slug}`)}
      style={{
        cursor: "pointer",
        borderWidth: "1px", borderStyle: "solid",
        borderColor: isDark ? "rgba(91,134,239,0.14)" : "rgba(22,64,211,0.12)",
      }}
      data-hover
    >
      <div className="relative overflow-hidden" style={{ height: "52vw", minHeight: "180px", maxHeight: "260px" }}>
        <img src={project.img} alt={project.title} className="w-full h-full object-cover"
          style={{ filter: isDark ? "saturate(0.6) contrast(1.1)" : "saturate(0.7) contrast(1.05)" }} />
        <div className="absolute inset-0" style={{
          background: isDark
            ? "linear-gradient(to bottom, transparent 50%, rgba(12,15,30,0.8))"
            : "linear-gradient(to bottom, transparent 50%, rgba(212,204,208,0.85))",
        }} />
        <span className="absolute top-4 left-4 font-mono text-[10px] tracking-widest" style={{ color: primaryColor }}>
          {project.idx}
        </span>
        <span className="absolute bottom-4 right-4 font-mono text-[9px]" style={{ color: muted }}>
          {project.year}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-display font-bold leading-none mb-1.5"
          style={{ fontSize: "clamp(1.4rem, 5vw, 1.8rem)", letterSpacing: "-0.02em", color: textFg }}>
          {project.title}
        </h3>
        <p className="font-mono text-[9px] uppercase tracking-widest mb-4" style={{ color: muted }}>
          {project.category}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map(tag => (
            <span key={tag} className="font-mono text-[8px] uppercase tracking-widest px-2 py-1"
              style={{ border: `1px solid ${primaryColor}28`, color: muted }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Mobile Work Section ───────────────────────────────────── */
function MobileWorkSection({ isDark, primaryColor }: { isDark: boolean; primaryColor: string }) {
  const textFg = isDark ? "#dce3f6" : "#0f0c0e";
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      PROJECTS.forEach((_, i) => {
        gsap.fromTo(`.mobile-card-${i}`,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
            scrollTrigger: { trigger: `.mobile-card-${i}`, start: "top 88%", once: true } }
        );
      });
    }, sectionRef.current);
    return () => ctx.revert();
  }, []);

  return (
    <section id="work" ref={sectionRef} className="relative z-10 px-6 py-16">
      <div className="flex items-baseline gap-3 mb-5">
        <span className="font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: primaryColor }}>01</span>
        <h2 className="font-display font-bold"
          style={{ fontSize: "clamp(1.6rem, 6vw, 2rem)", letterSpacing: "-0.02em", color: textFg }}>
          Selected Work
        </h2>
      </div>
      <div className="h-px mb-8" style={{ background: primaryColor, opacity: 0.18 }} />
      <div className="flex flex-col gap-3">
        {PROJECTS.map((project, i) => (
          <div key={project.id} className={`mobile-card-${i}`}>
            <MobileProjectCard project={project} isDark={isDark} primaryColor={primaryColor} />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Work Section ───────────────────────────────────────────
   Single component — never unmounts. Mobile layout is CSS-only
   (md:hidden / hidden md:flex). GSAP pin only activates on
   desktop (window.innerWidth >= 768 guard in useEffect) so
   GSAP never injects a pin-spacer that React doesn't know about,
   preventing the removeChild crash during component switching.  */
function WorkSection({ isDark, primaryColor, isTouch }: {
  isDark: boolean; primaryColor: string; isTouch: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const textFg = isDark ? "#dce3f6" : "#0f0c0e";
  const muted = isDark ? "rgba(220,227,246,0.25)" : "rgba(15,12,14,0.25)";

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    // Skip pin entirely on mobile — never wrap the section in a pin-spacer
    if (!container || !track || window.innerWidth < 768) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".work-label-desktop",
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: ".work-label-desktop", start: "top 85%", once: true } }
      );
      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: container, start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          pin: true, scrub: 1.2, invalidateOnRefresh: true,
        },
      });
    }, container);
    return () => { try { ctx.revert(); } catch {} };
  }, []);

  return (
    <section id="work" ref={containerRef} className="relative z-10">
      {/* ── Mobile layout (hidden on md+) ── */}
      <div className="md:hidden px-6 pt-14 pb-16">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: primaryColor }}>01</span>
          <h2 className="font-display font-bold"
            style={{ fontSize: "clamp(1.6rem, 6vw, 2rem)", letterSpacing: "-0.02em", color: textFg }}>
            Selected Work
          </h2>
        </div>
        <div className="h-px mb-8" style={{ background: primaryColor, opacity: 0.18 }} />
        <div className="flex flex-col gap-3">
          {PROJECTS.map(p => (
            <MobileProjectCard key={p.id} project={p} isDark={isDark} primaryColor={primaryColor} />
          ))}
        </div>
      </div>

      {/* ── Desktop layout (hidden below md) ── */}
      <div className="hidden md:block">
        <div className="work-label-desktop absolute top-6 left-14 z-10 flex items-center gap-3" style={{ opacity: 0 }}>
          <span className="font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: primaryColor }}>01</span>
          <h2 className="font-display font-bold"
            style={{ fontSize: "clamp(1rem, 2vw, 1.4rem)", letterSpacing: "-0.02em", color: textFg }}>
            Selected Work
          </h2>
          <span className="font-mono text-[8px] uppercase tracking-widest" style={{ color: muted }}>— scroll</span>
        </div>
        <div ref={trackRef} className="flex gap-px items-center"
          style={{ width: "max-content", paddingTop: "80px", paddingLeft: "clamp(2rem,5vw,3.5rem)", paddingRight: "clamp(2rem,5vw,3.5rem)" }}>
          {PROJECTS.map(p => (
            <ProjectCard key={p.id} project={p} isDark={isDark} primaryColor={primaryColor} isTouch={isTouch} />
          ))}
          <div className="flex-shrink-0 flex flex-col items-start justify-end pb-10 pl-14"
            style={{ width: "260px", height: "calc(100vh - 120px)" }}>
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] mb-3" style={{ color: muted }}>4 projects</p>
            <button className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest hover:opacity-100 transition-opacity"
              style={{ color: primaryColor, opacity: 0.7 }}
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              data-hover>
              Work together
              <ArrowRight size={13} strokeWidth={1.2} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── About Section ─────────────────────────────────────────
   Stats animate from 0 via GSAP counter on scroll.          */
function AboutSection({ isDark, primaryColor }: { isDark: boolean; primaryColor: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const textFg = isDark ? "#dce3f6" : "#0f0c0e";
  const bodyColor = isDark ? "rgba(220,227,246,0.65)" : "rgba(15,12,14,0.68)";
  const muted = isDark ? "rgba(220,227,246,0.35)" : "rgba(15,12,14,0.42)";

  const skills = [
    "UI/UX & Interaction Design", "Creative Media & Visual Design", "Figma",
    "Adobe Creative Cloud", "LottieFiles", "React & Framer Motion", "WebGL / Three.js",
    "FlutterFlow", "Godot", "Firebase", "Frontend Architecture", "AI Assistant Design", "Vibe Coding"
  ];

  useEffect(() => {
    if (!sectionRef.current) return;
    const el = sectionRef.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(".about-left",
        { x: -28 },
        { x: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true } }
      );
      gsap.fromTo(".about-right",
        { x: 28 },
        { x: 0, duration: 0.9, delay: 0.15, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true } }
      );
      gsap.utils.toArray<HTMLElement>(".skill-tag").forEach((tag, i) => {
        gsap.fromTo(tag, { y: 10 }, { y: 0, duration: 0.4, delay: i * 0.04, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 75%", once: true } });
      });


    }, el);
    return () => ctx.revert();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section id="about" ref={sectionRef} className="relative z-10 px-8 md:px-14 py-20 md:py-28">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-24">
        <div className="about-left">
          <div className="flex items-baseline gap-4 mb-8">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: primaryColor }}>02</span>
            <h2 className="font-display font-bold" style={{ fontSize: "clamp(1.8rem, 4vw, 3.5rem)", letterSpacing: "-0.02em", color: textFg }}>
              About
            </h2>
          </div>
          <p className="font-body text-base leading-[1.9] mb-6" style={{ color: bodyColor }}>
            I specialize in UI/UX design and building stunning, high-precision web applications. My focus is on integrating clean vector aesthetics, highly structured layouts, and fluid micro-animations into functional digital products.
          </p>
          <div className="mt-14 relative w-24 h-24" style={{ opacity: 0.13, color: primaryColor }}>
            <div className="absolute inset-0 border border-current" />
            <div className="absolute top-3.5 left-3.5 right-3.5 bottom-3.5 border border-current" />
            <div className="absolute inset-0 flex items-center"><div className="w-full h-px bg-current" /></div>
            <div className="absolute inset-0 flex justify-center"><div className="h-full w-px bg-current" /></div>
            <div className="absolute top-1/2 left-1/2 w-2.5 h-2.5 border border-current"
              style={{ transform: "translate(-50%,-50%) rotate(45deg)" }} />
          </div>
        </div>

        <div className="about-right">
          {/* Education */}
          <div className="mb-12">
            <p className="font-mono text-[9px] uppercase tracking-[0.28em] mb-6" style={{ color: primaryColor }}>Education Background</p>
            <div className="flex flex-col gap-6">
              <div className="relative pl-4" style={{ borderLeft: `1px solid ${primaryColor}22` }}>
                <div className="absolute top-1.5 -left-1 w-2 h-2 rounded-full" style={{ background: primaryColor }} />
                <p className="font-mono text-[8px] uppercase tracking-widest mb-1.5" style={{ color: muted }}>2024 - 2027</p>
                <h4 className="font-display font-bold text-base leading-tight mb-1" style={{ color: textFg }}>Bachelor in Creative Media</h4>
                <p className="font-body text-[11px]" style={{ color: muted }}>Taylor's University</p>
              </div>
              <div className="relative pl-4" style={{ borderLeft: `1px solid ${primaryColor}22` }}>
                <div className="absolute top-1.5 -left-1 w-2 h-2 rounded-full bg-transparent border" style={{ borderColor: primaryColor }} />
                <p className="font-mono text-[8px] uppercase tracking-widest mb-1.5" style={{ color: muted }}>2017 - 2023</p>
                <h4 className="font-display font-bold text-base leading-tight mb-1" style={{ color: textFg }}>High School / Secondary Education</h4>
                <p className="font-body text-[11px]" style={{ color: muted }}>Chung Hua Independent High School Klang</p>
              </div>
            </div>
          </div>
          <div className="h-px w-full mb-8" style={{ background: `${primaryColor}18` }} />
          <p className="font-mono text-[9px] uppercase tracking-[0.28em] mb-4" style={{ color: primaryColor }}>Creative Toolkit</p>
          <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
              <span key={skill} className="skill-tag font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 cursor-default"
                style={{ border: `1px solid ${primaryColor}22`, color: muted, transition: "border-color 0.3s, color 0.3s" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = `${primaryColor}88`; el.style.color = primaryColor; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = `${primaryColor}22`; el.style.color = muted; }}
                data-hover>
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Contact Section ───────────────────────────────────────
   Heading uses clip-path reveal. Links have Magnetic pull.   */
function ContactSection({ isDark, primaryColor, isTouch }: { isDark: boolean; primaryColor: string; isTouch: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const textFg = isDark ? "#dce3f6" : "#0f0c0e";
  const muted = isDark ? "rgba(220,227,246,0.28)" : "rgba(15,12,14,0.28)";
  const emailColor = isDark ? "rgba(220,227,246,0.62)" : "rgba(15,12,14,0.62)";

  useEffect(() => {
    if (!sectionRef.current) return;
    const el = sectionRef.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(".contact-rule",
        { scaleX: 0, transformOrigin: "left" },
        { scaleX: 1, duration: 1.1, ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 95%", once: true } }
      );
      gsap.fromTo(".contact-heading",
        { clipPath: "inset(0 0 100% 0)", y: 20 },
        { clipPath: "inset(0 0 0% 0)", y: 0, duration: 1.1, ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true } }
      );
      gsap.fromTo(".contact-links",
        { y: 16 },
        { y: 0, duration: 0.7, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true } }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="relative z-10 px-8 md:px-14 py-20 md:py-28">
      <div className="contact-rule h-px mb-16" style={{ background: primaryColor, opacity: 0.16 }} />
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-12">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] mb-5" style={{ color: primaryColor }}>
            03 — Contact
          </p>
          <h2 className="contact-heading font-display font-bold leading-[0.9]"
            style={{ fontSize: "clamp(2.2rem, 7vw, 7rem)", letterSpacing: "-0.03em", color: textFg,
              clipPath: "inset(0 0 100% 0)" }}>
            Let&apos;s build<br />
            <span style={{ color: primaryColor }}>something</span><br />
            remarkable.
          </h2>
        </div>
        <div className="contact-links flex flex-col gap-5 items-start md:items-end">
          <Magnetic strength={0.3} disabled={isTouch}>
            <a href="mailto:kianyigan@gmail.com"
              className="group flex items-center gap-3 font-body text-base transition-colors duration-300"
              style={{ color: emailColor }} data-hover
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = primaryColor)}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = emailColor)}>
              <Mail size={15} strokeWidth={1.2} />
              kianyigan@gmail.com
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight size={14} strokeWidth={1.1} />
              </span>
            </a>
          </Magnetic>
          <div className="flex gap-3">
            {([
              { href: "https://www.linkedin.com/in/gan-yi-kian-6b1816365/", Icon: Linkedin, label: "LinkedIn" },
              { href: "#", Icon: BookMarked, label: "Read.cv" },
            ] as const).map(({ href, Icon, label }) => (
              <Magnetic key={label} strength={0.3} disabled={isTouch}>
                <a href={href}
                  aria-label={label}
                  title={label}
                  className="flex items-center justify-center w-9 h-9 transition-colors duration-300"
                  style={{
                    border: `1px solid ${primaryColor}22`,
                    color: muted,
                  }}
                  data-hover
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.color = primaryColor;
                    el.style.borderColor = `${primaryColor}66`;
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.color = muted;
                    el.style.borderColor = `${primaryColor}22`;
                  }}>
                  <Icon size={14} strokeWidth={1.4} />
                </a>
              </Magnetic>
            ))}
            <Magnetic strength={0.3} disabled={isTouch}>
              <a href="#"
                aria-label="View work"
                title="View all work"
                className="flex items-center justify-center w-9 h-9 transition-colors duration-300"
                style={{ border: `1px solid ${primaryColor}22`, color: muted }}
                data-hover
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = primaryColor;
                  el.style.borderColor = `${primaryColor}66`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = muted;
                  el.style.borderColor = `${primaryColor}22`;
                }}>
                <ArrowUpRight size={14} strokeWidth={1.4} />
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
      <div className="mt-20 pt-6 flex items-center relative"
        style={{ borderTop: `1px solid ${primaryColor}10` }}>
        <div className="w-7 h-7" style={{ opacity: 0.35 }}>
          <ImageWithFallback src={logoImg} alt="KIAN" className="w-full h-full object-contain" />
        </div>
        <button
          onClick={() => {
            const lenis = (window as any).lenis;
            if (lenis) {
              lenis.scrollTo(0, { 
                duration: 3.5, 
                easing: (t: number) => t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2 
              });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="absolute left-1/2 -translate-x-1/2 group flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest transition-colors duration-300"
          style={{ color: muted }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = primaryColor)}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = muted)}
          data-hover
        >
          Back to top
          <span className="transition-transform duration-300 group-hover:-translate-y-1">
            <ArrowUp size={14} strokeWidth={1.2} />
          </span>
        </button>
      </div>
    </section>
  );
}

/* ─── Outlet context type ───────────────────────────────────── */
export interface OutletCtx {
  isDark: boolean;
  primaryColor: string;
  isTouch: boolean;
}

/* ─── Root layout — shared across all pages ─────────────────── */
function Root() {
  const [isDark, setIsDark] = useState(false);
  const [preloaderDone, setPreloaderDone] = useState(false);
  const isTouch = useIsTouch();
  const primaryColor = isDark ? "#5b86ef" : "#1640d3";
  const overlayRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useLenis();
  useScrollSkew();
  useIdleAmbient();

  const toggleDark = useCallback(() => {
    const root = document.documentElement;
    root.classList.add("theme-transitioning");
    root.classList.toggle("dark");
    setIsDark(prev => !prev);
    setTimeout(() => root.classList.remove("theme-transitioning"), 650);
  }, []);

  /* Page transition: wipe right→cover→navigate→exit left */
  const transitionTo = useCallback((path: string) => {
    const overlay = overlayRef.current;
    if (!overlay) { navigate(path); return; }
    gsap.fromTo(overlay,
      { x: "105%", pointerEvents: "none" },
      {
        x: "0%", duration: 0.45, ease: "power4.in",
        onComplete: () => {
          navigate(path);
          window.scrollTo(0, 0);
          gsap.to(overlay, {
            x: "-105%", duration: 0.45, ease: "power4.out", delay: 0.05,
            onComplete: () => gsap.set(overlay, { x: "105%", pointerEvents: "none" }),
          });
        },
      }
    );
  }, [navigate]);

  const ctx: OutletCtx = { isDark, primaryColor, isTouch };

  return (
    <TransitionCtx.Provider value={transitionTo}>
      {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}
      <div className="relative min-h-screen overflow-x-hidden bg-background">
        <FilmGrain isDark={isDark} />
        {!isTouch && <MouseGlow isDark={isDark} primaryColor={primaryColor} />}
        {!isTouch && <Cursor primaryColor={primaryColor} />}
        <BlueprintGrid primaryColor={primaryColor} />
        <LiveWidget primaryColor={primaryColor} />
        <Nav isDark={isDark} onToggleDark={toggleDark} primaryColor={primaryColor} />
        <Outlet context={ctx} />
        {/* Transition overlay — sits above all content */}
        <div ref={overlayRef} className="transition-overlay fixed inset-0 z-[250]"
          style={{ background: primaryColor, transform: "translateX(105%)", pointerEvents: "none" }} />
      </div>
    </TransitionCtx.Provider>
  );
}

/* ─── Portfolio home page ───────────────────────────────────── */
function PortfolioPage() {
  const { isDark, primaryColor, isTouch } = useOutletContext<OutletCtx>();
  return (
    <main>
      <Hero isDark={isDark} primaryColor={primaryColor} />
      <WorkSection isDark={isDark} primaryColor={primaryColor} isTouch={isTouch} />
      <AboutSection isDark={isDark} primaryColor={primaryColor} />
      <ContactSection isDark={isDark} primaryColor={primaryColor} isTouch={isTouch} />
    </main>
  );
}

/* ─── Router + App ──────────────────────────────────────────── */
const router = createHashRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: PortfolioPage },
      { path: "project/:slug", Component: ProjectDetail },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
