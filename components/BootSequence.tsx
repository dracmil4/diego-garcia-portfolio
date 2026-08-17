'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';

interface BootSequenceProps {
  onComplete: () => void;
}

const APOS = '\u2019';
const BULLET = '\u00B7';
const GT = '\u203A';

const LINE_STRINGS = [
  'const developer = {',
  `  name: ${APOS}Diego${APOS},`,
  `  role: ${APOS}Systems Engineer${APOS},`,
  `  level: ${APOS}Junior${APOS},`,
  `  stack: [${APOS}Node.js${APOS}, ${APOS}React Native${APOS}],`,
  `  focus: ${APOS}Backend ${BULLET} QA ${BULLET} Mobile${APOS}`,
  '}',
  '',
  'npm run portfolio',
  `${GT} building something useful...`,
];

const CODE_TO_TYPE = LINE_STRINGS.join('\n');
const TOTAL_CHARS = CODE_TO_TYPE.length;

const AUDIO_SRC = '/audio/keyboard-typing.mp3';
const AUDIO_FALLBACK_DURATION = 19;

const CHAR_WIDTH = 9.0;
const LINE_HEIGHT = 20;
const TEXT_START_X = 155;
const TEXT_START_Y = 145;

const CTA_LABEL = 'Iniciar Tour Guiado \uD83E\uDC82';

type Phase = 'idle' | 'typing' | 'ready' | 'leaving';

/**
 * Resuelve la duración real del clip de audio (para sincronizar la escritura
 * con el sonido). Si aún no hay metadatos, espera o usa un valor por defecto.
 */
function getAudioDuration(
  audio: HTMLAudioElement,
  fallback: number,
): Promise<number> {
  return new Promise((resolve) => {
    let settled = false;

    const pick = () => {
      const d = audio.duration;
      return Number.isFinite(d) && d > 0 ? d : fallback;
    };
    const done = (value: number) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('error', onError);
      resolve(value);
    };
    const onLoaded = () => done(pick());
    const onError = () => done(fallback);

    const timer = setTimeout(() => done(pick()), 1500);

    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      done(audio.duration);
      return;
    }
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('error', onError);
  });
}

function TypedCode({ typedChars }: { typedChars: number }) {
  const lines: string[] = [];
  let remaining = typedChars;

  for (const line of LINE_STRINGS) {
    if (remaining <= 0) break;
    if (remaining >= line.length) {
      lines.push(line);
      remaining -= line.length;
    } else {
      lines.push(line.slice(0, remaining));
      remaining = 0;
    }
  }

  const cursorLineIdx = lines.length - 1;
  const cursorCol = cursorLineIdx >= 0 ? lines[cursorLineIdx].length : 0;
  const cursorX = TEXT_START_X + cursorCol * CHAR_WIDTH;
  const cursorY = TEXT_START_Y + cursorLineIdx * LINE_HEIGHT;

  return (
    <g id="typed-code" fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" fontSize="14">
      {lines.map((line, i) => {
        const isFirst = i === 0;
        const isNpm = line.includes('npm run');
        const isBuild = line.includes('building');
        const isBracket = line === '}';
        const isKey = i >= 1 && i <= 5 && line.includes(':');

        let fill = '#c9d1d9';
        if (isNpm) fill = '#ffa657';
        else if (isBuild) fill = '#8b949e';
        else if (isFirst || isBracket) fill = '#ff7b72';
        else if (isKey) fill = '#79c0ff';

        return (
          <text key={i} x={TEXT_START_X} y={TEXT_START_Y + i * LINE_HEIGHT} fill={fill}>
            {line || '\u00A0'}
          </text>
        );
      })}

      {typedChars < TOTAL_CHARS && (
        <rect
          x={cursorX}
          y={cursorY - 13}
          width={8}
          height={17}
          rx={1}
          fill="#8FCB62"
        />
      )}
    </g>
  );
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [typedChars, setTypedChars] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<HTMLDivElement>(null);
  const mobileCardRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const proxyRef = useRef({ chars: 0 });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const bootStartedRef = useRef(false);

  // Montaje: detecta el dispositivo y precarga el audio (sin reproducirlo,
  // para que sus metadatos estén listos al momento del desbloqueo).
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    setIsMounted(true);

    const audio = new Audio(AUDIO_SRC);
    audio.preload = 'auto';
    audio.volume = 0.4;
    audio.loop = true;
    audioRef.current = audio;

    return () => {
      gsap.killTweensOf(audio);
      audio.pause();
      audio.currentTime = 0;
      audio.src = '';
    };
  }, []);

  // Detiene el audio de tecleo con un fade-out rápido (o lo corta en seco).
  const stopAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    gsap.killTweensOf(audio);
    gsap.to(audio, {
      volume: 0,
      duration: 0.25,
      ease: 'power1.in',
      onComplete: () => {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 0.4;
      },
    });
  }, []);

  // Desbloqueo por interacción del usuario: dispara el audio y la escritura.
  const startTyping = useCallback(() => {
    if (phase !== 'idle' || bootStartedRef.current) return;
    bootStartedRef.current = true;

    // 1. Reproduce el audio de forma síncrona dentro del gesto del usuario
    //    (tecla o clic), lo que autoriza el sonido sin restricciones.
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      const p = audio.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    }

    // 2. Oculta el prompt e inicia la línea de tiempo de GSAP.
    setPhase('typing');

    const runTimeline = (duration: number) => {
      const proxy = proxyRef.current;
      proxy.chars = 0;
      gsap.killTweensOf(proxy);

      gsap.to(proxy, {
        chars: TOTAL_CHARS,
        duration,
        ease: 'none',
        onUpdate: () => {
          setTypedChars(Math.floor(proxy.chars));
        },
        onComplete: () => {
          setTypedChars(TOTAL_CHARS);
          stopAudio();
          setTimeout(() => setPhase('ready'), 250);
        },
      });
    };

    // La escritura dura lo mismo que el clip de audio (19 s aprox.) para que
    // el tecleo suene en tiempo real y termine justo con "useful...".
    if (audio) {
      getAudioDuration(audio, AUDIO_FALLBACK_DURATION).then(runTimeline);
    } else {
      runTimeline(AUDIO_FALLBACK_DURATION);
    }
  }, [phase, stopAudio]);

  // Escucha global: cualquier tecla o clic/toque desbloquea el arranque.
  useEffect(() => {
    if (phase !== 'idle') return;
    const handleUnlock = () => startTyping();
    window.addEventListener('keydown', handleUnlock);
    window.addEventListener('pointerdown', handleUnlock);
    window.addEventListener('touchstart', handleUnlock);
    return () => {
      window.removeEventListener('keydown', handleUnlock);
      window.removeEventListener('pointerdown', handleUnlock);
      window.removeEventListener('touchstart', handleUnlock);
    };
  }, [phase, startTyping]);

  // Fade-in del monitor / terminal al comenzar la escritura.
  useEffect(() => {
    if (phase !== 'typing') return;
    const target = svgRef.current || mobileCardRef.current;
    if (!target) return;
    gsap.fromTo(
      target,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
    );
  }, [phase]);

  // Fade-in suave del botón de transición al IDE.
  useEffect(() => {
    if (phase !== 'ready' || !ctaRef.current) return;
    gsap.fromTo(
      ctaRef.current,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
    );
  }, [phase]);

  // Zoom In masivo hacia el centro de la pantalla y montaje del IDE.
  const triggerTransition = useCallback(() => {
    if (phase !== 'ready') return;
    setPhase('leaving');

    if (isMobile || !svgRef.current || !containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut',
        onComplete,
      });
      return;
    }

    const tl = gsap.timeline({ onComplete });
    tl.to(svgRef.current, {
      scale: 8,
      duration: 1.2,
      ease: 'power3.inOut',
    }, 0);
    tl.to(svgRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut',
    }, 0.9);
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.3,
    }, 1.1);
  }, [phase, isMobile, onComplete]);

  if (!isMounted) return null;

  const showCursorPulse = typedChars >= TOTAL_CHARS;

  /* ── PANTALLA NEGRA + PROMPT (idle) ───────────────── */
  if (phase === 'idle') {
    return (
      <div
        ref={containerRef}
        className="fixed inset-0 z-[100] bg-[#0a0e14] app-full-screen overflow-hidden cursor-pointer select-none"
      >
        <div className="absolute top-8 left-8 md:top-10 md:left-12 font-mono text-sm">
          <span className="text-[#8FCB62]">root@diego:~$</span>
          <span className="text-[#8b949e]"> Press any key to boot system </span>
          <span className="inline-block w-[0.6em] bg-[#8FCB62] text-[#8FCB62] animate-pulse">_</span>
        </div>
      </div>
    );
  }

  /* ── ARRANQUE MÓVIL ──────────────────────────────── */
  if (isMobile) {
    const lines: string[] = [];
    let remaining = typedChars;

    for (const line of LINE_STRINGS) {
      if (remaining <= 0) break;
      if (remaining >= line.length) {
        lines.push(line);
        remaining -= line.length;
      } else {
        lines.push(line.slice(0, remaining));
        remaining = 0;
      }
    }

    return (
      <div
        ref={containerRef}
        className="fixed inset-0 z-[100] bg-[#0a0e14] app-full-screen overflow-hidden"
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 overflow-hidden">
          {/* Acento degradado */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#bd93f9]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Terminal card */}
          <div
            ref={mobileCardRef}
            style={{ opacity: 0 }}
            className="w-full max-w-sm bg-[#12151f] border border-[#30363d] rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[#30363d] bg-[#161b22]">
              <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
              <span className="ml-2 text-[11px] font-mono text-[#8b949e]">portfolio.js</span>
            </div>

            <div className="px-5 py-5 font-mono text-sm leading-7 min-h-[200px]">
              {lines.map((displayLine, i) => {
                const originalLine = LINE_STRINGS[i];
                const isFirst = i === 0;
                const isBracket = originalLine === '}';
                const isKey = i >= 1 && i <= 5 && originalLine.includes(':');
                const isNpm = originalLine.includes('npm run');
                const isBuild = originalLine.includes('building');

                let color = '#c9d1d9';
                if (isNpm) color = '#ffa657';
                else if (isBuild) color = '#8b949e';
                else if (isFirst || isBracket) color = '#ff7b72';
                else if (isKey) color = '#79c0ff';

                const isLastVisibleLine = i === lines.length - 1;

                return (
                  <div key={i} style={{ color }} className="whitespace-pre">
                    {displayLine || ' '}
                    {isLastVisibleLine && !showCursorPulse && (
                      <span className="inline-block w-2 h-[1.1em] bg-[#8FCB62] align-middle ml-0.5" />
                    )}
                  </div>
                );
              })}

              {showCursorPulse && (
                <span className="inline-block w-2 h-[1.1em] bg-[#8FCB62] animate-pulse align-middle ml-0.5" />
              )}
            </div>
          </div>

          {/* Nombre + subtítulo */}
          <div className="mt-8 text-center space-y-1">
            <p className="text-[#f8f8f2] text-lg font-bold tracking-tight">Diego Garcia Chungara</p>
            <p className="text-[#bd93f9] text-sm">Ingeniero de Sistemas · Bolivia 🇧🇴</p>
          </div>

          {phase === 'ready' && (
            <button
              ref={ctaRef}
              onClick={triggerTransition}
              style={{ opacity: 0, fontFamily: "'Inter', sans-serif" }}
              className="mt-8 inline-flex items-center gap-2 rounded-xl border border-[#bd93f9]/50 bg-[#bd93f9]/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-md shadow-lg shadow-black/40 transition-colors hover:border-[#bd93f9] hover:bg-[#bd93f9]/20"
            >
              {CTA_LABEL}
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ── ARRANQUE DESKTOP ────────────────────────────── */
  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-[#0a0e14] app-full-screen overflow-hidden"
    >
      <div className="app-full-screen flex flex-col items-center justify-center">
        <div
          ref={svgRef}
          style={{ opacity: 0, transformOrigin: '50% 35%' }}
          className="relative w-[95vw] md:w-[min(92vw,820px)] will-change-transform"
        >
          <Image
            src="/images/laptop.svg"
            alt="Laptop con código"
            width={1000}
            height={700}
            className="w-full h-auto"
            priority
            unoptimized
          />

          <svg
            viewBox="0 0 1000 700"
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden="true"
          >
            <TypedCode typedChars={typedChars} />

            {showCursorPulse && (
              <g className="animate-pulse">
                <rect
                  x={TEXT_START_X + (LINE_STRINGS[LINE_STRINGS.length - 1]?.length ?? 0) * CHAR_WIDTH}
                  y={TEXT_START_Y + (LINE_STRINGS.length - 1) * LINE_HEIGHT - 13}
                  width={8}
                  height={17}
                  rx={1}
                  fill="#8FCB62"
                />
              </g>
            )}
          </svg>
        </div>

        {phase === 'ready' && (
          <button
            ref={ctaRef}
            onClick={triggerTransition}
            style={{ opacity: 0, fontFamily: "'Inter', sans-serif" }}
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#bd93f9]/50 bg-[#bd93f9]/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-md shadow-lg shadow-black/40 transition-colors hover:border-[#bd93f9] hover:bg-[#bd93f9]/20 hover:shadow-[0_0_30px_rgba(189,147,249,0.35)]"
          >
            {CTA_LABEL}
          </button>
        )}
      </div>
    </div>
  );
}