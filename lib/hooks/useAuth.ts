import { useContext } from 'react';
import { AuthContext, AuthContextType } from '../contexts/AuthContext';

/**
 * Hook to access AuthContext authentication parameters.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export default useAuth;
