import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Plus, MoreHorizontal, Search, Tag, X, Edit, Trash2, Eye, Phone, Mail, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTranslation } from 'react-i18next';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  lastContact: string;
  status: 'new' | 'contacted' | 'qualified' | 'negotiation' | 'closed' | 'lost';
  tags: string[];
  notes: string;
  value?: string;
}

const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 99988-7766',
    interest: 'Plano Pro',
    lastContact: '2 horas atrás',
    status: 'new',
    tags: ['urgente', 'qualificado'],
    notes: 'Cliente interessado em upgrade. Precisa de demonstração.',
    value: 'R$ 297/mês'
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    email: 'maria@oliveira.com',
    phone: '(11) 98765-4321',
    interest: 'Plano Premium',
    lastContact: '5 horas atrás',
    status: 'new',
    tags: ['urgente'],
    notes: 'Cliente interessado em upgrade.',
    value: 'R$ 397/mês'
  },
  {
    id: '3',
    name: 'Carlos Mendes',
    email: 'carlos@empresa.com',
    phone: '(21) 99876-5432',
    interest: 'Plano Starter',
    lastContact: '1 dia atrás',
    status: 'contacted',
    tags: ['urgente'],
    notes: 'Cliente interessado em upgrade.',
    value: 'R$ 197/mês'
  },
  {
    id: '4',
    name: 'Ana Costa',
    email: 'ana.costa@email.com',
    phone: '(11) 97654-3210',
    interest: 'Plano Pro',
    lastContact: '2 dias atrás',
    status: 'contacted',
    tags: ['urgente'],
    notes: 'Cliente interessado em upgrade.',
    value: 'R$ 297/mês'
  },
  {
    id: '5',
    name: 'Roberto Alves',
    email: 'roberto@alves.com',
    phone: '(21) 98765-0987',
    interest: 'Plano Premium',
    lastContact: '1 semana atrás',
    status: 'qualified',
    tags: ['urgente'],
    notes: 'Cliente interessado em upgrade.',
    value: 'R$ 397/mês'
  },
  {
    id: '6',
    name: 'Fernanda Lima',
    email: 'fernanda@lima.com',
    phone: '(11) 91234-5678',
    interest: 'Plano Pro',
    lastContact: '3 dias atrás',
    status: 'negotiation',
    tags: ['urgente'],
    notes: 'Cliente interessado em upgrade.',
    value: 'R$ 297/mês'
  },
  {
    id: '7',
    name: 'Ricardo Santos',
    email: 'ricardo@empresa.com',
    phone: '(11) 99876-5432',
    interest: 'Plano Premium',
    lastContact: '1 dia atrás',
    status: 'closed',
    tags: ['urgente'],
    notes: 'Cliente interessado em upgrade.',
    value: 'R$ 397/mês'
  },
  {
    id: '8',
    name: 'Patricia Melo',
    email: 'patricia@melo.com',
    phone: '(21) 99888-7777',
    interest: 'Plano Starter',
    lastContact: '4 dias atrás',
    status: 'lost',
    tags: ['urgente'],
    notes: 'Cliente interessado em upgrade.',
    value: 'R$ 197/mês'
  }
];

const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-purple-100 text-purple-800',
  qualified: 'bg-amber-100 text-amber-800',
  negotiation: 'bg-orange-100 text-orange-800',
  closed: 'bg-green-100 text-green-800',
  lost: 'bg-red-100 text-red-800',
};

const CRMPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [searchTerm, setSearchTerm] = useState('');
  const [newColumnName, setNewColumnName] = useState('');
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newTag, setNewTag] = useState('');
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  const [editColumnName, setEditColumnName] = useState('');
  
  const statusLabels = {
    new: t('crm.new'),
    contacted: t('crm.contacted'),
    qualified: t('crm.qualified'),
    negotiation: t('crm.negotiation'),
    closed: t('crm.closed'),
    lost: t('crm.lost')
  };

  const [columns, setColumns] = useState(Object.keys(statusLabels));
  
  // Filtra os leads baseado no termo de busca
  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.interest.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Agrupa os leads por status
  const groupedLeads = filteredLeads.reduce((acc, lead) => {
    acc[lead.status] = [...(acc[lead.status] || []), lead];
    return acc;
  }, {} as Record<string, Lead[]>);

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('text/plain', leadId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('text/plain');
    
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus as Lead['status'] } : lead
      )
    );
  };

  const addNewColumn = () => {
    if (newColumnName.trim()) {
      setColumns([...columns, newColumnName.toLowerCase().replace(/\s+/g, '-')]);
      setNewColumnName('');
      setShowAddColumn(false);
    }
  };

  const removeColumn = (columnKey: string) => {
    if (Object.keys(statusLabels).includes(columnKey)) {
      alert(t('crm.cannotDeleteSystem'));
      return;
    }
    setColumns(columns.filter(col => col !== columnKey));
  };

  const startEditingColumn = (columnKey: string) => {
    if (Object.keys(statusLabels).includes(columnKey)) {
      alert(t('crm.cannotRenameSystem'));
      return;
    }
    setEditingColumn(columnKey);
    setEditColumnName(columnKey);
  };

  const saveColumnName = () => {
    if (editColumnName.trim() && editingColumn) {
      const newKey = editColumnName.toLowerCase().replace(/\s+/g, '-');
      setColumns(columns.map(col => col === editingColumn ? newKey : col));
      setEditingColumn(null);
      setEditColumnName('');
    }
  };

  const cancelEditingColumn = () => {
    setEditingColumn(null);
    setEditColumnName('');
  };

  const openChatWithLead = (lead: Lead) => {
    // Navegar para a página de chat com o ID do lead
    navigate('/dashboard/chat', { state: { selectedUserId: lead.id, userName: lead.name } });
  };

  const addTagToLead = (leadId: string, tag: string) => {
    if (tag.trim()) {
      setLeads(prevLeads =>
        prevLeads.map(lead =>
          lead.id === leadId
            ? { ...lead, tags: [...lead.tags, tag.trim()] }
            : lead
        )
      );
    }
  };

  const removeTagFromLead = (leadId: string, tagToRemove: string) => {
    setLeads(prevLeads =>
      prevLeads.map(lead =>
        lead.id === leadId
          ? { ...lead, tags: lead.tags.filter(tag => tag !== tagToRemove) }
          : lead
      )
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader title={t('crm.title')} />
      
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('crm.title')}</h2>
            <p className="text-gray-600 dark:text-gray-300">{t('crm.subtitle')}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder={t('crm.searchPlaceholder')}
                className="pl-10"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowAddColumn(true)}
              className="whitespace-nowrap"
            >
              <Plus className="mr-2" size={16} /> {t('crm.newColumn')}
            </Button>
            <Button className="bg-luxfy-purple hover:bg-luxfy-darkPurple whitespace-nowrap">
              <Plus className="mr-2" size={16} /> {t('crm.newLead')}
            </Button>
          </div>
        </div>

        {showAddColumn && (
          <Card className="mb-6 border-luxfy-purple/20">
            <CardHeader>
              <CardTitle>{t('crm.addNewColumn')}</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Input
                placeholder={t('crm.columnNamePlaceholder')}
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
              />
              <Button onClick={addNewColumn}>{t('crm.add')}</Button>
              <Button variant="outline" onClick={() => setShowAddColumn(false)}>{t('crm.cancel')}</Button>
            </CardContent>
          </Card>
        )}
        
        <div className="overflow-x-auto pb-6">
          <div className="flex gap-4" style={{ minWidth: `${columns.length * 300}px` }}>
            {/* Colunas do Kanban - Draggable */}
            {columns.map((columnKey) => {
              const label = statusLabels[columnKey as keyof typeof statusLabels] || columnKey;
              const isDefaultColumn = Object.keys(statusLabels).includes(columnKey);
              
              return (
                <div 
                  key={columnKey} 
                  className="kanban-column relative"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, columnKey)}
                >
                  <div className="flex justify-between items-center mb-4">
                    {editingColumn === columnKey ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          value={editColumnName}
                          onChange={(e) => setEditColumnName(e.target.value)}
                          className="text-sm"
                          onKeyPress={(e) => e.key === 'Enter' && saveColumnName()}
                        />
                        <Button size="sm" variant="ghost" onClick={saveColumnName}>
                          ✓
                        </Button>
                        <Button size="sm" variant="ghost" onClick={cancelEditingColumn}>
                          ✕
                        </Button>
                      </div>
                    ) : (
                      <h3 className="font-semibold flex items-center">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${statusColors[columnKey as keyof typeof statusColors]?.split(' ')[0] || 'bg-gray-400'}`}></span>
                        {label}
                        <span className="ml-2 text-sm text-gray-500">
                          ({groupedLeads[columnKey]?.length || 0})
                        </span>
                      </h3>
                    )}
                    
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Plus size={16} />
                      </Button>
                      
                      {!isDefaultColumn && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Settings size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-white dark:bg-gray-800">
                            <DropdownMenuItem onClick={() => startEditingColumn(columnKey)}>
                              <Edit size={14} className="mr-2" />
                              {t('crm.rename')}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => removeColumn(columnKey)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={14} className="mr-2" />
                              {t('crm.delete')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {groupedLeads[columnKey]?.map(lead => (
                      <div 
                        key={lead.id} 
                        className="kanban-card cursor-move hover:shadow-lg transition-shadow"
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead.id)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{lead.name}</h4>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6"
                                onClick={() => setSelectedLead(lead)}
                              >
                                <Eye size={14} />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  {lead.name}
                                  <Badge variant="outline">{lead.interest}</Badge>
                                </DialogTitle>
                                <DialogDescription>
                                  {t('crm.completeInfo')}
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium mb-2">{t('crm.contact')}</h4>
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <Mail size={16} className="text-gray-400" />
                                        <span className="text-sm">{lead.email}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Phone size={16} className="text-gray-400" />
                                        <span className="text-sm">{lead.phone}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-medium mb-2">{t('crm.interest')}</h4>
                                    <p className="text-sm text-gray-600">{lead.interest}</p>
                                    {lead.value && (
                                      <p className="text-sm font-medium text-green-600 mt-1">{lead.value}</p>
                                    )}
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-medium mb-2">{t('crm.tags')}</h4>
                                  <div className="flex flex-wrap gap-2 mb-2">
                                    {lead.tags.map(tag => (
                                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                        {tag}
                                        <X 
                                          size={12} 
                                          className="cursor-pointer hover:text-red-500"
                                          onClick={() => removeTagFromLead(lead.id, tag)}
                                        />
                                      </Badge>
                                    ))}
                                  </div>
                                  <div className="flex gap-2">
                                    <Input
                                      placeholder={t('crm.newTagPlaceholder')}
                                      value={newTag}
                                      onChange={(e) => setNewTag(e.target.value)}
                                      className="flex-1"
                                    />
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        addTagToLead(lead.id, newTag);
                                        setNewTag('');
                                      }}
                                    >
                                      <Tag size={16} />
                                    </Button>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-medium mb-2">{t('crm.notes')}</h4>
                                  <Textarea
                                    defaultValue={lead.notes}
                                    placeholder="Adicione observações sobre este lead..."
                                    className="min-h-[100px]"
                                  />
                                </div>
                                
                                <div className="flex gap-2">
                                  <Button 
                                    className="bg-luxfy-purple hover:bg-luxfy-darkPurple"
                                    onClick={() => openChatWithLead(lead)}
                                  >
                                    <MessageSquare className="mr-2" size={16} />
                                    {t('crm.openChat')}
                                  </Button>
                                  <Button variant="outline">
                                    <Edit className="mr-2" size={16} />
                                    Editar Lead
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-1">
                          {lead.email}
                        </p>
                        <p className="text-sm text-gray-600 mb-3">
                          {lead.phone}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {lead.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {lead.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{lead.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs bg-gray-100 text-gray-800 rounded-full px-2 py-1">
                            {lead.interest}
                          </span>
                          <div className="flex items-center gap-1">
                            <MessageSquare size={14} className="text-luxfy-purple" />
                            <span className="text-xs text-gray-500">{lead.lastContact}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {(!groupedLeads[columnKey] || groupedLeads[columnKey].length === 0) && (
                      <div className="text-center py-8 text-sm text-gray-500">
                        Nenhum lead nesta coluna
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CRMPage;
