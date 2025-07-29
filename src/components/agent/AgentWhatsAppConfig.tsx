import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AgentApiService } from '@/services/agentApiService';
import { ApiAgent } from '@/types/agent-api';

interface AgentWhatsAppConfigProps {
  agent: ApiAgent;
  onUpdate: (agent: ApiAgent) => void;
}

export function AgentWhatsAppConfig({ agent, onUpdate }: AgentWhatsAppConfigProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    oficialMetaWhatsappPhoneNumber: agent.oficialMetaWhatsappPhoneNumber || '',
    hostEmail: agent.hostEmail || '',
    portEmail: agent.portEmail || '',
    secureEmail: agent.secureEmail ?? true,
    userEmail: agent.userEmail || ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Apenas enviar campos que foram realmente alterados
      const changedFields: any = {};
      
      // Função para normalizar valores (null/undefined vira string vazia)
      const normalize = (value: any) => value || '';
      
      if (normalize(formData.oficialMetaWhatsappPhoneNumber) !== normalize(agent.oficialMetaWhatsappPhoneNumber)) {
        changedFields.oficialMetaWhatsappPhoneNumber = formData.oficialMetaWhatsappPhoneNumber;
      }
      
      if (normalize(formData.hostEmail) !== normalize(agent.hostEmail)) {
        changedFields.hostEmail = formData.hostEmail;
      }
      
      if (normalize(formData.portEmail) !== normalize(agent.portEmail)) {
        changedFields.portEmail = formData.portEmail;
      }
      
      if (formData.secureEmail !== (agent.secureEmail ?? true)) {
        changedFields.secureEmail = formData.secureEmail;
      }
      
      if (normalize(formData.userEmail) !== normalize(agent.userEmail)) {
        changedFields.userEmail = formData.userEmail;
      }

      // Se não há campos alterados, não fazer a requisição
      if (Object.keys(changedFields).length === 0) {
        toast({
          title: "Nenhuma alteração",
          description: "Nenhum campo foi modificado.",
        });
        setLoading(false);
        return;
      }

      const response = await AgentApiService.updateAgent(agent.id.toString(), changedFields);
      onUpdate(response.agent);
      toast({
        title: "Sucesso",
        description: "Configurações do WhatsApp atualizadas com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar configurações do WhatsApp",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">WhatsApp Business</h3>
        
        <div className="space-y-2">
          <Label htmlFor="whatsapp-phone">Número do WhatsApp Business</Label>
          <Input
            id="whatsapp-phone"
            type="tel"
            value={formData.oficialMetaWhatsappPhoneNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, oficialMetaWhatsappPhoneNumber: e.target.value }))}
            placeholder="+5511999999999"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Configurações de Email SMTP</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="host-email">Host SMTP</Label>
            <Input
              id="host-email"
              value={formData.hostEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, hostEmail: e.target.value }))}
              placeholder="smtp.gmail.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="port-email">Porta SMTP</Label>
            <Input
              id="port-email"
              value={formData.portEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, portEmail: e.target.value }))}
              placeholder="587"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="user-email">Email do Usuário</Label>
          <Input
            id="user-email"
            type="email"
            value={formData.userEmail}
            onChange={(e) => setFormData(prev => ({ ...prev, userEmail: e.target.value }))}
            placeholder="usuario@email.com"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="secure-email"
            checked={formData.secureEmail}
            onChange={(e) => setFormData(prev => ({ ...prev, secureEmail: e.target.checked }))}
            className="rounded"
          />
          <Label htmlFor="secure-email">Usar conexão segura (TLS/SSL)</Label>
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Salvando...' : 'Salvar Configurações'}
      </Button>
    </form>
  );
}