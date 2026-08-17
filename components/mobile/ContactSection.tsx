'use client';

import React from 'react';
import { Mail, ExternalLink, Briefcase, Code2, MessageCircle, MapPin } from 'lucide-react';
import { SOCIAL_LINKS } from '../../data/constants';

export default function ContactSection() {
  return (
    <>
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
    </>
  );
}