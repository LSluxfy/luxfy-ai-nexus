import React, { Suspense, lazy, useState } from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInView } from '@/hooks/useInView';

// Lazy load o PandaVideoPlayer apenas quando necessário
const PandaVideoPlayer = lazy(() => import('./PandaVideoPlayer'));

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
        <Suspense fallback={placeholder}>
          <PandaVideoPlayer {...props} />
        </Suspense>
      ) : (
        placeholder
      )}
    </div>
  );
};

export default LazyPandaVideoPlayer;