
import { useState, useCallback } from 'react';
import { UploadService } from '@/services/uploadService';
import { UploadProgress, UploadConfig } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

interface UseUploadOptions {
  config?: UploadConfig;
  onSuccess?: (urls: string[]) => void;
  onError?: (error: string) => void;
}

export const useUpload = (options: UseUploadOptions = {}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const { toast } = useToast();

  const addFiles = useCallback((newFiles: File[]) => {
    const validation = UploadService.validateFiles([...files, ...newFiles], options.config);
    
    if (!validation.isValid) {
      toast({
        title: "Erro na validação",
        description: validation.errors[0],
        variant: "destructive",
      });
      return false;
    }

    setFiles(prev => [...prev, ...newFiles]);
    return true;
  }, [files, options.config, toast]);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
    setProgress([]);
    setUploadedUrls([]);
  }, []);

  const upload = useCallback(async (expireAt: string, identificator?: string) => {
    if (files.length === 0) {
      toast({
        title: "Nenhum arquivo",
        description: "Selecione pelo menos um arquivo para upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadedUrls([]);

    try {
      const response = await UploadService.uploadFiles(
        {
          files,
          expireAt,
          identificator,
        },
        setProgress
      );

      setUploadedUrls(response.urls);
      
      toast({
        title: "Upload concluído",
        description: `${files.length} arquivo(s) enviado(s) com sucesso`,
      });

      options.onSuccess?.(response.urls);
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Erro no upload';
      
      toast({
        title: "Erro no upload",
        description: errorMessage,
        variant: "destructive",
      });

      options.onError?.(errorMessage);
    } finally {
      setIsUploading(false);
    }
  }, [files, toast, options]);

  const getFilePreview = useCallback((file: File) => {
    return UploadService.getFilePreviewUrl(file);
  }, []);

  return {
    files,
    isUploading,
    progress,
    uploadedUrls,
    addFiles,
    removeFile,
    clearFiles,
    upload,
    getFilePreview,
    // Utilities
    formatFileSize: UploadService.formatFileSize,
    isImageFile: UploadService.isImageFile,
  };
};
