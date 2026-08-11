'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';

export interface TourStepDef {
  title: string;
  message: string;
  targetId: string;
  position: 'right' | 'top';
  highlightClass?: string;
}

export const TOUR_STEPS: TourStepDef[] = [
  {
    title: 'Empieza por aquí',
    message: 'En la barra lateral tienes mis archivos organizados por secciones. Haz clic en cualquiera para leer mi perfil, proyectos, estudios o información de contacto.',
    targetId: 'tour-sidebar',
    position: 'right',
    highlightClass: 'tour-highlight-sidebar',
  },
  {
    title: 'Mis proyectos',
    message: 'Haz doble clic sobre cualquier proyecto para abrir una ventana con todos los detalles: qué hace el sistema, cuál fue mi rol y las tecnologías utilizadas.',
    targetId: 'tour-proyectos',
    position: 'right',
    highlightClass: 'tour-highlight-proyectos',
  },
  {
    title: 'Terminal interactiva',
    message: 'Si eres desarrollador, puedes explorar el portafolio escribiendo comandos aquí. Escribe "help" para ver qué puedes hacer, o "skills --graph" para ver mis habilidades en formato gráfico.',
    targetId: 'tour-terminal',
    position: 'top',
    highlightClass: 'tour-highlight-terminal',
  },
];

interface TourOverlayProps {
  step: number;
  onNext: () => void;
  onClose: () => void;
  onRequestTerminalOpen?: () => void;
}

export default function TourOverlay({ step, onNext, onClose, onRequestTerminalOpen }: TourOverlayProps) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const stepData = TOUR_STEPS[step];
  const isLast = step === TOUR_STEPS.length - 1;
  const originalStylesRef = useRef<Map<HTMLElement, string>>(new Map());

  useEffect(() => {
    if (stepData.targetId === 'tour-terminal' && onRequestTerminalOpen) {
      onRequestTerminalOpen();
    }
  }, [step, stepData.targetId, onRequestTerminalOpen]);

  useEffect(() => {
    const measure = () => {
      const el = document.getElementById(stepData.targetId);
      if (el) {
        const rect = el.getBoundingClientRect();
        setRect(rect);
      } else {
        setRect(null);
      }
    };

    measure();

    const observer = new MutationObserver(() => {
      measure();
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('resize', measure);
      observer.disconnect();
    };
  }, [step, stepData.targetId]);

  const applyHighlight = useCallback(() => {
    originalStylesRef.current.clear();

    TOUR_STEPS.forEach(s => {
      if (!s.highlightClass) return;
      document.querySelectorAll(`.${s.highlightClass}`).forEach(el => {
        const htmlEl = el as HTMLElement;
        const inlineStyle = htmlEl.getAttribute('style') || '';
        originalStylesRef.current.set(htmlEl, inlineStyle);
        htmlEl.classList.remove('tour-highlight-active');
      });
    });

    if (!stepData.highlightClass) return;

    document.querySelectorAll(`.${stepData.highlightClass}`).forEach(el => {
      const htmlEl = el as HTMLElement;
      const inlineStyle = htmlEl.getAttribute('style') || '';
      originalStylesRef.current.set(htmlEl, inlineStyle);
      htmlEl.classList.add('tour-highlight-active');
    });
  }, [stepData.highlightClass]);

  const removeHighlight = useCallback(() => {
    originalStylesRef.current.forEach((originalStyle, el) => {
      el.classList.remove('tour-highlight-active');
      if (originalStyle) {
        el.setAttribute('style', originalStyle);
      } else {
        el.removeAttribute('style');
      }
    });
    originalStylesRef.current.clear();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      applyHighlight();
    }, 50);

    return () => {
      clearTimeout(timer);
      removeHighlight();
    };
  }, [step, applyHighlight, removeHighlight]);

  useEffect(() => {
    const styleId = 'tour-highlight-styles';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.textContent = `
        .tour-highlight-active {
          transition: box-shadow 0.3s ease !important;
        }
      `;
      document.head.appendChild(styleEl);
    }

    return () => {
      if (styleEl && styleEl.parentNode) {
        styleEl.parentNode.removeChild(styleEl);
      }
    };
  }, []);

  const tooltipStyle = (): React.CSSProperties => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    if (!rect) {
      if (isMobile) {
        return {
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'calc(100vw - 32px)',
          maxWidth: 320,
        };
      }
      return {
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 320,
      };
    }

    if (isMobile) {
      return {
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'calc(100vw - 32px)',
        maxWidth: 320,
      };
    }

    if (stepData.position === 'top') {
      return {
        position: 'fixed',
        left: Math.max(rect.left + rect.width / 2 - 160, 12),
        top: Math.max(rect.top - 200, 12),
        width: 320,
      };
    }
    return {
      position: 'fixed',
      left: Math.min(rect.right + 20, window.innerWidth - 340),
      top: rect.top + rect.height / 2 - 80,
      width: 320,
    };
  };

  const arrowStyle = (): React.CSSProperties | null => {
    if (!rect) return null;

    if (stepData.position === 'top') {
      return {
        position: 'fixed',
        left: Math.max(rect.left + rect.width / 2 - 8, 20),
        top: rect.top - 16,
        width: 0,
        height: 0,
        borderLeft: '8px solid transparent',
        borderRight: '8px solid transparent',
        borderTop: '8px solid var(--accent-color)',
      };
    }

    return {
      position: 'fixed',
      left: rect.right + 6,
      top: rect.top + rect.height / 2 - 8,
      width: 0,
      height: 0,
      borderTop: '8px solid transparent',
      borderBottom: '8px solid transparent',
      borderLeft: '8px solid var(--accent-color)',
    };
  };

  return (
    <div className="fixed inset-0 z-[9000] pointer-events-none">
      {/* Spotlight: 4 rects around the highlighted element, leaving it clear */}
      {rect ? (
        <>
          {/* Top */}
          <div
            className="absolute left-0 right-0 bg-black/65 transition-all duration-300"
            style={{ top: 0, height: Math.max(0, rect.top - 6) }}
          />
          {/* Bottom */}
          <div
            className="absolute left-0 right-0 bg-black/65 transition-all duration-300"
            style={{ top: rect.bottom + 6, bottom: 0 }}
          />
          {/* Left */}
          <div
            className="absolute bg-black/65 transition-all duration-300"
            style={{
              top: Math.max(0, rect.top - 6),
              left: 0,
              width: Math.max(0, rect.left - 6),
              height: rect.height + 12,
            }}
          />
          {/* Right */}
          <div
            className="absolute bg-black/65 transition-all duration-300"
            style={{
              top: Math.max(0, rect.top - 6),
              left: rect.right + 6,
              right: 0,
              height: rect.height + 12,
            }}
          />
          {/* Highlight ring on top of the clear element */}
          <div
            className="absolute pointer-events-none transition-all duration-300"
            style={{
              left: rect.left - 6,
              top: rect.top - 6,
              width: rect.width + 12,
              height: rect.height + 12,
              borderRadius: 10,
              outline: '2px solid var(--accent-color)',
              outlineOffset: 2,
              boxShadow: '0 0 0 4px rgba(0,122,204,0.25), 0 0 24px 4px rgba(0,122,204,0.15)',
              zIndex: 82,
            }}
          />
        </>
      ) : (
        /* Fallback: full overlay when no element is targeted */
        <div className="absolute inset-0 bg-black/65" />
      )}

      {rect && (
        <div style={{ ...arrowStyle()!, zIndex: 83 }} />
      )}

      <motion.div
        key={step}
        initial={{ opacity: 0, y: 8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        style={{ ...tooltipStyle(), zIndex: 85 }}
        className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 shadow-2xl font-sans pointer-events-auto"
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-[10px] font-mono text-[var(--accent-color)] uppercase tracking-widest mb-1">
              Paso {step + 1} / {TOUR_STEPS.length}
            </p>
            <h3 className="text-[#e6edf3] text-sm font-semibold tracking-tight">{stepData.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 text-[#484f58] hover:text-[#8b949e] transition-colors ml-2 shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-[#8b949e] text-xs leading-relaxed mb-4">{stepData.message}</p>

        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {TOUR_STEPS.map((_, i) => (
              <span
                key={i}
                className={`block h-1 rounded-full transition-all duration-300 ${
                  i === step ? 'w-4 bg-[var(--accent-color)]' : i < step ? 'w-2 bg-[var(--accent-color)]/40' : 'w-2 bg-[#30363d]'
                }`}
              />
            ))}
          </div>

          <button
            onClick={onNext}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent-color)] hover:opacity-90 text-white font-medium text-xs transition-all"
          >
            {isLast ? 'Finalizar' : 'Siguiente'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
