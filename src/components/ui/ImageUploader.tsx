import { Button } from "@heroui/react";
import { useRef, useState } from "react";

type ImageUploaderProps = {
  onFileChange: (file: File | null) => void;
  previewUrl?: string;
  label?: string;
};

export default function ImageUploader({
  onFileChange,
  previewUrl,
  label = "Add image",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const preview = localPreview ?? previewUrl ?? null;

  function handleChange(file: File | null) {
    if (localPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(localPreview);
    }
    if (!file) {
      setLocalPreview(null);
      onFileChange(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      return;
    }
    setLocalPreview(URL.createObjectURL(file));
    onFileChange(file);
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleChange(e.target.files?.[0] ?? null)}
      />
      <Button type="button" variant="tertiary" onPress={() => inputRef.current?.click()}>
        {label}
      </Button>
      {preview && (
        <div className="relative">
          <img src={preview} alt="Preview" className="max-h-48 rounded-xl object-cover" />
          <Button
            type="button"
            size="sm"
            className="mt-2"
            onPress={() => {
              handleChange(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
          >
            Remove
          </Button>
        </div>
      )}
    </div>
  );
}