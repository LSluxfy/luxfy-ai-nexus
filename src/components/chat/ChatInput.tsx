
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip, Mic, Square, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { UploadService } from '@/services/uploadService';
import { TagAutocomplete } from '@/components/ui/tag-autocomplete';
import { useAgentTags } from '@/hooks/use-agent-tags';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (content: string, type?: 'text' | 'audio' | 'file' | 'image', attachmentUrl?: string) => void;
  onToggleAI: () => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  aiEnabled: boolean;
  userTags: string[];
  disabled?: boolean;
  agentId?: string;
}

const ChatInput = ({ 
  onSendMessage, 
  onToggleAI, 
  onAddTag, 
  onRemoveTag,
  aiEnabled, 
  userTags,
  disabled = false,
  agentId
}: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [pendingAttachment, setPendingAttachment] = useState<{
    url: string;
    name: string;
    type: 'image' | 'file';
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Buscar tags do agente para autocomplete
  const { data: agentTags = [], isLoading: isLoadingTags } = useAgentTags(agentId);

  const handleSend = () => {
    if ((message.trim() || pendingAttachment) && !disabled) {
      if (pendingAttachment) {
        onSendMessage(
          message.trim() || (pendingAttachment.type === 'image' ? 'Imagem enviada' : `Arquivo enviado: ${pendingAttachment.name}`),
          pendingAttachment.type,
          pendingAttachment.url
        );
        setPendingAttachment(null);
      } else {
        onSendMessage(message.trim());
      }
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
      
      // Definir anexo pendente em vez de enviar automaticamente
      setPendingAttachment({
        url: fileUrl,
        name: file.name,
        type
      });

      toast({
        title: "Upload concluído",
        description: `${file.name} anexado. Escreva sua mensagem e envie.`,
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
    <div className="border-t bg-card p-3 space-y-2 flex-shrink-0">
      {/* Tags do usuário */}
      <div className="flex items-center gap-2 flex-wrap">
        <Tag size={14} className="text-muted-foreground" />
        {userTags.map(tag => (
          <Badge 
            key={tag} 
            variant="secondary" 
            className="bg-primary/10 text-primary cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors text-xs"
            onClick={() => !disabled && onRemoveTag(tag)}
          >
            {tag} ×
          </Badge>
        ))}
        
        <TagAutocomplete
          value={newTag}
          onChange={setNewTag}
          onAddTag={handleAddTag}
          selectedTags={userTags}
          onRemoveTag={onRemoveTag}
          suggestions={agentTags}
          isLoading={isLoadingTags}
          placeholder="Adicionar tag..."
          className="w-48"
        />
      </div>

      {/* Controles da IA */}
      <div className="flex items-center gap-2">
        <Button
          onClick={onToggleAI}
          variant={aiEnabled ? "default" : "outline"}
          size="sm"
          className="h-7 text-xs"
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
          className="text-muted-foreground hover:text-primary h-9 w-9"
          disabled={disabled || isUploading}
        >
          <Paperclip size={18} />
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={handleFileUpload}
          disabled={disabled}
        />
        
        <div className="flex-1 relative">
          <Textarea
            placeholder={disabled ? "Carregando..." : "Digite sua mensagem..."}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="resize-none min-h-[36px] max-h-24 text-sm"
            rows={1}
            disabled={disabled}
          />
        </div>
        
        <Button
          onClick={toggleRecording}
          variant={isRecording ? "destructive" : "ghost"}
          size="icon"
          className={cn(
            "h-9 w-9",
            isRecording ? "" : "text-muted-foreground hover:text-primary"
          )}
          disabled={disabled}
        >
          {isRecording ? <Square size={18} /> : <Mic size={18} />}
        </Button>
        
        <Button
          onClick={handleSend}
          disabled={(!message.trim() && !pendingAttachment) || disabled}
          size="icon"
          className="h-9 w-9 bg-primary hover:bg-primary/90"
        >
          <Send size={18} />
        </Button>
      </div>

      {/* Anexo pendente */}
      {pendingAttachment && (
        <div className="flex items-center gap-2 p-2 bg-muted rounded-lg border">
          <Paperclip size={14} className="text-primary" />
          <span className="flex-1 text-sm text-foreground">
            {pendingAttachment.name}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPendingAttachment(null)}
            className="h-5 w-5 p-0 text-muted-foreground hover:text-destructive"
          >
            ×
          </Button>
        </div>
      )}

      {isUploading && (
        <div className="text-xs text-muted-foreground text-center">
          Enviando arquivo...
        </div>
      )}
    </div>
  );
};

export default ChatInput;
