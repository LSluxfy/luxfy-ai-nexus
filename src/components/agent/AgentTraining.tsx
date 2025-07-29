import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Trash2, Plus, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AgentApiService } from '@/services/agentApiService';
import { ApiAgent, ApprenticeshipItem } from '@/types/agent-api';
import { SimpleFileUpload } from '@/components/upload/SimpleFileUpload';

interface AgentTrainingProps {
  agent: ApiAgent;
  onUpdate: (agent: ApiAgent) => void;
}

export function AgentTraining({ agent, onUpdate }: AgentTrainingProps) {
  const [loading, setLoading] = useState(false);
  const [apprenticeship, setApprenticeship] = useState<ApprenticeshipItem[]>(
    Array.isArray(agent.apprenticeship) ? agent.apprenticeship : []
  );
  const [newItem, setNewItem] = useState({
    question: '',
    response: '',
    files: [] as string[],
    exact: false
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Enviando dados de treinamento:', { apprenticeship });
      const response = await AgentApiService.updateAgent(agent.id.toString(), {
        apprenticeship
      });
      onUpdate(response.agent);
      toast({
        title: "Sucesso",
        description: "Treinamento atualizado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar treinamento",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addApprenticeshipItem = () => {
    if (newItem.question.trim() && newItem.response.trim()) {
      const item: ApprenticeshipItem = {
        ...newItem,
        id: crypto.randomUUID()
      };
      setApprenticeship(prev => [...prev, item]);
      setNewItem({
        question: '',
        response: '',
        files: [],
        exact: false
      });
    }
  };

  const removeApprenticeshipItem = (id: string) => {
    setApprenticeship(prev => prev.filter(item => item.id !== id));
  };

  const updateApprenticeshipItem = (id: string, updates: Partial<ApprenticeshipItem>) => {
    setApprenticeship(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const handleFileUpload = (urls: string[]) => {
    setNewItem(prev => ({ 
      ...prev, 
      files: [...prev.files, ...urls] 
    }));
  };

  const removeFile = (fileUrl: string, itemId?: string) => {
    if (itemId) {
      updateApprenticeshipItem(itemId, {
        files: apprenticeship.find(item => item.id === itemId)?.files.filter(f => f !== fileUrl) || []
      });
    } else {
      setNewItem(prev => ({
        ...prev,
        files: prev.files.filter(f => f !== fileUrl)
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Adicionar Nova Pergunta e Resposta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">Pergunta</Label>
            <Input
              id="question"
              value={newItem.question}
              onChange={(e) => setNewItem(prev => ({ ...prev, question: e.target.value }))}
              placeholder="Como posso ajudá-lo?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="response">Resposta</Label>
            <Textarea
              id="response"
              value={newItem.response}
              onChange={(e) => setNewItem(prev => ({ ...prev, response: e.target.value }))}
              rows={3}
              placeholder="Estou aqui para ajudar com suas dúvidas..."
            />
          </div>

          <div className="space-y-2">
            <Label>Arquivos de Apoio</Label>
            <SimpleFileUpload onUploadComplete={handleFileUpload} />
            {newItem.files.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {newItem.files.map((file) => (
                  <Badge key={file} variant="secondary" className="gap-1">
                    📎 {file.split('/').pop()}
                    <Trash2 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeFile(file)} 
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={newItem.exact}
              onCheckedChange={(checked) => setNewItem(prev => ({ ...prev, exact: checked }))}
            />
            <Label>Correspondência exata</Label>
          </div>

          <Button type="button" onClick={addApprenticeshipItem} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Item
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Itens de Treinamento ({apprenticeship.length})</h3>
        
        {apprenticeship.map((item) => (
          <Card key={item.id}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Pergunta</Label>
                  <Input
                    value={item.question}
                    onChange={(e) => updateApprenticeshipItem(item.id, { question: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Resposta</Label>
                  <Textarea
                    value={item.response}
                    onChange={(e) => updateApprenticeshipItem(item.id, { response: e.target.value })}
                    rows={3}
                  />
                </div>

                {item.files.length > 0 && (
                  <div className="space-y-2">
                    <Label>Arquivos</Label>
                    <div className="flex flex-wrap gap-2">
                      {item.files.map((file) => (
                        <Badge key={file} variant="secondary" className="gap-1">
                          📎 {file.split('/').pop()}
                          <Trash2 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeFile(file, item.id)} 
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={item.exact}
                      onCheckedChange={(checked) => updateApprenticeshipItem(item.id, { exact: checked })}
                    />
                    <Label>Correspondência exata</Label>
                  </div>
                  
                  <Button 
                    type="button"
                    variant="destructive" 
                    size="sm"
                    onClick={() => removeApprenticeshipItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Salvando...' : 'Salvar Treinamento'}
      </Button>
    </form>
  );
}