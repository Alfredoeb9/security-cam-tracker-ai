"use client";
import { useEffect, useRef, useState } from "react";

export default function Webcam() {
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

  if (isError) {
    return <p>Could not access the webcam. Please check your permissions.</p>;
  }

  if (!hasPermission) {
    return <p>Requesting webcam access...</p>;
  }

  return (
    <div>
      <h2>Webcam Feed</h2>
      <video ref={videoRef} autoPlay muted width="100%" />
    </div>
  );
}
