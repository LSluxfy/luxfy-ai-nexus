import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BookOpen, Users, Mic, MessageSquare, Calendar, Megaphone, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from '@/components/VideoPlayer';

const TutorialsPage = () => {
  const tutorials = [
    {
      id: 'welcome',
      title: 'Bem-vindos',
      icon: BookOpen,
      description: 'Introdução à plataforma Luxfy e como começar',
      videoUrl: '',
      topics: [
        'Visão geral da plataforma',
        'Primeiro acesso e configuração',
        'Navegação básica',
        'Dicas para começar'
      ]
    },
    {
      id: 'agents',
      title: 'Agentes',
      icon: Users,
      description: 'Como criar e configurar seus agentes de IA',
      videoUrl: '',
      topics: [
        'Criação de agentes',
        'Configurações básicas',
        'Treinamento e personalização',
        'Gerenciamento de múltiplos agentes'
      ]
    },
    {
      id: 'voice',
      title: 'Voz Personalizável',
      icon: Mic,
      description: 'Configure vozes únicas para seus agentes',
      videoUrl: '',
      topics: [
        'Seleção de vozes',
        'Personalização de tom',
        'Configurações de áudio',
        'Testes de qualidade'
      ]
    },
    {
      id: 'crm-chat',
      title: 'CRM e Chat',
      icon: MessageSquare,
      description: 'Gerencie leads e conversas em tempo real',
      videoUrl: '',
      topics: [
        'Configuração do CRM',
        'Gestão de leads',
        'Interface de chat',
        'Histórico de conversas'
      ]
    },
    {
      id: 'schedule',
      title: 'Agenda Inteligente',
      icon: Calendar,
      description: 'Automatize agendamentos com IA',
      videoUrl: '',
      topics: [
        'Configuração de horários',
        'Integração com calendários',
        'Automatização de agendamentos',
        'Gestão de disponibilidade'
      ]
    },
    {
      id: 'campaigns',
      title: 'Campanhas Marketing',
      icon: Megaphone,
      description: 'Crie e gerencie campanhas automatizadas',
      videoUrl: '',
      topics: [
        'Criação de campanhas',
        'Segmentação de público',
        'Automação de marketing',
        'Métricas de performance'
      ]
    },
    {
      id: 'analytics',
      title: 'Análises e Métricas',
      icon: BarChart3,
      description: 'Monitore performance e resultados',
      videoUrl: '',
      topics: [
        'Dashboard de métricas',
        'Relatórios de performance',
        'Análise de conversões',
        'Insights de IA'
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Tutoriais - Luxfy</title>
        <meta name="description" content="Aprenda a usar todas as funcionalidades da plataforma Luxfy com nossos tutoriais em vídeo" />
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Tutoriais da Plataforma</h1>
        <p className="text-muted-foreground text-lg">
          Aprenda a aproveitar ao máximo todas as funcionalidades da Luxfy com nossos tutoriais passo a passo.
        </p>
      </div>

      <Tabs defaultValue="welcome" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 mb-8">
          {tutorials.map((tutorial) => (
            <TabsTrigger key={tutorial.id} value={tutorial.id} className="flex flex-col gap-1 h-auto py-3">
              <tutorial.icon className="w-4 h-4" />
              <span className="text-xs hidden sm:block">{tutorial.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {tutorials.map((tutorial) => (
          <TabsContent key={tutorial.id} value={tutorial.id} className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <tutorial.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{tutorial.title}</CardTitle>
                    <CardDescription className="text-base">{tutorial.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <VideoPlayer
                  videoUrl={tutorial.videoUrl}
                  title={tutorial.title}
                  description={tutorial.description}
                />
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Tópicos abordados:</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {tutorial.topics.map((topic, index) => (
                      <li key={index} className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default TutorialsPage;