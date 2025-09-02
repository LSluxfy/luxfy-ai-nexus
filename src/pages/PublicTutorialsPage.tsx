import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Mic, MessageSquare, Calendar, Megaphone, BarChart3, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from '@/components/VideoPlayer';
import LandingNavbar from '@/components/LandingNavbar';
import LandingFooter from '@/components/LandingFooter';

const PublicTutorialsPage = () => {
  const tutorials = [
    {
      id: 'welcome',
      title: 'Bem-vindos',
      icon: BookOpen,
      description: 'Introdução à plataforma Luxfy e como começar',
      videoUrl: 'https://player-vz-a5f41599-9ad.tv.pandavideo.com.br/embed/?v=f6d673e7-3f9a-4d8d-8c5e-8ee8152795d4&iosFakeFullscreen=true',
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
      videoUrl: 'https://player-vz-a5f41599-9ad.tv.pandavideo.com.br/embed/?v=5d7c91d2-45fc-4d37-9208-d5a68ac0723b&iosFakeFullscreen=true',
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
      videoUrl: 'https://player-vz-a5f41599-9ad.tv.pandavideo.com.br/embed/?v=10b6a739-0f50-4090-a507-fc1dbd677029&iosFakeFullscreen=true',
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
      videoUrl: 'https://player-vz-a5f41599-9ad.tv.pandavideo.com.br/embed/?v=44bce4b7-74ec-4bc0-9253-5ecf614b9e81&iosFakeFullscreen=true',
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
      videoUrl: 'https://player-vz-a5f41599-9ad.tv.pandavideo.com.br/embed/?v=7e3ccc4b-2715-4069-b766-f43db1d0ac0c&iosFakeFullscreen=true',
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
      videoUrl: 'https://player-vz-a5f41599-9ad.tv.pandavideo.com.br/embed/?v=f10f5926-9da3-4dd7-ad7d-a72d4d61b732&iosFakeFullscreen=true',
      topics: [
        'Dashboard de métricas',
        'Relatórios de performance',
        'Análise de conversões',
        'Insights de IA'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Tutoriais - Como usar o Luxfy | Guias em Vídeo</title>
        <meta name="description" content="Aprenda a usar todas as funcionalidades da plataforma Luxfy com nossos tutoriais em vídeo gratuitos. Agentes de IA, CRM, automação e muito mais." />
      </Helmet>

      <LandingNavbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              <span className="bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
                Tutoriais Luxfy
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Aprenda a aproveitar ao máximo todas as funcionalidades da nossa plataforma de IA para WhatsApp com nossos tutoriais passo a passo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-800 to-blue-700 hover:from-blue-900 hover:to-blue-800">
                  Começar agora
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-blue-800 text-blue-800 hover:bg-blue-800 hover:text-white">
                  Já tenho conta
                </Button>
              </Link>
            </div>
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
                <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-800/10 rounded-lg">
                        <tutorial.icon className="w-6 h-6 text-blue-800" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-slate-900">{tutorial.title}</CardTitle>
                        <CardDescription className="text-base text-slate-600">{tutorial.description}</CardDescription>
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
                      <h3 className="text-lg font-semibold mb-3 text-slate-900">Tópicos abordados:</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {tutorial.topics.map((topic, index) => (
                          <li key={index} className="flex items-center gap-2 text-slate-600">
                            <div className="w-2 h-2 bg-blue-800 rounded-full flex-shrink-0"></div>
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
      </div>

      <LandingFooter />
    </div>
  );
};

export default PublicTutorialsPage;