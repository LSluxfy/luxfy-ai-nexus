import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AgentApiService } from '@/services/agentApiService';
import { ApiAgent } from '@/types/agent-api';
import { Clipboard } from 'lucide-react';

interface AgentWhatsAppConfigProps {
  agent: ApiAgent;
  onUpdate: (agent: ApiAgent) => void;
}

export function AgentWhatsAppConfig({ agent, onUpdate }: AgentWhatsAppConfigProps) {
  const [loading, setLoading] = useState(false);
  const [whatsappEnabled, setWhatsappEnabled] = useState(!!agent.oficialMetaWhatsappAccessToken);
  const [formData, setFormData] = useState({
    oficialMetaWhatsappAccessToken: agent.oficialMetaWhatsappAccessToken || '',
    oficialMetaWhatsappPhoneNumber: agent.oficialMetaWhatsappPhoneNumber || '',
    hostEmail: agent.hostEmail || '',
    portEmail: agent.portEmail || '',
    secureEmail: agent.secureEmail ?? true,
    userEmail: agent.userEmail || ''
  });
  const { toast } = useToast();

  // Sincronizar formData com os dados atuais do agente
  useEffect(() => {
    setWhatsappEnabled(!!agent.oficialMetaWhatsappAccessToken);
    setFormData({
      oficialMetaWhatsappAccessToken: agent.oficialMetaWhatsappAccessToken || '',
      oficialMetaWhatsappPhoneNumber: agent.oficialMetaWhatsappPhoneNumber || '',
      hostEmail: agent.hostEmail || '',
      portEmail: agent.portEmail || '',
      secureEmail: agent.secureEmail ?? true,
      userEmail: agent.userEmail || ''
    });
  }, [agent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Apenas enviar campos que foram realmente alterados
      const changedFields: any = {};
      
      // Debug: ver os valores originais e atuais
      console.log('Valores originais do agent:', {
        oficialMetaWhatsappAccessToken: agent.oficialMetaWhatsappAccessToken,
        oficialMetaWhatsappPhoneNumber: agent.oficialMetaWhatsappPhoneNumber,
        hostEmail: agent.hostEmail,
        portEmail: agent.portEmail,
        secureEmail: agent.secureEmail,
        userEmail: agent.userEmail
      });
      
      console.log('Valores do formData:', formData);
      
      // Função para normalizar valores (null/undefined vira string vazia)
      const normalize = (value: any) => value || '';
      
      // Se WhatsApp estiver desabilitado, sempre enviar null para token e telefone
      if (!whatsappEnabled) {
        changedFields.oficialMetaWhatsappAccessToken = null;
        changedFields.oficialMetaWhatsappPhoneNumber = null;
      } else {
        // Verificar mudanças apenas se WhatsApp estiver habilitado
        if (normalize(formData.oficialMetaWhatsappAccessToken) !== normalize(agent.oficialMetaWhatsappAccessToken)) {
          console.log('Mudança detectada em oficialMetaWhatsappAccessToken:', {
            original: agent.oficialMetaWhatsappAccessToken,
            novo: formData.oficialMetaWhatsappAccessToken
          });
          // Se o token estiver vazio, enviar undefined para remover do backend
          changedFields.oficialMetaWhatsappAccessToken = formData.oficialMetaWhatsappAccessToken || undefined;
        }
        
        if (normalize(formData.oficialMetaWhatsappPhoneNumber) !== normalize(agent.oficialMetaWhatsappPhoneNumber)) {
          console.log('Mudança detectada em oficialMetaWhatsappPhoneNumber:', {
            original: agent.oficialMetaWhatsappPhoneNumber,
            novo: formData.oficialMetaWhatsappPhoneNumber
          });
          changedFields.oficialMetaWhatsappPhoneNumber = formData.oficialMetaWhatsappPhoneNumber || undefined;
        }
      }
      
      if (normalize(formData.hostEmail) !== normalize(agent.hostEmail)) {
        console.log('Mudança detectada em hostEmail:', {
          original: agent.hostEmail,
          novo: formData.hostEmail
        });
        changedFields.hostEmail = formData.hostEmail || undefined;
      }
      
      if (normalize(formData.portEmail) !== normalize(agent.portEmail)) {
        console.log('Mudança detectada em portEmail:', {
          original: agent.portEmail,
          novo: formData.portEmail
        });
        changedFields.portEmail = formData.portEmail || undefined;
      }
      
      if (formData.secureEmail !== (agent.secureEmail ?? true)) {
        console.log('Mudança detectada em secureEmail:', {
          original: agent.secureEmail,
          novo: formData.secureEmail
        });
        changedFields.secureEmail = formData.secureEmail;
      }
      
      if (normalize(formData.userEmail) !== normalize(agent.userEmail)) {
        console.log('Mudança detectada em userEmail:', {
          original: agent.userEmail,
          novo: formData.userEmail
        });
        changedFields.userEmail = formData.userEmail || undefined;
      }
      
      console.log('Campos alterados que serão enviados:', changedFields);

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

  const handlePasteToken = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setFormData(prev => ({ ...prev, oficialMetaWhatsappAccessToken: clipboardText }));
      toast({
        title: "Token colado",
        description: "Token do WhatsApp Business foi colado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível colar do clipboard. Verifique as permissões do navegador.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">WhatsApp Business</h3>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="whatsapp-enabled"
            checked={whatsappEnabled}
            onChange={(e) => setWhatsappEnabled(e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="whatsapp-enabled">Ativar WhatsApp Business</Label>
        </div>

        {whatsappEnabled && (
          <>
            <div className="space-y-2">
              <Label htmlFor="whatsapp-token">Token do WhatsApp Business</Label>
              <div className="flex gap-2">
                <Input
                  id="whatsapp-token"
                  type="password"
                  value={formData.oficialMetaWhatsappAccessToken}
                  readOnly
                  placeholder="••••••••••••••••••••••••••••••••"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handlePasteToken}
                  title="Colar token do clipboard"
                >
                  <Clipboard className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {formData.oficialMetaWhatsappAccessToken && (
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
            )}
          </>
        )}
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