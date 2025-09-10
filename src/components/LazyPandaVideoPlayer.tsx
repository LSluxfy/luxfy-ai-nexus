import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInView } from '@/hooks/useInView';

// Componente de vídeo simples sem dependências do FloatingVideo
const SimplePandaVideo: React.FC<{
  videoId: string;
  title: string;
  aspectRatio?: string;
}> = ({ videoId, title, aspectRatio = "56.25%" }) => {
  const embedUrl = `https://player-vz-a5f41599-9ad.tv.pandavideo.com.br/embed/?v=${videoId}&iosFakeFullscreen=true`;

  useEffect(() => {
    // Carregar script do Panda Video apenas quando necessário
    if (!document.querySelector('script[src="https://player.pandavideo.com.br/api.v2.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://player.pandavideo.com.br/api.v2.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: aspectRatio === "56.25%" ? "16/9" : "16/10.39" }}>
      <div style={{ position: 'relative', paddingTop: aspectRatio }}>
        <iframe
          id={`panda-${videoId}`}
          src={embedUrl}
          style={{ border: 'none', position: 'absolute', top: 0, left: 0 }}
          allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture"
          allowFullScreen={true}
          width="100%"
          height="100%"
          title={title}
        />
      </div>
    </div>
  );
};

interface LazyPandaVideoPlayerProps {
  videoId: string;
  title: string;
  description?: string;
  aspectRatio?: string;
}

const LazyPandaVideoPlayer: React.FC<LazyPandaVideoPlayerProps> = (props) => {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const [userTriggered, setUserTriggered] = useState(false);

  const shouldLoad = inView || userTriggered;

  const placeholder = (
    <div 
      className="relative rounded-xl overflow-hidden bg-slate-900 cursor-pointer group"
      style={{ aspectRatio: props.aspectRatio === "56.25%" ? "16/9" : "16/10.39" }}
      onClick={() => setUserTriggered(true)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-slate-900/80 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Button 
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 rounded-full w-16 h-16 group-hover:scale-110 transition-transform"
          >
            <Play className="w-6 h-6 ml-1" fill="currentColor" />
          </Button>
          <div className="text-white">
            <h3 className="font-semibold text-lg">{props.title}</h3>
            {props.description && (
              <p className="text-slate-300 text-sm mt-2">{props.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div ref={ref}>
      {shouldLoad ? (
        <SimplePandaVideo 
          videoId={props.videoId}
          title={props.title}
          aspectRatio={props.aspectRatio}
        />
      ) : (
        placeholder
      )}
    </div>
  );
};

export default LazyPandaVideoPlayer;