
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip, Mic, Square, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { UploadService } from '@/services/uploadService';

interface ChatInputProps {
  onSendMessage: (content: string, type?: 'text' | 'audio' | 'file' | 'image', attachmentUrl?: string) => void;
  onToggleAI: () => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  aiEnabled: boolean;
  userTags: string[];
  disabled?: boolean;
}

const ChatInput = ({ 
  onSendMessage, 
  onToggleAI, 
  onAddTag, 
  onRemoveTag,
  aiEnabled, 
  userTags,
  disabled = false
}: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || disabled) return;

    setIsUploading(true);
    
    try {
      // Validar arquivo antes do upload
      const validation = UploadService.validateFiles([file]);
      if (!validation.isValid) {
        toast({
          title: "Erro na validação",
          description: validation.errors[0],
          variant: "destructive",
        });
        return;
      }

      // Definir data de expiração para 30 dias
      const expireAt = new Date();
      expireAt.setDate(expireAt.getDate() + 30);

      // Fazer upload do arquivo
      const response = await UploadService.uploadFiles({
        files: [file],
        expireAt: expireAt.toISOString(),
        identificator: `chat-upload-${Date.now()}`
      });

      // Verificar se o upload retornou URLs
      if (!response.urls || response.urls.length === 0) {
        throw new Error('Nenhuma URL retornada do upload');
      }

      const fileUrl = response.urls[0];
      const isImage = UploadService.isImageFile(file);
      const type = isImage ? 'image' : 'file';
      
      onSendMessage(
        isImage ? 'Imagem enviada' : `Arquivo enviado: ${file.name}`, 
        type,
        fileUrl
      );

      toast({
        title: "Arquivo enviado",
        description: `${file.name} foi enviado com sucesso.`,
      });
    } catch (error: any) {
      console.error('Erro no upload:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Erro ao enviar arquivo';
      
      toast({
        title: "Erro ao enviar arquivo",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const toggleRecording = () => {
    if (disabled) return;
    
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      onSendMessage('Áudio gravado', 'audio');
      toast({
        title: "Áudio gravado",
        description: "Sua mensagem de áudio foi enviada.",
      });
    } else {
      // Start recording
      setIsRecording(true);
      toast({
        title: "Gravando áudio",
        description: "Clique novamente para parar a gravação.",
      });
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !userTags.includes(newTag.trim()) && !disabled) {
      onAddTag(newTag.trim());
      setNewTag('');
    }
  };

  return (
    <div className="border-t bg-white p-4 space-y-3">
      {/* Tags do usuário */}
      <div className="flex items-center gap-2 flex-wrap">
        <Tag size={16} className="text-gray-500" />
        {userTags.map(tag => (
          <Badge 
            key={tag} 
            variant="secondary" 
            className="bg-luxfy-purple/10 text-luxfy-purple cursor-pointer hover:bg-red-100 hover:text-red-600 transition-colors"
            onClick={() => !disabled && onRemoveTag(tag)}
          >
            {tag} ×
          </Badge>
        ))}
        
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs"
              disabled={disabled}
            >
              + Tag
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60">
            <div className="space-y-2">
              <Input
                placeholder="Nova tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                disabled={disabled}
              />
              <Button 
                onClick={handleAddTag} 
                size="sm" 
                className="w-full bg-luxfy-purple hover:bg-luxfy-darkPurple"
                disabled={disabled}
              >
                Adicionar Tag
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Controles da IA */}
      <div className="flex items-center gap-2">
        <Button
          onClick={onToggleAI}
          variant={aiEnabled ? "default" : "outline"}
          size="sm"
          className={aiEnabled ? "bg-luxfy-purple hover:bg-luxfy-darkPurple" : ""}
          disabled={disabled}
        >
          IA {aiEnabled ? 'Ativada' : 'Desativada'}
        </Button>
        {aiEnabled && (
          <span className="text-xs text-green-600">
            ✓ IA responderá automaticamente
          </span>
        )}
      </div>

      {/* Input de mensagem */}
      <div className="flex items-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          className="text-gray-500 hover:text-luxfy-purple"
          disabled={disabled || isUploading}
        >
          <Paperclip size={20} />
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={handleFileUpload}
          accept="image/*,application/pdf,.doc,.docx,.txt"
          disabled={disabled}
        />
        
        <div className="flex-1 relative">
          <Textarea
            placeholder={disabled ? "Carregando..." : "Digite sua mensagem..."}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="resize-none pr-12 min-h-[40px] max-h-32"
            rows={1}
            disabled={disabled}
          />
        </div>
        
        <Button
          onClick={toggleRecording}
          variant={isRecording ? "destructive" : "ghost"}
          size="icon"
          className={isRecording ? "" : "text-gray-500 hover:text-luxfy-purple"}
          disabled={disabled}
        >
          {isRecording ? <Square size={20} /> : <Mic size={20} />}
        </Button>
        
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          size="icon"
          className="bg-luxfy-purple hover:bg-luxfy-darkPurple disabled:bg-gray-300"
        >
          <Send size={20} />
        </Button>
      </div>

      {isUploading && (
        <div className="text-xs text-gray-500 text-center">
          Enviando arquivo...
        </div>
      )}
    </div>
  );
};

export default ChatInput;
