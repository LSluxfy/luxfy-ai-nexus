import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { QrCode, Smartphone, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useAgentWhatsApp } from '@/hooks/use-agent-whatsapp';
import { ApiAgent } from '@/types/agent-api';
import QRCodeGenerator from 'qrcode';

interface AgentWhatsAppProps {
  agent: ApiAgent;
}

export function AgentWhatsApp({ agent }: AgentWhatsAppProps) {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);
  
  const { connecting, disconnecting, checkingStatus, clearingSession, connectAgent, checkStatus, disconnectAgent, forceReconnect, clearOrphanedSessions } = useAgentWhatsApp();

  useEffect(() => {
    checkAgentStatus();
  }, []);

  const checkAgentStatus = async () => {
    try {
      const status = await checkStatus(agent.id.toString());
      setIsOnline(status);
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      setIsOnline(false);
    }
  };

  const handleConnect = async () => {
    try {
      console.log(`🚀 INTERFACE: Iniciando conexão para agente ${agent.id}`);
      setQrCode(null);
      setQrCodeImage(null);
      
      const response = await connectAgent(agent.id.toString());
      console.log('🎯 INTERFACE: Resposta da conexão:', response);
      
      // Se já estava conectado, apenas atualizar status
      if (response.message === "Sessão já ativa") {
        checkAgentStatus();
        return;
      }
      
      // Verificar se existe QR code na resposta
      if (response.agent?.qr_string) {
        console.log('QR code recebido, configurando interface...');
        setQrCode(response.agent.qr_string);
        setGenerated(response.agent.generated || false);
        
        // Quando QR code é gerado, definir status como offline até que seja escaneado
        setIsOnline(false);
        
        // Gerar imagem do QR code a partir da string
        try {
          const qrImageUrl = await QRCodeGenerator.toDataURL(response.agent.qr_string, {
            width: 300,
            margin: 1,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
          setQrCodeImage(qrImageUrl);
          console.log('Imagem QR code gerada com sucesso');
        } catch (qrError) {
          console.error('Erro ao gerar QR code:', qrError);
        }

        // Aguardar 3 segundos antes de iniciar verificação de status
        setTimeout(() => {
          console.log('Iniciando monitoramento de status...');
          // Verificar status periodicamente após mostrar QR code
          const interval = setInterval(async () => {
            console.log('Verificando status do agente...');
            const status = await checkStatus(agent.id.toString());
            console.log('Status atual:', status);
            setIsOnline(status);
            
            if (status) {
              console.log('Agente conectado! Removendo QR code...');
              setQrCode(null);
              setQrCodeImage(null);
              clearInterval(interval);
            }
          }, 5000);

          // Limpar intervalo após 5 minutos para evitar polling infinito
          setTimeout(() => {
            console.log('Timeout de 5 minutos atingido, parando verificação de status');
            clearInterval(interval);
          }, 300000);
        }, 3000);
      } else {
        console.log('Nenhum QR code retornado na resposta, verificando status...');
        // Se não há QR code, pode ser que já esteja conectado
        checkAgentStatus();
      }
    } catch (error) {
      console.error('Erro ao conectar:', error);
    }
  };

  const handleForceReconnect = async () => {
    try {
      console.log(`🔄 INTERFACE: Forçando nova conexão para agente ${agent.id}`);
      // Limpar QR codes existentes
      setQrCode(null);
      setQrCodeImage(null);
      
      const response = await forceReconnect(agent.id.toString());
      console.log('🎯 INTERFACE: Resposta da reconexão forçada:', response);
      
      // Processar resposta igual ao handleConnect
      if (response.agent?.qr_string) {
        console.log('QR code recebido após reconexão, configurando interface...');
        setQrCode(response.agent.qr_string);
        setGenerated(response.agent.generated || false);
        setIsOnline(false);
        
        try {
          const qrImageUrl = await QRCodeGenerator.toDataURL(response.agent.qr_string, {
            width: 300,
            margin: 1,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
          setQrCodeImage(qrImageUrl);
        } catch (qrError) {
          console.error('Erro ao gerar QR code:', qrError);
        }

        // Monitoramento igual ao handleConnect
        setTimeout(() => {
          const interval = setInterval(async () => {
            const status = await checkStatus(agent.id.toString());
            setIsOnline(status);
            
            if (status) {
              setQrCode(null);
              setQrCodeImage(null);
              clearInterval(interval);
            }
          }, 5000);

          setTimeout(() => {
            clearInterval(interval);
          }, 300000);
        }, 3000);
      } else {
        checkAgentStatus();
      }
    } catch (error) {
      console.error('Erro ao forçar reconexão:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      console.log(`🔌 INTERFACE: Desconectando agente ${agent.id}`);
      await disconnectAgent(agent.id.toString());
      setIsOnline(false);
      setQrCode(null);
      setQrCodeImage(null);
    } catch (error) {
      console.error('❌ INTERFACE: Erro ao desconectar:', error);
    }
  };

  const handleClearSessions = async () => {
    try {
      console.log(`🧹 INTERFACE: Limpando sessões órfãs para agente ${agent.id}`);
      setQrCode(null);
      setQrCodeImage(null);
      
      const success = await clearOrphanedSessions(agent.id.toString());
      if (success) {
        // Aguardar um pouco e verificar status
        setTimeout(() => {
          checkAgentStatus();
        }, 2000);
      }
    } catch (error) {
      console.error('❌ INTERFACE: Erro ao limpar sessões:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Conexão WhatsApp</h3>
          <p className="text-sm text-muted-foreground">
            Conecte o agente ao WhatsApp Business
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={isOnline ? "default" : "secondary"} className="gap-2">
            {isOnline ? (
              <Wifi className="h-3 w-3" />
            ) : (
              <WifiOff className="h-3 w-3" />
            )}
            {isOnline === null ? 'Verificando...' : isOnline ? 'Online' : 'Offline'}
          </Badge>
          
          <Button
            variant="outline"
            size="sm"
            onClick={checkAgentStatus}
            disabled={checkingStatus}
          >
            <RefreshCw className={`h-4 w-4 ${checkingStatus ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {agent.oficialMetaWhatsappPhoneNumber && (
        <Alert>
          <Smartphone className="h-4 w-4" />
          <AlertDescription>
            Número configurado: <strong>{agent.oficialMetaWhatsappPhoneNumber}</strong>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Status da Conexão
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Status:</span>
                <span className={`text-sm ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                  {isOnline === null ? 'Verificando...' : isOnline ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm font-medium">Agente:</span>
                <span className="text-sm">{agent.name}</span>
              </div>
              
              {agent.oficialMetaWhatsappPhoneNumber && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Número:</span>
                  <span className="text-sm">{agent.oficialMetaWhatsappPhoneNumber}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {!isOnline ? (
                <>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleConnect} 
                      disabled={connecting || clearingSession}
                      className="flex-1"
                    >
                      {connecting ? 'Conectando...' : 'Conectar WhatsApp'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleForceReconnect} 
                      disabled={connecting || clearingSession}
                      className="whitespace-nowrap"
                    >
                      {connecting ? 'Reconectando...' : 'Forçar Nova Conexão'}
                    </Button>
                  </div>
                  
                  <Button 
                    variant="secondary" 
                    onClick={handleClearSessions} 
                    disabled={connecting || clearingSession}
                    className="w-full"
                  >
                    {clearingSession ? 'Limpando Sessões...' : 'Limpar Sessões Órfãs'}
                  </Button>
                </>
              ) : (
                <Button 
                  variant="destructive" 
                  onClick={handleDisconnect} 
                  disabled={disconnecting}
                  className="w-full"
                >
                  {disconnecting ? 'Desconectando...' : 'Desconectar'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {qrCodeImage && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                QR Code para Conexão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <QrCode className="h-4 w-4" />
                <AlertDescription>
                  {generated ? 
                    'Escaneie o QR Code com seu WhatsApp para conectar' :
                    'Sessão existente encontrada. Use este QR Code se necessário.'
                  }
                </AlertDescription>
              </Alert>
              
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-lg border">
                  <img 
                    src={qrCodeImage} 
                    alt="QR Code WhatsApp"
                    className="max-w-full h-auto"
                    style={{ maxWidth: '300px' }}
                  />
                </div>
              </div>
              
              {qrCode && (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground break-all p-2 bg-muted rounded">
                    Código: {qrCode}
                  </p>
                </div>
              )}
              
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  1. Abra o WhatsApp no seu telefone
                </p>
                <p className="text-sm text-muted-foreground">
                  2. Toque em Menu ou Configurações
                </p>
                <p className="text-sm text-muted-foreground">
                  3. Toque em "Aparelhos conectados"
                </p>
                <p className="text-sm text-muted-foreground">
                  4. Toque em "Conectar um aparelho"
                </p>
                <p className="text-sm text-muted-foreground">
                  5. Aponte para este QR Code
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {(!agent.oficialMetaWhatsappAccessToken || !agent.oficialMetaWhatsappPhoneNumber) && (
        <Alert>
          <AlertDescription>
            {!agent.oficialMetaWhatsappAccessToken 
              ? "Configure o token do WhatsApp Business nas configurações do agente antes de conectar."
              : "Configure um número do WhatsApp Business nas configurações do agente antes de conectar."
            }
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}