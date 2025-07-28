
import React, { useState } from 'react';
import { useAgents } from '@/hooks/use-agent';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, UserPlus, Trash2 } from 'lucide-react';
import { Agent } from '@/hooks/use-agent';
import { useTranslation } from 'react-i18next';

const AgentsPage = () => {
  const { t } = useTranslation();
  const { agents, userPlan, loading, createAgent, deleteAgent, canCreateAgent } = useAgents();
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentDescription, setNewAgentDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    
    if (newAgentName.trim()) {
      await createAgent(newAgentName.trim(), newAgentDescription.trim());
      setNewAgentName('');
      setNewAgentDescription('');
      setOpenDialog(false);
    }
    
    setIsCreating(false);
  };

  const handleDeleteAgent = async (agent: Agent) => {
    if (window.confirm(`${t('agents.deleteConfirm')} ${agent.name}?`)) {
      await deleteAgent(agent.id);
    }
  };

  if (loading) {
    return <div className="py-10 text-center">{t('agents.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t('agents.title')}</h1>
          <p className="text-muted-foreground">
            {userPlan && (
              <>
                {t('agents.currentPlan')}: <span className="font-semibold capitalize">{userPlan.plan_type}</span> •
                {" "}Agentes: <span className="font-semibold">{agents.length}/{userPlan.max_agents}</span>
              </>
            )}
          </p>
        </div>
        
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button disabled={!canCreateAgent} className="flex items-center gap-2">
              <UserPlus size={18} />
              <span>{t('agents.newAgent')}</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleCreateAgent}>
              <DialogHeader>
                <DialogTitle>{t('agents.createAgent')}</DialogTitle>
                <DialogDescription>
                  {t('agents.createAgentDescription')}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">{t('agents.agentName')}</Label>
                  <Input
                    id="name"
                    value={newAgentName}
                    onChange={(e) => setNewAgentName(e.target.value)}
                    placeholder={t('agents.agentNamePlaceholder')}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">{t('agents.description')}</Label>
                  <Textarea
                    id="description"
                    value={newAgentDescription}
                    onChange={(e) => setNewAgentDescription(e.target.value)}
                    placeholder={t('agents.descriptionPlaceholder')}
                    rows={3}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setOpenDialog(false)}
                  type="button"
                >
                  {t('agents.cancel')}
                </Button>
                <Button type="submit" disabled={isCreating || !newAgentName.trim()}>
                  {isCreating ? t('agents.creating') : t('agents.create')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {agents.length === 0 ? (
        <Card className="border-dashed bg-background">
          <CardContent className="pt-6 text-center">
            <div className="flex flex-col items-center gap-2 py-8">
              <div className="rounded-full bg-luxfy-blue/20 p-3">
                <UserPlus className="h-8 w-8 text-luxfy-blue" />
              </div>
              <h3 className="text-xl font-semibold">{t('agents.noAgentsCreated')}</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {t('agents.noAgentsDescription')}
              </p>
              <Button 
                className="mt-2 flex items-center gap-1"
                onClick={() => setOpenDialog(true)}
                disabled={!canCreateAgent}
              >
                <Plus size={16} />
                <span>{t('agents.createFirstAgent')}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <Card key={agent.id} className="overflow-hidden">
              <CardHeader className="bg-luxfy-blue/5 pb-2">
                <CardTitle className="flex justify-between items-start">
                  <span>{agent.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDeleteAgent(agent)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {agent.description || t('agents.noDescription')}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" className="w-full">
                  {t('agents.configureAgent')}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {!canCreateAgent && agents.length > 0 && (
        <Card className="border-dashed bg-muted/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold">{t('agents.limitReached')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('agents.limitDescription')}
                </p>
              </div>
              <Button variant="outline">{t('agents.upgradeToProButton')}</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AgentsPage;
