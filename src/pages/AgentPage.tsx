import React, { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Send, Plus, Settings, MessageSquare, Play, VolumeX, Volume2, Upload, Clock, QrCode, Trash2, FileText, Tag, X, ArrowDown, ArrowRight, GitBranch, Zap, File, Mic } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const AgentPage = () => {
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', content: 'Olá! Como posso ajudar você hoje?' },
  ]);
  const [message, setMessage] = useState('');
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [responseDelay, setResponseDelay] = useState(1);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Estados para o Fluxo
  const [flows, setFlows] = useState([
    {
      id: 1,
      name: 'Fluxo de Vendas',
      trigger: 'preço',
      steps: [
        { 
          id: 1, 
          type: 'message', 
          content: 'Entendi que você tem interesse em nossos preços!',
          hasAudio: false,
          audioFile: null,
          attachments: []
        },
        { 
          id: 2, 
          type: 'condition', 
          content: 'Cliente quer saber sobre planos?', 
          options: ['Sim', 'Não'],
          hasAudio: false,
          audioFile: null,
          attachments: []
        },
        { 
          id: 3, 
          type: 'message', 
          content: 'Temos 3 planos disponíveis: Básico, Pro e Enterprise.',
          hasAudio: true,
          audioFile: null,
          attachments: []
        },
        { 
          id: 4, 
          type: 'action', 
          content: 'Transferir para vendas',
          hasAudio: false,
          audioFile: null,
          attachments: []
        }
      ]
    }
  ]);
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [showNewFlowForm, setShowNewFlowForm] = useState(false);
  const [newFlowName, setNewFlowName] = useState('');
  const [newFlowTrigger, setNewFlowTrigger] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        { id: Date.now(), role: 'user', content: message },
      ]);
      
      setTimeout(() => {
        setMessages(prevMessages => [
          ...prevMessages,
          { 
            id: Date.now(), 
            role: 'ai', 
            content: 'Esta é uma resposta simulada do agente de IA.'
          },
        ]);
      }, responseDelay * 1000);
      
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAddQA = () => {
    if (newQuestion.trim() && newAnswer.trim()) {
      // Aqui adicionaria a nova pergunta e resposta
      setNewQuestion('');
      setNewAnswer('');
      setShowAddForm(false);
    }
  };

  const handleDeleteAgent = () => {
    // Lógica para deletar o agente
    console.log('Deletando agente...');
  };

  const addNewFlow = () => {
    if (newFlowName.trim() && newFlowTrigger.trim()) {
      const newFlow = {
        id: Date.now(),
        name: newFlowName,
        trigger: newFlowTrigger,
        steps: [
          { 
            id: Date.now() + 1, 
            type: 'message', 
            content: 'Mensagem inicial do fluxo',
            hasAudio: false,
            audioFile: null,
            attachments: []
          }
        ]
      };
      setFlows([...flows, newFlow]);
      setNewFlowName('');
      setNewFlowTrigger('');
      setShowNewFlowForm(false);
      console.log('Novo fluxo criado:', newFlow);
    }
  };

  const addStepToFlow = (flowId: number, stepType: string) => {
    console.log('Adicionando nova etapa:', { flowId, stepType });
    setFlows(prevFlows => prevFlows.map(flow => {
      if (flow.id === flowId) {
        const newStep = {
          id: Date.now() + Math.random(),
          type: stepType,
          content: stepType === 'message' ? 'Nova mensagem' : 
                   stepType === 'condition' ? 'Nova condição' : 
                   'Nova ação',
          options: stepType === 'condition' ? ['Sim', 'Não'] : undefined,
          hasAudio: false,
          audioFile: null,
          attachments: []
        };
        console.log('Nova etapa criada:', newStep);
        return { ...flow, steps: [...flow.steps, newStep] };
      }
      return flow;
    }));
  };

  const updateStepContent = (flowId: number, stepId: number, content: string) => {
    console.log('Atualizando conteúdo da etapa:', { flowId, stepId, content });
    setFlows(prevFlows => prevFlows.map(flow => {
      if (flow.id === flowId) {
        return {
          ...flow,
          steps: flow.steps.map(step => 
            step.id === stepId ? { ...step, content } : step
          )
        };
      }
      return flow;
    }));
  };

  const updateStepOption = (flowId: number, stepId: number, optionIndex: number, value: string) => {
    setFlows(prevFlows => prevFlows.map(flow => {
      if (flow.id === flowId) {
        return {
          ...flow,
          steps: flow.steps.map(step => {
            if (step.id === stepId && step.options) {
              const newOptions = [...step.options];
              newOptions[optionIndex] = value;
              return { ...step, options: newOptions };
            }
            return step;
          })
        };
      }
      return flow;
    }));
  };

  const toggleStepAudio = (flowId: number, stepId: number) => {
    console.log('Toggling audio para etapa:', { flowId, stepId });
    setFlows(prevFlows => prevFlows.map(flow => {
      if (flow.id === flowId) {
        return {
          ...flow,
          steps: flow.steps.map(step => 
            step.id === stepId ? { ...step, hasAudio: !step.hasAudio } : step
          )
        };
      }
      return flow;
    }));
  };

  const handleFileUpload = (flowId: number, stepId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log('Fazendo upload de arquivos:', files);
      setFlows(prevFlows => prevFlows.map(flow => {
        if (flow.id === flowId) {
          return {
            ...flow,
            steps: flow.steps.map(step => {
              if (step.id === stepId) {
                const newAttachments = [...(step.attachments || [])];
                Array.from(files).forEach(file => {
                  newAttachments.push({
                    id: Date.now() + Math.random(),
                    name: file.name,
                    size: file.size,
                    type: file.type
                  });
                });
                return { ...step, attachments: newAttachments };
              }
              return step;
            })
          };
        }
        return flow;
      }));
    }
  };

  const removeAttachment = (flowId: number, stepId: number, attachmentId: number) => {
    setFlows(prevFlows => prevFlows.map(flow => {
      if (flow.id === flowId) {
        return {
          ...flow,
          steps: flow.steps.map(step => {
            if (step.id === stepId) {
              return {
                ...step,
                attachments: step.attachments?.filter(att => att.id !== attachmentId) || []
              };
            }
            return step;
          })
        };
      }
      return flow;
    }));
  };

  const deleteStep = (flowId: number, stepId: number) => {
    console.log('Deletando etapa:', { flowId, stepId });
    setFlows(prevFlows => prevFlows.map(flow => {
      if (flow.id === flowId) {
        return {
          ...flow,
          steps: flow.steps.filter(step => step.id !== stepId)
        };
      }
      return flow;
    }));
  };

  const deleteFlow = (flowId: number) => {
    console.log('Deletando fluxo:', flowId);
    setFlows(prevFlows => prevFlows.filter(flow => flow.id !== flowId));
    if (selectedFlow?.id === flowId) {
      setSelectedFlow(null);
    }
  };

  const saveFlow = (flowId: number) => {
    console.log('Salvando fluxo:', flowId);
    const flow = flows.find(f => f.id === flowId);
    if (flow) {
      console.log('Fluxo salvo com sucesso:', flow);
      // Aqui você pode adicionar lógica para salvar no backend
      alert('Fluxo salvo com sucesso!');
    }
  };

  const StepTypeIcon = ({ type }: { type: string }) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'condition':
        return <GitBranch className="h-4 w-4 text-orange-500" />;
      case 'action':
        return <Zap className="h-4 w-4 text-green-500" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader title="Agente de IA" />
      
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Configure seu Assistente Virtual</h2>
          <p className="text-gray-600 dark:text-gray-300">Treine a IA para responder como você e automatize seu atendimento</p>
        </div>

        <Tabs defaultValue="simulator" className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="simulator">Simulador</TabsTrigger>
            <TabsTrigger value="training">Treinamento</TabsTrigger>
            <TabsTrigger value="flow">Fluxo</TabsTrigger>
            <TabsTrigger value="learning">Aprendizagem</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>
          
          {/* Simulador de Chat */}
          <TabsContent value="simulator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="col-span-2">
                <Card className="h-[600px] flex flex-col border-gray-200">
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="text-luxfy-purple" size={20} />
                      Simulador de Chat
                    </CardTitle>
                    <CardDescription>Teste como seu agente de IA responde às perguntas</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-auto p-4">
                    <div className="space-y-4 py-2">
                      {messages.map(msg => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg px-4 py-2 ${
                              msg.role === 'user'
                                ? 'bg-luxfy-purple text-white'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t p-4">
                    <div className="flex w-full items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-gray-500 hover:text-luxfy-purple"
                        onClick={() => setTtsEnabled(!ttsEnabled)}
                      >
                        {ttsEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                      </Button>
                      <Textarea
                        placeholder="Digite sua mensagem..."
                        className="flex-1 resize-none"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                      <Button 
                        onClick={handleSendMessage} 
                        size="icon" 
                        className="bg-luxfy-purple hover:bg-luxfy-darkPurple"
                      >
                        <Send size={18} />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>

              <div>
                <Card className="border-gray-200 mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Delay de Resposta
                    </CardTitle>
                    <CardDescription>Personalize o tempo de resposta da IA</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="delay">Delay em segundos: {responseDelay}s</Label>
                      <Input
                        id="delay"
                        type="number"
                        min="0"
                        max="10"
                        step="0.5"
                        value={responseDelay}
                        onChange={(e) => setResponseDelay(Number(e.target.value))}
                      />
                      <p className="text-xs text-gray-500">
                        Simula o tempo de "digitação" da IA
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle>Configurações do Simulador</CardTitle>
                    <CardDescription>Ajuste parâmetros para testar diferentes cenários</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nome do Cliente</label>
                      <Input placeholder="Ex: João Silva" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Produto de Interesse</label>
                      <Input placeholder="Ex: Plano Pro" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Cenário de Teste</label>
                      <select className="w-full border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-luxfy-purple focus:border-transparent">
                        <option>Dúvida sobre preços</option>
                        <option>Suporte técnico</option>
                        <option>Informação sobre produto</option>
                        <option>Reclamação</option>
                        <option>Agendamento</option>
                      </select>
                    </div>
                    <Button className="w-full bg-luxfy-purple hover:bg-luxfy-darkPurple">
                      <Play className="mr-2" size={16} /> Iniciar Simulação
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 mt-6">
                  <CardHeader>
                    <CardTitle>Desempenho do Agente</CardTitle>
                    <CardDescription>Métricas de eficiência do seu assistente</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Precisão das Respostas</span>
                        <span className="text-sm font-medium">92%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Tempo Médio de Resposta</span>
                        <span className="text-sm font-medium">1.2s</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Taxa de Transferência</span>
                        <span className="text-sm font-medium">15%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '15%' }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Treinamento */}
          <TabsContent value="training" className="space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Treinamento de IA</CardTitle>
                <CardDescription>Forneça informações para que seu agente aprenda a responder melhor</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-base font-medium">Sobre sua Empresa</label>
                  <Textarea
                    className="min-h-[120px]"
                    placeholder="Descreva sua empresa, produtos/serviços, valores e diferenciais..."
                  />
                  <p className="text-sm text-gray-500">
                    Estas informações serão usadas para que o agente entenda seu negócio
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-base font-medium">Produtos e Serviços</label>
                  <Textarea
                    className="min-h-[120px]"
                    placeholder="Liste seus produtos/serviços com descrições, preços e especificações..."
                  />
                  <p className="text-sm text-gray-500">
                    Quanto mais detalhes, melhor o agente poderá responder sobre sua oferta
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-base font-medium">Perguntas Frequentes</label>
                  <Textarea
                    className="min-h-[120px]"
                    placeholder="Liste perguntas comuns dos clientes e suas respectivas respostas..."
                  />
                  <p className="text-sm text-gray-500">
                    Isto ajudará a treinar o agente para as consultas mais comuns
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button className="bg-luxfy-purple hover:bg-luxfy-darkPurple">
                  Salvar e Treinar
                </Button>
                <Button variant="outline">
                  Cancelar
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Aba de Fluxo Completa */}
          <TabsContent value="flow" className="space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5 text-luxfy-purple" />
                  Fluxos de Atendimento
                </CardTitle>
                <CardDescription>
                  Crie fluxos automáticos baseados em palavras-chave para guiar o atendimento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Fluxos Criados</h3>
                    <Button 
                      className="bg-luxfy-purple hover:bg-luxfy-darkPurple"
                      onClick={() => setShowNewFlowForm(true)}
                    >
                      <Plus className="mr-2" size={16} /> Criar Novo Fluxo
                    </Button>
                  </div>

                  {showNewFlowForm && (
                    <Card className="border-2 border-luxfy-purple/20">
                      <CardHeader>
                        <CardTitle className="text-lg">Novo Fluxo de Atendimento</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="flowName">Nome do Fluxo</Label>
                          <Input
                            id="flowName"
                            placeholder="Ex: Fluxo de Vendas"
                            value={newFlowName}
                            onChange={(e) => setNewFlowName(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="trigger">Palavra-chave de Gatilho</Label>
                          <Input
                            id="trigger"
                            placeholder="Ex: preço, comprar, orçamento"
                            value={newFlowTrigger}
                            onChange={(e) => setNewFlowTrigger(e.target.value)}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Quando o cliente mencionar esta palavra, o fluxo será ativado
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={addNewFlow}>Criar Fluxo</Button>
                          <Button variant="outline" onClick={() => setShowNewFlowForm(false)}>Cancelar</Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Lista de Fluxos */}
                    <div className="space-y-4">
                      {flows.map((flow) => (
                        <Card 
                          key={flow.id} 
                          className={`border cursor-pointer transition-colors ${
                            selectedFlow?.id === flow.id 
                              ? 'border-luxfy-purple bg-luxfy-purple/5' 
                              : 'border-gray-200 hover:border-luxfy-purple/50'
                          }`}
                          onClick={() => setSelectedFlow(flow)}
                        >
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">{flow.name}</h4>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-500"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteFlow(flow.id);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-yellow-500" />
                                <span className="text-sm text-gray-600">
                                  Gatilho: "{flow.trigger}"
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">
                                {flow.steps.length} etapas configuradas
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Editor de Fluxo */}
                    <div>
                      {selectedFlow ? (
                        <Card className="border-gray-200">
                          <CardHeader>
                            <CardTitle className="text-lg">
                              Editando: {selectedFlow.name}
                            </CardTitle>
                            <CardDescription>
                              Gatilho: "{selectedFlow.trigger}"
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
                            <div className="space-y-3">
                              {selectedFlow.steps.map((step, index) => (
                                <div key={step.id} className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-luxfy-purple/10 rounded-full flex items-center justify-center text-sm font-medium">
                                      {index + 1}
                                    </div>
                                    <StepTypeIcon type={step.type} />
                                    <span className="text-sm font-medium capitalize">
                                      {step.type === 'message' ? 'Mensagem' :
                                       step.type === 'condition' ? 'Condição' : 'Ação'}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="ml-auto text-red-500"
                                      onClick={() => deleteStep(selectedFlow.id, step.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <Card className="ml-10 border">
                                    <CardContent className="p-3 space-y-3">
                                      <Textarea
                                        value={step.content}
                                        onChange={(e) => updateStepContent(selectedFlow.id, step.id, e.target.value)}
                                        className="text-sm"
                                        rows={2}
                                      />
                                      
                                      {/* Opções para condições */}
                                      {step.options && (
                                        <div className="space-y-1">
                                          <Label className="text-xs">Opções:</Label>
                                          {step.options.map((option, optIndex) => (
                                            <div key={optIndex} className="flex items-center gap-2">
                                              <ArrowRight className="h-3 w-3 text-gray-400" />
                                              <Input 
                                                value={option} 
                                                className="text-xs h-7"
                                                onChange={(e) => updateStepOption(selectedFlow.id, step.id, optIndex, e.target.value)}
                                              />
                                            </div>
                                          ))}
                                        </div>
                                      )}

                                      {/* Upload de Arquivos */}
                                      <div className="space-y-2">
                                        <Label className="text-xs">Anexos:</Label>
                                        <div className="flex items-center gap-2">
                                          <input
                                            type="file"
                                            multiple
                                            onChange={(e) => handleFileUpload(selectedFlow.id, step.id, e)}
                                            className="hidden"
                                            id={`file-upload-${step.id}`}
                                          />
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => document.getElementById(`file-upload-${step.id}`)?.click()}
                                          >
                                            <File className="h-3 w-3 mr-1" />
                                            Anexar Arquivo
                                          </Button>
                                        </div>
                                        
                                        {/* Lista de arquivos anexados */}
                                        {step.attachments && step.attachments.length > 0 && (
                                          <div className="space-y-1">
                                            {step.attachments.map((attachment) => (
                                              <div key={attachment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                                                <div className="flex items-center gap-2">
                                                  <FileText className="h-3 w-3 text-blue-500" />
                                                  <span>{attachment.name}</span>
                                                  <span className="text-gray-500">
                                                    ({Math.round(attachment.size / 1024)} KB)
                                                  </span>
                                                </div>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className="text-red-500 h-5 w-5 p-0"
                                                  onClick={() => removeAttachment(selectedFlow.id, step.id, attachment.id)}
                                                >
                                                  <X className="h-3 w-3" />
                                                </Button>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>

                                      {/* Opção de Áudio */}
                                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                        <div className="flex items-center gap-2">
                                          <Mic className="h-4 w-4 text-blue-500" />
                                          <Label className="text-xs">Enviar áudio nesta etapa</Label>
                                        </div>
                                        <Switch
                                          checked={step.hasAudio}
                                          onCheckedChange={() => toggleStepAudio(selectedFlow.id, step.id)}
                                        />
                                      </div>
                                      
                                      {step.hasAudio && (
                                        <div className="p-2 bg-blue-50 rounded">
                                          <p className="text-xs text-blue-600 mb-2">
                                            Áudio será enviado automaticamente nesta etapa
                                          </p>
                                          <Button variant="outline" size="sm">
                                            <Upload className="h-3 w-3 mr-1" />
                                            Upload Áudio
                                          </Button>
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>
                                  {index < selectedFlow.steps.length - 1 && (
                                    <div className="flex justify-center">
                                      <ArrowDown className="h-4 w-4 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>

                            <div className="border-t pt-4">
                              <Label className="text-sm font-medium">Adicionar Nova Etapa:</Label>
                              <div className="flex gap-2 mt-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    console.log('Clicou para adicionar mensagem');
                                    addStepToFlow(selectedFlow.id, 'message');
                                  }}
                                >
                                  <MessageSquare className="mr-1 h-3 w-3" />
                                  Mensagem
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    console.log('Clicou para adicionar condição');
                                    addStepToFlow(selectedFlow.id, 'condition');
                                  }}
                                >
                                  <GitBranch className="mr-1 h-3 w-3" />
                                  Condição
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    console.log('Clicou para adicionar ação');
                                    addStepToFlow(selectedFlow.id, 'action');
                                  }}
                                >
                                  <Zap className="mr-1 h-3 w-3" />
                                  Ação
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button 
                              className="bg-luxfy-purple hover:bg-luxfy-darkPurple"
                              onClick={() => saveFlow(selectedFlow.id)}
                            >
                              Salvar Fluxo
                            </Button>
                          </CardFooter>
                        </Card>
                      ) : (
                        <Card className="border-gray-200 h-96 flex items-center justify-center">
                          <div className="text-center text-gray-500">
                            <GitBranch size={48} className="mx-auto mb-4 text-gray-300" />
                            <h3 className="text-lg font-medium mb-2">Selecione um fluxo</h3>
                            <p>Escolha um fluxo da lista para editar suas etapas</p>
                          </div>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Aprendizagem */}
          <TabsContent value="learning" className="space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Aprendizagem por Perguntas e Respostas</CardTitle>
                <CardDescription>Configure respostas específicas para seu agente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Perguntas e Respostas</h3>
                    <Button 
                      className="bg-luxfy-purple hover:bg-luxfy-darkPurple"
                      onClick={() => setShowAddForm(true)}
                    >
                      <Plus className="mr-2" size={16} /> Adicionar Nova
                    </Button>
                  </div>

                  {showAddForm && (
                    <Card className="border-2 border-luxfy-purple/20">
                      <CardHeader>
                        <CardTitle className="text-lg">Nova Pergunta e Resposta</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="question">Pergunta</Label>
                          <Textarea
                            id="question"
                            placeholder="Digite a pergunta..."
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="answer">Resposta</Label>
                          <Textarea
                            id="answer"
                            placeholder="Digite a resposta..."
                            value={newAnswer}
                            onChange={(e) => setNewAnswer(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleAddQA}>Salvar</Button>
                          <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancelar</Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  <div className="space-y-4">
                    {[
                      { question: "Qual o preço do plano básico?", answer: "O plano básico custa R$ 97/mês", exact: true, hasFile: false },
                      { question: "Horário de atendimento", answer: "Funcionamos de segunda a sexta, das 9h às 18h", exact: false, hasFile: true },
                      { question: "Como funciona o suporte?", answer: "Nosso suporte é via chat e email", exact: true, hasFile: false }
                    ].map((item, index) => (
                      <Card key={index} className="border dark:border-gray-700">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-medium mb-1">Pergunta</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">{item.question}</p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-1">Resposta</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">{item.answer}</p>
                            </div>
                            {item.hasFile && (
                              <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                                <FileText className="h-4 w-4 text-blue-600" />
                                <span className="text-sm text-blue-600 dark:text-blue-400">documento-referencia.pdf</span>
                              </div>
                            )}
                            <div className="flex items-center justify-between pt-2 border-t">
                              <div className="flex items-center space-x-2">
                                <Switch checked={item.exact} />
                                <Label className="text-sm">
                                  {item.exact ? "Resposta Exata" : "Contexto para IA"}
                                </Label>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm">
                                  <Upload className="h-4 w-4 mr-1" />
                                  Arquivo
                                </Button>
                                <Button variant="ghost" size="sm">Editar</Button>
                                <Button variant="ghost" size="sm" className="text-red-500">Remover</Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Configurações */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Configurações do Agente</CardTitle>
                <CardDescription>Personalize o comportamento do seu assistente virtual</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome do Agente</label>
                    <Input defaultValue="Assistente" />
                    <p className="text-xs text-gray-500">
                      Como seu agente se apresentará aos clientes
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Língua Principal</label>
                    <select className="w-full border border-gray-200 rounded-md p-2 dark:border-gray-600 dark:bg-gray-800">
                      <option>Português (Brasil)</option>
                      <option>English (US)</option>
                      <option>Español</option>
                    </select>
                    <p className="text-xs text-gray-500">
                      Idioma principal usado pelo agente
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Delay de Resposta (segundos)</label>
                  <div className="flex items-center space-x-4">
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      value={responseDelay}
                      onChange={(e) => setResponseDelay(Number(e.target.value))}
                      className="w-32"
                    />
                    <span className="text-sm text-gray-600">{responseDelay}s - Simula tempo de digitação</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tom de Voz</label>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <input type="radio" id="formal" name="tone" className="peer hidden" defaultChecked />
                      <label htmlFor="formal" className="block cursor-pointer select-none rounded-md border border-gray-200 p-3 text-center peer-checked:border-luxfy-purple peer-checked:bg-luxfy-purple/10">
                        Formal
                      </label>
                    </div>
                    <div>
                      <input type="radio" id="casual" name="tone" className="peer hidden" />
                      <label htmlFor="casual" className="block cursor-pointer select-none rounded-md border border-gray-200 p-3 text-center peer-checked:border-luxfy-purple peer-checked:bg-luxfy-purple/10">
                        Casual
                      </label>
                    </div>
                    <div>
                      <input type="radio" id="friendly" name="tone" className="peer hidden" />
                      <label htmlFor="friendly" className="block cursor-pointer select-none rounded-md border border-gray-200 p-3 text-center peer-checked:border-luxfy-purple peer-checked:bg-luxfy-purple/10">
                        Amigável
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Estilo de Resposta</label>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <input type="radio" id="concise" name="style" className="peer hidden" />
                      <label htmlFor="concise" className="block cursor-pointer select-none rounded-md border border-gray-200 p-3 text-center peer-checked:border-luxfy-purple peer-checked:bg-luxfy-purple/10">
                        Conciso
                      </label>
                    </div>
                    <div>
                      <input type="radio" id="balanced" name="style" className="peer hidden" defaultChecked />
                      <label htmlFor="balanced" className="block cursor-pointer select-none rounded-md border border-gray-200 p-3 text-center peer-checked:border-luxfy-purple peer-checked:bg-luxfy-purple/10">
                        Balanceado
                      </label>
                    </div>
                    <div>
                      <input type="radio" id="detailed" name="style" className="peer hidden" />
                      <label htmlFor="detailed" className="block cursor-pointer select-none rounded-md border border-gray-200 p-3 text-center peer-checked:border-luxfy-purple peer-checked:bg-luxfy-purple/10">
                        Detalhado
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Integrações WhatsApp</label>
                  <div className="space-y-3">
                    <Card className="border">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <MessageSquare className="text-green-500" size={20} />
                            <div>
                              <p className="font-medium">API Oficial do WhatsApp</p>
                              <p className="text-sm text-gray-500">Integração via WhatsApp Business API</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Configurar API</Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <QrCode className="text-green-500" size={20} />
                            <div>
                              <p className="font-medium">QR Code WhatsApp</p>
                              <p className="text-sm text-gray-500">Conexão rápida via QR Code</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Gerar QR Code</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Integração com ElevenLabs (Voz)</label>
                  <div className="rounded-md border p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Volume2 className="text-gray-400" size={20} />
                        <div>
                          <p className="font-medium">Text-to-Speech</p>
                          <p className="text-sm text-gray-500">Não configurado • Opcional</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Configurar</Button>
                    </div>
                    <p className="text-xs text-amber-600 mt-2">
                      Nota: Esta integração requer uma chave API do ElevenLabs e terá custo adicional.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Configurações Avançadas</label>
                  <div className="flex items-center justify-between border rounded-md p-4">
                    <div>
                      <p className="font-medium">Transferir para humano se a confiança for baixa</p>
                      <p className="text-sm text-gray-500">Encaminha para atendentes humanos quando a IA tem dúvidas</p>
                    </div>
                    <div className="flex h-6 items-center">
                      <input
                        id="human-transfer"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-luxfy-purple focus:ring-luxfy-purple"
                        defaultChecked
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-red-600">Zona de Perigo</h3>
                    <div className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-red-800 dark:text-red-400">Excluir Agente</h4>
                          <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                            Esta ação não pode ser desfeita. Todos os dados de treinamento e configurações serão perdidos permanentemente.
                          </p>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir Agente
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir este agente? Esta ação é irreversível e todos os dados serão perdidos.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleDeleteAgent}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Excluir Permanentemente
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancelar</Button>
                <Button className="bg-luxfy-purple hover:bg-luxfy-darkPurple">
                  <Settings className="mr-2" size={16} /> Salvar Configurações
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AgentPage;
