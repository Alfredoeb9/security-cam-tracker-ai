"use client";
import { type ObjectDetection } from "@tensorflow-models/coco-ssd";
import * as cocossd from "@tensorflow-models/coco-ssd";
import { useEffect, useState } from "react";

export default function CocoModel() {
  const [model, setModel] = useState<ObjectDetection>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    void initModel();
  }, [model]);

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
