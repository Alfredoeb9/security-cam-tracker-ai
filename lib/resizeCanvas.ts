import { MutableRefObject } from "react";

export function resizeCanvas(
  canvasRef: MutableRefObject<HTMLCanvasElement | null>,
  videoRef: MutableRefObject<HTMLVideoElement | null>
) {
  const canvas = canvasRef.current;
  const video = videoRef.current;

  if (canvas && video) {
    canvas.width = video.videoWidth ?? 640;
    canvas.height = video.videoHeight ?? 480;
  }
}
