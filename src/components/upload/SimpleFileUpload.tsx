
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpload } from '@/hooks/use-upload';
import { Upload, X } from 'lucide-react';
import { UploadConfig } from '@/types/api';

interface SimpleFileUploadProps {
  onUploadComplete: (urls: string[]) => void;
  label?: string;
  config?: UploadConfig;
  single?: boolean; // Para upload de um único arquivo
  accept?: string;
  className?: string;
}

export const SimpleFileUpload = ({
  onUploadComplete,
  label = "Selecionar arquivos",
  config,
  single = false,
  accept,
  className
}: SimpleFileUploadProps) => {
  const {
    files,
    isUploading,
    addFiles,
    removeFile,
    upload,
    formatFileSize,
  } = useUpload({
    config: single ? { ...config, maxFiles: 1 } : config,
    onSuccess: onUploadComplete,
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (single && selectedFiles.length > 0) {
      // Para upload único, substitui o arquivo anterior
      addFiles([selectedFiles[0]]);
    } else {
      addFiles(selectedFiles);
    }
  };

  const handleUpload = () => {
    const expireAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    upload(expireAt);
  };

  return (
    <div className={className}>
      <div className="space-y-3">
        <div>
          <Label htmlFor="file-upload">{label}</Label>
          <div className="mt-1 flex items-center gap-2">
            <Input
              id="file-upload"
              type="file"
              onChange={handleFileSelect}
              multiple={!single}
              accept={accept}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleUpload}
              disabled={isUploading || files.length === 0}
            >
              <Upload size={16} className="mr-1" />
              {isUploading ? 'Enviando...' : 'Enviar'}
            </Button>
          </div>
        </div>

        {files.length > 0 && (
          <div className="space-y-1">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                <span className="truncate">
                  {file.name} ({formatFileSize(file.size)})
                </span>
                {!isUploading && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                  >
                    <X size={12} />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleFileUpload;
