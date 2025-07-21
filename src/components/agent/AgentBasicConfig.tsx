import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AgentApiService } from '@/services/agentApiService';
import { ApiAgent } from '@/types/agent-api';

interface AgentBasicConfigProps {
  agent: ApiAgent;
  onUpdate: (agent: ApiAgent) => void;
}

export function AgentBasicConfig({ agent, onUpdate }: AgentBasicConfigProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: agent.name,
    description: agent.description,
    language: agent.language,
    tags: agent.tags,
    Faq: agent.Faq || '',
    ProductsServices: agent.ProductsServices || '',
    AboutCompany: agent.AboutCompany || ''
  });
  const [newTag, setNewTag] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await AgentApiService.updateAgent(agent.id.toString(), formData);
      onUpdate(response.agent);
      toast({
        title: "Sucesso",
        description: "Configurações básicas atualizadas com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar configurações básicas",
        variant: "destructive",
      });
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Agente</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Idioma</Label>
          <Select value={formData.language} onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
              <SelectItem value="en-US">English (US)</SelectItem>
              <SelectItem value="es-ES">Español</SelectItem>
              <SelectItem value="fr-FR">Français</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
        />
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

      <div className="space-y-2">
        <Label htmlFor="faq">FAQ (Perguntas Frequentes)</Label>
        <Textarea
          id="faq"
          value={formData.Faq}
          onChange={(e) => setFormData(prev => ({ ...prev, Faq: e.target.value }))}
          rows={4}
          placeholder="P: Como funciona o serviço?&#10;R: Nosso serviço funciona de forma automatizada..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="products">Produtos e Serviços</Label>
        <Textarea
          id="products"
          value={formData.ProductsServices}
          onChange={(e) => setFormData(prev => ({ ...prev, ProductsServices: e.target.value }))}
          rows={4}
          placeholder="Descreva os produtos e serviços oferecidos..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Sobre a Empresa</Label>
        <Textarea
          id="company"
          value={formData.AboutCompany}
          onChange={(e) => setFormData(prev => ({ ...prev, AboutCompany: e.target.value }))}
          rows={4}
          placeholder="Informações sobre a empresa..."
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Salvando...' : 'Salvar Configurações'}
      </Button>
    </form>
  );
}