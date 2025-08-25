import React, { useEffect, useRef, useState } from 'react';
import { X, Minimize2, Maximize2, Move, Volume2, VolumeX } from 'lucide-react';
import { useFloatingVideo } from '@/contexts/FloatingVideoContext';
import { Button } from '@/components/ui/button';

const FloatingVideoPlayer: React.FC = () => {
  const { state, closeVideo, toggleMinimize, updatePosition, updateSize } = useFloatingVideo();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isMuted, setIsMuted] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        
        // Keep within viewport bounds
        const maxX = window.innerWidth - state.size.width;
        const maxY = window.innerHeight - state.size.height;
        
        updatePosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY)),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, state.size, updatePosition]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.isOpen) {
        closeVideo();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [state.isOpen, closeVideo]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('drag-handle')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - state.position.x,
        y: e.clientY - state.position.y,
      });
    }
  };

  if (!state.isOpen || !state.videoUrl) return null;

  const minimizedHeight = 40;
  const currentHeight = state.isMinimized ? minimizedHeight : state.size.height;

  return (
    <div
      ref={playerRef}
      className="fixed z-50 bg-background border border-border rounded-lg shadow-2xl overflow-hidden transition-all duration-300"
      style={{
        left: state.position.x,
        top: state.position.y,
        width: state.size.width,
        height: currentHeight,
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <div className="drag-handle flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border cursor-move">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Move className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm font-medium text-foreground truncate">
            {state.title}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? (
              <VolumeX className="w-3 h-3" />
            ) : (
              <Volume2 className="w-3 h-3" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={toggleMinimize}
          >
            {state.isMinimized ? (
              <Maximize2 className="w-3 h-3" />
            ) : (
              <Minimize2 className="w-3 h-3" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={closeVideo}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Video Content */}
      {!state.isMinimized && (
        <div className="relative bg-black">
          <iframe
            src={`${state.videoUrl}${isMuted ? '&mute=1' : ''}`}
            title={state.title}
            className="w-full h-full"
            style={{ height: state.size.height - 49 }} // Subtract header height
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          
          {/* Resize handle */}
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-primary/20 hover:bg-primary/40 transition-colors"
            onMouseDown={(e) => {
              e.stopPropagation();
              setIsResizing(true);
              const startX = e.clientX;
              const startY = e.clientY;
              const startWidth = state.size.width;
              const startHeight = state.size.height;

              const handleResize = (e: MouseEvent) => {
                const newWidth = Math.max(300, startWidth + (e.clientX - startX));
                const newHeight = Math.max(200, startHeight + (e.clientY - startY));
                updateSize({ width: newWidth, height: newHeight });
              };

              const handleResizeEnd = () => {
                setIsResizing(false);
                document.removeEventListener('mousemove', handleResize);
                document.removeEventListener('mouseup', handleResizeEnd);
              };

              document.addEventListener('mousemove', handleResize);
              document.addEventListener('mouseup', handleResizeEnd);
            }}
          >
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-primary rounded-tl-sm" />
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingVideoPlayer;
