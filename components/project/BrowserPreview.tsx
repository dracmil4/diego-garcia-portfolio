'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CarouselDots from './CarouselDots';

interface BrowserPreviewProps {
  images: string[];
  currentImage: number;
  onSelect: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onLightbox: () => void;
}

export default function BrowserPreview({ images, currentImage, onSelect, onPrev, onNext, onLightbox }: BrowserPreviewProps) {
  return (
    <div className="flex-1 flex flex-col rounded-lg bg-[#161b22] border border-[#21262d] overflow-hidden">
      <div className="flex items-center gap-1.5 h-6 px-2.5 bg-slate-800/50 border-b border-[#21262d] rounded-t-lg">
        <span className="w-2 h-2 rounded-full bg-slate-600/80" />
        <span className="w-2 h-2 rounded-full bg-slate-600/80" />
        <span className="w-2 h-2 rounded-full bg-slate-600/80" />
      </div>
      <div className="flex-1 relative flex items-center justify-center min-h-0 p-3">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImage}
            src={images[currentImage]}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
            className="max-w-full max-h-44 object-contain rounded cursor-zoom-in"
            onClick={onLightbox}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </AnimatePresence>
      </div>
      {images.length > 1 && (
        <div className="border-t border-[#21262d] p-2">
          <CarouselDots images={images} currentImage={currentImage} onSelect={onSelect} onPrev={onPrev} onNext={onNext} />
        </div>
      )}
    </div>
  );
}