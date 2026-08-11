import React from 'react';
import { FileItem } from '../types';
import { X, FileText, Play, Code2, Hash, Menu } from 'lucide-react';

interface EditorProps {
  openFiles: FileItem[];
  activeFile: FileItem | null;
  onSelectTab: (file: FileItem) => void;
  onCloseTab: (fileId: string) => void;
  onRunProject?: (projectName: string) => void;
  onOpenDrawer?: () => void;
}

const FILE_ICON_MAP: Record<string, React.ReactNode> = {
  md:      <FileText className="w-3.5 h-3.5 text-[#519aba]" />,
  json:    <Hash className="w-3.5 h-3.5 text-[#e8c86a]" />,
  socials: <Code2 className="w-3.5 h-3.5 text-[#c678dd]" />,
};

export default function Editor({ openFiles, activeFile, onSelectTab, onCloseTab, onRunProject, onOpenDrawer }: EditorProps) {
  if (openFiles.length === 0 || !activeFile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[var(--bg-color)] select-none p-8">
        <div className="max-w-sm w-full text-center space-y-6">
          {/* Icon */}
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[var(--sidebar-bg)] border border-[var(--border-color)] flex items-center justify-center">
            <Code2 className="w-6 h-6 text-[var(--accent-color)]" strokeWidth={1.5} />
          </div>

          {/* Text */}
          <div className="space-y-2">
            <h2 className="text-[var(--text-color)] text-base font-semibold tracking-tight">
              Explorador de portafolio
            </h2>
            <p className="text-[var(--muted-color)] text-xs leading-relaxed">
              Selecciona un archivo del panel lateral para leer el perfil, certificaciones o información de proyectos.
            </p>
          </div>

          {/* Shortcuts */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-[var(--muted-color)] font-mono">
            <kbd className="px-2.5 py-1 rounded bg-[var(--sidebar-bg)] border border-[var(--border-color)]">cat perfil.md</kbd>
            <span className="opacity-40">·</span>
            <kbd className="px-2.5 py-1 rounded bg-[var(--sidebar-bg)] border border-[var(--border-color)]">help</kbd>
          </div>
        </div>
      </div>
    );
  }

  // Syntax highlighting for markdown, json, yaml
  const renderHighlightedContent = (content: string = '', ext?: string, path?: string) => {
    const lines = content.split('\n');
    const isAcademic = path?.includes('universidad');

    return lines.map((line, idx) => {
      let formattedLine = line;
      let lineClass = 'text-[var(--text-color)]';

      if (ext === 'md') {
        // Render markdown images
        const imageMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
        if (imageMatch) {
          const captionLine = lines[idx + 1] || '';
          const captionMatch = captionLine.match(/^\*([^*]+)\*$/);
          return (
            <div key={idx} className="flex items-start gap-0 py-2">
              <span className="text-right pr-5 select-none text-[var(--muted-color)] opacity-40 font-mono text-[11px] shrink-0 w-8">{idx + 1}</span>
              <span className="flex-1">
                {isAcademic ? (
                  <>
                    <img
                      src={imageMatch[2]}
                      alt={imageMatch[1] || 'Foto'}
                      className="w-48 rounded-lg object-cover border border-[var(--border-color)] shadow-lg"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    {captionMatch && (
                      <p className="mt-2.5 text-xs italic text-[var(--muted-color)] font-sans">{captionMatch[1]}</p>
                    )}
                  </>
                ) : (
                  <img
                    src={imageMatch[2]}
                    alt={imageMatch[1] || 'Foto'}
                    className="w-28 h-28 rounded-full object-cover border-2 border-[var(--accent-color)] shadow-lg"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
              </span>
            </div>
          );
        }

        // Skip italic caption lines (rendered together with image)
        if (/^\*[^*]+\*$/.test(line)) return null;

        if (line.startsWith('# '))        lineClass = 'text-[var(--text-color)] font-bold text-lg tracking-tight';
        else if (line.startsWith('## ')) lineClass = 'text-[var(--accent-color)] font-semibold text-sm mt-3 mb-0.5';
        else if (line.startsWith('> '))  lineClass = 'text-[var(--muted-color)] italic border-l-2 border-[var(--border-color)] pl-3';
        else if (line.startsWith('- '))  lineClass = 'text-[var(--text-color)]';

      } else if (ext === 'json') {
        if (line.includes(':')) {
          const colonIdx = line.indexOf(':');
          const keyPart = line.substring(0, colonIdx);
          const valPart = line.substring(colonIdx + 1);
          return (
            <div key={idx} className="table-row font-mono text-xs leading-relaxed">
              <span className="table-cell text-right pr-6 select-none text-[var(--muted-color)] opacity-40 w-8">{idx + 1}</span>
              <span className="table-cell whitespace-pre">
                <span className="text-[#61afef]">{keyPart}</span>:
                <span className="text-[#98c379]">{valPart}</span>
              </span>
            </div>
          );
        }
      } else if (ext === 'yaml') {
        if (line.includes(':') && !line.trim().startsWith('-')) {
          const colonIdx = line.indexOf(':');
          const keyPart = line.substring(0, colonIdx);
          const valPart = line.substring(colonIdx + 1);
          return (
            <div key={idx} className="table-row font-mono text-xs leading-relaxed">
              <span className="table-cell text-right pr-6 select-none text-[var(--muted-color)] opacity-40 w-8">{idx + 1}</span>
              <span className="table-cell whitespace-pre">
                <span className="text-[#61afef]">{keyPart}</span>:
                <span className="text-amber-300">{valPart}</span>
              </span>
            </div>
          );
        }
      }

      if (ext === 'md') {
        return (
          <div key={idx} className="flex items-baseline gap-0 text-xs leading-relaxed font-sans">
            <span className="text-right pr-5 select-none text-[var(--muted-color)] opacity-40 font-mono text-[11px] shrink-0 w-8">{idx + 1}</span>
            <span className={`flex-1 min-w-0 whitespace-pre-wrap break-words ${lineClass}`}>{formattedLine || ' '}</span>
          </div>
        );
      }

      return (
        <div key={idx} className="table-row text-xs leading-relaxed font-mono">
          <span className="table-cell text-right pr-6 select-none text-[var(--muted-color)] opacity-40 w-8 text-[11px]">{idx + 1}</span>
          <span className={`table-cell whitespace-pre ${lineClass}`}>{formattedLine || ' '}</span>
        </div>
      );
    });
  };

  const isProjectFile = activeFile.path.includes('proyectos/');

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--bg-color)] overflow-hidden">
      {/* Tabs */}
      <div className="flex items-center bg-[var(--sidebar-bg)] border-b border-[var(--border-color)] overflow-x-auto select-none">
        {/* Mobile menu button */}
        {onOpenDrawer && (
          <button
            onClick={onOpenDrawer}
            className="md:hidden flex items-center justify-center w-10 h-10 shrink-0 border-r border-[var(--border-color)] text-[var(--muted-color)] hover:text-[var(--text-color)] hover:bg-[var(--hover-color)] transition-colors"
            aria-label="Abrir explorador"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}
        {openFiles.map(file => {
          const isActive = file.id === activeFile.id;
          const icon = FILE_ICON_MAP[file.extension || ''] ?? <FileText className="w-3.5 h-3.5 text-[var(--muted-color)]" />;
          return (
            <div
              key={file.id}
              onClick={() => onSelectTab(file)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs border-r border-[var(--border-color)] cursor-pointer transition-colors group min-w-0 ${
                isActive
                  ? 'bg-[var(--bg-color)] text-[var(--text-color)] border-t-2 border-t-[var(--accent-color)] -mt-px font-medium'
                  : 'text-[var(--muted-color)] hover:bg-[var(--hover-color)] hover:text-[var(--text-color)]'
              }`}
            >
              {icon}
              <span className="truncate max-w-[120px]">{file.name}</span>
              <button
                onClick={(e) => { e.stopPropagation(); onCloseTab(file.id); }}
                className="ml-1 p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-white/10 text-[var(--muted-color)] hover:text-[var(--text-color)] transition-all"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>

      {/* File path + action bar */}
      <div className="px-5 py-2 bg-[var(--bg-color)] border-b border-[var(--border-color)] flex items-center justify-between text-[11px] text-[var(--muted-color)] font-mono">
        <span className="opacity-60">{activeFile.path}</span>
        {isProjectFile && onRunProject && (
          <button
            onClick={() => onRunProject(activeFile.name.replace(/\.[^/.]+$/, ''))}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-[var(--accent-color)]/10 hover:bg-[var(--accent-color)]/20 border border-[var(--accent-color)]/30 text-[var(--accent-color)] font-medium transition-all"
          >
            <Play className="w-3 h-3" fill="currentColor" />
            <span>Ver demo</span>
          </button>
        )}
      </div>

      {/* Editor content */}
      <div className="flex-1 overflow-auto p-6 bg-[var(--bg-color)]">
        <div className={activeFile.extension === 'md' ? 'flex flex-col w-full space-y-0.5' : 'table w-full'}>
          {renderHighlightedContent(activeFile.content, activeFile.extension, activeFile.path)}
        </div>
      </div>
    </div>
  );
}
