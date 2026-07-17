import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Info, CheckCircle2, AlertTriangle, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useNotifications } from '../../context/NotificationContext';

export function NotificationCenter() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'research': return <Info className="w-5 h-5 text-blue-500" />;
      case 'meeting': return <Calendar className="w-5 h-5 text-purple-500" />;
      case 'success': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'alert': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default: return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-slate-900 shadow-sm relative transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-2xl ring-2 ring-white"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-xs font-medium text-primary hover:text-primary-dark"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      onClick={() => markAsRead(notif.id)}
                      className={cn(
                        "p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors cursor-pointer",
                        !notif.read ? "bg-primary/5" : ""
                      )}
                    >
                      <div className="mt-0.5 shrink-0 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                        {getIcon(notif.type)}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-900">{notif.title}</h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{notif.message}</p>
                        <span className="text-[10px] text-slate-500 mt-2 block">
                          {notif.createdAt?.toDate ? notif.createdAt.toDate().toLocaleString() : 'Just now'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500">
                  <Bell className="w-8 h-8 mx-auto mb-3 text-slate-400" />
                  <p className="text-sm">You're all caught up!</p>
                </div>
              )}
            </div>
            <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center">
               <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                 View all notifications
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
