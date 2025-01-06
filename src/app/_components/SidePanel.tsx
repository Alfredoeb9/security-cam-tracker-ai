"use client";

import { type Dispatch, type SetStateAction, useState } from "react";
import RenderFeatureHighlightsSection from "./RenderFeatureHighlightsSection";

type SidePanelTypes = {
  isFlipped: SetStateAction<boolean>;
  setIsFlipped: Dispatch<SetStateAction<boolean>>;
};

export default function SidePanel({ isFlipped, setIsFlipped }: SidePanelTypes) {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [autoRecordEnabled, setAutoRecordEnabled] = useState<boolean>(false);
  // Function to toggle the horizontal flip
  const toggleFlip = () => {
    setIsFlipped((prevState) => !prevState);
  };

  const handleScreenshot = () => {
    console.log("screenshot taken");
  };

  const handleRecordSession = () => {
    setIsRecording((prev) => !prev);
    console.log("recording starting");
  };

  const handleAutoRecord = () => {
    if (autoRecordEnabled) {
      setAutoRecordEnabled(false);
      alert("Autorecord disabled");
    } else {
      setAutoRecordEnabled(true);
      alert("Autorecord Started");
    }
  };

  return (
    <div className="relative flex flex-row">
      <div className="border-primary/5 border-2 max-w-xs flex flex-col gap-2 justify-between shadow-md rounded-md p-4">
        <div className="flex flex-col gap-2">
          <button className="cursor-pointer z-50 " onClick={toggleFlip}>
            {isFlipped ? "Flip Camera Back" : "Flip Camera"}
          </button>
          <hr className="my-2" />
        </div>

        <div className="flex flex-col gap-2">
          <hr className="my-2" />
          <button onClick={handleScreenshot}>Screenshot</button>
          <button
            onClick={handleRecordSession}
            className={isRecording ? "border-red-500" : "border-transparent"}
          >
            Record
          </button>

          <hr className="my-2" />

          <button
            onClick={handleAutoRecord}
            className={
              autoRecordEnabled ? "border-red-500" : "border-transparent"
            }
          >
            {autoRecordEnabled ? "Auto Recording is On" : "Auto Record"}
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <hr className="my-2" />
        </div>
      </div>

      <div className="h-full flex-1 py-4 p-2 overflow-y-scroll">
        <RenderFeatureHighlightsSection />
      </div>
    </div>
  );
}
