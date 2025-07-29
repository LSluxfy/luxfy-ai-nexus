
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MessageSquare, Plus, Edit, Trash2, Settings, Eye, Phone, Mail, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import type { CRMRow, CRMTables, LeadStatus } from '@/types/crm';

interface CRMKanbanProps {
  tables: CRMTables;
  groupedLeads: Record<string, CRMRow[]>;
  onMoveLead: (leadId: number, newStatus: LeadStatus) => void;
  onUpdateLead: (leadId: number, updates: Partial<CRMRow>) => void;
  onRemoveLead: (leadId: number) => void;
  onAddColumn: (columnName: string) => void;
  onRemoveColumn: (columnKey: string) => void;
  onRenameColumn: (columnKey: string, newName: string) => void;
  onOpenChat?: (lead: CRMRow) => void;
  isUpdating?: boolean;
}

const statusColors = {
  'new': 'bg-blue-100 text-blue-800',
  'contacted': 'bg-purple-100 text-purple-800',
  'qualified': 'bg-amber-100 text-amber-800',
  'negotiation': 'bg-orange-100 text-orange-800',
  'closed': 'bg-green-100 text-green-800',
  'lost': 'bg-red-100 text-red-800',
} as const;

export function CRMKanban({
  tables,
  groupedLeads,
  onMoveLead,
  onUpdateLead,
  onRemoveLead,
  onAddColumn,
  onRemoveColumn,
  onRenameColumn,
  onOpenChat,
  isUpdating = false
}: CRMKanbanProps) {
  const [newColumnName, setNewColumnName] = useState('');
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  const [editColumnName, setEditColumnName] = useState('');
  const [selectedLead, setSelectedLead] = useState<CRMRow | null>(null);
  const [newTag, setNewTag] = useState('');

  const handleDragStart = (e: React.DragEvent, leadId: number) => {
    e.dataTransfer.setData('text/plain', leadId.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const leadId = parseInt(e.dataTransfer.getData('text/plain'));
    onMoveLead(leadId, newStatus as LeadStatus);
  };

  const addNewColumn = () => {
    if (newColumnName.trim()) {
      onAddColumn(newColumnName.trim());
      setNewColumnName('');
      setShowAddColumn(false);
    }
  };

  const startEditingColumn = (columnKey: string) => {
    const defaultColumns = ['new', 'contacted', 'qualified', 'negotiation', 'closed', 'lost'];
    if (defaultColumns.includes(columnKey)) {
      alert('Não é possível renomear colunas do sistema');
      return;
    }
    setEditingColumn(columnKey);
    setEditColumnName(tables[columnKey] || columnKey);
  };

  const saveColumnName = () => {
    if (editColumnName.trim() && editingColumn) {
      onRenameColumn(editingColumn, editColumnName.trim());
      setEditingColumn(null);
      setEditColumnName('');
    }
  };

  const cancelEditingColumn = () => {
    setEditingColumn(null);
    setEditColumnName('');
  };

  const handleRemoveColumn = (columnKey: string) => {
    const defaultColumns = ['new', 'contacted', 'qualified', 'negotiation', 'closed', 'lost'];
    if (defaultColumns.includes(columnKey)) {
      alert('Não é possível deletar colunas do sistema');
      return;
    }
    
    if (confirm('Tem certeza que deseja remover esta coluna? Todos os leads nela serão removidos.')) {
      onRemoveColumn(columnKey);
    }
  };

  const addTagToLead = (leadId: number, tag: string) => {
    if (tag.trim()) {
      const lead = Object.values(groupedLeads).flat().find(l => l.id === leadId);
      if (lead) {
        const updatedTags = [...lead.tags, tag.trim()];
        onUpdateLead(leadId, { tags: updatedTags });
      }
    }
  };

  const removeTagFromLead = (leadId: number, tagToRemove: string) => {
    const lead = Object.values(groupedLeads).flat().find(l => l.id === leadId);
    if (lead) {
      const updatedTags = lead.tags.filter(tag => tag !== tagToRemove);
      onUpdateLead(leadId, { tags: updatedTags });
    }
  };

  const columns = Object.entries(tables);

  return (
    <div className="space-y-6">
      {/* Add Column Card */}
      {showAddColumn && (
        <Card className="border-luxfy-purple/20">
          <CardHeader>
            <CardTitle>Adicionar Nova Coluna</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Input
              placeholder="Nome da coluna"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addNewColumn()}
            />
            <Button onClick={addNewColumn} disabled={!newColumnName.trim()}>
              Adicionar
            </Button>
            <Button variant="outline" onClick={() => setShowAddColumn(false)}>
              Cancelar
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-6">
        <div className="flex gap-4" style={{ minWidth: `${columns.length * 300}px` }}>
          {columns.map(([columnKey, columnLabel]) => {
            const isDefaultColumn = ['new', 'contacted', 'qualified', 'negotiation', 'closed', 'lost'].includes(columnKey);
            const columnLeads = groupedLeads[columnKey] || [];
            
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
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        statusColors[columnKey as keyof typeof statusColors]?.split(' ')[0] || 'bg-gray-400'
                      }`}></span>
                      {columnLabel}
                      <span className="ml-2 text-sm text-gray-500">
                        ({columnLeads.length})
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
                            Renomear
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleRemoveColumn(columnKey)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={14} className="mr-2" />
                            Deletar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {columnLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="kanban-card cursor-move hover:shadow-lg transition-shadow"
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{lead.name}</h4>
                        <div className="flex gap-1">
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
                                  <Badge variant="outline">{lead.interests.join(', ')}</Badge>
                                </DialogTitle>
                                <DialogDescription>
                                  Informações completas do lead
                                </DialogDescription>
                              </DialogHeader>

                              <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium mb-2">Contato</h4>
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
                                    <h4 className="font-medium mb-2">Interesses</h4>
                                    <p className="text-sm text-gray-600">{lead.interests.join(', ')}</p>
                                    {lead.price > 0 && (
                                      <p className="text-sm font-medium text-green-600 mt-1">
                                        R$ {lead.price.toLocaleString('pt-BR')}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-2">Tags</h4>
                                  <div className="flex flex-wrap gap-2 mb-2">
                                    {lead.tags.map((tag) => (
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
                                      placeholder="Nova tag"
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
                                      Adicionar
                                    </Button>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-2">Observações</h4>
                                  <Textarea
                                    defaultValue={lead.notes}
                                    placeholder="Adicione observações sobre este lead..."
                                    className="min-h-[100px]"
                                    onBlur={(e) => onUpdateLead(lead.id, { notes: e.target.value })}
                                  />
                                </div>

                                <div className="flex gap-2">
                                  {onOpenChat && (
                                    <Button
                                      className="bg-luxfy-purple hover:bg-luxfy-darkPurple"
                                      onClick={() => onOpenChat(lead)}
                                    >
                                      <MessageSquare className="mr-2" size={16} />
                                      Abrir Chat
                                    </Button>
                                  )}
                                  <Button variant="outline">
                                    <Edit className="mr-2" size={16} />
                                    Editar Lead
                                  </Button>
                                  <Button 
                                    variant="destructive"
                                    onClick={() => {
                                      if (confirm(`Tem certeza que deseja deletar o lead "${lead.name}"?`)) {
                                        onRemoveLead(lead.id);
                                      }
                                    }}
                                  >
                                    <Trash2 className="mr-2" size={16} />
                                    Deletar Lead
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-red-500 hover:text-red-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Tem certeza que deseja deletar o lead "${lead.name}"?`)) {
                                onRemoveLead(lead.id);
                              }
                            }}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-1">{lead.email}</p>
                      <p className="text-sm text-gray-600 mb-3">{lead.phone}</p>

                      <div className="flex flex-wrap gap-1 mb-2">
                        {lead.tags.slice(0, 2).map((tag) => (
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
                          {lead.interests.join(', ')}
                        </span>
                        <div className="flex items-center gap-1">
                          {lead.chatId && <MessageSquare size={14} className="text-luxfy-purple" />}
                          <span className="text-xs text-gray-500">
                            {new Date(lead.updatedAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {columnLeads.length === 0 && (
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

      {/* Add Column Button */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={() => setShowAddColumn(true)}
          disabled={isUpdating}
        >
          <Plus className="mr-2" size={16} />
          Nova Coluna
        </Button>
      </div>
    </div>
  );
}
