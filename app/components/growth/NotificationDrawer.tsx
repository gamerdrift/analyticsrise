'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Sparkles, Briefcase, Zap, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { NotificationService, AppNotification } from '@/lib/services/notificationService';

export default function NotificationDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setNotifications(NotificationService.getNotifications());
    setUnreadCount(NotificationService.getUnreadCount());
  }, []);

  const handleMarkRead = (id: string) => {
    const updated = NotificationService.markAsRead(id);
    setNotifications(updated);
    setUnreadCount(NotificationService.getUnreadCount());
  };

  return (
    <>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
        aria-label="Open Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#00E5FF] text-black text-[9px] font-black flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Slide-over Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[120] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-[#05070B]/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-[#0D1117] border-l border-white/10 h-full p-6 shadow-2xl z-10 flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-[#00E5FF]" />
                    <h3 className="text-lg font-display font-black text-white">Notifications</h3>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Notifications List */}
                <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-160px)] pr-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleMarkRead(n.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        n.read
                          ? 'bg-white/5 border-white/5 opacity-70'
                          : 'bg-[#00E5FF]/10 border-[#00E5FF]/40 shadow-md shadow-[#00E5FF]/5'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-xs font-bold text-white">{n.title}</h4>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-[#00E5FF] shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed mb-3">{n.message}</p>
                      {n.actionRoute && (
                        <Link
                          href={n.actionRoute}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-[#00E5FF] hover:underline uppercase tracking-wider"
                        >
                          {n.actionText || 'View Details'} →
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 text-center text-[10px] font-mono text-slate-500">
                AnalyticsRise Realtime Notification Hub
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
