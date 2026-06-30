import { useContext } from 'react';
import { LoadingContext, LoadingContextType } from '../contexts/LoadingContext';

/**
 * Hook to access global loading state trigger actions.
 */
export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
export default useLoading;
