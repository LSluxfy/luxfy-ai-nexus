
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, ExternalLink, Eye, File, Image, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileItem {
  url: string;
  name: string;
  size?: number;
  type?: string;
  uploadedAt?: string;
}

interface FileViewerProps {
  files: FileItem[];
  className?: string;
  showDownload?: boolean;
  showPreview?: boolean;
  onPreview?: (file: FileItem) => void;
}

export const FileViewer = ({
  files,
  className,
  showDownload = true,
  showPreview = true,
  onPreview
}: FileViewerProps) => {
  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'Tamanho desconhecido';
    
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: FileItem) => {
    if (!file.type) return File;
    if (file.type.startsWith('image/')) return Image;
    if (file.type.includes('pdf')) return FileText;
    return File;
  };

  const isImageFile = (file: FileItem) => {
    return file.type?.startsWith('image/') || false;
  };

  const handleDownload = (file: FileItem) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (files.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <File className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">Nenhum arquivo disponível</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="space-y-3">
          {files.map((file, index) => {
            const Icon = getFileIcon(file);
            
            return (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {/* Preview ou ícone */}
                <div className="flex-shrink-0">
                  {isImageFile(file) ? (
                    <img 
                      src={file.url} 
                      alt={file.name}
                      className="w-12 h-12 object-cover rounded cursor-pointer"
                      onClick={() => onPreview?.(file)}
                    />
                  ) : (
                    <Icon className="w-12 h-12 text-gray-400" />
                  )}
                </div>

                {/* Informações do arquivo */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {file.size && (
                      <Badge variant="secondary" className="text-xs">
                        {formatFileSize(file.size)}
                      </Badge>
                    )}
                    {file.type && (
                      <Badge variant="outline" className="text-xs">
                        {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
                      </Badge>
                    )}
                  </div>
                  {file.uploadedAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      Enviado em {new Date(file.uploadedAt).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>

                {/* Ações */}
                <div className="flex items-center gap-1">
                  {showPreview && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPreview?.(file)}
                      className="text-gray-600 hover:text-luxfy-purple"
                    >
                      <Eye size={16} />
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(file.url, '_blank')}
                    className="text-gray-600 hover:text-luxfy-purple"
                  >
                    <ExternalLink size={16} />
                  </Button>
                  
                  {showDownload && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(file)}
                      className="text-gray-600 hover:text-luxfy-purple"
                    >
                      <Download size={16} />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileViewer;
