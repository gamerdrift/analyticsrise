import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';

// Initialize Firebase Admin (assumes env vars set)
if (!initializeApp.length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    }),
  });
}
const db = getFirestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  if (method === 'GET') {
    // list recent posts
    const snapshot = await db.collection('posts').orderBy('createdAt', 'desc').limit(20).get();
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ posts });
    return;
  }
  if (method === 'POST') {
    const { authorId, title, content, type, tags, visibility } = req.body;
    if (!authorId || !title || !content || !type) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    // simple sanitization (real implementation should use robust library)
    const sanitizedContent = content; // placeholder
    const newPost = {
      authorId,
      title,
      content: sanitizedContent,
      type,
      tags: tags || [],
      visibility: visibility || 'public',
      createdAt: Date.now(),
    };
    const docRef = await db.collection('posts').add(newPost);
    res.status(201).json({ id: docRef.id, ...newPost });
    return;
  }
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
