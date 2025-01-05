"use client";

import { type Dispatch, type SetStateAction, useState } from "react";

type SidePanelTypes = {
  isFlipped: SetStateAction<boolean>;
  setIsFlipped: Dispatch<SetStateAction<boolean>>;
};

function handleScreenshot() {
  console.log("screenshot taken");
}

function handleRecordSession() {
  console.log("recording starting");
}

export default function SidePanel({ isFlipped, setIsFlipped }: SidePanelTypes) {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  // Function to toggle the horizontal flip
  const toggleFlip = () => {
    setIsFlipped((prevState) => !prevState);
  };

  return (
    <div className="relative flex flex-row flex-1">
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
        </div>

        <div className="flex flex-col gap-2">
          <hr className="my-2" />
        </div>
      </div>
    </div>
  );
}
