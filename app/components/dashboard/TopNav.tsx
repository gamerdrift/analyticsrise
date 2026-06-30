import React from 'react';
import Image from 'next/image';
import { Bell, Moon, Sun } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth'; // custom hook

const TopNav: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="topnav glass flex items-center justify-between p-4">
      <div className="flex items-center space-x-3">
        {user?.photoURL ? (
          <Image src={user.photoURL} alt="avatar" width={40} height={40} className="rounded-full" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-500" />
        )}
        <span className="font-medium text-white">{user?.displayName || 'User'}</span>
      </div>
      <div className="flex items-center space-x-4">
        <button aria-label="Notifications" className="p-2 rounded hover:bg-white/10 transition">
          <Bell className="w-5 h-5 text-white" />
        </button>
        {/* Theme toggle */}
        <button aria-label="Toggle theme" className="p-2 rounded hover:bg-white/10 transition flex items-center">
          <Moon className="w-5 h-5 text-white" />
          <Sun className="w-5 h-5 text-white ml-2" />
        </button>
        <button onClick={signOut} className="p-2 rounded hover:bg-white/10 transition" aria-label="Logout">
          <span className="text-white">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default TopNav;
