import React, { useState, useRef, useEffect } from 'react';
import { FileItem, ThemeType } from '../types';
import { Terminal as TerminalIcon, Minus } from 'lucide-react';

interface TerminalProps {
  files: FileItem[];
  currentDir: string;
  setCurrentDir: (dir: string) => void;
  onOpenFile: (file: FileItem) => void;
  onRunProject: (projectName: string) => void;
  onTriggerTheme: (theme: ThemeType) => void;
  onTriggerSudo: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

interface HistoryItem {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'ascii';
  text: string;
}

export default function Terminal({
  files,
  currentDir,
  setCurrentDir,
  onOpenFile,
  onRunProject,
  onTriggerTheme,
  onTriggerSudo,
  isOpen,
  onToggleOpen,
}: TerminalProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([
    { id: '1', type: 'output', text: 'Diego Garcia Chungara — Portafolio v2.5.0' },
    { id: '2', type: 'output', text: 'Escribe "help" para ver los comandos disponibles.' },
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [history, isOpen]);

  const findFileInDir = (pathStr: string, dir: string, fileList: FileItem[]): FileItem | null => {
    let targetPath = pathStr;
    if (!targetPath.startsWith('/')) {
      targetPath = dir === '/' ? `/${targetPath}` : `${dir}/${targetPath}`;
    }
    for (const folder of fileList) {
      if (folder.children) {
        for (const file of folder.children) {
          if (file.path === targetPath || file.name === pathStr || file.path.endsWith(`/${pathStr}`)) {
            return file;
          }
        }
      }
    }
    return null;
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    const newHistory: HistoryItem[] = [
      ...history,
      { id: Date.now().toString(), type: 'input', text: `guest@diego:${currentDir}$ ${cmd}` },
    ];

    // Save command history
    setCmdHistory(prev => [cmd, ...prev.slice(0, 49)]);
    setHistoryIdx(-1);

    const parts = cmd.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case 'help':
        newHistory.push({
          id: (Date.now() + 1).toString(),
          type: 'output',
          text: `Comandos disponibles:
  help              Muestra esta lista
  clear             Limpia la terminal
  ls                Lista archivos del directorio actual
  cd [carpeta]      Navega entre directorios (/sobre-mi, /proyectos, /educacion, /contacto)
  cat [archivo]     Abre el archivo en el editor
  run [proyecto]    Abre la ventana de demo del proyecto
  theme [nombre]    Cambia el tema (dracula, cyberpunk, github, ide)
  skills --graph    Muestra gráfico de habilidades en ASCII
  sudo rm -rf /     No lo intentes`,
        });
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      case 'ls': {
        let itemsToShow: FileItem[] = [];
        if (currentDir === '/') {
          itemsToShow = files;
        } else {
          const folder = files.find(f => f.path === currentDir);
          itemsToShow = folder?.children || [];
        }
        const listText = itemsToShow
          .map(i => `${i.type === 'folder' ? 'drwxr-xr-x' : '-rw-r--r--'}  ${i.name}`)
          .join('\n');
        newHistory.push({
          id: (Date.now() + 1).toString(),
          type: 'output',
          text: listText || '(directorio vacío)',
        });
        break;
      }

      case 'cd': {
        const targetDir = args[0];
        if (!targetDir || targetDir === '/' || targetDir === '~') {
          setCurrentDir('/');
        } else if (targetDir === '..') {
          setCurrentDir('/');
        } else {
          const cleaned = targetDir.startsWith('/') ? targetDir : `/${targetDir}`;
          const foundFolder = files.find(f => f.path === cleaned || f.name === targetDir);
          if (foundFolder) {
            setCurrentDir(foundFolder.path);
          } else {
            newHistory.push({
              id: (Date.now() + 1).toString(),
              type: 'error',
              text: `cd: no such directory: ${targetDir}`,
            });
          }
        }
        break;
      }

      case 'cat': {
        const fileName = args[0];
        if (!fileName) {
          newHistory.push({ id: (Date.now() + 1).toString(), type: 'error', text: 'cat: especifica un archivo. Ej: cat perfil.md' });
          break;
        }
        const file = findFileInDir(fileName, currentDir, files);
        if (file) {
          onOpenFile(file);
          newHistory.push({
            id: (Date.now() + 1).toString(),
            type: 'success',
            text: `Abierto en editor: ${file.path}`,
          });
        } else {
          newHistory.push({ id: (Date.now() + 1).toString(), type: 'error', text: `cat: archivo no encontrado: ${fileName}` });
        }
        break;
      }

      case 'run': {
        const projName = args[0];
        if (!projName) {
          newHistory.push({
            id: (Date.now() + 1).toString(),
            type: 'output',
            text: `Proyectos disponibles:\n  cbn_gestion_eventos\n  ucb_sistema_becas\n  ucb_sistema_certificados\n  andean_ux_hobby_match`,
          });
          break;
        }
        onRunProject(projName);
        newHistory.push({ id: (Date.now() + 1).toString(), type: 'success', text: `Abriendo demo: ${projName}` });
        break;
      }

      case 'theme': {
        const themeName = args[0] as ThemeType;
        if (['ide', 'dracula', 'cyberpunk', 'github'].includes(themeName)) {
          onTriggerTheme(themeName);
          newHistory.push({ id: (Date.now() + 1).toString(), type: 'success', text: `Tema cambiado a: ${themeName}` });
        } else {
          newHistory.push({ id: (Date.now() + 1).toString(), type: 'error', text: `Temas disponibles: ide, dracula, cyberpunk, github` });
        }
        break;
      }

      case 'skills':
        if (args[0] === '--graph') {
          newHistory.push({
            id: (Date.now() + 1).toString(),
            type: 'ascii',
            text: `HABILIDADES — Diego Garcia Chungara

TypeScript / React / RN  [██████████████████] 95%
Node.js / Clean Arch.    [█████████████████ ] 90%
Flutter (BLoC) / Mobile  [█████████████████ ] 91%
PostgreSQL & PostGIS      [██████████████    ] 85%
ISTQB CTFL 4.0 / QA      [████████████████  ] 88%`,
          });
        } else {
          newHistory.push({ id: (Date.now() + 1).toString(), type: 'output', text: 'Uso: skills --graph' });
        }
        break;

      case 'sudo':
        if (cmd === 'sudo rm -rf /') {
          onTriggerSudo();
          newHistory.push({ id: (Date.now() + 1).toString(), type: 'error', text: 'Permiso denegado. Sistema protegido por Clean Architecture.' });
        } else {
          newHistory.push({ id: (Date.now() + 1).toString(), type: 'error', text: 'sudo: comando no autorizado' });
        }
        break;

      default:
        newHistory.push({
          id: (Date.now() + 1).toString(),
          type: 'error',
          text: `zsh: command not found: ${command}`,
        });
    }

    setHistory(newHistory);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newIdx = Math.min(historyIdx + 1, cmdHistory.length - 1);
      setHistoryIdx(newIdx);
      if (cmdHistory[newIdx]) setInput(cmdHistory[newIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newIdx = Math.max(historyIdx - 1, -1);
      setHistoryIdx(newIdx);
      setInput(newIdx === -1 ? '' : cmdHistory[newIdx]);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggleOpen}
        className="fixed bottom-16 md:bottom-4 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-4 z-40 px-4 py-2.5 md:px-3 md:py-2 rounded-full md:rounded-lg bg-[var(--sidebar-bg)] border border-[var(--border-color)] text-xs font-mono shadow-xl flex items-center gap-2 hover:border-[var(--accent-color)] transition-all text-[var(--muted-color)] hover:text-[var(--text-color)]"
      >
        <TerminalIcon className="w-4 h-4 text-[var(--accent-color)]" />
        <span>{'>'} Terminal</span>
      </button>
    );
  }

  return (
    <div
      id="tour-terminal"
      className="fixed bottom-0 left-0 right-0 h-[45vh] md:h-56 md:relative bg-[var(--bg-color)] border-t border-[var(--border-color)] flex flex-col font-mono text-xs z-50 tour-highlight-terminal"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--sidebar-bg)] border-b border-[var(--border-color)] select-none">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-3.5 h-3.5 text-[var(--accent-color)]" />
          <span className="text-[var(--muted-color)] text-[11px]">bash</span>
        </div>
        <button
          onClick={onToggleOpen}
          className="p-1 rounded hover:bg-white/10 text-[var(--muted-color)] hover:text-[var(--text-color)] transition-colors"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* History */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 select-text">
        {history.map(item => (
          <div key={item.id} className="whitespace-pre-wrap leading-relaxed">
            {item.type === 'input'   && <span className="text-[#7aa2f7]">{item.text}</span>}
            {item.type === 'output'  && <span className="text-[var(--muted-color)]">{item.text}</span>}
            {item.type === 'success' && <span className="text-[#9ece6a]">{item.text}</span>}
            {item.type === 'error'   && <span className="text-[#f7768e]">{item.text}</span>}
            {item.type === 'ascii'   && <span className="text-[#e0af68] font-mono text-[11px] block">{item.text}</span>}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleCommand}
        className="px-3 py-2 bg-[var(--sidebar-bg)] border-t border-[var(--border-color)] flex items-center gap-2"
      >
        <span className="text-[#7aa2f7] shrink-0">guest@diego:{currentDir}$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none font-mono text-[var(--text-color)] text-xs caret-[var(--accent-color)]"
          placeholder="help"
          autoComplete="off"
          spellCheck={false}
        />
      </form>
    </div>
  );
}
