'use client';

import React from 'react';
import { GraduationCap } from 'lucide-react';
import { FileItem } from '../../types';
import { parseJSON } from '../../utils/parseJSON';

interface EducationSectionProps {
  certFile?: FileItem;
}

interface Certification {
  title: string;
  institution?: string;
  year: string;
  description?: string;
}

export default function EducationSection({ certFile }: EducationSectionProps) {
  const certData = parseJSON<{ certifications: Certification[] }>(certFile?.content);

  return (
    <>
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
    </>
  );
}