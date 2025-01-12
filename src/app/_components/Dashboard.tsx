"use client";
import { useRef, useState } from "react";
import Webcam from "./Webcam";
import CanvasLayout from "./CanvasLayout";
import SidePanel from "./SidePanel";
import CocoModel from "./CocoModel";

interface HTMLVideoElementWithCaptureStream extends HTMLVideoElement {
  captureStream(): MediaStream;
}

export default function Dashboard() {
  const [isFlipped, setIsFlipped] = useState(false); // State to track whether the video is flipped
  const videoRef = useRef<HTMLVideoElementWithCaptureStream | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]); // To store the recorded data
  const [autoRecordEnabled, setAutoRecordEnabled] = useState<boolean>(false);

  return (
    <>
      <CocoModel
        videoRef={videoRef}
        canvasRef={canvasRef}
        isFlipped={isFlipped}
        autoRecordEnabled={autoRecordEnabled}
        setAutoRecordEnabled={setAutoRecordEnabled}
      />

      <Webcam
        isFlipped={isFlipped}
        setIsFlipped={setIsFlipped}
        videoRef={videoRef}
        streamRef={streamRef}
      />
      <CanvasLayout canvasRef={canvasRef} />
      <SidePanel
        isFlipped={isFlipped}
        setIsFlipped={setIsFlipped}
        mediaRecorderRef={mediaRecorderRef}
        videoRef={videoRef}
        recordedChunksRef={recordedChunksRef}
      />
    </>
  );
}
