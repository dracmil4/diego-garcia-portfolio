'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselDotsProps {
  images: string[];
  currentImage: number;
  onSelect: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function CarouselDots({ images, currentImage, onSelect, onPrev, onNext }: CarouselDotsProps) {
  return (
    <div className="flex items-center justify-center gap-2 pt-2">
      <button onClick={onPrev} className="p-1 rounded hover:bg-white/10 text-[#484f58] hover:text-[#8b949e] transition-colors" aria-label="Anterior">
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>
      <div className="flex gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentImage ? 'bg-[var(--accent-color)] w-3' : 'bg-white/20 hover:bg-white/40'}`}
            aria-label={`Imagen ${i + 1}`}
          />
        ))}
      </div>
      <button onClick={onNext} className="p-1 rounded hover:bg-white/10 text-[#484f58] hover:text-[#8b949e] transition-colors" aria-label="Siguiente">
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}