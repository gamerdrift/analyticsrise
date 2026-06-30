import React from 'react';
import { useAuth } from '@/lib/hooks/useAuth'; // custom hook to get user
import { format } from 'date-fns';

const WelcomeWidget: React.FC = () => {
  const { user } = useAuth();
  const today = format(new Date(), 'EEEE, MMMM d');

  return (
    <section className="widget glass p-6 rounded-xl">
      <h2 className="text-2xl font-semibold text-white mb-2">Welcome back, {user?.displayName || 'User'}!</h2>
      <p className="text-gray-300">{today}</p>
    </section>
  );
};

export default WelcomeWidget;
