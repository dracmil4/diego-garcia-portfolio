'use client';

import React from 'react';
import { Mail, ExternalLink, MapPin, Globe, Code2, Database, Shield } from 'lucide-react';
import { SOCIAL_LINKS, DISPLAY_NAME } from '../../data/constants';

const SKILLS = [
  { icon: Globe,    label: 'Web & Móvil',    desc: 'React, React Native, Flutter, Next.js' },
  { icon: Code2,    label: 'Backend',        desc: 'Node.js, TypeScript, Express, APIs REST' },
  { icon: Database, label: 'Bases de datos', desc: 'PostgreSQL, Prisma ORM, optimización' },
  { icon: Shield,   label: 'Calidad (QA)',   desc: 'ISTQB CTFL 4.0, pruebas funcionales' },
];

export default function ProfileSection() {
  return (
    <>
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
    </>
  );
}