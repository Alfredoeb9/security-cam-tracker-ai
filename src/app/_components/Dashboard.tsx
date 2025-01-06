"use client";
import { useRef, useState } from "react";
import Webcam from "./Webcam";
import CanvasLayout from "./CanvasLayout";
import SidePanel from "./SidePanel";
import CocoModel from "./CocoModel";

export default function Dashboard() {
  const [isFlipped, setIsFlipped] = useState(false); // State to track whether the video is flipped
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  return (
    <>
      <CocoModel
        videoRef={videoRef}
        canvasRef={canvasRef}
        isFlipped={isFlipped}
      />

      <Webcam
        isFlipped={isFlipped}
        setIsFlipped={setIsFlipped}
        videoRef={videoRef}
        streamRef={streamRef}
      />
      <CanvasLayout canvasRef={canvasRef} />
      <SidePanel isFlipped={isFlipped} setIsFlipped={setIsFlipped} />
    </>
  );
}
