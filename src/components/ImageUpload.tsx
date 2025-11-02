import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  isAnalyzing?: boolean;
}

export const ImageUpload = ({ onImageSelect, isAnalyzing }: ImageUploadProps) => {
  const { t } = useTranslation();
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        onImageSelect(file);
      }
    },
    [onImageSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    multiple: false,
  });

  const clearImage = () => {
    setPreview(null);
  };

  return (
    <div className="w-full">
      {!preview ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-primary bg-primary/5 scale-105'
              : 'border-border hover:border-primary hover:bg-accent/5'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-16 w-16 mx-auto mb-4 text-primary" />
          <p className="text-lg font-medium mb-2">{t('hero.uploadButton')}</p>
          <p className="text-sm text-muted-foreground">
            {isDragActive ? 'Drop the image here' : 'Drag & drop or click to select'}
          </p>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden border-2 border-primary/20">
          <img src={preview} alt="Preview" className="w-full h-auto max-h-96 object-contain" />
          {!isAnalyzing && (
            <Button
              onClick={clearImage}
              variant="destructive"
              size="icon"
              className="absolute top-4 right-4"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-white font-medium">{t('dashboard.analyzing')}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
