/**
 * RevenueRiseAI — Server-Side AI Conversation Repository
 * Authoritative Firestore persistence for conversations and messages with strict ownership validation.
 */

import { Firestore, FieldValue } from 'firebase-admin/firestore';
import { HttpsError } from 'firebase-functions/v2/https';
import { AIConversation, PedagogicalMode, AITokenUsage } from './types';

export class AIConversationRepository {
  /**
   * Resolves existing conversation with ownership validation or initializes a new one
   */
  public static async getOrCreateConversation(
    userId: string,
    conversationId: string | undefined,
    pedagogicalMode: PedagogicalMode = 'socratic',
    database: Firestore
  ): Promise<AIConversation> {
    const nowIso = new Date().toISOString();

    if (conversationId && conversationId.trim() !== '') {
      const convRef = database.collection('aiConversations').doc(conversationId);
      const snap = await convRef.get();

      if (snap.exists) {
        const data = snap.data() as AIConversation;
        // Strict ownership check: prevent cross-user access
        if (data.userId !== userId) {
          throw new HttpsError(
            'permission-denied',
            'You do not have permission to access or modify this conversation.'
          );
        }
        return data;
      }
    }

    // Initialize new conversation
    const newConvId = conversationId || `conv_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const newConvRef = database.collection('aiConversations').doc(newConvId);

    const newConversation: AIConversation = {
      conversationId: newConvId,
      userId,
      title: 'New Mentoring Session',
      pedagogicalMode,
      createdAt: nowIso,
      updatedAt: nowIso,
      messageCount: 0,
      lastMessageAt: nowIso,
    };

    await newConvRef.set({
      ...newConversation,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      lastMessageAt: FieldValue.serverTimestamp(),
    });

    return newConversation;
  }

  /**
   * Persists both user query and assistant response atomically to Firestore
   */
  public static async persistExchange(
    conversationId: string,
    userId: string,
    userQuery: string,
    assistantContent: string,
    modelUsed: string,
    usage: AITokenUsage,
    database: Firestore
  ): Promise<{ userMessageId: string; assistantMessageId: string }> {
    const timestamp = Date.now();
    const userMessageId = `msg_u_${timestamp}_${Math.random().toString(36).slice(2, 7)}`;
    const assistantMessageId = `msg_a_${timestamp + 1}_${Math.random().toString(36).slice(2, 7)}`;

    const batch = database.batch();
    const convRef = database.collection('aiConversations').doc(conversationId);
    const userMsgRef = convRef.collection('messages').doc(userMessageId);
    const asstMsgRef = convRef.collection('messages').doc(assistantMessageId);

    // Derive concise conversation title from initial user message if first message
    const titleSnippet = userQuery.slice(0, 48).trim();

    // 1. User message document
    batch.set(userMsgRef, {
      messageId: userMessageId,
      conversationId,
      userId,
      role: 'user',
      content: userQuery,
      createdAt: FieldValue.serverTimestamp(),
      status: 'completed',
    });

    // 2. Assistant message document
    batch.set(asstMsgRef, {
      messageId: assistantMessageId,
      conversationId,
      userId,
      role: 'assistant',
      content: assistantContent,
      createdAt: FieldValue.serverTimestamp(),
      status: 'completed',
      tokens: {
        promptTokens: usage.promptTokens,
        completionTokens: usage.completionTokens,
        totalTokens: usage.totalTokens,
      },
      modelUsed,
    });

    // 3. Update conversation metadata
    batch.update(convRef, {
      messageCount: FieldValue.increment(2),
      lastMessageAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      title: titleSnippet ? `${titleSnippet}...` : 'Mentoring Session',
    });

    await batch.commit();

    return { userMessageId, assistantMessageId };
  }
}
