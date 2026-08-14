'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { initialFileSystem } from '../data/fileSystem';
import { FileItem, ThemeType, WindowItem } from '../types';
import Sidebar from '../components/Sidebar';
import Editor from '../components/Editor';
import Terminal from '../components/Terminal';
import FloatingWindow from '../components/FloatingWindow';
import StatusBar from '../components/StatusBar';
import BootSequence from '../components/BootSequence';
import TourOverlay, { TOUR_STEPS } from '../components/TourOverlay';
import MobileLayout from '../components/MobileLayout';

export default function Home() {
  const [showBoot, setShowBoot] = useState<boolean>(true);
  const [bootJustEnded, setBootJustEnded] = useState<boolean>(false);
  const [tourActive, setTourActive] = useState<boolean>(false);
  const [tourStep, setTourStep] = useState<number>(0);
  const [files] = useState<FileItem[]>(initialFileSystem);
  const [openFiles, setOpenFiles] = useState<FileItem[]>([initialFileSystem[0].children![0]]);
  const [activeFile, setActiveFile] = useState<FileItem | null>(initialFileSystem[0].children![0]);
  const [currentDir, setCurrentDir] = useState<string>('/');
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('dracula');
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
  const [isRedAlert, setIsRedAlert] = useState<boolean>(false);
  const [highestZIndex, setHighestZIndex] = useState<number>(50);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const autoTourTriggered = useRef<boolean>(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // OS Floating Windows for all projects
  const [windows, setWindows] = useState<WindowItem[]>([
    {
      id: 'cbn_gestion_eventos',
      title: 'CBN - Sistema de Gestión de Eventos',
      type: 'project',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 10
    },
    {
      id: 'ucb_sistema_becas',
      title: 'UCB - Sistema de Becas Universitarias',
      type: 'project',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 10
    },
    {
      id: 'ucb_sistema_certificados',
      title: 'UCB - Sistema de Certificados Universitarios',
      type: 'project',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 10
    },
    {
      id: 'andean_ux_hobby_match',
      title: 'Hobby Match App Móvil',
      type: 'project',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 10
    }
  ]);

  const handleSelectFile = (file: FileItem) => {
    setActiveFile(file);
    if (!openFiles.some(f => f.id === file.id)) {
      setOpenFiles(prev => [...prev, file]);
    }
  };

  const handleDoubleClickFile = (file: FileItem) => {
    handleSelectFile(file);
    if (file.path.includes('proyectos/')) {
      const projId = file.name.replace(/\.[^/.]+$/, '');
      handleRunProject(projId);
    }
  };

  const handleCloseTab = (fileId: string) => {
    const nextOpenFiles = openFiles.filter(f => f.id !== fileId);
    setOpenFiles(nextOpenFiles);
    if (activeFile?.id === fileId) {
      if (nextOpenFiles.length > 0) {
        setActiveFile(nextOpenFiles[nextOpenFiles.length - 1]);
      } else {
        setActiveFile(null);
      }
    }
  };

  const handleRunProject = (projectName: string) => {
    const cleanName = projectName.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setWindows(prev => prev.map(w => {
      if (w.id.includes(cleanName) || cleanName.includes(w.id)) {
        const newZ = highestZIndex + 1;
        setHighestZIndex(newZ);
        return { ...w, isOpen: true, isMinimized: false, zIndex: newZ };
      }
      return w;
    }));
  };

  const handleCloseWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isOpen: false } : w));
  };

  const handleMinimizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
  };

  const handleMaximizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
  };

  const handleFocusWindow = (id: string) => {
    const newZ = highestZIndex + 1;
    setHighestZIndex(newZ);
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: newZ } : w));
  };

  const handleTriggerSudo = () => {
    setIsRedAlert(true);
    setTimeout(() => {
      setIsRedAlert(false);
    }, 1500);
  };

  const handleBootComplete = () => {
    setShowBoot(false);
    setBootJustEnded(true);
  };

  const handleCloseTour = () => setTourActive(false);

  const handleTourNext = () => {
    if (tourStep >= TOUR_STEPS.length - 1) {
      setTourActive(false);
    } else {
      setTourStep(s => s + 1);
    }
  };

  useEffect(() => {
    if (bootJustEnded && !autoTourTriggered.current) {
      autoTourTriggered.current = true;
      const t = setTimeout(() => {
        setTourActive(true);
        setTourStep(0);
      }, 500);
      return () => clearTimeout(t);
    }
  }, [bootJustEnded]);

  // Theme class mapping
  const getThemeClass = () => {
    switch (currentTheme) {
      case 'dracula': return 'theme-dracula';
      case 'cyberpunk': return 'theme-cyberpunk';
      case 'github': return 'theme-github';
      default: return 'theme-ide';
    }
  };

  return (
    <>
      {showBoot && (
        <BootSequence onComplete={handleBootComplete} />
      )}
      <motion.div
        className={`app-full-screen flex flex-col overflow-hidden ${getThemeClass()} ${isRedAlert ? 'bg-rose-950 glitch-effect' : ''}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: showBoot ? 0 : 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
      {/* Dynamic Theme Inline Variables */}
      <style jsx global>{`
        .theme-ide {
          --bg-color: #1e1e1e;
          --sidebar-bg: #252526;
          --active-color: #37373d;
          --hover-color: #2a2d2e;
          --text-color: #d4d4d4;
          --muted-color: #858585;
          --border-color: #333333;
          --accent-color: #007acc;
        }
        .theme-dracula {
          --bg-color: #282a36;
          --sidebar-bg: #21222c;
          --active-color: #44475a;
          --hover-color: #383a59;
          --text-color: #f8f8f2;
          --muted-color: #6272a4;
          --border-color: #44475a;
          --accent-color: #bd93f9;
        }
        .theme-cyberpunk {
          --bg-color: #0f051d;
          --sidebar-bg: #1a0933;
          --active-color: #2e1159;
          --hover-color: #250d44;
          --text-color: #00ffcc;
          --muted-color: #ff007f;
          --border-color: #ff007f;
          --accent-color: #ff007f;
        }
        .theme-github {
          --bg-color: #ffffff;
          --sidebar-bg: #f6f8fa;
          --active-color: #eaeef2;
          --hover-color: #f0f3f6;
          --text-color: #24292e;
          --muted-color: #586069;
          --border-color: #e1e4e8;
          --accent-color: #0366d6;
        }
      `}</style>

      {/* ── MOBILE LAYOUT ──────────────────────────────────── */}
      {isMobile ? (
        <MobileLayout
          files={files}
          windows={windows}
          isTerminalOpen={isTerminalOpen}
          isDrawerOpen={isDrawerOpen}
          currentDir={currentDir}
          onSelectFile={(f) => { handleSelectFile(f); setIsDrawerOpen(false); }}
          onDoubleClickFile={handleDoubleClickFile}
          onRunProject={handleRunProject}
          onChangeTheme={setCurrentTheme}
          onToggleTerminal={() => setIsTerminalOpen(p => !p)}
          onOpenDrawer={() => setIsDrawerOpen(true)}
          onCloseDrawer={() => setIsDrawerOpen(false)}
          setCurrentDir={setCurrentDir}
          onTriggerSudo={handleTriggerSudo}
          onCloseWindow={handleCloseWindow}
          onMinimizeWindow={handleMinimizeWindow}
          onMaximizeWindow={handleMaximizeWindow}
          onFocusWindow={handleFocusWindow}
        />
      ) : (
        /* ── DESKTOP LAYOUT ──────────────────────────────── */
        <>
          <div className="flex-1 flex overflow-hidden relative">
            <Sidebar
              files={files}
              activeFileId={activeFile?.id || ''}
              onSelectFile={handleSelectFile}
              onDoubleClickFile={handleDoubleClickFile}
              currentDir={currentDir}
              isDrawerOpen={false}
              onCloseDrawer={() => {}}
            />

            <div className="flex-1 flex flex-col overflow-hidden relative">
              <Editor
                openFiles={openFiles}
                activeFile={activeFile}
                onSelectTab={setActiveFile}
                onCloseTab={handleCloseTab}
                onRunProject={handleRunProject}
                onOpenDrawer={() => {}}
              />

              <Terminal
                files={files}
                currentDir={currentDir}
                setCurrentDir={setCurrentDir}
                onOpenFile={handleSelectFile}
                onRunProject={handleRunProject}
                onTriggerTheme={setCurrentTheme}
                onTriggerSudo={handleTriggerSudo}
                isOpen={isTerminalOpen}
                onToggleOpen={() => setIsTerminalOpen(!isTerminalOpen)}
              />

              {windows.map(win => (
                <FloatingWindow
                  key={win.id}
                  window={win}
                  files={files}
                  onClose={handleCloseWindow}
                  onMinimize={handleMinimizeWindow}
                  onMaximize={handleMaximizeWindow}
                  onFocus={handleFocusWindow}
                />
              ))}
            </div>
          </div>

          <StatusBar
            currentTheme={currentTheme}
            onChangeTheme={setCurrentTheme}
            onToggleTerminal={() => setIsTerminalOpen(!isTerminalOpen)}
          />

          {!showBoot && !tourActive && (
            <button
              onClick={() => { setTourActive(true); setTourStep(0); }}
              className="fixed top-4 right-4 z-[70] px-3 py-1.5 rounded-lg bg-[var(--sidebar-bg)] border border-[var(--border-color)] text-[11px] font-mono text-[var(--muted-color)] hover:text-[var(--text-color)] hover:border-[var(--accent-color)] flex items-center gap-2 shadow-lg transition-all"
            >
              <span className="flex items-center justify-center w-4 h-4 rounded text-[var(--accent-color)] text-[10px] font-bold border border-[var(--accent-color)]/40">?</span>
              <span>Tour</span>
            </button>
          )}

          {tourActive && (
            <TourOverlay
              step={tourStep}
              onNext={handleTourNext}
              onClose={handleCloseTour}
              onRequestTerminalOpen={() => setIsTerminalOpen(true)}
            />
          )}
        </>
      )}
      </motion.div>
    </>
  );
}
