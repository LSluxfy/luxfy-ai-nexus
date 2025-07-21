
import React, { useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpload } from '@/hooks/use-upload';
import { Upload, X, File, Image, FileText, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UploadConfig } from '@/types/api';

interface FileUploadProps {
  onUploadComplete?: (urls: string[]) => void;
  config?: UploadConfig;
  className?: string;
  showExpireDate?: boolean;
  defaultExpireDate?: string;
  identificator?: string;
}

export const FileUpload = ({ 
  onUploadComplete, 
  config,
  className,
  showExpireDate = true,
  defaultExpireDate,
  identificator 
}: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [expireAt, setExpireAt] = useState(
    defaultExpireDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );

  const {
    files,
    isUploading,
    progress,
    uploadedUrls,
    addFiles,
    removeFile,
    clearFiles,
    upload,
    getFilePreview,
    formatFileSize,
    isImageFile,
  } = useUpload({
    config,
    onSuccess: onUploadComplete,
  });

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    addFiles(selectedFiles);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = () => {
    upload(expireAt, identificator);
  };

  const getFileIcon = (file: File) => {
    if (isImageFile(file)) return Image;
    if (file.type.includes('pdf')) return FileText;
    return File;
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Área de Drop */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
              isDragOver 
                ? "border-luxfy-purple bg-luxfy-purple/5" 
                : "border-gray-300 hover:border-luxfy-purple/50"
            )}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Arraste arquivos aqui ou clique para selecionar
            </p>
            <p className="text-sm text-gray-500">
              Máximo {config?.maxFiles || 10} arquivos, {formatFileSize(config?.maxSizePerFile || 10485760)} cada
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept={config?.allowedTypes?.join(',') || undefined}
          />

          {/* Data de expiração */}
          {showExpireDate && (
            <div className="space-y-2">
              <Label htmlFor="expire-date" className="flex items-center gap-2">
                <Calendar size={16} />
                Data de Expiração
              </Label>
              <Input
                id="expire-date"
                type="datetime-local"
                value={expireAt}
                onChange={(e) => setExpireAt(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
          )}

          {/* Lista de arquivos */}
          {files.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Arquivos selecionados ({files.length})</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFiles}
                  disabled={isUploading}
                >
                  Limpar todos
                </Button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {files.map((file, index) => {
                  const Icon = getFileIcon(file);
                  const preview = getFilePreview(file);
                  const fileProgress = progress.find(p => p.fileIndex === index);

                  return (
                    <div key={`${file.name}-${index}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      {/* Preview ou ícone */}
                      <div className="flex-shrink-0">
                        {preview ? (
                          <img 
                            src={preview} 
                            alt={file.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        ) : (
                          <Icon className="w-10 h-10 text-gray-400" />
                        )}
                      </div>

                      {/* Informações do arquivo */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                        
                        {/* Progresso */}
                        {fileProgress && (
                          <div className="mt-1">
                            <div className="flex items-center gap-2">
                              <Progress 
                                value={fileProgress.progress} 
                                className="flex-1 h-2"
                              />
                              <Badge 
                                variant={
                                  fileProgress.status === 'completed' ? 'default' :
                                  fileProgress.status === 'error' ? 'destructive' :
                                  'secondary'
                                }
                                className="text-xs"
                              >
                                {fileProgress.status === 'pending' && 'Aguardando'}
                                {fileProgress.status === 'uploading' && `${fileProgress.progress}%`}
                                {fileProgress.status === 'completed' && 'Concluído'}
                                {fileProgress.status === 'error' && 'Erro'}
                              </Badge>
                            </div>
                            {fileProgress.error && (
                              <p className="text-xs text-red-600 mt-1">
                                {fileProgress.error}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Botão remover */}
                      {!isUploading && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X size={16} />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Botão de upload */}
              <Button
                onClick={handleUpload}
                disabled={isUploading || files.length === 0}
                className="w-full bg-luxfy-purple hover:bg-luxfy-darkPurple"
              >
                {isUploading ? 'Enviando...' : `Enviar ${files.length} arquivo(s)`}
              </Button>
            </div>
          )}

          {/* URLs dos arquivos enviados */}
          {uploadedUrls.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-green-600">Arquivos enviados com sucesso:</h4>
              <div className="space-y-1">
                {uploadedUrls.map((url, index) => (
                  <div key={index} className="text-xs text-gray-600 bg-green-50 p-2 rounded">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="hover:text-green-600">
                      {url}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
