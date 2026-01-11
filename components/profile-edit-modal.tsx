"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import getCroppedImg from "@/lib/canvas-utils";
import { Minus, Plus, RotateCcw, RotateCw, X } from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Cropper, { Area } from "react-easy-crop";
import { toast } from "sonner";

type AspectRatio = {
  label: string;
  value: number | undefined; // undefined for "Free"
};

const ASPECT_RATIOS: AspectRatio[] = [
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "16:9", value: 16 / 9 },
  { label: "Free", value: undefined },
];

function UploadModalHelper({
  showUploadModal,
  setShowUploadModal,
  imageFile,
  onCropComplete,
}: {
  showUploadModal: boolean;
  setShowUploadModal: Dispatch<SetStateAction<boolean>>;
  imageFile: File | null;
  onCropComplete: (croppedImageBlob: Blob) => Promise<void> | void;
}) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result?.toString() || null);
      });
      reader.readAsDataURL(imageFile);
    } else {
      setImageSrc(null);
    }
  }, [imageFile]);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onCropCompleteHandler = (
    croppedArea: Area,
    croppedAreaPixels: Area
  ) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setIsLoading(true);
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      if (croppedImage) {
        await onCropComplete(croppedImage);
        setShowUploadModal(false);
      }
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Failed to process image");
    } finally {
      setIsLoading(false);
    }
  };

  const rotateLeft = () => {
    setRotation((prev) => prev - 90);
  };

  const rotateRight = () => {
    setRotation((prev) => prev + 90);
  };

  return (
    <Modal
      showModal={showUploadModal}
      setShowModal={setShowUploadModal}
      className="max-w-2xl w-full p-0 overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl"
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="font-sans text-lg font-semibold text-gray-900 dark:text-white">
          Crop Photo
        </h2>
        <button
          onClick={() => setShowUploadModal(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
        >
          <X size={20} />
        </button>
      </div>

      <div className="relative w-full h-100 bg-zinc-900">
        {imageSrc && (
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteHandler}
            onZoomChange={setZoom}
            showGrid={true}
          />
        )}
      </div>

      <div className="p-6 flex flex-col gap-6">
        {/* Rotate and Zoom Controls */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-wider w-16">
            Rotate
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-lg"
              onClick={rotateLeft}
            >
              <RotateCcw size={18} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-lg"
              onClick={rotateRight}
            >
              <RotateCw size={18} />
            </Button>
          </div>
          <div className="w-px h-8 bg-gray-200 dark:bg-gray-800 mx-2" />
          <div className="flex items-center gap-4 flex-1">
            <Minus size={16} className="text-gray-400" />
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-primary"
            />
            <Plus size={16} className="text-gray-400" />
          </div>
        </div>

        {/* Aspect Ratio Controls */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-wider w-16">
            Ratio
          </div>
          <div className="flex gap-2">
            {ASPECT_RATIOS.map((ratio) => (
              <button
                key={ratio.label}
                onClick={() => setAspect(ratio.value)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  aspect === ratio.value
                    ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                    : "text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50"
                }`}
              >
                {ratio.label}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowUploadModal(false)}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="rounded-lg"
            >
              {isLoading ? "Saving..." : "Apply Crop"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export function useUploadModal() {
  const [showUploadModal, setShowUploadModal] = useState(false);

  const UploadModal = useCallback(
    ({
      imageFile,
      onCropComplete,
    }: {
      imageFile: File | null;
      onCropComplete: (croppedImageBlob: Blob) => Promise<void> | void;
    }) => {
      return (
        <UploadModalHelper
          showUploadModal={showUploadModal}
          setShowUploadModal={setShowUploadModal}
          imageFile={imageFile}
          onCropComplete={onCropComplete}
        />
      );
    },
    [showUploadModal, setShowUploadModal]
  );

  return useMemo(
    () => ({ setShowUploadModal, UploadModal }),
    [setShowUploadModal, UploadModal]
  );
}
