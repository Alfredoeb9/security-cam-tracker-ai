"use client";
import { useState } from "react";
import Webcam from "./Webcam";
import CanvasLayout from "./CanvasLayout";
import SidePanel from "./SidePanel";

export default function Dashboard() {
  //   const session = await auth();
  const [isFlipped, setIsFlipped] = useState(false); // State to track whether the video is flipped

  return (
    <>
      <Webcam isFlipped={isFlipped} setIsFlipped={setIsFlipped} />
      <CanvasLayout />
      <SidePanel isFlipped={isFlipped} setIsFlipped={setIsFlipped} />
    </>
  );
}
