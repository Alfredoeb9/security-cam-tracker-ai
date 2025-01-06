"use client";

import { type MutableRefObject } from "react";

type CanvasTypes = {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
};

export default function CanvasLayout({ canvasRef }: CanvasTypes) {
  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 h-full w-full object-contain"
    ></canvas>
  );
}
