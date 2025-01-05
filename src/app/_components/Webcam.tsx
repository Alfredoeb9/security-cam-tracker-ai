"use client";
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

type WebcamTypes = {
  isFlipped: SetStateAction<boolean>;
  setIsFlipped: Dispatch<SetStateAction<boolean>>;
};

export default function Webcam({ isFlipped, setIsFlipped }: WebcamTypes) {
  const [hasPermission, setHasPermission] = useState(false);
  const [isError, setIsError] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const getMediaStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        setHasPermission(true);
      } catch (error) {
        console.log("Error accessing media devices", error);
        setIsError(true);
      }
    };

    void getMediaStream();

    return () => {
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [streamRef.current]);

  // Ensure the video is properly loaded before showing
  const handleLoadedMetadata = async () => {
    if (videoRef.current) {
      await videoRef.current.play();
    }
  };

  if (isError) {
    return <p>Could not access the webcam. Please check your permissions.</p>;
  }

  if (!hasPermission) {
    return <p>Requesting webcam access...</p>;
  }

  return (
    <div className="h-full w-full object-contain p-2">
      <video
        ref={videoRef}
        autoPlay
        muted
        onLoadedMetadata={handleLoadedMetadata}
        width="100%"
        height="100%"
        style={{
          border: "2px solid black",
          transform: isFlipped ? "scaleX(-1)" : "scaleX(1)", // Flip horizontally if isFlipped is true
        }}
      />
    </div>
  );
}
