import { useEffect, useRef } from "react";
import { useParams, useNavigate, Link, useOutletContext } from "react-router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { PROJECTS } from "../data/projects";

gsap.registerPlugin(ScrollTrigger);

interface OutletCtx {
  isDark: boolean;
  primaryColor: string;
  isTouch: boolean;
}


export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isDark, primaryColor } = useOutletContext<OutletCtx>();

  const project = PROJECTS.find((p) => p.slug === slug);
  const projectIndex = PROJECTS.findIndex((p) => p.slug === slug);
  const nextProject = PROJECTS[(projectIndex + 1) % PROJECTS.length];

  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project) { navigate("/"); return; }
    window.scrollTo(0, 0);
  }, [slug, project, navigate]);

  useEffect(() => {
    if (!project) return;
    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.fromTo(".pd-hero-content",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: "power4.out", delay: 0.2 }
      );
      gsap.fromTo(".pd-meta-item",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power3.out", delay: 0.5 }
      );

      // Scroll reveals
      gsap.utils.toArray<HTMLElement>(".pd-section").forEach((el) => {
        gsap.fromTo(el,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true } }
        );
      });

      // Rule draws
      gsap.utils.toArray<HTMLElement>(".pd-rule").forEach((el) => {
        gsap.fromTo(el,
          { scaleX: 0, transformOrigin: "left" },
          { scaleX: 1, duration: 1, ease: "power4.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true } }
        );
      });
    });
    return () => { try { ctx.revert(); } catch {} };
  }, [slug, project]);

  if (!project) return null;

  const textFg = isDark ? "#dce3f6" : "#0f0c0e";
  const bodyColor = isDark ? "rgba(220,227,246,0.68)" : "rgba(15,12,14,0.68)";
  const muted = isDark ? "rgba(220,227,246,0.38)" : "rgba(15,12,14,0.42)";
  const borderColor = isDark ? "rgba(91,134,239,0.12)" : "rgba(22,64,211,0.1)";

  return (
    <div className="min-h-screen">
      {/* ── Hero ─────────────────────────────────────────── */}
      <div ref={heroRef} className="relative h-[75vh] min-h-[480px] overflow-hidden">
        <img
          src={project.heroImg}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient overlay — strengthened bottom opacity for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.4) 100%)",
          }}
        />

        {/* Back button — top left */}
        <Link
          to="/"
          className="absolute top-28 left-8 md:left-14 flex items-center gap-2 z-10 transition-all duration-300"
          style={{
            color: "rgba(255,255,255,0.85)",
            background: "rgba(0,0,0,0.28)",
            backdropFilter: "blur(8px)",
            padding: "6px 12px 6px 10px",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.color = "#fff";
            el.style.background = `${primaryColor}cc`;
            el.style.borderColor = primaryColor;
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.color = "rgba(255,255,255,0.85)";
            el.style.background = "rgba(0,0,0,0.28)";
            el.style.borderColor = "rgba(255,255,255,0.12)";
          }}
        >
          <ArrowLeft size={13} strokeWidth={1.3} />
          <span className="font-mono text-[9px] uppercase tracking-[0.28em]">Portfolio</span>
        </Link>

        {/* View project link — top right */}
        <a
          href={project.tagline.replace('Live Preview: ', '')}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-28 right-8 md:right-14 flex items-center gap-2 z-10 transition-all duration-300"
          style={{
            color: "rgba(255,255,255,0.85)",
            background: "rgba(0,0,0,0.28)",
            backdropFilter: "blur(8px)",
            padding: "6px 12px 6px 12px",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.color = "#fff";
            el.style.background = `${primaryColor}cc`;
            el.style.borderColor = primaryColor;
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.color = "rgba(255,255,255,0.85)";
            el.style.background = "rgba(0,0,0,0.28)";
            el.style.borderColor = "rgba(255,255,255,0.12)";
          }}
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.28em]">View Project</span>
          <ArrowUpRight size={13} strokeWidth={1.3} />
        </a>

        {/* Hero content — bottom */}
        <div className="pd-hero-content absolute bottom-0 left-0 right-0 px-8 md:px-14 pb-10">
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] block mb-3"
            style={{ color: isDark ? primaryColor : "#8faaff" }}>
            {project.idx} — {project.category}
          </span>
          <h1
            className="font-display font-bold leading-[0.88] mb-4"
            style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)", letterSpacing: "-0.025em", color: "#ffffff", textShadow: "0 2px 12px rgba(0,0,0,0.2)" }}
          >
            {project.title}
          </h1>
          <p className="font-body text-base max-w-xl" style={{ color: "rgba(255, 255, 255, 0.78)" }}>
            {project.tagline}
          </p>
        </div>

        {/* Blueprint corner marks */}
        {(["top-0 right-0", "bottom-0 right-0"] as const).map((pos, i) => (
          <div key={i} className={`absolute ${pos} w-8 h-8 z-10`} style={{ opacity: 0.5 }}>
            <div className="absolute top-0 right-0 w-full h-px" style={{ background: primaryColor }} />
            <div className="absolute top-0 right-0 h-full w-px" style={{ background: primaryColor }} />
          </div>
        ))}
      </div>

      {/* ── Meta row ─────────────────────────────────────── */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 border-b"
        style={{ borderColor }}
      >
        {[
          { label: "Category", value: project.category },
          { label: "Role", value: project.role },
          { label: "Year", value: project.year },
          { label: "Duration", value: project.duration },
        ].map((item, i) => (
          <div
            key={i}
            className="pd-meta-item px-8 md:px-14 py-6 border-r last:border-r-0"
            style={{ borderColor }}
          >
            <p className="font-mono text-[8px] uppercase tracking-[0.25em] mb-1.5" style={{ color: muted }}>
              {item.label}
            </p>
            <p className="font-body text-sm" style={{ color: textFg }}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* ── Content ──────────────────────────────────────── */}
      <div ref={contentRef} className="px-8 md:px-14">

        {/* Overview */}
        <section className="pd-section py-16 md:py-20 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 md:gap-16">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: primaryColor }}>01</span>
            <h2 className="font-display font-bold mt-1"
              style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)", letterSpacing: "-0.02em", color: textFg }}>
              Overview
            </h2>
          </div>
          <p className="font-body text-base leading-[1.95]" style={{ color: bodyColor }}>
            {project.overview}
          </p>
        </section>

        <div className="pd-rule h-px" style={{ background: primaryColor, opacity: 0.12 }} />

        {/* Full-width image */}
        <div className="pd-section py-12 md:py-16">
          <div className="relative overflow-hidden" style={{ border: `1px solid ${borderColor}` }}>
            <img
              src={project.secondImg}
              alt={`${project.title} — process`}
              className="w-full object-cover"
              style={{
                height: "clamp(240px, 40vw, 520px)",
              }}
            />
          </div>
        </div>

        <div className="pd-rule h-px" style={{ background: primaryColor, opacity: 0.12 }} />

        {/* Challenge */}
        <section className="pd-section py-16 md:py-20 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 md:gap-16">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: primaryColor }}>02</span>
            <h2 className="font-display font-bold mt-1"
              style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)", letterSpacing: "-0.02em", color: textFg }}>
              The Challenge
            </h2>
          </div>
          <p className="font-body text-base leading-[1.95]" style={{ color: bodyColor }}>
            {project.challenge}
          </p>
        </section>

        <div className="pd-rule h-px" style={{ background: primaryColor, opacity: 0.12 }} />

        {/* Approach */}
        <section className="pd-section py-16 md:py-20 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 md:gap-16">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: primaryColor }}>03</span>
            <h2 className="font-display font-bold mt-1"
              style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)", letterSpacing: "-0.02em", color: textFg }}>
              Approach
            </h2>
          </div>
          <div className="flex flex-col gap-0">
            {project.approach.map((step, i) => (
              <div
                key={i}
                className="flex items-baseline gap-4 py-4 border-b"
                style={{ borderColor }}
              >
                <span className="font-mono text-[9px] flex-shrink-0" style={{ color: primaryColor }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="font-body text-sm leading-relaxed" style={{ color: bodyColor }}>
                  {step}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="pd-rule h-px" style={{ background: primaryColor, opacity: 0.12 }} />

        {/* Outcome */}
        <section className="pd-section py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 md:gap-16">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: primaryColor }}>04</span>
              <h2 className="font-display font-bold mt-1"
                style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)", letterSpacing: "-0.02em", color: textFg }}>
                Outcome
              </h2>
            </div>
            <p className="font-body text-base leading-[1.95]" style={{ color: bodyColor }}>
              {project.outcome}
            </p>
          </div>
        </section>
      </div>

      {/* ── Next project ─────────────────────────────────── */}
      <div className="pd-section" style={{ borderTop: `1px solid ${borderColor}` }}>
        <Link
          to={`/project/${nextProject.slug}`}
          className="group flex items-center justify-between px-8 md:px-14 py-10 md:py-14 transition-colors duration-300"
          style={{ background: "transparent" }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = isDark ? "rgba(91,134,239,0.04)" : "rgba(22,64,211,0.03)")}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
        >
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.28em] mb-2" style={{ color: muted }}>
              Next Project
            </p>
            <h3
              className="font-display font-bold transition-colors duration-300"
              style={{
                fontSize: "clamp(1.5rem, 4vw, 3rem)",
                letterSpacing: "-0.02em",
                color: textFg,
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = primaryColor)}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = textFg)}
            >
              {nextProject.title}
            </h3>
            <p className="font-mono text-[9px] uppercase tracking-widest mt-1" style={{ color: primaryColor }}>
              {nextProject.category} — {nextProject.year}
            </p>
          </div>
          <div
            className="w-12 h-12 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:translate-x-2"
            style={{ border: `1px solid ${primaryColor}30`, color: primaryColor }}
          >
            <ArrowRight size={16} strokeWidth={1.2} />
          </div>
        </Link>
      </div>
    </div>
  );
}
