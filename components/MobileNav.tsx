
import React from 'react';
import { LayoutDashboard, Calendar, Globe, Menu, Layers, User } from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onToggleMenu: () => void;
  isDarkMode: boolean;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab, onToggleMenu, isDarkMode }) => {
  return (
    <div className="md:hidden fixed bottom-6 left-4 right-4 z-50 flex justify-center">
      <div className={`flex items-center justify-between px-6 py-4 rounded-[2rem] shadow-2xl backdrop-blur-xl border w-full max-w-sm transition-all duration-300 ${
        isDarkMode 
          ? 'bg-[#0B1437]/90 border-white/10 shadow-black/50' 
          : 'bg-white/90 border-white/40 shadow-slate-200/50'
      }`}>
        <NavButton 
          icon={LayoutDashboard} 
          isActive={activeTab === 'dashboard' || activeTab === 'club-dashboard'} 
          onClick={() => setActiveTab('dashboard')} 
          isDarkMode={isDarkMode}
        />
        <NavButton 
          icon={Calendar} 
          isActive={activeTab === 'events' || activeTab === 'club-events'} 
          onClick={() => setActiveTab('events')} 
          isDarkMode={isDarkMode}
        />
        
        {/* Center Floating Action - Club Hub */}
        <div className="relative -top-8">
            <button 
              onClick={() => setActiveTab('clubs')}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/30 transition-transform active:scale-90 ${
                  activeTab === 'clubs' 
                  ? 'bg-white text-blue-600 border-4 border-blue-600' 
                  : 'bg-blue-600 text-white border-4 border-[#F2F3F5] dark:border-[#0B1437]'
              }`}
            >
              <Globe size={24} />
            </button>
        </div>

        <NavButton 
          icon={Layers} 
          isActive={['recruitment', 'certificates', 'tickets', 'payments'].includes(activeTab)} 
          onClick={() => setActiveTab('recruitment')} 
          isDarkMode={isDarkMode}
        />
        
        <button 
          onClick={onToggleMenu}
          className={`flex flex-col items-center justify-center w-10 h-10 rounded-2xl transition-all active:scale-90 ${
              isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Menu size={24} />
        </button>
      </div>
    </div>
  );
};

const NavButton = ({ icon: Icon, isActive, onClick, isDarkMode }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-10 h-10 rounded-2xl transition-all active:scale-90 relative ${
      isActive 
        ? 'text-blue-600' 
        : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'
    }`}
  >
    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
    {isActive && (
      <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-blue-600" />
    )}
  </button>
);

export default MobileNav;
