import { NextApiRequest, NextApiResponse } from 'next';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, cert } from 'firebase-admin/app';

// Initialize Firebase Admin if not already initialized
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
  const { method, query, body } = req;
  const postId = typeof query.postId === 'string' ? query.postId : undefined;

  if (!postId) {
    res.status(400).json({ error: 'postId query parameter is required' });
    return;
  }

  if (method === 'GET') {
    // Fetch comments for a post
    const snapshot = await db
      .collection('posts')
      .doc(postId)
      .collection('comments')
      .orderBy('createdAt', 'asc')
      .get();
    const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ comments });
    return;
  }

  if (method === 'POST') {
    const { authorId, content } = body;
    if (!authorId || !content) {
      res.status(400).json({ error: 'authorId and content are required' });
      return;
    }
    const newComment = {
      authorId,
      content, // TODO: sanitize on server side
      createdAt: Date.now(),
    };
    const docRef = await db
      .collection('posts')
      .doc(postId)
      .collection('comments')
      .add(newComment);
    res.status(201).json({ id: docRef.id, ...newComment });
    return;
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
