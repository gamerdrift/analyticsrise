'use client';

import React, { createContext, useState, ReactNode } from 'react';

/**
 * Loading Context Type Definition
 */
export interface LoadingContextType {
  isLoading: boolean;
  loadingMessage: string | null;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
}

export const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

/**
 * Loading Provider
 * 
 * Manages global loading states and provides utilities to display blocking overlays
 * or custom spinner/skeleton messages.
 */
export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

  const startLoading = (message?: string) => {
    setIsLoading(true);
    setLoadingMessage(message || null);
  };

  const stopLoading = () => {
    setIsLoading(false);
    setLoadingMessage(null);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, loadingMessage, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};
export default LoadingProvider;
