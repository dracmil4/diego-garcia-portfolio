'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { FileItem, WindowItem } from '../types';
import { ExternalLink, ChevronLeft, ChevronRight, Minus, Square, X, Circle, Signal, Wifi, Battery } from 'lucide-react';
import TechIcon from './TechIcon';

interface FloatingWindowProps {
  window: WindowItem;
  files: FileItem[];
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
}

interface ProjectDetails {
  title: string;
  role: string;
  stack: string[];
  desc: string;
  githubUrl: string;
  images: string[];
  highlights: string[];
}

const PROJECT_DEFAULTS: Record<string, ProjectDetails> = {
  cbn_gestion_eventos: {
    title: 'CBN — Sistema de Gestión de Eventos',
    role: 'Software Developer',
    stack: ['Node.js', 'TypeScript', 'Clean Architecture', 'Prisma ORM', 'Flutter', 'BLoC'],
    desc: 'Backend robusto bajo Clean Architecture con Node.js y Prisma ORM. App móvil en Flutter (BLoC) con enfoque Offline-First.',
    githubUrl: 'https://github.com/diego-garcia-chungara',
    images: ['/images/proyectos/cbn-admin.png', '/images/proyectos/cbn-mobile.png'],
    highlights: ['Panel de administración web', 'App móvil Flutter offline-first', 'Migraciones con Prisma'],
  },
  ucb_sistema_becas: {
    title: 'UCB — Sistema de Becas Universitarias',
    role: 'QA Junior / Colaborador Técnico',
    stack: ['QA Testing', 'Clean Code', 'Git / Pull Requests', 'Requirements Engineering'],
    desc: 'Definición de requerimientos, pruebas funcionales y revisión técnica de código del equipo.',
    githubUrl: 'https://github.com/diego-garcia-chungara',
    images: ['/images/proyectos/ucb-prs.png', '/images/proyectos/ucb-testing.png'],
    highlights: ['Revisión de Pull Requests', 'Matriz de trazabilidad', 'Flujos de aprobación de becas'],
  },
  ucb_sistema_certificados: {
    title: 'UCB — Sistema de Certificados Universitarios',
    role: 'Proyecto Universitario',
    stack: ['TypeScript', 'Node.js', 'PostgreSQL', 'Digital Validation'],
    desc: 'Sistema de generación y validación digital de certificados académicos. Panel administrativo y certificado final.',
    githubUrl: 'https://github.com/diego-garcia-chungara',
    images: ['/images/proyectos/ucb-cert-panel.png', '/images/proyectos/ucb-cert-result.png'],
    highlights: ['Panel de generación de certificados', 'Validación digital integrada', 'Trazabilidad en PostgreSQL'],
  },
  andean_ux_hobby_match: {
    title: 'Hobby Match — App Móvil',
    role: 'Software Developer',
    stack: ['React Native', 'TypeScript', 'AsyncStorage', 'UI Locking'],
    desc: 'App multiplataforma para conectar personas por intereses, con UI locking y persistencia local eficiente.',
    githubUrl: 'https://github.com/diego-garcia-chungara',
    images: ['/images/proyectos/hobby-match-1.png', '/images/proyectos/hobby-match-2.png', '/images/proyectos/hobby-match-3.png'],
    highlights: ['Listas optimizadas con FlatList', 'Control de carga con UI locking', 'Caché local AsyncStorage'],
  },
};

const STATUS_BADGE: Record<string, { label: string; color: string }> = {
  'Production Ready': { label: 'Production', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  'Deployed':         { label: 'Deployed',   color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  'Production':       { label: 'Production', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  'Academic Project': { label: 'Academic',   color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
};

export default function FloatingWindow({ window: win, files, onClose, onMinimize, onMaximize, onFocus }: FloatingWindowProps) {
  const dragControls = useDragControls();
  const [currentImage, setCurrentImage] = useState(0);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape');
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const getProjectDetails = (id: string): ProjectDetails & { status?: string } => {
    const defaults = PROJECT_DEFAULTS[id] ?? {
      title: win.title,
      role: 'Software Engineer',
      stack: ['TypeScript', 'React', 'Node.js'],
      desc: 'Proyecto desarrollado bajo estándares de ingeniería de software.',
      githubUrl: 'https://github.com/diego-garcia-chungara',
      images: [],
      highlights: [],
    };

    const jsonFile = files
      .flatMap(folder => folder.children ?? [])
      .find(file => file.name.replace(/\.[^.]+$/, '') === id);

    if (jsonFile?.content) {
      try {
        const parsed = JSON.parse(jsonFile.content);
        return {
          title:     parsed.projectName || defaults.title,
          role:      parsed.role        || defaults.role,
          stack:     parsed.techStack   || defaults.stack,
          desc:      parsed.description || defaults.desc,
          githubUrl: parsed.githubUrl   || defaults.githubUrl,
          images:    parsed.images      || defaults.images,
          highlights: parsed.highlights || defaults.highlights,
          status:    parsed.status,
        };
      } catch {
        return defaults;
      }
    }
    return defaults;
  };

  const project = getProjectDetails(win.id);
  const images = project.images.length > 0 ? project.images : [];
  const badge = STATUS_BADGE[project.status ?? ''];

  useEffect(() => {
    if (!win.isOpen || win.isMinimized || !images[currentImage]) return;
    const img = new Image();
    img.onload = () => setOrientation(img.naturalHeight >= img.naturalWidth ? 'portrait' : 'landscape');
    img.onerror = () => setOrientation('landscape');
    img.src = images[currentImage];
  }, [currentImage, images, win.isOpen, win.isMinimized]);

  if (!win.isOpen || win.isMinimized) return null;

  const nextImage = () => images.length && setCurrentImage(i => (i + 1) % images.length);
  const prevImage = () => images.length && setCurrentImage(i => (i - 1 + images.length) % images.length);

  const carouselDots = (
    <div className="flex items-center justify-center gap-2 pt-2">
      <button onClick={prevImage} className="p-1 rounded hover:bg-white/10 text-[#484f58] hover:text-[#8b949e] transition-colors" aria-label="Anterior">
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>
      <div className="flex gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentImage(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentImage ? 'bg-[var(--accent-color)] w-3' : 'bg-white/20 hover:bg-white/40'}`}
            aria-label={`Imagen ${i + 1}`}
          />
        ))}
      </div>
      <button onClick={nextImage} className="p-1 rounded hover:bg-white/10 text-[#484f58] hover:text-[#8b949e] transition-colors" aria-label="Siguiente">
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  const isMobile = typeof globalThis !== 'undefined' && (globalThis as unknown as { innerWidth: number }).innerWidth < 768;

  return (
    <motion.div
      drag={!win.isMaximized && !isMobile}
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0}
      onClick={() => onFocus(win.id)}
      initial={{ scale: 0.92, opacity: 0, y: 8 }}
      animate={{
        scale: 1, opacity: 1, y: 0,
        x: win.isMaximized ? 0 : undefined,
        borderRadius: win.isMaximized ? 0 : 12,
      }}
      exit={{ scale: 0.92, opacity: 0, y: 8 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      style={{ zIndex: win.zIndex }}
      className={`flex flex-col overflow-hidden bg-[#0d1117] border border-[#21262d] shadow-2xl ${
        win.isMaximized
          ? 'fixed inset-0'
          : 'fixed inset-0 md:absolute md:w-[760px] md:h-[520px] md:left-[14%] md:top-[8%] md:max-w-[92vw] md:max-h-[88vh] md:rounded-xl'
      }`}
    >
      {/* Title bar */}
      <div
        className="window-header flex items-center gap-3 px-4 py-3 bg-[#161b22] border-b border-[#21262d] cursor-grab active:cursor-grabbing select-none shrink-0"
        onPointerDown={(e) => { if (!win.isMaximized) dragControls.start(e); }}
      >
        {/* Traffic lights - hidden on mobile, show only close button */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); onClose(win.id); }}
            className="w-3.5 h-3.5 rounded-full bg-[#ff5f57] hover:brightness-110 transition-all flex items-center justify-center group"
            title="Cerrar"
          >
            <X className="w-2 h-2 text-[#820005] opacity-0 group-hover:opacity-100" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMinimize(win.id); }}
            className="w-3.5 h-3.5 rounded-full bg-[#febc2e] hover:brightness-110 transition-all flex items-center justify-center group hidden md:flex"
            title="Minimizar"
          >
            <Minus className="w-2 h-2 text-[#9a6700] opacity-0 group-hover:opacity-100" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMaximize(win.id); }}
            className="w-3.5 h-3.5 rounded-full bg-[#28c840] hover:brightness-110 transition-all flex items-center justify-center group hidden md:flex"
            title="Pantalla completa"
          >
            <Square className="w-1.5 h-1.5 text-[#006500] opacity-0 group-hover:opacity-100" />
          </button>
        </div>

        <span className="flex-1 text-center text-xs font-medium text-[#8b949e] truncate">
          {project.title}
        </span>

        <span className="text-[10px] font-mono text-[#484f58] shrink-0 hidden md:inline">portfolio/os</span>

        {/* Mobile close button - large touch target */}
        <button
          onClick={(e) => { e.stopPropagation(); onClose(win.id); }}
          className="md:hidden p-2 -mr-1 rounded-lg hover:bg-white/10 text-[#8b949e] transition-colors"
          title="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Window body */}
      <div className="flex-1 bg-[#0d1117] flex flex-col md:flex-row overflow-hidden">

        {/* Left column — project info */}
        <div className="flex-1 p-6 flex flex-col gap-5 overflow-y-auto border-r border-[#21262d]">
          {/* Role + Title */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono text-[#7aa2f7] uppercase tracking-widest">
                {project.role}
              </span>
              {badge && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${badge.color}`}>
                  {badge.label}
                </span>
              )}
            </div>
            <h2 className="text-[#e6edf3] text-lg font-semibold tracking-tight leading-tight">
              {project.title}
            </h2>
          </div>

          {/* Description */}
          <p className="text-[#8b949e] text-xs leading-relaxed">
            {project.desc}
          </p>

          {/* Highlights */}
          {project.highlights && project.highlights.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-[#484f58] uppercase tracking-wider">Destacados</span>
              <ul className="space-y-1">
                {project.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#8b949e]">
                    <span className="text-[var(--accent-color)] mt-0.5 shrink-0">—</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech stack */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-[#484f58] uppercase tracking-wider">Stack</span>
            <div className="flex flex-wrap gap-1.5">
              {project.stack.map((tech, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#161b22] border border-[#30363d] text-xs font-mono text-[#8b949e] hover:border-[#484f58] transition-colors"
                >
                  <TechIcon tech={tech} className="w-3.5 h-3.5 shrink-0" />
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-auto pt-2">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] hover:border-[#484f58] text-[#c9d1d9] text-xs font-medium transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Ver en GitHub
            </a>
          </div>
        </div>

        {/* Right column — gallery */}
        <div className="w-full md:w-64 bg-[#0d1117] p-4 flex flex-col gap-3 shrink-0">
          {/* Gallery header */}
          <div className="flex items-center justify-between text-[10px] font-mono text-[#484f58]">
            <div className="flex items-center gap-1.5">
              <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500" />
              <span>preview</span>
            </div>
            <span>HTTP 200</span>
          </div>

          {/* Image gallery */}
          <div className="flex-1 flex flex-col min-h-0">
            {images.length > 0 ? (
              <div className="flex-1 flex flex-col">
                {orientation === 'portrait' ? (
                  <div className="flex-1 flex flex-col items-center justify-center gap-3 rounded-lg bg-[#161b22] border border-[#21262d] p-4">
                    <div className="relative bg-gradient-to-b from-[#2b2b2b] to-[#111] rounded-[2.6rem] p-[7px] shadow-[0_18px_60px_rgba(0,0,0,0.7)]">
                      {/* Side hardware buttons */}
                      <div className="absolute -left-[2.5px] top-20 w-[3px] h-7 rounded-l-md bg-[#2a2a2a]" />
                      <div className="absolute -left-[2.5px] top-[7.5rem] w-[3px] h-12 rounded-l-md bg-[#2a2a2a]" />
                      <div className="absolute -right-[2.5px] top-24 w-[3px] h-16 rounded-r-md bg-[#2a2a2a]" />
                      <div className="relative w-36 aspect-[9/19] rounded-[2.1rem] overflow-hidden bg-black">
                        {/* Status bar */}
                        <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between pl-6 pr-3 h-6 pt-1 text-white text-[9px] font-semibold pointer-events-none">
                          <span>9:41</span>
                          <span className="flex items-center gap-1 text-white/90">
                            <Signal className="w-3 h-3" />
                            <Wifi className="w-3 h-3" />
                            <Battery className="w-3.5 h-3.5" />
                          </span>
                        </div>
                        {/* Dynamic island */}
                        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-[18px] bg-black rounded-full z-30" />
                        <AnimatePresence mode="wait">
                          <motion.img
                            key={currentImage}
                            src={images[currentImage]}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-full h-full object-cover cursor-zoom-in"
                            onClick={() => setLightboxOpen(true)}
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        </AnimatePresence>
                        {/* Home indicator */}
                        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full bg-white/80 z-30 pointer-events-none" />
                      </div>
                    </div>
                    {images.length > 1 && carouselDots}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col rounded-lg bg-[#161b22] border border-[#21262d] overflow-hidden">
                    <div className="flex items-center gap-1.5 h-6 px-2.5 bg-slate-800/50 border-b border-[#21262d] rounded-t-lg">
                      <span className="w-2 h-2 rounded-full bg-slate-600/80" />
                      <span className="w-2 h-2 rounded-full bg-slate-600/80" />
                      <span className="w-2 h-2 rounded-full bg-slate-600/80" />
                    </div>
                    <div className="flex-1 relative flex items-center justify-center min-h-0 p-3">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={currentImage}
                          src={images[currentImage]}
                          initial={{ opacity: 0, x: 8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          transition={{ duration: 0.2 }}
                          className="max-w-full max-h-44 object-contain rounded cursor-zoom-in"
                          onClick={() => setLightboxOpen(true)}
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </AnimatePresence>
                    </div>
                    {images.length > 1 && (
                      <div className="border-t border-[#21262d] p-2">{carouselDots}</div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 rounded-lg bg-[#161b22] border border-[#21262d] flex flex-col items-center justify-center gap-3 p-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/20 flex items-center justify-center">
                  <Circle className="w-4 h-4 text-[var(--accent-color)]" />
                </div>
                <p className="text-[11px] text-[#484f58] text-center font-mono">
                  Sin preview disponible
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-sm flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLightboxOpen(false)}
          >
            <button
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
              onClick={() => setLightboxOpen(false)}
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  className="absolute left-5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  aria-label="Anterior"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  className="absolute right-5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  aria-label="Siguiente"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <AnimatePresence mode="wait">
              <motion.img
                key={currentImage}
                src={images[currentImage]}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
