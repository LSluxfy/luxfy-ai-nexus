import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TagAutocomplete } from '@/components/ui/tag-autocomplete';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useAgentTags } from '@/hooks/use-agent-tags';
import type { CRMRow, CRMTables, LeadStatus } from '@/types/crm';

interface NewLeadDialogProps {
  onAddLead: (leadData: Partial<CRMRow>) => void;
  tables: CRMTables;
  isUpdating?: boolean;
}

export function NewLeadDialog({ onAddLead, tables, isUpdating = false }: NewLeadDialogProps) {
  const { t } = useTranslation();
  const { id: agentId } = useParams<{ id: string }>();
  const { data: agentTags = [], isLoading: tagsLoading } = useAgentTags(agentId);
  const [open, setOpen] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
    price: '',
    delivery: '',
    status: '1', // Default to first status
    interests: [] as string[],
    tags: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    const leadData: Partial<CRMRow> = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      notes: formData.notes.trim(),
      price: formData.price ? parseFloat(formData.price) : 0,
      delivery: formData.delivery.trim(),
      status: formData.status,
      interests: formData.interests,
      tags: formData.tags,
      createdBy: 'attendant',
      responsibleId: 0,
      chatId: 0,
      logs: [],
      activities: []
    };

    onAddLead(leadData);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      notes: '',
      price: '',
      delivery: '',
      status: '1',
      interests: [],
      tags: []
    });
    
    setTagInput('');
    
    setOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Get available statuses from tables
  const availableStatuses = Object.entries(tables).map(([key, name]) => ({
    value: key,
    label: name
  }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-luxfy-purple hover:bg-luxfy-darkPurple whitespace-nowrap" disabled={isUpdating}>
          <Plus className="mr-2" size={16} />
          {t('crm.newLead')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('crm.newLead')}</DialogTitle>
          <DialogDescription>
            Adicione um novo lead ao seu CRM
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Nome do lead"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="email@exemplo.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Valor</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {availableStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="delivery">Entrega</Label>
              <Input
                id="delivery"
                value={formData.delivery}
                onChange={(e) => handleInputChange('delivery', e.target.value)}
                placeholder="Tipo de entrega"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <TagAutocomplete
              value={tagInput}
              onChange={setTagInput}
              onAddTag={handleAddTag}
              selectedTags={formData.tags}
              onRemoveTag={handleRemoveTag}
              suggestions={agentTags}
              isLoading={tagsLoading}
              placeholder="Adicionar tag..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Observações sobre o lead..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t('crm.cancel')}
            </Button>
            <Button type="submit" disabled={!formData.name.trim() || isUpdating}>
              {isUpdating ? 'Salvando...' : t('crm.add')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}