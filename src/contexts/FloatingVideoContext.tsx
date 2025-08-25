import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FloatingVideoState {
  isOpen: boolean;
  videoUrl: string | null;
  title: string;
  isMinimized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface FloatingVideoContextType {
  state: FloatingVideoState;
  openVideo: (url: string, title: string) => void;
  closeVideo: () => void;
  toggleMinimize: () => void;
  updatePosition: (position: { x: number; y: number }) => void;
  updateSize: (size: { width: number; height: number }) => void;
}

const FloatingVideoContext = createContext<FloatingVideoContextType | undefined>(undefined);

const initialState: FloatingVideoState = {
  isOpen: false,
  videoUrl: null,
  title: '',
  isMinimized: false,
  position: { x: 20, y: 20 },
  size: { width: 400, height: 225 },
};

export const FloatingVideoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<FloatingVideoState>(initialState);

  const openVideo = (url: string, title: string) => {
    setState(prev => ({
      ...prev,
      isOpen: true,
      videoUrl: url,
      title,
      isMinimized: false,
    }));
  };

  const closeVideo = () => {
    setState(prev => ({
      ...prev,
      isOpen: false,
      videoUrl: null,
      title: '',
      isMinimized: false,
    }));
  };

  const toggleMinimize = () => {
    setState(prev => ({
      ...prev,
      isMinimized: !prev.isMinimized,
    }));
  };

  const updatePosition = (position: { x: number; y: number }) => {
    setState(prev => ({ ...prev, position }));
  };

  const updateSize = (size: { width: number; height: number }) => {
    setState(prev => ({ ...prev, size }));
  };

  return (
    <FloatingVideoContext.Provider
      value={{
        state,
        openVideo,
        closeVideo,
        toggleMinimize,
        updatePosition,
        updateSize,
      }}
    >
      {children}
    </FloatingVideoContext.Provider>
  );
};

export const useFloatingVideo = () => {
  const context = useContext(FloatingVideoContext);
  if (context === undefined) {
    throw new Error('useFloatingVideo must be used within a FloatingVideoProvider');
  }
  return context;
};