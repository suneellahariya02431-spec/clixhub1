
import React, { useState, useRef, useEffect } from 'react';
import { User, Club } from '../types';
import { Bell, Search, Settings, LogOut, User as UserIcon, Moon, Sun, ChevronDown, Sparkles } from 'lucide-react';

interface NavbarProps {
  user: User;
  clubs: Club[];
  activeContext: string;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onToggleMobileMenu: () => void;
  onGoHome?: () => void;
  onOpenProfile?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  user, activeContext, onLogout, isDarkMode, onToggleTheme, onOpenProfile 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className={`h-24 px-6 md:px-10 flex items-center justify-between sticky top-0 z-40 transition-all duration-300 ${isDarkMode ? 'bg-[#0B1437]/90 border-b border-white/5' : 'bg-[#F2F3F5]/90'} backdrop-blur-md`}>
      
      {/* Left: Context Title / Breadcrumbs */}
      <div className="hidden md:flex flex-col">
         <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
            <span>MITS Gwalior</span>
            <span>/</span>
            <span className={isDarkMode ? 'text-white' : 'text-slate-900'}>{activeContext === 'Global' ? 'Campus Overview' : activeContext}</span>
         </div>
         <h1 className={`text-xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1B2559]'}`}>
            {activeContext === 'Global' ? `Hello, ${user.name.split(' ')[0]}` : 'Club Operations'}
         </h1>
      </div>

      {/* Mobile Menu Trigger Placeholder */}
      <div className="md:hidden font-black text-xl text-slate-900 dark:text-white tracking-tight">CLIX</div>

      {/* Right: Actions */}
      <div className="flex items-center gap-6">
        
        {/* Search Bar */}
        <div className={`hidden md:flex items-center gap-3 px-5 py-3 rounded-full w-64 border transition-all ${isDarkMode ? 'bg-[#111C44] border-white/10 text-white' : 'bg-white shadow-soft border-transparent text-slate-700'}`}>
            <Search size={18} className={isDarkMode ? 'text-slate-400' : 'text-slate-400'} />
            <input 
                type="text" 
                placeholder="Search anything..." 
                className={`bg-transparent border-none outline-none text-sm font-bold w-full placeholder:font-medium ${isDarkMode ? 'placeholder:text-slate-500' : 'placeholder:text-slate-400'}`}
            />
        </div>

        {/* Notification Bell */}
        <button className={`w-12 h-12 rounded-full flex items-center justify-center transition-all relative ${isDarkMode ? 'bg-[#111C44] text-white hover:bg-white/10' : 'bg-white shadow-soft text-slate-600 hover:text-blue-600 hover:scale-105'}`}>
            <Bell size={20} />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#111C44]"></span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={menuRef}>
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`flex items-center gap-3 pl-2 pr-4 py-2 rounded-full border transition-all ${
                    isDarkMode 
                    ? 'bg-[#111C44] border-white/10 text-white hover:border-white/20' 
                    : 'bg-white shadow-soft border-transparent text-slate-700 hover:shadow-md'
                }`}
            >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}`}>
                    {user.photoUrl ? <img src={user.photoUrl} className="w-full h-full rounded-full object-cover" /> : user.name[0]}
                </div>
                <span className="text-sm font-bold hidden md:block">{user.name.split(' ')[0]}</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''} opacity-50`} />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
                <div className={`absolute right-0 mt-4 w-72 rounded-[2rem] shadow-2xl border p-4 space-y-2 animate-in fade-in slide-in-from-top-4 duration-200 origin-top-right ${
                    isDarkMode ? 'bg-[#111C44] border-white/10' : 'bg-white border-slate-100'
                }`}>
                    {/* User Info Header */}
                    <div className={`p-5 rounded-[1.5rem] mb-2 flex items-center gap-4 ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}`}>
                            {user.name[0]}
                        </div>
                        <div>
                            <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user.name}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{user.globalRole}</p>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <button 
                        onClick={() => { onOpenProfile?.(); setIsMenuOpen(false); }}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                            isDarkMode ? 'text-slate-300 hover:bg-white/5 hover:text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                    >
                        <UserIcon size={18} /> Profile Settings
                    </button>
                    
                    <button 
                        onClick={() => { onToggleTheme(); }}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                            isDarkMode ? 'text-slate-300 hover:bg-white/5 hover:text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                    >
                        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />} 
                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>

                    <div className={`h-px mx-4 my-2 ${isDarkMode ? 'bg-white/10' : 'bg-slate-100'}`}></div>

                    <button 
                        onClick={onLogout}
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold text-rose-500 hover:bg-rose-500/10 transition-all"
                    >
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>
            )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
