// app/unified-workspace/context/UnifiedWorkspaceContext.tsx
import React, { createContext, useReducer, Dispatch, ReactNode, useEffect } from 'react';
import { collection, doc, getDoc, setDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase'; // assume firebase init exports db

/** Types **/
export type PhaseStatus = 'locked' | 'active' | 'completed';
export interface Phase {
  id: string;
  name: string;
  status: PhaseStatus;
  simulator: 'excel' | 'sql' | 'python' | 'powerbi' | 'tableau';
  deliverables: Deliverable[];
}
export interface Deliverable {
  id: string;
  type: 'dashboard' | 'notebook' | 'sqlScript' | 'excelWorkbook' | 'presentation';
  title: string;
  completed: boolean;
  url?: string;
}
export interface Project {
  id: string;
  name: string;
  industry: string;
  phases: Phase[];
  xpEarned: number;
  achievements: string[];
  estimatedHours: number;
  thumbnailUrl?: string;
  summary: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type Action =
  | { type: 'SET_PROJECT'; payload: Project }
  | { type: 'UPDATE_PHASE'; payload: Phase }
  | { type: 'COMPLETE_TASK'; payload: { phaseId: string; taskId: string } }
  | { type: 'ADD_DELIVERABLE'; payload: { phaseId: string; deliverable: Deliverable } };

const initialState: { project: Project | null } = { project: null };

function reducer(state: typeof initialState, action: Action) {
  switch (action.type) {
    case 'SET_PROJECT':
      return { ...state, project: action.payload };
    case 'UPDATE_PHASE':
      if (!state.project) return state;
      return {
        ...state,
        project: {
          ...state.project,
          phases: state.project.phases.map(p => (p.id === action.payload.id ? action.payload : p)),
        },
      };
    case 'COMPLETE_TASK':
      // In a real implementation you'd locate the task within a phase; placeholder here.
      return state;
    case 'ADD_DELIVERABLE':
      if (!state.project) return state;
      return {
        ...state,
        project: {
          ...state.project,
          phases: state.project.phases.map(p =>
            p.id === action.payload.phaseId
              ? { ...p, deliverables: [...p.deliverables, action.payload.deliverable] }
              : p
          ),
        },
      };
    default:
      return state;
  }
}

export const UnifiedWorkspaceContext = createContext<{ state: typeof initialState; dispatch: Dispatch<Action> } | undefined>(undefined);

export const UnifiedWorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load a project (for demo we use a hard‑coded ID). In production you would select based on user.
  useEffect(() => {
    const projectId = 'demo-project';
    const docRef = doc(collection(db, 'projects'), projectId);
    getDoc(docRef).then(snap => {
      if (snap.exists()) {
        dispatch({ type: 'SET_PROJECT', payload: snap.data() as Project });
      }
    });
    // Real‑time updates
    const unsub = onSnapshot(docRef, snap => {
      if (snap.exists()) dispatch({ type: 'SET_PROJECT', payload: snap.data() as Project });
    });
    return () => unsub();
  }, []);

  // Sync changes back to Firestore (simple example – you may debounce in production)
  useEffect(() => {
    if (state.project) {
      const docRef = doc(collection(db, 'projects'), state.project.id);
      setDoc(docRef, state.project, { merge: true });
    }
  }, [state.project]);

  return <UnifiedWorkspaceContext.Provider value={{ state, dispatch }}>{children}</UnifiedWorkspaceContext.Provider>;
};

// Hook for convenience
export const useUnifiedWorkspace = () => {
  const ctx = React.useContext(UnifiedWorkspaceContext);
  if (!ctx) throw new Error('useUnifiedWorkspace must be used within UnifiedWorkspaceProvider');
  return ctx;
};
