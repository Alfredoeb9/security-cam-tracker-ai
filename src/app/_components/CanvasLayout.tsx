"use client";

import { useRef } from "react";

export default function CanvasLayout() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 h-full w-full object-contain"
    ></canvas>
  );
}
