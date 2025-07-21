import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, MoreHorizontal, Edit, Trash2, Calendar, Mail, MessageSquare, Clock } from 'lucide-react';
import { useAgentCampaigns } from '@/hooks/use-agent-campaigns';
import { Campaign } from '@/types/agent-api';
import { CampaignForm } from './CampaignForm';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AgentCampaignsProps {
  agentId: string;
}

export function AgentCampaigns({ agentId }: AgentCampaignsProps) {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { campaigns, loading, creating, updateCampaign, fetchCampaigns } = useAgentCampaigns(agentId);

  const handleEdit = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedCampaign(null);
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setSelectedCampaign(null);
  };

  const getChannelIcon = (sendBy: string) => {
    switch (sendBy) {
      case 'ONLY_EMAIL':
      case 'PREFER_EMAIL':
        return <Mail className="h-4 w-4" />;
      case 'ONLY_WHATSAPP':
      case 'PREFER_WHATSAPP':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <div className="flex gap-1"><Mail className="h-3 w-3" /><MessageSquare className="h-3 w-3" /></div>;
    }
  };

  const getChannelLabel = (sendBy: string) => {
    switch (sendBy) {
      case 'ONLY_EMAIL':
        return 'Apenas Email';
      case 'ONLY_WHATSAPP':
        return 'Apenas WhatsApp';
      case 'PREFER_EMAIL':
        return 'Preferir Email';
      case 'PREFER_WHATSAPP':
        return 'Preferir WhatsApp';
      default:
        return 'Email + WhatsApp';
    }
  };

  const getFrequencyLabel = (dispatchesPer: string) => {
    switch (dispatchesPer) {
      case 'HOUR':
        return 'Por hora';
      case 'DAY':
        return 'Por dia';
      case 'WEEK':
        return 'Por semana';
      case 'MONTH':
        return 'Por mês';
      default:
        return dispatchesPer;
    }
  };

  if (loading) {
    return <div>Carregando campanhas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Campanhas de Marketing</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie campanhas de email e WhatsApp
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Campanha
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedCampaign ? 'Editar Campanha' : 'Nova Campanha'}
              </DialogTitle>
            </DialogHeader>
            <CampaignForm
              agentId={agentId}
              campaign={selectedCampaign}
              onSuccess={handleClose}
            />
          </DialogContent>
        </Dialog>
      </div>

      {campaigns.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Nenhuma campanha criada</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Crie sua primeira campanha para começar a enviar mensagens
            </p>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Campanha
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{campaign.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={campaign.active ? "default" : "secondary"}>
                        {campaign.active ? 'Ativa' : 'Inativa'}
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        {getChannelIcon(campaign.sendBy)}
                        {getChannelLabel(campaign.sendBy)}
                      </Badge>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(campaign)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Frequência: {getFrequencyLabel(campaign.dispatchesPer)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Início: {format(new Date(campaign.startDate), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </span>
                  </div>
                  
                  {campaign.endDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Fim: {format(new Date(campaign.endDate), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </span>
                    </div>
                  )}
                  
                  {campaign.lastSentAt && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Último envio: {format(new Date(campaign.lastSentAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </span>
                    </div>
                  )}
                </div>
                
                {campaign.tags && campaign.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {campaign.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {(campaign.message || campaign.subject) && (
                  <div className="space-y-1">
                    {campaign.subject && (
                      <p className="text-sm font-medium">Email: {campaign.subject}</p>
                    )}
                    {campaign.message && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        WhatsApp: {campaign.message}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}