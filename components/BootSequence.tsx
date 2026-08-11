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
const TYPING_DURATION = 3.8;

const CHAR_WIDTH = 9.0;
const LINE_HEIGHT = 20;
const TEXT_START_X = 155;
const TEXT_START_Y = 145;

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
  const [isAnimating, setIsAnimating] = useState(false);
  const [unmounted, setUnmounted] = useState(false);
  const [typedChars, setTypedChars] = useState(0);
  const [showCta, setShowCta] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<HTMLDivElement>(null);
  const proxyRef = useRef({ chars: 0 });

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const proxy = proxyRef.current;

    gsap.to(proxy, {
      chars: TOTAL_CHARS,
      duration: TYPING_DURATION,
      ease: 'none',
      onUpdate: () => {
        setTypedChars(Math.floor(proxy.chars));
      },
      onComplete: () => {
        setTypedChars(TOTAL_CHARS);
        setTimeout(() => setShowCta(true), 400);
      },
    });

    return () => {
      gsap.killTweensOf(proxy);
    };
  }, []);

  const triggerTransition = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    gsap.killTweensOf(proxyRef.current);

    if (isMobile || !svgRef.current || !containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut',
        onComplete: () => {
          setUnmounted(true);
          onComplete();
        },
      });
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setUnmounted(true);
        onComplete();
      },
    });

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
  }, [isAnimating, onComplete, isMobile]);

  useEffect(() => {
    if (!showCta) return;

    const handleKey = () => triggerTransition();
    const handleMove = () => triggerTransition();
    const handleTouch = () => triggerTransition();

    window.addEventListener('keydown', handleKey);
    window.addEventListener('mousemove', handleMove, { once: true });
    window.addEventListener('touchstart', handleTouch, { once: true });

    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchstart', handleTouch);
    };
  }, [showCta, triggerTransition]);

  if (!isMounted || unmounted) return null;

  /* ── MOBILE BOOT ─────────────────────────────────── */
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
        onClick={showCta ? triggerTransition : undefined}
        className="fixed inset-0 z-[100] bg-[#0a0e14] flex flex-col items-center justify-center px-6 overflow-hidden"
      >
        {/* Gradient accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#bd93f9]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Terminal card */}
        <div className="w-full max-w-sm bg-[#12151f] border border-[#30363d] rounded-2xl overflow-hidden shadow-2xl">
          {/* Window chrome */}
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[#30363d] bg-[#161b22]">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
            <span className="ml-2 text-[11px] font-mono text-[#8b949e]">portfolio.js</span>
          </div>

          {/* Code content */}
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
                  {isLastVisibleLine && typedChars < TOTAL_CHARS && (
                    <span className="inline-block w-2 h-[1.1em] bg-[#8FCB62] animate-pulse align-middle ml-0.5" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Name + CTA */}
        <div className="mt-8 text-center space-y-1">
          <p className="text-[#f8f8f2] text-lg font-bold tracking-tight">Diego Garcia Chungara</p>
          <p className="text-[#bd93f9] text-sm">Ingeniero de Sistemas · Bolivia 🇧🇴</p>
        </div>

        {showCta && !isAnimating && (
          <button
            onClick={triggerTransition}
            className="mt-8 px-6 py-3 rounded-xl bg-[#bd93f9] text-[#0a0e14] text-sm font-bold shadow-lg shadow-[#bd93f9]/20 active:scale-95 transition-transform"
          >
            Ver portafolio
          </button>
        )}
      </div>
    );
  }

  /* ── DESKTOP BOOT (sin cambios) ──────────────────── */
  return (
    <div
      ref={containerRef}
      onClick={triggerTransition}
      className="fixed inset-0 z-[100] bg-[#0a0e14] h-screen w-screen flex items-center justify-center cursor-pointer overflow-hidden"
    >
      <div
        ref={svgRef}
        className="relative w-[95vw] md:w-[min(92vw,820px)] will-change-transform"
        style={{ transformOrigin: '50% 35%' }}
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

          {typedChars >= TOTAL_CHARS && (
            <g className="animate-pulse">
              <rect
                x={155 + (LINE_STRINGS[LINE_STRINGS.length - 1]?.length ?? 0) * CHAR_WIDTH}
                y={TEXT_START_Y + (LINE_STRINGS.length - 1) * LINE_HEIGHT - 13}
                width={8}
                height={17}
                rx={1}
                fill="#8FCB62"
              />
            </g>
          )}

          {showCta && !isAnimating && (
            <text
              x={TEXT_START_X}
              y={TEXT_START_Y + LINE_STRINGS.length * LINE_HEIGHT + 20}
              fontFamily="ui-sans-serif, system-ui, sans-serif"
              fontSize="11"
              fill="#58a6ff"
              opacity="0.9"
            >
              🡒 Haz clic en la pantalla para continuar...
            </text>
          )}
        </svg>
      </div>
    </div>
  );
}

