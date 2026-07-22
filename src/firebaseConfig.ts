// src/firebaseConfig.ts
// Unified re-export from central Firebase configuration
import app, { auth, db, storage } from '@/lib/firebase/config';

export { app, auth, db, storage };
export default app;
