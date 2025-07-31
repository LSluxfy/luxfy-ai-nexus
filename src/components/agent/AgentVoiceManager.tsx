import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { AgentApiService } from '@/services/agentApiService';
import { ClonedVoice, ApiAgent } from '@/types/agent-api';
import { Upload, Trash2, Star, StarOff, Plus, Mic } from 'lucide-react';

interface AgentVoiceManagerProps {
  agent: ApiAgent;
  onUpdate: (agent: ApiAgent) => void;
}

export function AgentVoiceManager({ agent, onUpdate }: AgentVoiceManagerProps) {
  const [voices, setVoices] = useState<ClonedVoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCloneDialogOpen, setIsCloneDialogOpen] = useState(false);
  const [cloneForm, setCloneForm] = useState({
    name: '',
    description: '',
    labels: '',
    files: [] as File[]
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchVoices();
  }, [agent.id]);

  const fetchVoices = async () => {
    try {
      setLoading(true);
      const voicesData = await AgentApiService.getAgentVoices(agent.id.toString());
      setVoices(voicesData);
    } catch (error) {
      toast({
        title: "Erro ao carregar vozes",
        description: "Não foi possível carregar as vozes clonadas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloneVoice = async () => {
    if (!cloneForm.name || !cloneForm.description || cloneForm.files.length === 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos e adicione pelo menos um arquivo de áudio.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await AgentApiService.cloneVoice(agent.id.toString(), cloneForm);
      
      toast({
        title: "Clonagem iniciada",
        description: "A clonagem da voz foi iniciada. Isso pode levar alguns minutos.",
      });

      setIsCloneDialogOpen(false);
      setCloneForm({ name: '', description: '', labels: '', files: [] });
      
      // Recarregar vozes após um tempo
      setTimeout(() => {
        fetchVoices();
      }, 3000);
    } catch (error) {
      toast({
        title: "Erro na clonagem",
        description: "Não foi possível iniciar a clonagem da voz.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVoice = async (voiceId: number) => {
    try {
      setLoading(true);
      await AgentApiService.deleteVoice(voiceId.toString());
      
      toast({
        title: "Voz deletada",
        description: "A voz foi deletada com sucesso.",
      });

      fetchVoices();
    } catch (error) {
      toast({
        title: "Erro ao deletar",
        description: "Não foi possível deletar a voz.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetMainVoice = async (voiceId: string) => {
    try {
      const updatedAgent = { ...agent, selectVoiceId: voiceId };
      await AgentApiService.updateAgent(agent.id.toString(), { selectVoiceId: voiceId });
      onUpdate(updatedAgent);
      
      toast({
        title: "Voz principal definida",
        description: "A voz principal foi atualizada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao definir voz principal",
        description: "Não foi possível definir a voz como principal.",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 10) {
      toast({
        title: "Muitos arquivos",
        description: "Você pode enviar no máximo 10 arquivos.",
        variant: "destructive",
      });
      return;
    }

    const invalidFiles = files.filter(file => file.size > 10 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      toast({
        title: "Arquivos muito grandes",
        description: "Cada arquivo deve ter no máximo 10MB.",
        variant: "destructive",
      });
      return;
    }

    setCloneForm(prev => ({ ...prev, files }));
  };

  if (!agent.ElevenLabsApiKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Gerenciamento de Vozes
          </CardTitle>
          <CardDescription>
            Configure uma chave API do ElevenLabs para gerenciar vozes clonadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            Para usar o gerenciamento de vozes, configure primeiro sua chave API do ElevenLabs na aba "IA".
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Gerenciamento de Vozes
              </CardTitle>
              <CardDescription>
                Clone, gerencie e defina a voz principal do seu agente
              </CardDescription>
            </div>
            <Dialog open={isCloneDialogOpen} onOpenChange={setIsCloneDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Clonar Voz
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Clonar Nova Voz</DialogTitle>
                  <DialogDescription>
                    Envie arquivos de áudio para criar uma voz clonada personalizada
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="voice-name">Nome da Voz</Label>
                    <Input
                      id="voice-name"
                      value={cloneForm.name}
                      onChange={(e) => setCloneForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Voz do Atendente"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="voice-description">Descrição</Label>
                    <Textarea
                      id="voice-description"
                      value={cloneForm.description}
                      onChange={(e) => setCloneForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descreva as características da voz"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="voice-labels">Etiquetas</Label>
                    <Input
                      id="voice-labels"
                      value={cloneForm.labels}
                      onChange={(e) => setCloneForm(prev => ({ ...prev, labels: e.target.value }))}
                      placeholder="Ex: formal, masculina, brasileira"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="voice-files">Arquivos de Áudio</Label>
                    <Input
                      id="voice-files"
                      type="file"
                      multiple
                      accept="audio/*"
                      onChange={handleFileChange}
                    />
                    <div className="text-sm text-muted-foreground">
                      Máximo 10 arquivos, 10MB cada. Formatos: MP3, WAV, FLAC
                    </div>
                    {cloneForm.files.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {cloneForm.files.map((file, index) => (
                          <Badge key={index} variant="secondary">
                            {file.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCloneDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCloneVoice} disabled={loading}>
                    {loading ? "Clonando..." : "Iniciar Clonagem"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Voz Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Voz Principal</CardTitle>
          <CardDescription>
            Defina qual voz será usada pelo agente nas conversas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Voz Selecionada</Label>
              <Select 
                value={agent.selectVoiceId || ''} 
                onValueChange={handleSetMainVoice}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar voz principal" />
                </SelectTrigger>
                <SelectContent>
                  {/* Vozes padrão do ElevenLabs */}
                  <SelectItem value="9BWtsMINqrJLrRacOk9x">Aria (Padrão)</SelectItem>
                  <SelectItem value="CwhRBWXzGAHq8TQ4Fs17">Roger (Padrão)</SelectItem>
                  <SelectItem value="EXAVITQu4vr4xnSDxMaL">Sarah (Padrão)</SelectItem>
                  <SelectItem value="FGY2WhTYpPnrIDTdsKH5">Laura (Padrão)</SelectItem>
                  <SelectItem value="IKne3meq5aSn9XLyUdCD">Charlie (Padrão)</SelectItem>
                  
                  {voices.length > 0 && <Separator />}
                  
                  {/* Vozes clonadas */}
                  {voices.map((voice) => (
                    <SelectItem key={voice.id} value={voice.voiceId}>
                      {voice.voiceName} (Clonada)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Vozes Clonadas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Vozes Clonadas</CardTitle>
          <CardDescription>
            Gerencie suas vozes personalizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-muted-foreground">
              Carregando vozes...
            </div>
          ) : voices.length === 0 ? (
            <div className="text-center text-muted-foreground">
              Nenhuma voz clonada encontrada. Clone sua primeira voz para começar.
            </div>
          ) : (
            <div className="space-y-4">
              {voices.map((voice) => (
                <div key={voice.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{voice.voiceName}</h4>
                      {agent.selectVoiceId === voice.voiceId && (
                        <Badge variant="default">
                          <Star className="h-3 w-3 mr-1" />
                          Principal
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      ID: {voice.voiceId}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Criada em {new Date(voice.createAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {agent.selectVoiceId !== voice.voiceId && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetMainVoice(voice.voiceId)}
                      >
                        <StarOff className="h-4 w-4 mr-1" />
                        Definir como Principal
                      </Button>
                    )}
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Deletar Voz</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja deletar a voz "{voice.voiceName}"? 
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteVoice(voice.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Deletar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}