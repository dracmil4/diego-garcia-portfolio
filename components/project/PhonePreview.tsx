'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Signal, Wifi, Battery } from 'lucide-react';
import CarouselDots from './CarouselDots';

interface PhonePreviewProps {
  images: string[];
  currentImage: number;
  onSelect: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onLightbox: () => void;
}

export default function PhonePreview({ images, currentImage, onSelect, onPrev, onNext, onLightbox }: PhonePreviewProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 rounded-lg bg-[#161b22] border border-[#21262d] p-4">
      <div className="relative bg-gradient-to-b from-[#2b2b2b] to-[#111] rounded-[2.6rem] p-[7px] shadow-[0_18px_60px_rgba(0,0,0,0.7)]">
        {/* Side hardware buttons */}
        <div className="absolute -left-[2.5px] top-20 w-[3px] h-7 rounded-l-md bg-[#2a2a2a]" />
        <div className="absolute -left-[2.5px] top-[7.5rem] w-[3px] h-12 rounded-l-md bg-[#2a2a2a]" />
        <div className="absolute -right-[2.5px] top-24 w-[3px] h-16 rounded-r-md bg-[#2a2a2a]" />
        <div className="relative w-36 aspect-[9/19] rounded-[2.1rem] overflow-hidden bg-black">
          {/* Status bar */}
          <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between pl-6 pr-3 h-6 pt-1 text-white text-[9px] font-semibold pointer-events-none">
            <span>9:41</span>
            <span className="flex items-center gap-1 text-white/90">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </span>
          </div>
          {/* Dynamic island */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-[18px] bg-black rounded-full z-30" />
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImage}
              src={images[currentImage]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full object-cover cursor-zoom-in"
              onClick={onLightbox}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </AnimatePresence>
          {/* Home indicator */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full bg-white/80 z-30 pointer-events-none" />
        </div>
      </div>
      {images.length > 1 && (
        <CarouselDots images={images} currentImage={currentImage} onSelect={onSelect} onPrev={onPrev} onNext={onNext} />
      )}
    </div>
  );
}