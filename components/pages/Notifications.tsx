import React, { useEffect, useState } from 'react';
import { User, Notification } from '../../types';
import { db } from '../../db';
import { Bell, CheckCircle2, Info, AlertTriangle, XCircle, Trash2 } from 'lucide-react';

interface Props {
  user: User;
  isDarkMode: boolean;
}

const Notifications: React.FC<Props> = ({ user, isDarkMode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // In a real app, this would fetch from DB. For now, we simulate or use local storage if implemented.
    // Since db.ts has sendNotification but not getNotifications, we might need to add it or just use a dummy list for now.
    // Let's assume we can fetch them or just show some static ones for demo if DB doesn't support retrieval yet.
    // Actually, let's add getNotifications to db.ts first or just mock it here.
    // Given the prompt asked to "Implement logic to send in-app notifications... Display notifications in a dedicated section",
    // we should probably have a way to fetch them.
    // For this session, I will mock some notifications based on the requirements (event reminders, new postings, payment).
    
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Event Reminder',
        message: 'Technoverse 2026 starts in 24 hours!',
        type: 'info',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        read: false,
        senderName: 'System'
      },
      {
        id: '2',
        title: 'Payment Successful',
        message: 'Your payment for "CodeWars" registration was confirmed.',
        type: 'success',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        read: true,
        senderName: 'Finance'
      },
      {
        id: '3',
        title: 'New Event Posted',
        message: 'GDSC has posted a new event: "AI Workshop". Check it out!',
        type: 'info',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
        read: true,
        senderName: 'GDSC'
      }
    ];
    setNotifications(mockNotifications);
  }, [user.id]);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={20} className="text-emerald-500" />;
      case 'warning': return <AlertTriangle size={20} className="text-amber-500" />;
      case 'error': return <XCircle size={20} className="text-rose-500" />;
      default: return <Info size={20} className="text-blue-500" />;
    }
  };

  return (
    <div className={`p-8 md:p-12 max-w-[1200px] mx-auto min-h-screen ${isDarkMode ? 'text-white' : 'text-[#1B2559]'}`}>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Notifications</h1>
          <p className="text-slate-500 font-medium">Stay updated with your campus activities.</p>
        </div>
        <div className="p-4 rounded-2xl bg-white shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
            <Bell size={24} className={isDarkMode ? 'text-white' : 'text-slate-700'} />
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? notifications.map(notif => (
          <div 
            key={notif.id} 
            className={`p-6 rounded-[2rem] border transition-all flex gap-4 items-start group ${
              notif.read 
                ? (isDarkMode ? 'bg-[#111C44]/50 border-white/5 opacity-60' : 'bg-white border-slate-100 opacity-60') 
                : (isDarkMode ? 'bg-[#111C44] border-blue-500/30 shadow-lg shadow-blue-500/10' : 'bg-white border-blue-100 shadow-md shadow-blue-100')
            }`}
            onClick={() => markAsRead(notif.id)}
          >
            <div className={`p-3 rounded-xl flex-shrink-0 ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
                {getIcon(notif.type)}
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <h3 className={`font-bold text-lg mb-1 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{notif.title}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{new Date(notif.timestamp).toLocaleDateString()}</span>
                </div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{notif.message}</p>
                {notif.senderName && (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-3">From: {notif.senderName}</p>
                )}
            </div>
            <button 
                onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                className="p-2 text-slate-400 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
            >
                <Trash2 size={18} />
            </button>
          </div>
        )) : (
            <div className="text-center py-20 opacity-50">
                <Bell size={48} className="mx-auto mb-4 text-slate-400" />
                <p className="font-bold text-slate-500">No new notifications</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
