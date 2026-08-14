'use client';

import React, { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { FileItem, ThemeType, WindowItem } from '../types';
import {
  User, FolderOpen, GraduationCap, Mail, Terminal as TerminalIcon,
  ChevronRight, X, Play, ExternalLink, Menu,
  Code2, Shield, Database, Globe, Briefcase, MapPin,
  MessageCircle,
} from 'lucide-react';
import { SOCIAL_LINKS, DISPLAY_NAME, TERMINAL_USER } from '../data/constants';
import Terminal from './Terminal';
import FloatingWindow from './FloatingWindow';

interface MobileLayoutProps {
  files: FileItem[];
  windows: WindowItem[];
  isTerminalOpen: boolean;
  isDrawerOpen: boolean;
  currentDir: string;
  onSelectFile: (f: FileItem) => void;
  onDoubleClickFile: (f: FileItem) => void;
  onRunProject: (name: string) => void;
  onChangeTheme: (t: ThemeType) => void;
  onToggleTerminal: () => void;
  onOpenDrawer: () => void;
  onCloseDrawer: () => void;
  setCurrentDir: (d: string) => void;
  onTriggerSudo: () => void;
  onCloseWindow: (id: string) => void;
  onMinimizeWindow: (id: string) => void;
  onMaximizeWindow: (id: string) => void;
  onFocusWindow: (id: string) => void;
}

// Bottom nav sections
const NAV_ITEMS = [
  { id: 'perfil',    label: 'Perfil',    Icon: User },
  { id: 'proyectos', label: 'Proyectos', Icon: FolderOpen },
  { id: 'educacion', label: 'Estudios',  Icon: GraduationCap },
  { id: 'contacto',  label: 'Contacto',  Icon: Mail },
];

// Skills cards
const SKILLS = [
  { icon: Globe,    label: 'Web & Móvil',    desc: 'React, React Native, Flutter, Next.js' },
  { icon: Code2,    label: 'Backend',        desc: 'Node.js, TypeScript, Express, APIs REST' },
  { icon: Database, label: 'Bases de datos', desc: 'PostgreSQL, Prisma ORM, optimización' },
  { icon: Shield,   label: 'Calidad (QA)',   desc: 'ISTQB CTFL 4.0, pruebas funcionales' },
];

// Parse JSON safely
function parseJSON<T>(content?: string): T | null {
  try { return content ? JSON.parse(content) : null; } catch { return null; }
}

export default function MobileLayout({
  files, windows, isTerminalOpen, isDrawerOpen, currentDir,
  onSelectFile, onDoubleClickFile, onRunProject, onChangeTheme,
  onToggleTerminal, onOpenDrawer, onCloseDrawer,
  setCurrentDir, onTriggerSudo,
  onCloseWindow, onMinimizeWindow, onMaximizeWindow, onFocusWindow,
}: MobileLayoutProps) {
  const [activeSection, setActiveSection] = useState('perfil');

  const proyectosFolder = files.find(f => f.name === 'proyectos');
  const educFolder      = files.find(f => f.name === 'educacion');
  const projects        = proyectosFolder?.children ?? [];
  const certFile        = educFolder?.children?.find(f => f.name === 'certificaciones.json');

  const certData = parseJSON<{
    certifications: { title: string; institution?: string; year: string; description?: string }[];
  }>(certFile?.content);

  // Navigate to section and close drawer
  const goToSection = (id: string) => {
    setActiveSection(id);
    onCloseDrawer();
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">

      {/* ── HEADER ──────────────────────────────── */}
      <header className="flex items-center justify-between px-4 h-12 border-b border-[var(--border-color)] bg-[var(--sidebar-bg)] shrink-0 z-10">
        <button
          onClick={onOpenDrawer}
          className="p-2 rounded-lg hover:bg-[var(--hover-color)] text-[var(--muted-color)] hover:text-[var(--text-color)] transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--accent-color)] animate-pulse" />
          <span className="text-xs font-mono text-[var(--muted-color)]">{TERMINAL_USER}</span>
        </div>

        <button
          onClick={onToggleTerminal}
          className={`p-2 rounded-lg transition-colors ${
            isTerminalOpen
              ? 'text-[var(--accent-color)] bg-[var(--active-color)]'
              : 'text-[var(--muted-color)] hover:bg-[var(--hover-color)]'
          }`}
          aria-label="Terminal"
        >
          <TerminalIcon className="w-5 h-5" />
        </button>
      </header>

      {/* ── DRAWER (Navigation menu) ─────────────── */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseDrawer}
              className="fixed inset-0 bg-black/60 z-[100]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed top-0 left-0 bottom-0 w-[72vw] max-w-[260px] z-[101] bg-[var(--sidebar-bg)] border-r border-[var(--border-color)] flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-4 h-12 border-b border-[var(--border-color)] shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[var(--accent-color)]" />
                  <span className="text-xs font-mono font-semibold text-[var(--text-color)]">{TERMINAL_USER}</span>
                </div>
                <button onClick={onCloseDrawer} className="p-1.5 rounded hover:bg-[var(--hover-color)] text-[var(--muted-color)]">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Nav sections */}
              <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted-color)] px-2 mb-3">Secciones</p>
                {NAV_ITEMS.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    onClick={() => goToSection(id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      activeSection === id
                        ? 'bg-[var(--active-color)] text-[var(--text-color)]'
                        : 'text-[var(--muted-color)] hover:bg-[var(--hover-color)] hover:text-[var(--text-color)]'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {label}
                    {activeSection === id && (
                      <ChevronRight className="w-3.5 h-3.5 ml-auto text-[var(--accent-color)]" />
                    )}
                  </button>
                ))}

                <div className="pt-4 pb-1">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted-color)] px-2 mb-3">Contacto rápido</p>
                </div>

                <a
                  href={`mailto:${SOCIAL_LINKS.email}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--muted-color)] hover:bg-[var(--hover-color)] hover:text-[var(--text-color)] transition-colors"
                >
                  <Mail className="w-4 h-4 shrink-0 text-[var(--accent-color)]" />
                  Email
                </a>
                <a
                  href={SOCIAL_LINKS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--muted-color)] hover:bg-[var(--hover-color)] hover:text-[var(--text-color)] transition-colors"
                >
                  <MessageCircle className="w-4 h-4 shrink-0 text-emerald-500" />
                  WhatsApp
                </a>
                <a
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--muted-color)] hover:bg-[var(--hover-color)] hover:text-[var(--text-color)] transition-colors"
                >
                  <Briefcase className="w-4 h-4 shrink-0 text-[var(--accent-color)]" />
                  LinkedIn
                </a>
                <a
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--muted-color)] hover:bg-[var(--hover-color)] hover:text-[var(--text-color)] transition-colors"
                >
                  <Code2 className="w-4 h-4 shrink-0 text-[var(--accent-color)]" />
                  GitHub
                </a>
              </div>

              {/* Drawer footer */}
              <div className="px-4 py-3 border-t border-[var(--border-color)]">
                <p className="text-[10px] text-[var(--muted-color)] font-mono text-center">{DISPLAY_NAME}</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── MAIN SCROLL CONTENT ─────────────────── */}
      <div className="flex-1 overflow-y-auto bg-[var(--bg-color)]">
        <AnimatePresence mode="wait">

          {/* ── PERFIL ──── */}
          {activeSection === 'perfil' && (
            <motion.div
              key="perfil"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="px-5 py-8 space-y-8"
            >
              {/* Hero */}
              <div className="text-center space-y-4">
                <div className="relative inline-block">
                  <img
                    src="/images/foto-perfil.png"
                    alt={DISPLAY_NAME}
                    className="w-24 h-24 rounded-full object-cover border-2 border-[var(--accent-color)] shadow-lg mx-auto"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[var(--bg-color)]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[var(--text-color)] tracking-tight">Diego Garcia</h1>
                  <p className="text-sm text-[var(--accent-color)] mt-0.5 font-medium">Ingeniero de Sistemas</p>
                  <div className="flex items-center justify-center gap-1.5 mt-2 text-xs text-[var(--muted-color)]">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Tarija, Bolivia 🇧🇴</span>
                  </div>
                </div>
                <p className="text-sm text-[var(--muted-color)] leading-relaxed max-w-xs mx-auto">
                  Creo software que resuelve problemas reales — sistemas que la gente usa sin frustrarse, y que los equipos pueden mejorar sin complicaciones.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <a
                    href={`mailto:${SOCIAL_LINKS.email}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent-color)] text-white text-sm font-medium"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Contactar
                  </a>
                  <a
                    href={SOCIAL_LINKS.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-color)] text-sm font-medium hover:bg-[var(--hover-color)] transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    GitHub
                  </a>
                </div>
              </div>

              {/* Skills cards */}
              <div>
                <h2 className="text-xs font-mono uppercase tracking-widest text-[var(--muted-color)] mb-4">Lo que hago</h2>
                <div className="grid grid-cols-2 gap-3">
                  {SKILLS.map(({ icon: Icon, label, desc }) => (
                    <div key={label} className="p-3.5 rounded-xl bg-[var(--sidebar-bg)] border border-[var(--border-color)] space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-[var(--accent-color)]/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-[var(--accent-color)]" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[var(--text-color)]">{label}</p>
                        <p className="text-[10px] text-[var(--muted-color)] mt-0.5 leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* How I work */}
              <div className="p-4 rounded-xl bg-[var(--sidebar-bg)] border border-[var(--border-color)]">
                <h2 className="text-xs font-mono uppercase tracking-widest text-[var(--muted-color)] mb-3">Cómo trabajo</h2>
                <p className="text-sm text-[var(--text-color)] leading-relaxed">
                  Escribo código ordenado — que otro desarrollador pueda entender y modificar sin necesitarme presente. Me comunico bien con personas técnicas y no técnicas.
                </p>
              </div>
            </motion.div>
          )}

          {/* ── PROYECTOS ── */}
          {activeSection === 'proyectos' && (
            <motion.div
              key="proyectos"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="px-5 py-8"
            >
              <h2 className="text-xs font-mono uppercase tracking-widest text-[var(--muted-color)] mb-6">Proyectos</h2>
              <div className="space-y-4">
                {projects.map(proj => {
                  const data = parseJSON<{
                    projectName: string;
                    role: string;
                    description: string;
                    techStack: string[];
                    highlights: string[];
                    status: string;
                  }>(proj.content);
                  if (!data) return null;
                  return (
                    <div key={proj.id} className="rounded-xl bg-[var(--sidebar-bg)] border border-[var(--border-color)] overflow-hidden">
                      <div className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-semibold text-[var(--text-color)] leading-tight">{data.projectName}</h3>
                            <p className="text-xs text-[var(--accent-color)] mt-0.5">{data.role}</p>
                          </div>
                          <span className="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--active-color)] text-[var(--muted-color)] border border-[var(--border-color)]">
                            {data.status}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--muted-color)] leading-relaxed">{data.description}</p>
                        {data.highlights?.length > 0 && (
                          <ul className="space-y-1.5">
                            {data.highlights.map((h, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-[var(--text-color)]">
                                <ChevronRight className="w-3.5 h-3.5 text-[var(--accent-color)] shrink-0 mt-0.5" />
                                {h}
                              </li>
                            ))}
                          </ul>
                        )}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {data.techStack?.map(t => (
                            <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--accent-color)]/10 text-[var(--accent-color)] border border-[var(--accent-color)]/20">
                              {t}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={() => onDoubleClickFile(proj)}
                          className="w-full mt-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-[var(--border-color)] text-xs text-[var(--muted-color)] hover:bg-[var(--hover-color)] hover:text-[var(--text-color)] transition-colors"
                        >
                          <Play className="w-3 h-3" fill="currentColor" />
                          Ver detalles del proyecto
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ── EDUCACIÓN ── */}
          {activeSection === 'educacion' && (
            <motion.div
              key="educacion"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="px-5 py-8 space-y-6"
            >
              <h2 className="text-xs font-mono uppercase tracking-widest text-[var(--muted-color)]">Educación</h2>
              <div className="p-4 rounded-xl bg-[var(--sidebar-bg)] border border-[var(--border-color)] space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent-color)]/10 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5 text-[var(--accent-color)]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text-color)] leading-tight">Licenciatura en Ingeniería de Sistemas</h3>
                    <p className="text-xs text-[var(--accent-color)] mt-0.5">Universidad Católica Boliviana &ldquo;San Pablo&rdquo;</p>
                    <p className="text-xs text-[var(--muted-color)] mt-0.5">Tarija, Bolivia · Titulado</p>
                  </div>
                </div>
                <p className="text-xs text-[var(--muted-color)] leading-relaxed">
                  Énfasis en desarrollo de software, bases de datos, redes y calidad. Proyectos integradores en equipo con roles definidos y entregables reales.
                </p>
              </div>

              {certData?.certifications && (
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--muted-color)] mb-3">Certificaciones</h3>
                  <div className="space-y-2.5">
                    {certData.certifications.map((c, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--sidebar-bg)] border border-[var(--border-color)]">
                        <span className="text-xs font-mono text-[var(--accent-color)] shrink-0 mt-0.5 w-8">{c.year.slice(-4)}</span>
                        <div>
                          <p className="text-xs font-medium text-[var(--text-color)]">{c.title}</p>
                          {c.description && <p className="text-[10px] text-[var(--muted-color)] mt-0.5 leading-relaxed">{c.description}</p>}
                          {c.institution && <p className="text-[10px] text-[var(--muted-color)]/70 mt-0.5">{c.institution}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ── CONTACTO ── */}
          {activeSection === 'contacto' && (
            <motion.div
              key="contacto"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="px-5 py-8 space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-[var(--text-color)]">Hablemos</h2>
                <p className="text-sm text-[var(--muted-color)] leading-relaxed max-w-xs mx-auto">
                  Estoy disponible para entrevistas, llamadas o simplemente preguntas sobre mi experiencia.
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href={`mailto:${SOCIAL_LINKS.email}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[var(--sidebar-bg)] border border-[var(--border-color)] hover:border-[var(--accent-color)] transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent-color)]/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[var(--accent-color)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[var(--muted-color)] uppercase tracking-wide">Email</p>
                    <p className="text-sm text-[var(--text-color)] truncate">{SOCIAL_LINKS.email}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[var(--muted-color)] group-hover:text-[var(--accent-color)] transition-colors shrink-0" />
                </a>

                <a
                  href={SOCIAL_LINKS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-[var(--sidebar-bg)] border border-[var(--border-color)] hover:border-emerald-500 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[var(--muted-color)] uppercase tracking-wide">WhatsApp</p>
                    <p className="text-sm text-[var(--text-color)] truncate">+591 60265541</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[var(--muted-color)] group-hover:text-emerald-500 transition-colors shrink-0" />
                </a>

                <a
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-[var(--sidebar-bg)] border border-[var(--border-color)] hover:border-[var(--accent-color)] transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent-color)]/10 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-[var(--accent-color)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[var(--muted-color)] uppercase tracking-wide">LinkedIn</p>
                    <p className="text-sm text-[var(--text-color)] truncate">linkedin.com/in/diego-garcia-ch</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[var(--muted-color)] group-hover:text-[var(--accent-color)] transition-colors shrink-0" />
                </a>

                <a
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-[var(--sidebar-bg)] border border-[var(--border-color)] hover:border-[var(--accent-color)] transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent-color)]/10 flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-[var(--accent-color)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[var(--muted-color)] uppercase tracking-wide">GitHub</p>
                    <p className="text-sm text-[var(--text-color)] truncate">github.com/dracmil4</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[var(--muted-color)] group-hover:text-[var(--accent-color)] transition-colors shrink-0" />
                </a>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--sidebar-bg)] border border-[var(--border-color)]">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-[var(--muted-color)] uppercase tracking-wide">Ubicación</p>
                    <p className="text-sm text-[var(--text-color)]">Tarija, Bolivia 🇧🇴</p>
                    <p className="text-xs text-[var(--muted-color)] mt-0.5">Disponible para trabajo remoto</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── TERMINAL (bottom sheet funcional) ─────── */}
      <AnimatePresence>
        {isTerminalOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 220, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="shrink-0 overflow-hidden border-t border-[var(--border-color)]"
            id="tour-terminal"
          >
            {/* Terminal with real handlers so cd, ls, etc. work */}
            <Terminal
              files={files}
              currentDir={currentDir}
              setCurrentDir={setCurrentDir}
              onOpenFile={onSelectFile}
              onRunProject={onRunProject}
              onTriggerTheme={onChangeTheme}
              onTriggerSudo={onTriggerSudo}
              isOpen={true}
              onToggleOpen={onToggleTerminal}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── BOTTOM NAV ──────────────────────────── */}
      <nav className="shrink-0 border-t border-[var(--border-color)] bg-[var(--sidebar-bg)] flex items-stretch relative safe-bottom">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-[10px] font-medium transition-colors relative ${
                isActive
                  ? 'text-[var(--accent-color)]'
                  : 'text-[var(--muted-color)] hover:text-[var(--text-color)]'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[var(--accent-color)] rounded-b-full" />
              )}
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Floating project windows */}
      {windows.map(win => (
        <FloatingWindow
          key={win.id}
          window={win}
          files={files}
          onClose={onCloseWindow}
          onMinimize={onMinimizeWindow}
          onMaximize={onMaximizeWindow}
          onFocus={onFocusWindow}
        />
      ))}
    </div>
  );
}
