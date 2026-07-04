"use client";

import { motion } from "framer-motion";

interface FloatingBlobProps {
  src: string;
  alt: string;
  size: number;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  duration?: number;
  delay?: number;
  rotate?: number;
}

export default function FloatingBlob({
  src, alt, size, top, bottom, left, right, duration = 7, delay = 0, rotate = 0,
}: FloatingBlobProps) {
  return (
    <motion.img
      src={src}
      alt={alt}
      className="floating-blob"
      style={{
        position: "absolute", top, bottom, left, right,
        width: size, height: "auto", zIndex: -1,
        pointerEvents: "none", userSelect: "none",
        filter: "drop-shadow(0 16px 24px oklch(0.4 0.06 280 / 16%))",
      }}
      initial={{ y: 0, rotate }}
      animate={{ y: [0, -22, 0], rotate: [rotate - 3, rotate + 3, rotate - 3] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
