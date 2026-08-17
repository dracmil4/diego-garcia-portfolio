'use client';

import React, { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { FileItem, ThemeType, WindowItem } from '../types';
import {
  User, FolderOpen, GraduationCap, Mail, Terminal as TerminalIcon,
  ChevronRight, X, Menu, Briefcase, MessageCircle, Code2,
} from 'lucide-react';
import { SOCIAL_LINKS, DISPLAY_NAME, TERMINAL_USER } from '../data/constants';
import Terminal from './Terminal';
import FloatingWindow from './FloatingWindow';
import ProfileSection from './mobile/ProfileSection';
import ProjectsSection from './mobile/ProjectsSection';
import EducationSection from './mobile/EducationSection';
import ContactSection from './mobile/ContactSection';

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
              <ProfileSection />
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
              <ProjectsSection projects={projects} onDoubleClickFile={onDoubleClickFile} />
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
              <EducationSection certFile={certFile} />
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
              <ContactSection />
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