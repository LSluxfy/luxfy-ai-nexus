import React, { useEffect } from 'react';
import { Play, PictureInPicture } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PandaVideoPlayerProps {
  videoId: string;
  title: string;
  description?: string;
  aspectRatio?: string; // "56.25%" or "64.94287432351172%"
}

const PandaVideoPlayer: React.FC<PandaVideoPlayerProps> = ({ 
  videoId, 
  title, 
  description, 
  aspectRatio = "56.25%" 
}) => {
  const embedUrl = `https://player-vz-a5f41599-9ad.tv.pandavideo.com.br/embed/?v=${videoId}&iosFakeFullscreen=true`;
  
  // Try to get floating video context safely
  let openVideo: ((url: string, title: string) => void) | undefined;
  
  try {
    // Dynamic import to avoid build errors
    const { useFloatingVideo } = require('@/contexts/FloatingVideoContext');
    const floating = useFloatingVideo();
    openVideo = floating?.openVideo;
  } catch {
    // Context not available - this is expected for pages without FloatingVideoProvider
    openVideo = undefined;
  }

  useEffect(() => {
    // Ensure Panda Video script is loaded
    if (!document.querySelector('script[src="https://player.pandavideo.com.br/api.v2.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://player.pandavideo.com.br/api.v2.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div className="relative rounded-xl overflow-hidden group" style={{ aspectRatio: aspectRatio === "56.25%" ? "16/9" : "16/10.39" }}>
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
      
      {/* Floating Mode Button */}
      {openVideo && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => openVideo(embedUrl, title)}
            className="h-8 gap-1 bg-black/70 hover:bg-black/90 text-white border-0"
          >
            <PictureInPicture className="w-3 h-3" />
            <span className="text-xs">Flutuante</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default PandaVideoPlayer;