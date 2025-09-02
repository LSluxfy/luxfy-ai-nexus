import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BookOpen, Users, Mic, MessageSquare, Calendar, Megaphone, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from '@/components/VideoPlayer';
import { useTranslation } from 'react-i18next';

const TutorialsPage = () => {
  const { t } = useTranslation();

  const tutorials = [
    {
      id: 'welcome',
      title: t('tutorials.categories.welcome.title'),
      icon: BookOpen,
      description: t('tutorials.categories.welcome.description'),
      videoUrl: 'https://player-vz-a5f41599-9ad.tv.pandavideo.com.br/embed/?v=f6d673e7-3f9a-4d8d-8c5e-8ee8152795d4&iosFakeFullscreen=true',
      topics: t('tutorials.categories.welcome.topics', { returnObjects: true }) as string[]
    },
    {
      id: 'agents',
      title: t('tutorials.categories.agents.title'),
      icon: Users,
      description: t('tutorials.categories.agents.description'),
      videoUrl: 'https://player-vz-a5f41599-9ad.tv.pandavideo.com.br/embed/?v=5d7c91d2-45fc-4d37-9208-d5a68ac0723b&iosFakeFullscreen=true',
      topics: t('tutorials.categories.agents.topics', { returnObjects: true }) as string[]
    },
    {
      id: 'voice',
      title: t('tutorials.categories.voice.title'),
      icon: Mic,
      description: t('tutorials.categories.voice.description'),
      videoUrl: 'https://player-vz-a5f41599-9ad.tv.pandavideo.com.br/embed/?v=10b6a739-0f50-4090-a507-fc1dbd677029&iosFakeFullscreen=true',
      topics: t('tutorials.categories.voice.topics', { returnObjects: true }) as string[]
    },
    {
      id: 'crm-chat',
      title: t('tutorials.categories.crmChat.title'),
      icon: MessageSquare,
      description: t('tutorials.categories.crmChat.description'),
      videoUrl: 'https://player-vz-a5f41599-9ad.tv.pandavideo.com.br/embed/?v=44bce4b7-74ec-4bc0-9253-5ecf614b9e81&iosFakeFullscreen=true',
      topics: t('tutorials.categories.crmChat.topics', { returnObjects: true }) as string[]
    },
    {
      id: 'schedule',
      title: t('tutorials.categories.schedule.title'),
      icon: Calendar,
      description: t('tutorials.categories.schedule.description'),
      videoUrl: '',
      topics: t('tutorials.categories.schedule.topics', { returnObjects: true }) as string[]
    },
    {
      id: 'campaigns',
      title: t('tutorials.categories.campaigns.title'),
      icon: Megaphone,
      description: t('tutorials.categories.campaigns.description'),
      videoUrl: 'https://player-vz-a5f41599-9ad.tv.pandavideo.com.br/embed/?v=7e3ccc4b-2715-4069-b766-f43db1d0ac0c&iosFakeFullscreen=true',
      topics: t('tutorials.categories.campaigns.topics', { returnObjects: true }) as string[]
    },
    {
      id: 'analytics',
      title: t('tutorials.categories.analytics.title'),
      icon: BarChart3,
      description: t('tutorials.categories.analytics.description'),
      videoUrl: 'https://player-vz-a5f41599-9ad.tv.pandavideo.com.br/embed/?v=f10f5926-9da3-4dd7-ad7d-a72d4d61b732&iosFakeFullscreen=true',
      topics: t('tutorials.categories.analytics.topics', { returnObjects: true }) as string[]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>{t('tutorials.page.seoTitle')}</title>
        <meta name="description" content={t('tutorials.page.seoDescription')} />
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">{t('tutorials.page.internalTitle')}</h1>
        <p className="text-muted-foreground text-lg">
          {t('tutorials.page.internalDescription')}
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
                  <h3 className="text-lg font-semibold mb-3">{t('tutorials.page.topicsCovered')}</h3>
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