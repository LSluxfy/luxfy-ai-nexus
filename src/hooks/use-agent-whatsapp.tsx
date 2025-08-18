
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AgentApiService } from '@/services/agentApiService';

export function useAgentWhatsApp() {
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [clearingSession, setClearingSession] = useState(false);
  const { toast } = useToast();

  // Sleep helper para aguardar entre tentativas
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Função robusta para desconectar com múltiplas tentativas
  const forceDisconnect = async (agentId: string, maxAttempts = 3) => {
    let lastError: any = null;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`Tentativa ${attempt}/${maxAttempts} de desconexão para agente ${agentId}`);
        
        await AgentApiService.disconnectAgent(agentId);
        console.log(`Desconexão bem-sucedida na tentativa ${attempt}`);
        
        // Aguardar para garantir que a desconexão foi processada
        await sleep(3000 + (attempt * 1000)); // 3-6 segundos dependendo da tentativa
        
        return true;
      } catch (error: any) {
        console.error(`Erro na tentativa ${attempt} de desconexão:`, error);
        lastError = error;
        
        if (attempt < maxAttempts) {
          console.log(`Aguardando antes da próxima tentativa... (${attempt * 2}s)`);
          await sleep(attempt * 2000); // Backoff exponencial
        }
      }
    }
    
    console.error(`Todas as ${maxAttempts} tentativas de desconexão falharam`);
    throw lastError;
  };

  // Conectar agente ao WhatsApp com lógica robusta de recuperação
  const connectAgent = async (agentId: string, forceReconnect = false) => {
    try {
      setConnecting(true);
      console.log(`=== INICIANDO CONEXÃO AGENTE ${agentId} ===`);
      console.log(`Modo: ${forceReconnect ? 'FORÇAR NOVA CONEXÃO' : 'CONEXÃO NORMAL'}`);

      // SEMPRE desconectar primeiro quando forceReconnect = true
      if (forceReconnect) {
        console.log('🔄 Modo forçar reconexão ativado - executando desconexão forçada...');
        
        toast({
          title: "Limpando sessões existentes",
          description: "Removendo sessões anteriores antes de conectar...",
        });

        try {
          await forceDisconnect(agentId, 3);
          console.log('✅ Desconexão forçada concluída com sucesso');
        } catch (disconnectError: any) {
          console.warn('⚠️ Falha na desconexão forçada, mas continuando:', disconnectError);
          // Não bloqueamos o processo se a desconexão falhar
        }
      } else {
        // Verificação rápida de status apenas em conexão normal
        console.log('🔍 Verificando status atual do agente...');
        const currentStatus = await checkStatus(agentId);
        console.log(`Status atual: ${currentStatus ? 'ONLINE' : 'OFFLINE'}`);
        
        if (currentStatus) {
          console.log('✅ Agente já está conectado');
          toast({
            title: "Agente já conectado",
            description: "O agente já possui uma sessão ativa do WhatsApp",
          });
          return { agent: null, message: "Sessão já ativa" };
        }
      }

      // Tentar conectar com manejo robusto de erros
      console.log('🚀 Tentando estabelecer nova conexão...');
      
      let connectionResponse;
      try {
        connectionResponse = await AgentApiService.connectAgent(agentId);
        console.log('✅ Conexão estabelecida com sucesso:', connectionResponse);
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || error.message;
        console.error('❌ Erro na conexão inicial:', errorMessage);
        
        // Verificar se é erro de sessão existente
        if (errorMessage.includes('sessão') && errorMessage.includes('já existe')) {
          console.log('🔧 Erro de sessão órfã detectado - iniciando recuperação automática...');
          
          toast({
            title: "Sessão órfã detectada",
            description: "Removendo sessão anterior e reconectando automaticamente...",
            variant: "destructive",
          });
          
          // Tentar recuperação automática
          try {
            console.log('🧹 Executando limpeza de sessão órfã...');
            await forceDisconnect(agentId, 3);
            
            console.log('🔄 Tentando conectar após limpeza...');
            await sleep(5000); // Aguardar 5 segundos após limpeza
            
            connectionResponse = await AgentApiService.connectAgent(agentId);
            console.log('✅ Recuperação automática bem-sucedida:', connectionResponse);
            
            toast({
              title: "Recuperação bem-sucedida",
              description: "Sessão anterior removida e nova conexão estabelecida",
            });
          } catch (recoveryError: any) {
            console.error('❌ Falha na recuperação automática:', recoveryError);
            
            toast({
              title: "Falha na recuperação automática",
              description: "Use o botão 'Limpar Sessões' e tente novamente em alguns minutos.",
              variant: "destructive",
            });
            throw recoveryError;
          }
        } else {
          // Outros tipos de erro
          toast({
            title: "Erro ao conectar",
            description: errorMessage,
            variant: "destructive",
          });
          throw error;
        }
      }

      // Sucesso na conexão
      console.log('🎉 Conexão estabelecida com sucesso!');
      toast({
        title: "Conexão iniciada",
        description: connectionResponse.message,
      });

      return connectionResponse;
      
    } catch (error: any) {
      console.error('💥 ERRO FATAL na conexão:', error);
      throw error;
    } finally {
      setConnecting(false);
      console.log('=== FIM DO PROCESSO DE CONEXÃO ===');
    }
  };

  // Verificar status do agente com logs detalhados
  const checkStatus = async (agentId: string, silent = false) => {
    try {
      if (!silent) setCheckingStatus(true);
      
      console.log(`🔍 Verificando status do agente ${agentId}...`);
      const response = await AgentApiService.getAgentStatus(agentId);
      
      console.log(`📊 Status do agente ${agentId}:`, {
        isOnline: response.isOnline,
        rawResponse: response
      });
      
      return response.isOnline;
    } catch (error: any) {
      console.error(`❌ Erro ao verificar status do agente ${agentId}:`, error);
      
      if (!silent) {
        toast({
          title: "Erro ao verificar status",
          description: error.response?.data?.error || error.message,
          variant: "destructive",
        });
      }
      return false;
    } finally {
      if (!silent) setCheckingStatus(false);
    }
  };

  // Forçar nova conexão (desconectar e reconectar)
  const forceReconnect = async (agentId: string) => {
    try {
      console.log(`🔄 Forçando reconexão para agente ${agentId}`);
      return await connectAgent(agentId, true);
    } catch (error) {
      console.error('❌ Erro ao forçar reconexão:', error);
      throw error;
    }
  };

  // Limpar todas as sessões órfãs (modo de recuperação)
  const clearOrphanedSessions = async (agentId: string) => {
    try {
      setClearingSession(true);
      console.log(`🧹 Iniciando limpeza de sessões órfãs para agente ${agentId}...`);
      
      toast({
        title: "Limpando sessões órfãs",
        description: "Removendo todas as sessões existentes...",
      });

      // Tentar múltiplas desconexões agressivas
      await forceDisconnect(agentId, 5); // 5 tentativas
      
      // Aguardar mais tempo para garantir limpeza
      console.log('⏳ Aguardando 10 segundos para garantir limpeza completa...');
      await sleep(10000);
      
      // Verificar se realmente foi limpo
      const finalStatus = await checkStatus(agentId, true);
      
      if (finalStatus) {
        console.warn('⚠️ Sessão ainda ativa após limpeza');
        toast({
          title: "Limpeza parcial",
          description: "Algumas sessões podem ainda existir. Aguarde alguns minutos.",
          variant: "destructive",
        });
      } else {
        console.log('✅ Limpeza de sessões concluída com sucesso');
        toast({
          title: "Sessões limpas",
          description: "Todas as sessões órfãs foram removidas. Você pode conectar agora.",
        });
      }

      return !finalStatus;
    } catch (error: any) {
      console.error('❌ Erro na limpeza de sessões órfãs:', error);
      
      toast({
        title: "Erro na limpeza",
        description: "Não foi possível limpar todas as sessões. Tente novamente em alguns minutos.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setClearingSession(false);
    }
  };

  // Desconectar agente do WhatsApp
  const disconnectAgent = async (agentId: string) => {
    try {
      setDisconnecting(true);
      console.log(`🔌 Desconectando agente ${agentId}...`);
      
      const response = await AgentApiService.disconnectAgent(agentId);
      console.log(`✅ Agente ${agentId} desconectado:`, response);
      
      toast({
        title: "Agente desconectado",
        description: response.message,
      });

      return true;
    } catch (error: any) {
      console.error(`❌ Erro ao desconectar agente ${agentId}:`, error);
      
      toast({
        title: "Erro ao desconectar",
        description: error.response?.data?.error || error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setDisconnecting(false);
    }
  };

  return {
    connecting,
    disconnecting,
    checkingStatus,
    clearingSession,
    connectAgent,
    checkStatus,
    disconnectAgent,
    forceReconnect,
    clearOrphanedSessions,
  };
}
