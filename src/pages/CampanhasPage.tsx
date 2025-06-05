
import React, { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Plus, 
  Megaphone, 
  MessageSquare, 
  Mail, 
  Users, 
  Upload, 
  Play, 
  Pause, 
  Edit, 
  Trash2, 
  Download,
  FileText,
  Target,
  Calendar,
  BarChart3
} from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  type: 'whatsapp' | 'email';
  status: 'draft' | 'active' | 'paused' | 'completed';
  audience: {
    type: 'tags' | 'upload';
    tags?: string[];
    uploadedList?: string;
  };
  message: string;
  subject?: string; // Para emails
  sentCount: number;
  totalCount: number;
  openRate?: number;
  clickRate?: number;
  createdAt: string;
  scheduledAt?: string;
}

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Promoção Black Friday',
    type: 'whatsapp',
    status: 'active',
    audience: {
      type: 'tags',
      tags: ['urgente', 'qualificado']
    },
    message: 'Olá! Aproveite nossa promoção especial de Black Friday com 50% de desconto em todos os planos!',
    sentCount: 150,
    totalCount: 200,
    openRate: 85,
    clickRate: 12,
    createdAt: '2024-01-15',
    scheduledAt: '2024-01-16 09:00'
  },
  {
    id: '2',
    name: 'Newsletter Semanal',
    type: 'email',
    status: 'completed',
    audience: {
      type: 'upload',
      uploadedList: 'lista-newsletter.csv'
    },
    subject: 'Novidades da semana - Luxfy',
    message: 'Confira as principais novidades e atualizações da plataforma Luxfy desta semana.',
    sentCount: 500,
    totalCount: 500,
    openRate: 65,
    clickRate: 8,
    createdAt: '2024-01-10'
  }
];

const availableTags = ['urgente', 'qualificado', 'interesse-premium', 'novo-lead', 'follow-up'];

const CampanhasPage = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newCampaign, setNewCampaign] = useState<Partial<Campaign>>({
    type: 'whatsapp',
    audience: { type: 'tags', tags: [] },
    status: 'draft'
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleCreateCampaign = () => {
    if (!newCampaign.name || !newCampaign.message) return;

    const campaign: Campaign = {
      id: Date.now().toString(),
      name: newCampaign.name,
      type: newCampaign.type as 'whatsapp' | 'email',
      status: 'draft',
      audience: newCampaign.audience?.type === 'upload' 
        ? { type: 'upload', uploadedList: uploadedFile?.name || '' }
        : { type: 'tags', tags: selectedTags },
      message: newCampaign.message,
      subject: newCampaign.subject,
      sentCount: 0,
      totalCount: selectedTags.length * 50, // Mock calculation
      createdAt: new Date().toISOString().split('T')[0]
    };

    setCampaigns([...campaigns, campaign]);
    setShowCreateDialog(false);
    setNewCampaign({ type: 'whatsapp', audience: { type: 'tags', tags: [] }, status: 'draft' });
    setSelectedTags([]);
    setUploadedFile(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setNewCampaign({
        ...newCampaign,
        audience: { type: 'upload', uploadedList: file.name }
      });
    }
  };

  const toggleTag = (tag: string) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(updatedTags);
    setNewCampaign({
      ...newCampaign,
      audience: { type: 'tags', tags: updatedTags }
    });
  };

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return 'Ativa';
      case 'paused': return 'Pausada';
      case 'completed': return 'Concluída';
      default: return 'Rascunho';
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader title="Campanhas de Marketing" />
      
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Campanhas</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Crie e gerencie campanhas de WhatsApp e Email
            </p>
          </div>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-luxfy-purple hover:bg-luxfy-darkPurple">
                <Plus className="mr-2" size={16} />
                Nova Campanha
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Criar Nova Campanha</DialogTitle>
                <DialogDescription>
                  Configure sua campanha de marketing
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="campaign-name">Nome da Campanha</Label>
                    <Input
                      id="campaign-name"
                      placeholder="Ex: Promoção Black Friday"
                      value={newCampaign.name || ''}
                      onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="campaign-type">Tipo de Campanha</Label>
                    <Select 
                      value={newCampaign.type} 
                      onValueChange={(value) => setNewCampaign({ ...newCampaign, type: value as 'whatsapp' | 'email' })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="whatsapp">
                          <div className="flex items-center gap-2">
                            <MessageSquare size={16} />
                            WhatsApp
                          </div>
                        </SelectItem>
                        <SelectItem value="email">
                          <div className="flex items-center gap-2">
                            <Mail size={16} />
                            Email
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {newCampaign.type === 'email' && (
                  <div>
                    <Label htmlFor="email-subject">Assunto do Email</Label>
                    <Input
                      id="email-subject"
                      placeholder="Ex: Promoção especial só para você!"
                      value={newCampaign.subject || ''}
                      onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
                    />
                  </div>
                )}

                <div>
                  <Label>Público-alvo</Label>
                  <Tabs 
                    value={newCampaign.audience?.type || 'tags'} 
                    onValueChange={(value) => setNewCampaign({ 
                      ...newCampaign, 
                      audience: { type: value as 'tags' | 'upload', tags: [], uploadedList: '' } 
                    })}
                    className="mt-2"
                  >
                    <TabsList>
                      <TabsTrigger value="tags" className="flex items-center gap-2">
                        <Target size={16} />
                        Por Tags
                      </TabsTrigger>
                      <TabsTrigger value="upload" className="flex items-center gap-2">
                        <Upload size={16} />
                        Upload de Lista
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="tags" className="space-y-3">
                      <p className="text-sm text-gray-600">Selecione as tags dos usuários do CRM:</p>
                      <div className="flex flex-wrap gap-2">
                        {availableTags.map(tag => (
                          <Badge 
                            key={tag}
                            variant={selectedTags.includes(tag) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => toggleTag(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      {selectedTags.length > 0 && (
                        <p className="text-sm text-green-600">
                          {selectedTags.length} tag(s) selecionada(s) - Aproximadamente {selectedTags.length * 50} contatos
                        </p>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="upload" className="space-y-3">
                      <p className="text-sm text-gray-600">Faça upload de uma lista CSV com os contatos:</p>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <div className="space-y-2">
                          <Label htmlFor="file-upload" className="cursor-pointer">
                            <span className="text-sm font-medium text-luxfy-purple hover:text-luxfy-darkPurple">
                              Clique para fazer upload
                            </span>
                            <Input
                              id="file-upload"
                              type="file"
                              accept=".csv,.xlsx,.xls"
                              className="hidden"
                              onChange={handleFileUpload}
                            />
                          </Label>
                          <p className="text-xs text-gray-500">CSV, XLS ou XLSX até 10MB</p>
                        </div>
                        {uploadedFile && (
                          <div className="mt-3 text-sm text-green-600">
                            ✓ {uploadedFile.name} carregado com sucesso
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <div>
                  <Label htmlFor="campaign-message">
                    {newCampaign.type === 'email' ? 'Conteúdo do Email' : 'Mensagem do WhatsApp'}
                  </Label>
                  <Textarea
                    id="campaign-message"
                    placeholder={newCampaign.type === 'email' 
                      ? "Digite o conteúdo do seu email..." 
                      : "Digite sua mensagem do WhatsApp..."}
                    rows={4}
                    value={newCampaign.message || ''}
                    onChange={(e) => setNewCampaign({ ...newCampaign, message: e.target.value })}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateCampaign} className="bg-luxfy-purple hover:bg-luxfy-darkPurple">
                    Criar Campanha
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Cards de métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Campanhas</CardTitle>
              <Megaphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{campaigns.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Campanhas Ativas</CardTitle>
              <Play className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {campaigns.filter(c => c.status === 'active').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Enviado</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {campaigns.reduce((acc, c) => acc + c.sentCount, 0)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Abertura Média</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(campaigns.reduce((acc, c) => acc + (c.openRate || 0), 0) / campaigns.length) || 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de campanhas */}
        <Card>
          <CardHeader>
            <CardTitle>Suas Campanhas</CardTitle>
            <CardDescription>
              Gerencie todas as suas campanhas de marketing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Público</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead>Taxa de Abertura</TableHead>
                  <TableHead>Criada em</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {campaign.type === 'whatsapp' ? (
                          <MessageSquare size={16} className="text-green-600" />
                        ) : (
                          <Mail size={16} className="text-blue-600" />
                        )}
                        {campaign.type === 'whatsapp' ? 'WhatsApp' : 'Email'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(campaign.status)}>
                        {getStatusLabel(campaign.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {campaign.audience.type === 'tags' ? (
                        <div className="flex flex-wrap gap-1">
                          {campaign.audience.tags?.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {(campaign.audience.tags?.length || 0) > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{(campaign.audience.tags?.length || 0) - 2}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-sm">
                          <FileText size={14} />
                          {campaign.audience.uploadedList}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="text-sm">
                          {campaign.sentCount}/{campaign.totalCount}
                        </div>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-luxfy-purple h-2 rounded-full" 
                            style={{ width: `${(campaign.sentCount / campaign.totalCount) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {campaign.openRate ? `${campaign.openRate}%` : '-'}
                    </TableCell>
                    <TableCell>{campaign.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {campaign.status === 'active' ? (
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Pause size={14} />
                          </Button>
                        ) : campaign.status === 'draft' ? (
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Play size={14} />
                          </Button>
                        ) : null}
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                          <Trash2 size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CampanhasPage;
