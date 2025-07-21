
import api from '@/lib/api';
import { UploadRequest, UploadResponse, UploadProgress, FileValidation, UploadConfig } from '@/types/api';

export class UploadService {
  private static readonly DEFAULT_CONFIG: UploadConfig = {
    maxFiles: 10,
    maxSizePerFile: 10 * 1024 * 1024, // 10MB
  };

  // Validar arquivos antes do upload
  static validateFiles(files: File[], config: UploadConfig = this.DEFAULT_CONFIG): FileValidation {
    const errors: string[] = [];

    if (files.length === 0) {
      errors.push('Nenhum arquivo selecionado');
    }

    if (files.length > config.maxFiles) {
      errors.push(`Máximo de ${config.maxFiles} arquivos permitidos`);
    }

    files.forEach((file, index) => {
      if (file.size > config.maxSizePerFile) {
        const sizeMB = config.maxSizePerFile / (1024 * 1024);
        errors.push(`Arquivo "${file.name}" excede o tamanho máximo de ${sizeMB}MB`);
      }

      if (config.allowedTypes && !config.allowedTypes.includes(file.type)) {
        errors.push(`Tipo de arquivo "${file.type}" não permitido para "${file.name}"`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Upload com progresso
  static async uploadFiles(
    request: UploadRequest,
    onProgress?: (progress: UploadProgress[]) => void
  ): Promise<UploadResponse> {
    const validation = this.validateFiles(request.files);
    
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    const formData = new FormData();
    
    // Adicionar arquivos ao FormData
    request.files.forEach((file) => {
      formData.append('files', file);
    });
    
    formData.append('expireAt', request.expireAt);
    
    if (request.identificator) {
      formData.append('identificator', request.identificator);
    }

    // Inicializar progresso
    const progressArray: UploadProgress[] = request.files.map((file, index) => ({
      fileIndex: index,
      fileName: file.name,
      progress: 0,
      status: 'pending',
    }));

    onProgress?.(progressArray);

    try {
      // Atualizar status para uploading
      progressArray.forEach(p => p.status = 'uploading');
      onProgress?.(progressArray);

      const response = await api.post('/v1/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const overallProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            
            // Distribuir progresso entre os arquivos
            progressArray.forEach((p, index) => {
              p.progress = overallProgress;
              if (overallProgress === 100) {
                p.status = 'completed';
              }
            });
            
            onProgress?.(progressArray);
          }
        },
      });

      // Marcar todos como completos e adicionar URLs
      const uploadResponse: UploadResponse = response.data;
      
      progressArray.forEach((p, index) => {
        p.status = 'completed';
        p.progress = 100;
        p.url = uploadResponse.urls[index];
      });
      
      onProgress?.(progressArray);

      return uploadResponse;

    } catch (error: any) {
      // Marcar todos como erro
      progressArray.forEach(p => {
        p.status = 'error';
        p.error = error.response?.data?.error || error.message || 'Erro no upload';
      });
      
      onProgress?.(progressArray);
      throw error;
    }
  }

  // Utilitário para formatar tamanho de arquivo
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  // Utilitário para verificar se é imagem
  static isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
  }

  // Gerar URL de preview para imagens
  static getFilePreviewUrl(file: File): string | null {
    if (this.isImageFile(file)) {
      return URL.createObjectURL(file);
    }
    return null;
  }
}
