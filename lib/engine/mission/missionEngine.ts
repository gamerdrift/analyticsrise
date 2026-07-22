// lib/engine/mission/missionEngine.ts
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { User } from '@/lib/types';

export interface Mission {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: number; // minutes
  objectives: string[];
  prerequisites?: string[]; // mission IDs
  xpReward: number;
  unlockLogic?: (user: User) => boolean;
}

export class MissionEngine {
  private missionsCol;
  constructor(private db: any) {
    this.missionsCol = collection(this.db, 'missions');
  }

  async getMission(id: string): Promise<Mission | null> {
    const snap = await getDoc(doc(this.missionsCol, id));
    return snap.exists() ? (snap.data() as Mission) : null;
  }

  async listAllMissions(): Promise<Mission[]> {
    const snap = await getDocs(this.missionsCol);
    return snap.docs.map((d: any) => d.data() as Mission);
  }

  async listAvailableMissions(_uid: string): Promise<Mission[]> {
    // For now, return all missions; client can filter by unlockLogic later.
    return this.listAllMissions();
  }

  async isUnlocked(mission: Mission, uid: string): Promise<boolean> {
    if (!mission.prerequisites || mission.prerequisites.length === 0) return true;
    // Simple check: all prerequisite missions must be completed.
    const progressCol = collection(this.db, 'missionProgress');
    const q = query(
      progressCol,
      where('uid', '==', uid),
      where('missionId', 'in', mission.prerequisites),
      where('status', '==', 'completed')
    );
    const snap = await getDocs(q);
    return snap.size === mission.prerequisites.length;
  }
}
