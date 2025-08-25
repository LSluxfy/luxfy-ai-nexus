import React from 'react';
import { Play } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl?: string;
  title: string;
  description?: string;
  thumbnail?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, title, description, thumbnail }) => {
  if (!videoUrl) {
    return (
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden aspect-video flex items-center justify-center group hover:from-slate-800 hover:to-slate-700 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 opacity-50"></div>
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
            <Play className="w-8 h-8 text-white ml-1" />
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
          {description && (
            <p className="text-white/80 text-sm max-w-sm mx-auto">{description}</p>
          )}
          <div className="mt-4 text-white/60 text-xs">Em breve</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden aspect-video">
      <iframe
        src={videoUrl}
        title={title}
        className="w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default VideoPlayer;