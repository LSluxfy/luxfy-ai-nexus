import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { AgentApiService } from '@/services/agentApiService';
import { ApiAgent } from '@/types/agent-api';

interface AgentAIConfigProps {
  agent: ApiAgent;
  onUpdate: (agent: ApiAgent) => void;
}

export function AgentAIConfig({ agent, onUpdate }: AgentAIConfigProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    model: agent.model,
    delayResponse: agent.delayResponse,
    styleResponse: agent.styleResponse,
    transferInDistrust: agent.transferInDistrust,
    ElevenLabsApiKey: agent.ElevenLabsApiKey || '',
    selectVoiceId: agent.selectVoiceId || '',
    appointmentsRules: agent.appointmentsRules,
    appointmentsDefaultDuration: agent.appointmentsDefaultDuration,
    appointmentsStartTime: agent.appointmentsStartTime,
    appointmentsEndTime: agent.appointmentsEndTime
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const timestamp = new Date().toISOString();
      console.log(`🚀 [AI CONFIG UPDATE] ${timestamp} - Atualizando configurações de IA do agente ${agent.id}`);
      console.log(`📦 [AI CONFIG DATA] ${timestamp}`, formData);
      
      const response = await AgentApiService.updateAgent(agent.id.toString(), formData);
      
      console.log(`✅ [AI CONFIG SUCCESS] ${timestamp} - Configurações de IA atualizadas com sucesso`);
      console.log(`📦 [AI CONFIG RESPONSE] ${timestamp}`, response.agent);
      
      onUpdate(response.agent);
      toast({
        title: "Sucesso",
        description: "Configurações de IA atualizadas com sucesso!",
      });
    } catch (error: any) {
      const timestamp = new Date().toISOString();
      console.error(`❌ [AI CONFIG ERROR] ${timestamp} - Erro ao atualizar configurações de IA`, error);
      console.error(`🔍 [AI CONFIG ERROR DETAILS] ${timestamp}`, {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      toast({
        title: "Erro",
        description: "Erro ao atualizar configurações de IA",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Configurações do Modelo IA</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="model">Modelo de IA</Label>
            <Select value={formData.model} onValueChange={(value) => setFormData(prev => ({ ...prev, model: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lxf-1.0">LXF-1.0</SelectItem>
                <SelectItem value="gpt-4.0-turbo">GPT-4.0 Turbo</SelectItem>
                <SelectItem value="gpt-4o">GPT-4o</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="style">Estilo de Resposta</Label>
            <Select value={formData.styleResponse} onValueChange={(value) => setFormData(prev => ({ ...prev, styleResponse: value as any }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CONCISE">Conciso</SelectItem>
                <SelectItem value="BALANCED">Equilibrado</SelectItem>
                <SelectItem value="DETAILED">Detalhado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="delay">Delay de Resposta (ms)</Label>
          <Input
            id="delay"
            type="number"
            value={formData.delayResponse}
            onChange={(e) => setFormData(prev => ({ ...prev, delayResponse: parseInt(e.target.value) }))}
            min="0"
            max="10000"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.transferInDistrust}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, transferInDistrust: checked }))}
          />
          <Label>Transferir quando não confiante</Label>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Configurações de Voz (ElevenLabs)</h3>
        
        <div className="space-y-2">
          <Label htmlFor="elevenlabs-key">Chave API ElevenLabs</Label>
          <Input
            id="elevenlabs-key"
            type="password"
            value={formData.ElevenLabsApiKey}
            onChange={(e) => setFormData(prev => ({ ...prev, ElevenLabsApiKey: e.target.value }))}
            placeholder="sk_..."
          />
        </div>

      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Configurações de Agendamento</h3>
        
        <div className="space-y-2">
          <Label htmlFor="appointment-rules">Regras de Agendamento</Label>
          <Textarea
            id="appointment-rules"
            value={formData.appointmentsRules}
            onChange={(e) => setFormData(prev => ({ ...prev, appointmentsRules: e.target.value }))}
            rows={3}
            placeholder="Ex: Não agendar aos domingos e sempre no horário comercial"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="default-duration">Duração Padrão (min)</Label>
            <Input
              id="default-duration"
              type="number"
              value={formData.appointmentsDefaultDuration}
              onChange={(e) => setFormData(prev => ({ ...prev, appointmentsDefaultDuration: parseInt(e.target.value) }))}
              min="15"
              max="480"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="start-time">Hora Início</Label>
            <Input
              id="start-time"
              type="time"
              value={formData.appointmentsStartTime}
              onChange={(e) => setFormData(prev => ({ ...prev, appointmentsStartTime: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-time">Hora Fim</Label>
            <Input
              id="end-time"
              type="time"
              value={formData.appointmentsEndTime}
              onChange={(e) => setFormData(prev => ({ ...prev, appointmentsEndTime: e.target.value }))}
            />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Salvando...' : 'Salvar Configurações'}
      </Button>
    </form>
  );
}