import React from 'react';
import Link from 'next/link';
import { Home, BookOpen, MapPin, Star, Settings } from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Learning Path', href: '/learning-path', icon: BookOpen },
  { name: 'Roadmap', href: '/roadmap', icon: MapPin },
  { name: 'Achievements', href: '/achievements', icon: Star },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar: React.FC = () => {
  return (
    <nav className="sidebar glass">
      <ul className="space-y-2">
        {navigation.map((item) => (
          <li key={item.name}>
            <Link href={item.href} className="flex items-center space-x-2 px-4 py-2 rounded hover:bg-white/10 transition">
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
