"use client";

import { useEffect, useRef, useState } from "react";
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
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Cached images can finish loading before React attaches the onLoad
  // listener, so the load event never fires - check .complete on mount too.
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  return (
    <motion.img
      ref={imgRef}
      src={src}
      alt={alt}
      className="floating-blob"
      onLoad={() => setLoaded(true)}
      style={{
        position: "absolute", top, bottom, left, right,
        width: size, height: "auto", zIndex: -1,
        pointerEvents: "none", userSelect: "none",
        filter: "drop-shadow(0 16px 24px oklch(0.4 0.06 280 / 16%))",
      }}
      initial={{ y: 0, rotate, opacity: 0 }}
      animate={{ y: [0, -22, 0], rotate: [rotate - 3, rotate + 3, rotate - 3], opacity: loaded ? 1 : 0 }}
      transition={{
        y: { duration, delay, repeat: Infinity, ease: "easeInOut" },
        rotate: { duration, delay, repeat: Infinity, ease: "easeInOut" },
        opacity: { duration: 0.5, ease: "easeOut" },
      }}
    />
  );
}
