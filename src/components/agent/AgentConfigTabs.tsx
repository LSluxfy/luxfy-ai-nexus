
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AgentBasicConfig } from './AgentBasicConfig';
import { AgentWhatsAppConfig } from './AgentWhatsAppConfig';
import { AgentAIConfig } from './AgentAIConfig';
import { AgentTraining } from './AgentTraining';
import { AgentFlowEditor } from './AgentFlowEditor';
import { AgentSimulator } from './AgentSimulator';
import { AgentWhatsApp } from './AgentWhatsApp';
import { AgentCampaigns } from './AgentCampaigns';
import { AgentMetrics } from './AgentMetrics';
import { AgentChats } from './AgentChats';
import { AgentAppointments } from './AgentAppointments';
import { ApiAgent } from '@/types/agent-api';
import { useNavigate } from 'react-router-dom';

interface AgentConfigTabsProps {
  agent: ApiAgent;
  onUpdate: (agent: ApiAgent) => void;
}

export function AgentConfigTabs({ agent, onUpdate }: AgentConfigTabsProps) {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{agent.name}</h1>
        <p className="text-muted-foreground">{agent.description}</p>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="flex flex-wrap gap-1 h-auto p-2 bg-muted rounded-lg overflow-x-auto">
          <TabsTrigger value="basic">Básico</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="ai">IA</TabsTrigger>
          <TabsTrigger value="training">Treinamento</TabsTrigger>
          <TabsTrigger value="flows">Fluxos</TabsTrigger>
          <TabsTrigger value="simulator">Simulador</TabsTrigger>
          <TabsTrigger value="connection">Conexão</TabsTrigger>
          <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="chats">Chats</TabsTrigger>
          <TabsTrigger value="appointments">Agenda</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Básicas</CardTitle>
              <CardDescription>Informações gerais do agente</CardDescription>
            </CardHeader>
            <CardContent>
              <AgentBasicConfig agent={agent} onUpdate={onUpdate} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whatsapp">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do WhatsApp</CardTitle>
              <CardDescription>Configuração da integração com WhatsApp Business</CardDescription>
            </CardHeader>
            <CardContent>
              <AgentWhatsAppConfig agent={agent} onUpdate={onUpdate} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de IA</CardTitle>
              <CardDescription>Modelo, estilo de resposta e comportamento</CardDescription>
            </CardHeader>
            <CardContent>
              <AgentAIConfig agent={agent} onUpdate={onUpdate} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training">
          <Card>
            <CardHeader>
              <CardTitle>Treinamento Q&A</CardTitle>
              <CardDescription>Perguntas e respostas para treinamento do agente</CardDescription>
            </CardHeader>
            <CardContent>
              <AgentTraining agent={agent} onUpdate={onUpdate} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flows">
          <Card>
            <CardHeader>
              <CardTitle>Fluxos Conversacionais</CardTitle>
              <CardDescription>Criar e gerenciar fluxos de conversa</CardDescription>
            </CardHeader>
            <CardContent>
              <AgentFlowEditor agent={agent} onUpdate={onUpdate} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulator">
          <Card>
            <CardHeader>
              <CardTitle>Simulador de Conversa</CardTitle>
              <CardDescription>Teste o agente com conversas simuladas</CardDescription>
            </CardHeader>
            <CardContent>
              <AgentSimulator agent={agent} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connection">
          <Card>
            <CardHeader>
              <CardTitle>Conexão WhatsApp</CardTitle>
              <CardDescription>Conectar e gerenciar a conexão com WhatsApp</CardDescription>
            </CardHeader>
            <CardContent>
              <AgentWhatsApp agent={agent} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>Campanhas</CardTitle>
              <CardDescription>Gerenciar campanhas de marketing</CardDescription>
            </CardHeader>
            <CardContent>
              <AgentCampaigns agentId={agent.id.toString()} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle>Métricas e Analytics</CardTitle>
              <CardDescription>Visualizar performance do agente</CardDescription>
            </CardHeader>
            <CardContent>
              <AgentMetrics agent={agent} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chats">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Chats</CardTitle>
              <CardDescription>Visualizar conversas e histórico</CardDescription>
            </CardHeader>
            <CardContent>
              <AgentChats agent={agent} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Agendamentos</CardTitle>
              <CardDescription>Gerenciar agenda e compromissos</CardDescription>
            </CardHeader>
            <CardContent>
              <AgentAppointments agent={agent} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
