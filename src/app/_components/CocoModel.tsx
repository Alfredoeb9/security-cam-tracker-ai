/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
"use client";
import React, {
  type MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { type ObjectDetection } from "@tensorflow-models/coco-ssd";
import * as cocossd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-backend-cpu";
import { resizeCanvas } from "lib/resizeCanvas";
import { drawOnCanvas } from "lib/draw";

type CocoModelTypes = {
  videoRef: MutableRefObject<HTMLVideoElement | null>;
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  isFlipped: boolean;
};

export default function CocoModel({
  videoRef,
  canvasRef,
  isFlipped,
}: CocoModelTypes) {
  const [model, setModel] = useState<ObjectDetection>();
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setLoading(true);
    void initModel();
  }, []);

  async function initModel() {
    const loadedModel: ObjectDetection = await cocossd.load({
      base: "mobilenet_v2",
    });
    setModel(loadedModel);
  }

  useEffect(() => {
    if (model) {
      setLoading(false);
    }
  }, [model]);

  useEffect(() => {
    if (model && videoRef.current) {
      intervalRef.current = setInterval(() => {
        void runPrediction();
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // every time a new videRef or model get rendered run the
    // the useEffect again
  }, [videoRef, model, runPrediction]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function runPrediction() {
    if (model && videoRef.current && videoRef.current.readyState === 4) {
      try {
        const predicitons = await model.detect(videoRef.current);
        resizeCanvas(canvasRef, videoRef);
        drawOnCanvas(
          isFlipped,
          predicitons,
          canvasRef.current?.getContext("2d")
        );
      } catch (error) {
        console.error("Error running predicition", error);
      }
    }
  }

  return (
    <>
      {loading && (
        <div className="z-50 absolute w-full h-full flex items-center justify-center">
          Getting things ready ...
        </div>
      )}
    </>
  );
}
