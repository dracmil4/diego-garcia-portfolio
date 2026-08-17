'use client';

import React from 'react';
import { ChevronRight, Play } from 'lucide-react';
import { FileItem } from '../../types';
import { parseJSON } from '../../utils/parseJSON';

interface ProjectsSectionProps {
  projects: FileItem[];
  onDoubleClickFile: (file: FileItem) => void;
}

interface ProjectData {
  projectName: string;
  role: string;
  description: string;
  techStack: string[];
  highlights: string[];
  status: string;
}

export default function ProjectsSection({ projects, onDoubleClickFile }: ProjectsSectionProps) {
  return (
    <>
      <h2 className="text-xs font-mono uppercase tracking-widest text-[var(--muted-color)] mb-6">Proyectos</h2>
      <div className="space-y-4">
        {projects.map(proj => {
          const data = parseJSON<ProjectData>(proj.content);
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
    </>
  );
}