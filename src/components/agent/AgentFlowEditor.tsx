import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Trash2, Plus, ArrowDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AgentApiService } from '@/services/agentApiService';
import { ApiAgent, Flow, FlowStep } from '@/types/agent-api';

interface AgentFlowEditorProps {
  agent: ApiAgent;
  onUpdate: (agent: ApiAgent) => void;
}

export function AgentFlowEditor({ agent, onUpdate }: AgentFlowEditorProps) {
  const [loading, setLoading] = useState(false);
  const [flows, setFlows] = useState<Flow[]>(
    Array.isArray(agent.flow) ? agent.flow : []
  );
  const [newFlow, setNewFlow] = useState({
    name: '',
    keywords: [] as string[],
    steps: [] as FlowStep[]
  });
  const [newKeyword, setNewKeyword] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await AgentApiService.updateAgent(agent.id.toString(), {
        flow: flows
      });
      onUpdate(response.agent);
      toast({
        title: "Sucesso",
        description: "Fluxos conversacionais atualizados com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar fluxos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addFlow = () => {
    if (newFlow.name.trim()) {
      const flow: Flow = {
        ...newFlow,
        keywords: [...newFlow.keywords]
      };
      setFlows(prev => [...prev, flow]);
      setNewFlow({
        name: '',
        keywords: [],
        steps: []
      });
    }
  };

  const removeFlow = (index: number) => {
    setFlows(prev => prev.filter((_, i) => i !== index));
  };

  const updateFlow = (index: number, updates: Partial<Flow>) => {
    setFlows(prev => prev.map((flow, i) => 
      i === index ? { ...flow, ...updates } : flow
    ));
  };

  const addKeyword = (flowIndex?: number) => {
    if (newKeyword.trim()) {
      if (flowIndex !== undefined) {
        updateFlow(flowIndex, {
          keywords: [...flows[flowIndex].keywords, newKeyword.trim()]
        });
      } else {
        setNewFlow(prev => ({
          ...prev,
          keywords: [...prev.keywords, newKeyword.trim()]
        }));
      }
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword: string, flowIndex?: number) => {
    if (flowIndex !== undefined) {
      updateFlow(flowIndex, {
        keywords: flows[flowIndex].keywords.filter(k => k !== keyword)
      });
    } else {
      setNewFlow(prev => ({
        ...prev,
        keywords: prev.keywords.filter(k => k !== keyword)
      }));
    }
  };

  const addStep = (flowIndex: number) => {
    const newStep: FlowStep = {
      id: crypto.randomUUID(),
      objective: '',
      condition: '',
      files: [],
      possibleAudio: false
    };
    
    updateFlow(flowIndex, {
      steps: [...flows[flowIndex].steps, newStep]
    });
  };

  const updateStep = (flowIndex: number, stepId: string, updates: Partial<FlowStep>) => {
    const flow = flows[flowIndex];
    const updatedSteps = flow.steps.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    );
    updateFlow(flowIndex, { steps: updatedSteps });
  };

  const removeStep = (flowIndex: number, stepId: string) => {
    const flow = flows[flowIndex];
    updateFlow(flowIndex, {
      steps: flow.steps.filter(step => step.id !== stepId)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Criar Novo Fluxo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="flow-name">Nome do Fluxo</Label>
            <Input
              id="flow-name"
              value={newFlow.name}
              onChange={(e) => setNewFlow(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Atendimento Inicial"
            />
          </div>

          <div className="space-y-2">
            <Label>Palavras-chave</Label>
            <div className="flex gap-2">
              <Input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Adicionar palavra-chave"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
              />
              <Button type="button" onClick={() => addKeyword()} variant="outline">
                Adicionar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {newFlow.keywords.map((keyword) => (
                <Badge key={keyword} variant="secondary" className="gap-1">
                  {keyword}
                  <Trash2 className="h-3 w-3 cursor-pointer" onClick={() => removeKeyword(keyword)} />
                </Badge>
              ))}
            </div>
          </div>

          <Button type="button" onClick={addFlow} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Criar Fluxo
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {flows.map((flow, flowIndex) => (
          <Card key={flowIndex}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{flow.name}</CardTitle>
                <Button 
                  type="button"
                  variant="destructive" 
                  size="sm"
                  onClick={() => removeFlow(flowIndex)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nome do Fluxo</Label>
                <Input
                  value={flow.name}
                  onChange={(e) => updateFlow(flowIndex, { name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Palavras-chave</Label>
                <div className="flex gap-2">
                  <Input
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="Adicionar palavra-chave"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword(flowIndex))}
                  />
                  <Button type="button" onClick={() => addKeyword(flowIndex)} variant="outline">
                    Adicionar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {flow.keywords.map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="gap-1">
                      {keyword}
                      <Trash2 className="h-3 w-3 cursor-pointer" onClick={() => removeKeyword(keyword, flowIndex)} />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Etapas do Fluxo ({flow.steps.length})</Label>
                  <Button type="button" onClick={() => addStep(flowIndex)} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar Etapa
                  </Button>
                </div>

                {flow.steps.map((step, stepIndex) => (
                  <div key={step.id}>
                    <Card className="bg-muted/30">
                      <CardContent className="pt-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Etapa {stepIndex + 1}</Label>
                            <Button 
                              type="button"
                              variant="destructive" 
                              size="sm"
                              onClick={() => removeStep(flowIndex, step.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="space-y-2">
                            <Label>Objetivo</Label>
                            <Textarea
                              value={step.objective}
                              onChange={(e) => updateStep(flowIndex, step.id, { objective: e.target.value })}
                              placeholder="Descreva o objetivo desta etapa..."
                              rows={2}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Condição</Label>
                            <Input
                              value={step.condition}
                              onChange={(e) => updateStep(flowIndex, step.id, { condition: e.target.value })}
                              placeholder="cliente.informado === false"
                            />
                          </div>

                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={step.possibleAudio}
                              onCheckedChange={(checked) => updateStep(flowIndex, step.id, { possibleAudio: checked })}
                            />
                            <Label>Resposta em áudio possível</Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {stepIndex < flow.steps.length - 1 && (
                      <div className="flex justify-center py-2">
                        <ArrowDown className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Salvando...' : 'Salvar Fluxos'}
      </Button>
    </form>
  );
}