
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Award, 
  Globe, 
  Zap,
  MessageSquare,
  Settings,
  ChevronRight,
  ChevronLeft,
  Ticket,
  CreditCard,
  Briefcase,
  ShieldCheck,
  FileCheck,
  PieChart,
  Lock,
  GraduationCap,
  Activity,
  UserPlus,
  Fingerprint,
  Wallet,
  Layout,
  Server
} from 'lucide-react';
import { ClubRole, Role, User } from '../types';

interface SidebarProps {
  user: User;
  clubs: any[]; // relaxed type for brevity in this update
  activeContext: string;
  onContextChange: (id: string) => void;
  userRole: Role;
  clubRole: ClubRole | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  user, activeContext, onContextChange, userRole, clubRole, activeTab, setActiveTab, isOpen, onClose 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Auto-collapse logic for specific pages like Chat
  useEffect(() => {
    if (activeTab === 'chat') {
      setIsExpanded(false);
    }
  }, [activeTab]);

  const getMenuItems = () => {
    const items = [];

    // GLOBAL CONTEXT MENU
    if (activeContext === 'Global') {
      items.push({ id: 'dashboard', label: 'Overview', icon: LayoutDashboard });
      items.push({ id: 'events', label: 'Campus Events', icon: Calendar });
      items.push({ id: 'clubs', label: 'Club Directory', icon: Globe });
      items.push({ id: 'chat', label: 'Messages', icon: MessageSquare });
      items.push({ id: 'notifications', label: 'Notifications', icon: Zap });

      if (userRole === Role.STUDENT) {
        items.push({ section: 'Portfolio' });
        items.push({ id: 'recruitment', label: 'Applications', icon: Briefcase });
        items.push({ id: 'tickets', label: 'My Passes', icon: Ticket });
        items.push({ id: 'certificates', label: 'Credentials', icon: Award });
        items.push({ id: 'payments', label: 'Transactions', icon: CreditCard });
      }

      if (userRole === Role.FACULTY) {
        items.push({ section: 'Faculty' });
        items.push({ id: 'faculty-dashboard', label: 'Hub', icon: ShieldCheck });
        items.push({ id: 'approvals', label: 'Approvals', icon: FileCheck });
        items.push({ id: 'reports', label: 'KPIs', icon: PieChart });
      }

      if (userRole === Role.SUPER_ADMIN) {
        items.push({ section: 'Admin' });
        items.push({ id: 'admin-dashboard', label: 'Console', icon: Lock });
        items.push({ id: 'student-registry', label: 'Students', icon: Users });
        items.push({ id: 'faculty-registry', label: 'Faculty', icon: GraduationCap });
        items.push({ id: 'analytics', label: 'Analytics', icon: Activity });
        items.push({ id: 'global-audit', label: 'Logs', icon: Server });
      }

    } else {
      // CLUB CONTEXT MENU
      items.push({ id: 'club-dashboard', label: 'Club HQ', icon: LayoutDashboard });
      items.push({ id: 'chat', label: 'Team Chat', icon: MessageSquare });

      const isPresident = clubRole === ClubRole.PRESIDENT;
      const isVicePresident = clubRole === ClubRole.VICE_PRESIDENT;
      const isTreasurer = clubRole === ClubRole.TREASURER;
      const isSecretary = clubRole === ClubRole.SECRETARY;
      const isHead = [ClubRole.TECH_HEAD, ClubRole.CONTENT_HEAD, ClubRole.MANAGEMENT_HEAD, ClubRole.SOCIAL_MEDIA_HEAD].includes(clubRole as ClubRole);
      const isAuthority = userRole === Role.SUPER_ADMIN || userRole === Role.FACULTY;

      if (isPresident || isVicePresident || isSecretary || isHead || isAuthority || isTreasurer) {
        items.push({ section: 'Ops' });
        if (isPresident || isVicePresident || isSecretary || isAuthority) {
            items.push({ id: 'members', label: 'Roster', icon: Users });
            items.push({ id: 'recruitment', label: 'Hiring', icon: UserPlus });
        }
        if (isPresident || isVicePresident || isSecretary || isHead || isAuthority) {
            items.push({ id: 'club-events', label: 'Events', icon: Zap });
            items.push({ id: 'attendance', label: 'Attendance', icon: Fingerprint });
        }
      }

      if (isTreasurer || isPresident || isAuthority) {
        items.push({ section: 'Finance' });
        items.push({ id: 'club-finance', label: 'Treasury', icon: Wallet });
      }

      if (isPresident || isAuthority) {
        items.push({ section: 'Admin' });
        items.push({ id: 'certificates', label: 'Certs', icon: Award });
        items.push({ id: 'site-editor', label: 'Website', icon: Layout });
        items.push({ id: 'club-settings', label: 'Settings', icon: Settings });
      }
    }
    return items;
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed md:relative z-50 h-full flex flex-col transition-all duration-300 ease-in-out
        bg-white border-r border-slate-100 shadow-2xl md:shadow-none
        ${isExpanded ? 'w-64' : 'w-20'}
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        md:bg-transparent md:border-none
      `}>
        {/* Desktop Card Wrapper */}
        <div className={`
          h-full flex flex-col bg-white md:rounded-[2.5rem] md:my-4 md:ml-4 shadow-soft border border-white/50 overflow-hidden
        `}>
          
          {/* Toggle Button (Desktop Only) */}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="hidden md:flex absolute -right-3 top-10 w-6 h-6 bg-white border border-slate-100 rounded-full items-center justify-center shadow-md text-slate-400 hover:text-blue-600 z-50 hover:scale-110 transition-transform"
          >
            {isExpanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>

          {/* Brand Header */}
          <div className={`p-6 flex items-center gap-3 ${!isExpanded && 'justify-center p-4'}`}>
            <div 
                className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg cursor-pointer hover:scale-105 transition-transform" 
                onClick={() => { onContextChange('Global'); if(window.innerWidth < 768) onClose(); }}
            >
              <Zap size={20} fill="currentColor" />
            </div>
            {isExpanded && (
              <div className="animate-in fade-in duration-300">
                <h1 className="font-bold text-lg tracking-tight text-slate-900">CLIX</h1>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">MITS Gwalior</p>
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar pb-20 md:pb-4">
            {menuItems.map((item, index) => {
              if (item.section) {
                return isExpanded ? (
                  <div key={`sec-${index}`} className="px-4 pt-4 pb-2 animate-in fade-in duration-300">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">{item.section}</p>
                  </div>
                ) : <div key={`sec-${index}`} className="h-4" />;
              }

              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id!); if(window.innerWidth < 768) onClose(); }}
                  className={`w-full flex items-center gap-3 p-3 rounded-[1.2rem] transition-all duration-300 group relative ${
                    isActive
                      ? 'bg-black text-white shadow-lg' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  } ${!isExpanded && 'justify-center'}`}
                  title={!isExpanded ? item.label : ''}
                >
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'fill-white/10' : ''} />
                  {isExpanded && <span className="font-bold text-xs">{item.label}</span>}
                  
                  {isActive && !isExpanded && (
                    <div className="absolute right-2 top-2 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* User Footer */}
          <div className="p-3 mt-auto mb-safe">
            <div 
                onClick={() => { if(activeContext !== 'Global') onContextChange('Global'); }}
                className={`rounded-[1.5rem] p-3 bg-slate-50 border border-slate-100 flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-colors ${!isExpanded && 'justify-center p-2'}`}
            >
               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                  {user.name[0]}
               </div>
               {isExpanded && (
                 <div className="flex-1 min-w-0">
                   <p className="text-xs font-bold text-slate-900 truncate">{user.name.split(' ')[0]}</p>
                   <p className="text-[9px] font-medium text-slate-400 truncate uppercase">
                       {activeContext === 'Global' ? 'Global' : 'Club'}
                   </p>
                 </div>
               )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
