import React from 'react';
import { ThemeType } from '../types';
import { GitBranch, ShieldCheck, Cpu, Terminal, Palette } from 'lucide-react';

interface StatusBarProps {
  currentTheme: ThemeType;
  onChangeTheme: (theme: ThemeType) => void;
  onToggleTerminal: () => void;
}

const THEME_LABELS: Record<ThemeType, string> = {
  ide:       'VS Code Dark',
  dracula:   'Dracula',
  cyberpunk: 'Cyberpunk',
  github:    'GitHub Light',
};

export default function StatusBar({ currentTheme, onChangeTheme, onToggleTerminal }: StatusBarProps) {
  return (
    <footer className="h-6 bg-[var(--accent-color)] px-3 flex items-center justify-between text-[11px] font-mono text-white/80 select-none z-30 shrink-0">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-white cursor-default">
          <GitBranch className="w-3 h-3" />
          <span>main</span>
        </div>
        <div className="flex items-center gap-1.5 hidden sm:flex">
          <ShieldCheck className="w-3 h-3 text-white/70" />
          <span className="text-white/70">ISTQB CTFL 4.0</span>
        </div>
        <div className="hidden md:flex items-center gap-1.5">
          <Cpu className="w-3 h-3 text-white/70" />
          <span className="text-white/70">Clean Architecture</span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Palette className="w-3 h-3 text-white/70" />
          <select
            value={currentTheme}
            onChange={(e) => onChangeTheme(e.target.value as ThemeType)}
            className="bg-transparent border-none outline-none text-white/80 text-[11px] font-mono cursor-pointer hover:text-white transition-colors"
          >
            {(Object.keys(THEME_LABELS) as ThemeType[]).map(t => (
              <option key={t} value={t} className="bg-[#1e1e1e] text-white">
                {THEME_LABELS[t]}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onToggleTerminal}
          className="flex items-center gap-1 text-white/70 hover:text-white transition-colors"
        >
          <Terminal className="w-3 h-3" />
          <span className="hidden sm:inline">Terminal</span>
        </button>

        <span className="text-white/50 hidden sm:inline">UTF-8</span>
        <span className="text-white/70 hidden sm:inline">TypeScript</span>
      </div>
    </footer>
  );
}
