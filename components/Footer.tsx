
import React, { useState, useEffect } from 'react';
import { 
  Zap, Linkedin, Code, Terminal, Instagram, Youtube, Twitter, Facebook, 
  GraduationCap, MapPin, Mail, Phone, Layout, Database, Calendar, FileText, 
  ExternalLink, Globe, Server, ClipboardList 
} from 'lucide-react';
import { db } from '../db';

interface Props {
  onOpenDeveloper: () => void;
  onOpenProfile?: () => void;
  onNavigate: (page: string) => void;
  isDarkMode: boolean;
  variant?: 'default' | 'minimal';
}

const Footer: React.FC<Props> = ({ onOpenDeveloper, onOpenProfile, onNavigate, isDarkMode, variant = 'default' }) => {
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      const c = await db.getFooterConfig();
      setConfig(c);
    };
    fetchConfig();
  }, []);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Instagram': return Instagram;
      case 'Youtube': return Youtube;
      case 'Linkedin': return Linkedin;
      case 'Twitter': return Twitter;
      case 'Facebook': return Facebook;
      case 'GraduationCap': return GraduationCap;
      case 'Layout': return Layout;
      case 'Database': return Database;
      case 'Calendar': return Calendar;
      case 'FileText': return FileText;
      default: return Globe;
    }
  };
  
  if (!config) return null;

  return (
    <footer className={`border-t transition-colors duration-500 ${isDarkMode ? 'bg-[#050505] border-white/5 text-slate-400' : 'bg-white border-slate-100 text-slate-500'}`}>
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-16">
        
        {variant === 'default' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16 border-b border-white/5 pb-16">
            
            {/* Column 1: Brand & Social (4 cols) */}
            <div className="lg:col-span-4 space-y-8">
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white shadow-xl shadow-black/20">
                      <Zap size={20} className="fill-white" />
                  </div>
                  <div>
                      <h3 className={`text-xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>CLIX</h3>
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">MITS Gwalior</p>
                  </div>
              </div>
              <p className="text-sm leading-relaxed max-w-sm opacity-80 font-medium">
                  The centralized operating system for student leadership, event management, and recruitment. Empowering the next generation of innovators.
              </p>
              
              <div className="flex flex-wrap gap-2">
                  {config.socialLinks.map((social: any, i: number) => {
                      const Icon = getIcon(social.icon);
                      return (
                        <a 
                            key={i} 
                            href={social.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`p-2.5 rounded-lg transition-all border ${isDarkMode ? 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-400 hover:text-white' : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-500 hover:text-black'}`}
                            title={social.platform}
                        >
                            <Icon size={18} />
                        </a>
                      );
                  })}
              </div>
            </div>

            {/* Column 2: Academics (2 cols) */}
            <div className="lg:col-span-2">
              <h4 className={`text-xs font-black uppercase tracking-widest mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Academics</h4>
              <ul className="space-y-3">
                {config.institutionalLinks.map((link: any, i: number) => {
                  const Icon = getIcon(link.icon);
                  return (
                    <li key={i}>
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="group flex items-center gap-2 text-sm font-medium hover:text-[#0099FF] transition-colors"
                      >
                        <Icon size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>



            {/* Column 4: Legal (2 cols) */}
            <div className="lg:col-span-2">
              <h4 className={`text-xs font-black uppercase tracking-widest mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Legal</h4>
              <ul className="space-y-3 text-sm font-medium">
                  <li><button onClick={() => onNavigate('privacy')} className="hover:text-[#0099FF] transition-colors text-left">Privacy Protocol</button></li>
                  <li><button onClick={() => onNavigate('tos')} className="hover:text-[#0099FF] transition-colors text-left">Terms of Service</button></li>
                  <li><button onClick={() => onNavigate('report')} className="hover:text-[#0099FF] transition-colors text-left">Report Issue</button></li>
                  <li><button onClick={onOpenDeveloper} className="hover:text-[#0099FF] transition-colors flex items-center gap-2 text-left"><Terminal size={14} /> Developer Console</button></li>
              </ul>
            </div>

            {/* Column 5: Contact (2 cols) */}
            <div className="lg:col-span-2">
              <h4 className={`text-xs font-black uppercase tracking-widest mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Contact</h4>
              <ul className="space-y-4 text-sm font-medium">
                  <li className="flex items-start gap-3">
                      <MapPin size={16} className="mt-1 shrink-0 text-[#0099FF]" />
                      <span className="opacity-80 leading-relaxed text-xs">
                          {config.contactInfo.address}
                      </span>
                  </li>
                  <li className="flex items-center gap-3">
                      <Mail size={16} className="shrink-0 text-[#0099FF]" />
                      <a href={`mailto:${config.contactInfo.email}`} className="opacity-80 hover:text-[#0099FF] transition-colors text-xs truncate">
                          {config.contactInfo.email}
                      </a>
                  </li>
                  {config.contactInfo.phones.map((phone: string, i: number) => (
                    <li key={i} className="flex items-center gap-3">
                        <Phone size={16} className="shrink-0 text-[#0099FF]" />
                        <span className="opacity-80 text-xs">
                            {phone}
                        </span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-2">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                <p className="text-xs font-bold opacity-40 text-center md:text-left">© 2026 Madhav Institute of Technology & Science.</p>
                <div className="flex items-center gap-4">
                    <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">System Operational</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button 
                    onClick={onOpenDeveloper}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                        isDarkMode 
                        ? 'border-white/5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white' 
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
                    }`}
                >
                    <Terminal size={12} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Console</span>
                </button>

                <div className="h-4 w-px bg-white/10 hidden md:block"></div>

                <div className="flex items-center gap-2 text-xs font-bold">
                    <span className="opacity-40">Architected by</span>
                    <button onClick={onOpenProfile} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}`}>
                        <Code size={12} /> Naman Lahariya
                    </button>
                </div>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
