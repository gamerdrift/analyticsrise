import { NextApiRequest, NextApiResponse } from 'next';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, cert } from 'firebase-admin/app';

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

  if (method === 'POST') {
    const { userId } = body;
    if (!userId) {
      res.status(400).json({ error: 'userId is required' });
      return;
    }
    // Prevent duplicate likes
    const likeQuery = await db
      .collection('posts')
      .doc(postId)
      .collection('likes')
      .where('userId', '==', userId)
      .limit(1)
      .get();
    if (!likeQuery.empty) {
      res.status(200).json({ message: 'Already liked' });
      return;
    }
    const newLike = {
      userId,
      createdAt: Date.now(),
    };
    const docRef = await db
      .collection('posts')
      .doc(postId)
      .collection('likes')
      .add(newLike);
    res.status(201).json({ id: docRef.id, ...newLike });
    return;
  }

  if (method === 'GET') {
    const snapshot = await db
      .collection('posts')
      .doc(postId)
      .collection('likes')
      .orderBy('createdAt', 'desc')
      .get();
    const likes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ likes });
    return;
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
