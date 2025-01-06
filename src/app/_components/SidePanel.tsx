/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import {
  type Dispatch,
  MutableRefObject,
  type SetStateAction,
  useEffect,
  useState,
} from "react";
import RenderFeatureHighlightsSection from "./RenderFeatureHighlightsSection";
import { formatDate } from "lib/formatDate";

// Extend the HTMLVideoElement type to include captureStream
interface HTMLVideoElementWithCaptureStream extends HTMLVideoElement {
  captureStream(): MediaStream;
}

type SidePanelTypes = {
  isFlipped: SetStateAction<boolean>;
  setIsFlipped: Dispatch<SetStateAction<boolean>>;
  mediaRecorderRef: MutableRefObject<MediaRecorder | null>;
  videoRef: MutableRefObject<HTMLVideoElementWithCaptureStream | null>;
  recordedChunksRef: MutableRefObject<Blob[]>;
};

export default function SidePanel({
  isFlipped,
  setIsFlipped,
  mediaRecorderRef,
  videoRef,
  recordedChunksRef,
}: SidePanelTypes) {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [autoRecordEnabled, setAutoRecordEnabled] = useState<boolean>(false);
  const [downloadLink, setDownloadLink] = useState<string>("");
  let stopTimeout: NodeJS.Timeout;

  // Start screen capture
  // const startScreenCapture = async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getDisplayMedia({
  //       video: true,
  //       audio: true, // Optional: if you want audio too
  //     });

  //     if (videoRef.current) {
  //       // Display the captured screen in a video element
  //       videoRef.current.srcObject = stream;
  //       await videoRef.current.play();

  //       // Start recording the screen
  //       startRecording(stream);
  //     }
  //   } catch (error) {
  //     console.error("Error accessing display media:", error);
  //   }
  // };

  // Function to start recording the webcam
  useEffect(() => {
    if (videoRef.current) {
      const stream = videoRef.current.captureStream(); // Capture the webcam stream and cast to MediaStream
      if (stream) {
        // Initialize the MediaRecorder with the stream
        mediaRecorderRef.current = new MediaRecorder(stream);

        // Handle data available event (recorded video chunks)
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };

        // When recording starts
        mediaRecorderRef.current.onstart = () => {
          setIsRecording(true);
        };

        // When recording stops
        mediaRecorderRef.current.onstop = () => {
          setIsRecording(false);
          // Combine the chunks into a Blob and create a download URL
          const recordedBlob = new Blob(recordedChunksRef.current, {
            type: "video/webm",
          });
          const videoURL = URL.createObjectURL(recordedBlob);

          // Create a link to download the recorded video
          const a = document.createElement("a");
          a.href = videoURL;
          a.download = `${formatDate(new Date())}.webm`; // Format the filename with the current date
          a.click();
        };

        // Start recording
        mediaRecorderRef.current.start();
      }
    }
  }, [mediaRecorderRef, recordedChunksRef, videoRef]);

  // Function to stop recording
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  // Effect to handle the setup of the webcam video stream
  useEffect(() => {
    // Get the webcam stream and set it to the video element
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    };

    void getUserMedia();

    // Cleanup the stream on component unmount
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current?.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop()); // Stop the tracks when the component unmounts
      }
    };
  }, [videoRef]);

  // Function to toggle the horizontal flip
  const toggleFlip = () => {
    setIsFlipped((prevState) => !prevState);
  };

  const handleScreenshot = () => {
    console.log("screenshot taken");
  };

  const handleRecordSession = () => {
    if (!videoRef.current) {
      alert("Camera is not found. Please refresh and allow permission");
    }

    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.requestData();
      mediaRecorderRef.current.stop();
      alert("Recording saved to downloads");
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    if (videoRef.current && mediaRecorderRef.current?.state !== "recording") {
      mediaRecorderRef.current?.start();

      stopTimeout = setTimeout(() => {
        if (mediaRecorderRef.current?.state === "recording") {
          mediaRecorderRef.current.requestData();
          mediaRecorderRef.current.stop();
        }
      }, 30000);
    }
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

      {downloadLink && !isRecording && (
        <div>
          <a href={downloadLink} download="screen-recording.webm">
            Download Video
          </a>
        </div>
      )}
    </div>
  );
}
