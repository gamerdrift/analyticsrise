// src/components/AIMentor.tsx
import React, { useState } from 'react';
import { RiRobotLine } from 'react-icons/ri';
import { useLearning } from '@/src/context/LearningContext';
import '@/styles/mentor.css';

/**
 * Floating AI Mentor UI.
 * Desktop: small chat‑like bubble in the bottom‑right.
 * Mobile: FAB that expands to a modal when tapped.
 */
const AIMentor: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { stats, updateStats } = useLearning();

  const handleQuery = async (question: string) => {
    // Placeholder – later you can connect to OpenAI/Llama etc.
    return `You asked: ${question}. (AI response placeholder)`;
  };

  const submitQuestion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem('question') as HTMLInputElement;
    const answer = await handleQuery(input.value);
    // Here you could record interaction, update stats, etc.
    alert(answer);
    input.value = '';
  };

  return (
    <div className="ai-mentor">
      {open ? (
        <div className="ai-mentor__chat">
          <div className="ai-mentor__header" onClick={() => setOpen(false)}>
            <RiRobotLine size={24} /> AI Mentor
          </div>
          <form className="ai-mentor__form" onSubmit={submitQuestion}>
            <input name="question" placeholder="Ask me anything…" required />
            <button type="submit">Send</button>
          </form>
        </div>
      ) : (
        <button className="ai-mentor__fab" onClick={() => setOpen(true)} aria-label="Open AI Mentor">
          <RiRobotLine size={28} />
        </button>
      )}
    </div>
  );
};

export default AIMentor;
