
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAgents } from '@/hooks/use-agent';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, Settings, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

const AgentSettings = () => {
  const { agents, loading, deleteAgent, userPlan } = useAgents();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [deletingAgent, setDeletingAgent] = useState<string | null>(null);

  const handleDeleteAgent = async (agentId: string, agentName: string) => {
    setDeletingAgent(agentId);
    
    try {
      const success = await deleteAgent(agentId);
      if (success) {
        toast({
          title: t("settings.agents.agentRemoved"),
          description: t("settings.agents.agentRemovedDesc", { name: agentName }),
        });
      }
    } catch (error) {
      toast({
        title: t("settings.agents.removeError"),
        description: t("settings.agents.removeErrorDesc"),
        variant: "destructive",
      });
    } finally {
      setDeletingAgent(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">{t("settings.agents.loading")}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            {t("settings.agents.title")}
          </CardTitle>
          <CardDescription>
            {t("settings.agents.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
              <div>
                <h4 className="font-medium">{t("settings.agents.currentPlan")}</h4>
                <p className="text-sm text-gray-600">
                  {userPlan ? (
                    <>
                      <span className="capitalize">{userPlan.plan_type}</span> - 
                      {agents.length}/{userPlan.max_agents} {t("settings.agents.agentsUsed")}
                    </>
                  ) : (
                    t("settings.agents.loadingPlan")
                  )}
                </p>
              </div>
              <Button variant="outline" size="sm">
                {t("settings.agents.upgrade")}
              </Button>
            </div>

            {agents.length === 0 ? (
              <div className="text-center py-8">
                <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t("settings.agents.noAgents")}</h3>
                <p className="text-gray-600 mb-4">{t("settings.agents.noAgentsDesc")}</p>
                <Button>{t("settings.agents.createFirst")}</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {agents.map((agent) => (
                  <div key={agent.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{agent.name}</h4>
                      <p className="text-sm text-gray-600">
                        {agent.description || t("settings.agents.noDescription")}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {t("settings.agents.createdOn")} {new Date(agent.created_at).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        {t("settings.agents.configure")}
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            disabled={deletingAgent === agent.id}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            {deletingAgent === agent.id ? t("settings.agents.removing") : t("settings.agents.remove")}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t("settings.agents.confirmRemoval")}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t("settings.agents.confirmRemovalDesc", { name: agent.name })}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t("settings.agents.cancel")}</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteAgent(agent.id, agent.name)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {t("settings.agents.removeAgent")}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentSettings;
