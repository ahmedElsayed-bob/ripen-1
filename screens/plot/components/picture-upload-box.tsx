import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PlotGridType } from "@/types/farm";
import { CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ChangeEvent,
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface PictureUploadBoxProps {
  grid: PlotGridType;
  onInView?: (isInView: boolean) => void;
  onUploadPicture?: () => void;
  isSelected?: boolean;
}

export interface PictureUploadBoxRef {
  triggerUpload: () => void;
}

export const PictureUploadBox = forwardRef<
  PictureUploadBoxRef,
  PictureUploadBoxProps
>(({ grid, onInView, onUploadPicture, isSelected }, ref) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current || !onInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          onInView(entry.intersectionRatio >= 0.9);
        });
      },
      {
        threshold: [0.9],
        rootMargin: "0px",
      }
    );

    observer.observe(cardRef.current);

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [onInView]);

  const handleUploadPicture = async () => {
    setIsLoading(true);
    setUploadProgress(0);

    // Simulate upload progress over 1 second
    const startTime = Date.now();
    const duration = 3000; // 1 second

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setUploadProgress(progress);

      if (progress < 100) {
        requestAnimationFrame(updateProgress);
      }
    };

    requestAnimationFrame(updateProgress);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    setIsLoading(false);
    setIsUploaded(true);
    onUploadPicture?.();
  };

  useImperativeHandle(
    ref,
    () => ({
      triggerUpload: handleUploadPicture,
    }),
    []
  );

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      setImageUrl(URL.createObjectURL(selectedFile));
    }
    handleUploadPicture();
  };

  return (
    <Card
      ref={cardRef}
      className={`${isSelected ? "border-1 border-green-500 shadow-lg" : ""}`}
    >
      <CardHeader>
        <CardTitle>{grid.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <div className="text-sm text-gray-600 font-medium">
              Uploading... {Math.round(uploadProgress)}%
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0D826B] transition-all duration-75 ease-out rounded-full"
                style={{ width: `${Math.round(uploadProgress)}%` }}
              />
            </div>
          </div>
        ) : isUploaded ? (
          <div>
            <img
              src={imageUrl || ""}
              alt="Uploaded Image"
              width={100}
              height={100}
            />
          </div>
        ) : (
          <div className="flex items-center justify-end gap-4">
            <Button className="bg-[#0D826B] hover:bg-[#0D826B]/90">
              Capture
            </Button>
            <label className="cursor-pointer">
              <Input type="file" onChange={handleUpload} hidden />
              <div className="flex items-center gap-2 text-sm text-green-700">
                <Upload />
                Upload
              </div>
            </label>
          </div>
        )}
      </CardContent>
    </Card>
  );
});
