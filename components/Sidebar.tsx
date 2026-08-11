import React, { useState, useEffect } from 'react';
import { FileItem } from '../types';
import { ChevronRight, ChevronDown, Folder, FolderOpen, Braces, FileText, Share2, FileType2, Code2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  files: FileItem[];
  activeFileId: string;
  onSelectFile: (file: FileItem) => void;
  onDoubleClickFile: (file: FileItem) => void;
  currentDir: string;
  isDrawerOpen?: boolean;
  onCloseDrawer?: () => void;
}

export default function Sidebar({
  files,
  activeFileId,
  onSelectFile,
  onDoubleClickFile,
  currentDir,
  isDrawerOpen = false,
  onCloseDrawer,
}: SidebarProps) {
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    'sobre-mi':  true,
    'proyectos': true,
    'educacion': true,
    'contacto':  true,
  });

  const toggleFolder = (folderName: string) => {
    setOpenFolders(prev => ({ ...prev, [folderName]: !prev[folderName] }));
  };

  const getFileIcon = (ext?: string) => {
    switch (ext) {
      case 'md':      return <FileText className="w-3.5 h-3.5 text-[#519aba]" />;
      case 'json':    return <Braces className="w-3.5 h-3.5 text-[#e8c86a]" />;
      case 'yaml':    return <FileType2 className="w-3.5 h-3.5 text-[#e37933]" />;
      case 'socials': return <Share2 className="w-3.5 h-3.5 text-[#c678dd]" />;
      default:        return <Code2 className="w-3.5 h-3.5 text-[#8a919a]" />;
    }
  };

  const handleSelectFile = (file: FileItem) => {
    onSelectFile(file);
    onCloseDrawer?.();
  };

  const handleDoubleClickFile = (file: FileItem) => {
    onDoubleClickFile(file);
    onCloseDrawer?.();
  };

  const FOLDER_LABELS: Record<string, string> = {
    'sobre-mi':  'sobre-mi',
    'proyectos': 'proyectos',
    'educacion': 'educacion',
    'contacto':  'contacto',
  };

  return (
    <>
      {/* Desktop Sidebar - hidden on mobile */}
      <aside
        id="tour-sidebar"
        className="hidden md:flex w-60 bg-[var(--sidebar-bg)] border-r border-[var(--border-color)] flex-col h-full select-none text-sm shrink-0 tour-highlight-sidebar"
      >
        <div className="px-4 py-3 border-b border-[var(--border-color)] flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--muted-color)]">
            Explorador
          </span>
          <span className="text-[10px] font-mono text-[var(--accent-color)] opacity-60">
            portafolio/
          </span>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {files.map(folder => {
            const isOpen = openFolders[folder.name];
            return (
              <div key={folder.id} className="mb-0.5">
                <div
                  id={folder.name === 'proyectos' ? 'tour-proyectos' : undefined}
                  onClick={() => toggleFolder(folder.name)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 hover:bg-[var(--hover-color)] cursor-pointer text-[11px] font-medium text-[var(--muted-color)] hover:text-[var(--text-color)] transition-colors group ${folder.name === 'proyectos' ? 'tour-highlight-proyectos' : ''}`}
                >
                  <span className="text-[var(--muted-color)] group-hover:text-[var(--text-color)] transition-colors">
                    {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </span>
                  {isOpen
                    ? <FolderOpen className="w-3.5 h-3.5 text-amber-400/80" />
                    : <Folder className="w-3.5 h-3.5 text-amber-400/60" />
                  }
                  <span>{FOLDER_LABELS[folder.name] ?? folder.name}</span>
                </div>

                {isOpen && folder.children && (
                  <div className="pl-6 space-y-px">
                    {folder.children.map(file => {
                      const isActive = activeFileId === file.id;
                      return (
                        <div
                          key={file.id}
                          onClick={() => onSelectFile(file)}
                          onDoubleClick={() => onDoubleClickFile(file)}
                          title={file.path.includes('proyectos/') ? 'Doble clic para abrir demo del proyecto' : undefined}
                          className={`flex items-center gap-2 px-2.5 py-1 rounded-md cursor-pointer text-[11px] transition-colors ${
                            isActive
                              ? 'bg-[var(--active-color)] text-[var(--text-color)] font-medium border-l border-[var(--accent-color)] pl-[9px]'
                              : 'hover:bg-[var(--hover-color)] text-[var(--muted-color)] hover:text-[var(--text-color)]'
                          }`}
                        >
                          {getFileIcon(file.extension)}
                          <span className="truncate">{file.name}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="px-3 py-3 border-t border-[var(--border-color)] flex items-center gap-2.5">
          <div className="relative shrink-0">
            <img
              src="/images/foto-perfil.png"
              alt="Diego Garcia Chungara"
              className="w-7 h-7 rounded-full border border-[var(--border-color)] object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.visibility = 'hidden'; }}
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-[var(--sidebar-bg)]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] text-[var(--text-color)] font-medium truncate">diego-garcia</div>
            <div className="text-[10px] text-[var(--muted-color)] truncate">Tarija, Bolivia</div>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={onCloseDrawer}
            />
            <motion.aside
              id="tour-sidebar-mobile"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[80vw] max-w-[300px] bg-[var(--sidebar-bg)] z-50 md:hidden flex flex-col shadow-2xl tour-highlight-sidebar"
            >
              <div className="px-4 py-3 border-b border-[var(--border-color)] flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--muted-color)]">
                  Explorador
                </span>
                <button
                  onClick={onCloseDrawer}
                  className="p-1.5 rounded-lg hover:bg-[var(--hover-color)] text-[var(--muted-color)] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-2">
                {files.map(folder => {
                  const isOpen = openFolders[folder.name];
                  return (
                    <div key={folder.id} className="mb-0.5">
                      <div
                        id={folder.name === 'proyectos' ? 'tour-proyectos' : undefined}
                        onClick={() => toggleFolder(folder.name)}
                        className={`flex items-center gap-1.5 px-3 py-2 hover:bg-[var(--hover-color)] cursor-pointer text-[12px] font-medium text-[var(--muted-color)] hover:text-[var(--text-color)] transition-colors group active:bg-[var(--active-color)] ${folder.name === 'proyectos' ? 'tour-highlight-proyectos' : ''}`}
                      >
                        <span className="text-[var(--muted-color)] group-hover:text-[var(--text-color)] transition-colors">
                          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </span>
                        {isOpen
                          ? <FolderOpen className="w-4 h-4 text-amber-400/80" />
                          : <Folder className="w-4 h-4 text-amber-400/60" />
                        }
                        <span>{FOLDER_LABELS[folder.name] ?? folder.name}</span>
                      </div>

                      {isOpen && folder.children && (
                        <div className="pl-6 space-y-px">
                          {folder.children.map(file => {
                            const isActive = activeFileId === file.id;
                            return (
                              <div
                                key={file.id}
                                onClick={() => handleSelectFile(file)}
                                onDoubleClick={() => handleDoubleClickFile(file)}
                                className={`flex items-center gap-2 px-2.5 py-2 rounded-md cursor-pointer text-[12px] transition-colors active:bg-[var(--active-color)] ${
                                  isActive
                                    ? 'bg-[var(--active-color)] text-[var(--text-color)] font-medium border-l border-[var(--accent-color)] pl-[9px]'
                                    : 'hover:bg-[var(--hover-color)] text-[var(--muted-color)] hover:text-[var(--text-color)]'
                                }`}
                              >
                                {getFileIcon(file.extension)}
                                <span className="truncate">{file.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="px-3 py-3 border-t border-[var(--border-color)] flex items-center gap-2.5">
                <div className="relative shrink-0">
                  <img
                    src="/images/foto-perfil.png"
                    alt="Diego Garcia Chungara"
                    className="w-8 h-8 rounded-full border border-[var(--border-color)] object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.visibility = 'hidden'; }}
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[var(--sidebar-bg)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-[var(--text-color)] font-medium truncate">diego-garcia</div>
                  <div className="text-[11px] text-[var(--muted-color)] truncate">Tarija, Bolivia</div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
