import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Plus, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAgentCampaigns } from '@/hooks/use-agent-campaigns';
import { Campaign, CreateCampaignRequest } from '@/types/agent-api';
import { SimpleFileUpload } from '@/components/upload/SimpleFileUpload';

interface CampaignFormProps {
  agentId: string;
  campaign?: Campaign | null;
  onSuccess: () => void;
}

export function CampaignForm({ agentId, campaign, onSuccess }: CampaignFormProps) {
  const [loading, setLoading] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [formData, setFormData] = useState<CreateCampaignRequest>({
    name: campaign?.name || '',
    tags: campaign?.tags || [],
    dispatchesPer: campaign?.dispatchesPer || 'DAY',
    attachments: campaign?.attachments || [],
    startDate: campaign?.startDate || new Date().toISOString(),
    endDate: campaign?.endDate || null,
    sendBy: campaign?.sendBy || 'EMAIL_AND_WHATSAPP',
    message: campaign?.message || null,
    subject: campaign?.subject || null,
    body: campaign?.body || null,
    active: campaign?.active ?? true
  });
  
  const { createCampaign, updateCampaign } = useAgentCampaigns(agentId);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (campaign) {
        await updateCampaign(campaign.id.toString(), formData);
      } else {
        await createCampaign(formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar campanha:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleFileUpload = (urls: string[]) => {
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...urls]
    }));
  };

  const removeAttachment = (attachmentToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter(attachment => attachment !== attachmentToRemove)
    }));
  };

  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome da Campanha</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sendBy">Canal de Envio</Label>
          <Select value={formData.sendBy} onValueChange={(value) => setFormData(prev => ({ ...prev, sendBy: value as any }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ONLY_EMAIL">Apenas Email</SelectItem>
              <SelectItem value="ONLY_WHATSAPP">Apenas WhatsApp</SelectItem>
              <SelectItem value="PREFER_EMAIL">Preferir Email</SelectItem>
              <SelectItem value="PREFER_WHATSAPP">Preferir WhatsApp</SelectItem>
              <SelectItem value="EMAIL_AND_WHATSAPP">Email + WhatsApp</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Data de Início</Label>
          <Input
            id="startDate"
            type="datetime-local"
            value={formatDateForInput(formData.startDate)}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: new Date(e.target.value).toISOString() }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">Data de Fim (Opcional)</Label>
          <Input
            id="endDate"
            type="datetime-local"
            value={formData.endDate ? formatDateForInput(formData.endDate) : ''}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              endDate: e.target.value ? new Date(e.target.value).toISOString() : null 
            }))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dispatchesPer">Frequência de Envio</Label>
        <Select value={formData.dispatchesPer} onValueChange={(value) => setFormData(prev => ({ ...prev, dispatchesPer: value as any }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="HOUR">Por hora</SelectItem>
            <SelectItem value="DAY">Por dia</SelectItem>
            <SelectItem value="WEEK">Por semana</SelectItem>
            <SelectItem value="MONTH">Por mês</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Adicionar tag"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          />
          <Button type="button" onClick={addTag} variant="outline">
            Adicionar
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
            </Badge>
          ))}
        </div>
      </div>

      <Tabs defaultValue="whatsapp" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
        </TabsList>
        
        <TabsContent value="whatsapp" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">Mensagem WhatsApp</Label>
            <Textarea
              id="message"
              value={formData.message || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              rows={6}
              placeholder="Digite a mensagem para WhatsApp..."
            />
          </div>
        </TabsContent>
        
        <TabsContent value="email" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Assunto do Email</Label>
            <Input
              id="subject"
              value={formData.subject || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Assunto do email"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="body">Corpo do Email</Label>
            <Textarea
              id="body"
              value={formData.body || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
              rows={8}
              placeholder="Conteúdo do email..."
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-2">
        <Label>Anexos</Label>
        <SimpleFileUpload onUploadComplete={handleFileUpload} />
        {formData.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.attachments.map((attachment, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                📎 {attachment.split('/').pop()}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeAttachment(attachment)} />
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.active}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
        />
        <Label>Campanha ativa</Label>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Salvando...' : campaign ? 'Atualizar Campanha' : 'Criar Campanha'}
        </Button>
      </div>
    </form>
  );
}