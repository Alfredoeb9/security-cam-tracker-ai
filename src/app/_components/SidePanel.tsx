"use client";
import {
  type Dispatch,
  type MutableRefObject,
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

  // Function to start recording the webcam or screen
  const startRecording = () => {
    if (videoRef.current && mediaRecorderRef.current?.state !== "recording") {
      const stream = videoRef.current.captureStream(); // Capture the video element stream
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
          setDownloadLink(videoURL);

          // Create a link to download the recorded video
          const a = document.createElement("a");
          a.href = videoURL;
          a.download = `${formatDate(new Date())}.webm`; // Format the filename with the current date
          a.click();

          recordedChunksRef.current = [];
        };

        // Start recording
        mediaRecorderRef.current.start();

        setTimeout(() => {
          if (mediaRecorderRef.current?.state === "recording") {
            mediaRecorderRef.current.requestData();
            mediaRecorderRef.current.stop();
          }
        }, 30000);
      }
    }
  };

  useEffect(() => {
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
      const videoElement = videoRef.current;
      if (videoElement?.srcObject instanceof MediaStream) {
        const stream = videoElement.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [videoRef]);

  // Function to stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.requestData();
      mediaRecorderRef.current.stop();
    }
  };

  // Function to toggle the horizontal flip
  const toggleFlip = () => {
    setIsFlipped((prevState) => !prevState);
  };

  const handleScreenshot = () => {
    if (!videoRef.current) {
      alert("Camera not found, Please refresh");
    } else {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        // Convert the canvas content to a data URL
        const imgDataUrl = canvas.toDataURL("image/png");

        // Create a link to download the image
        const a = document.createElement("a");
        a.href = imgDataUrl;
        a.download = `${formatDate(new Date())}.png`; // Format the filename with the current date
        a.click();
      }
    }
  };

  const handleRecordSession = () => {
    if (!videoRef.current) {
      alert("Camera is not found. Please refresh and allow permission");
    }

    if (mediaRecorderRef.current?.state === "recording") {
      stopRecording();
      alert("Recording saved to downloads");
    } else {
      startRecording();
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
