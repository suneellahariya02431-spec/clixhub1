
import React, { useState, useEffect } from 'react';
import { Event, Club, Venue } from '../../types';
import { db } from '../../db';
import { 
  Zap, 
  ArrowRight, 
  Activity, 
  ShieldCheck, 
  Users, 
  Sparkles, 
  Globe,
  Calendar,
  MapPin,
  Award,
  BarChart3,
  CheckCircle2,
  Search,
  Layout,
  Terminal
} from 'lucide-react';
import Footer from '../Footer';

interface Props {
  events: Event[];
  clubs: Club[];
  onLogin: () => void;
  onRegister: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenDeveloper?: () => void;
  onOpenProfile?: () => void;
  onNavigate?: (page: string) => void;
}

const LandingPage: React.FC<Props> = ({ 
  events, 
  clubs, 
  onLogin, 
  onRegister, 
  isDarkMode, 
  onToggleTheme, 
  onOpenDeveloper, 
  onOpenProfile, 
  onNavigate 
}) => {
  const [mounted, setMounted] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      title: "Event Management",
      desc: "Seamlessly organize, promote, and manage campus events with real-time attendance tracking.",
      icon: Calendar,
      color: "bg-blue-500"
    },
    {
      title: "Club Governance",
      desc: "Centralized tools for club leadership, member rosters, and financial oversight.",
      icon: Users,
      color: "bg-purple-500"
    },
    {
      title: "Smart Certifications",
      desc: "Automated generation and verification of participation certificates.",
      icon: Award,
      color: "bg-emerald-500"
    },
    {
      title: "Real-time Analytics",
      desc: "Data-driven insights into student engagement and campus activities.",
      icon: BarChart3,
      color: "bg-rose-500"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-black selection:text-white overflow-x-hidden">
      
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${mounted ? 'bg-white/80 backdrop-blur-xl border-b border-slate-100' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center shadow-lg transform transition-transform hover:rotate-12">
              <Zap size={20} fill="currentColor" />
            </div>
            <span className="text-xl font-bold tracking-tight">CLIX</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <nav className="flex gap-6 text-sm font-medium text-slate-600">
              <button onClick={() => onNavigate?.('events')} className="hover:text-black transition-colors">Events</button>
              <button onClick={() => onNavigate?.('clubs')} className="hover:text-black transition-colors">Clubs</button>
              <button onClick={() => onNavigate?.('features')} className="hover:text-black transition-colors">Features</button>
            </nav>
            <div className="h-6 w-px bg-slate-200"></div>
            <button 
                onClick={onLogin}
                className="text-sm font-semibold text-slate-600 hover:text-black transition-colors"
            >
                Log In
            </button>
            <button 
                onClick={onRegister}
                className="px-5 py-2.5 bg-black text-white rounded-full text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
                Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div className={`space-y-8 transition-all duration-1000 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 text-sm font-medium text-slate-600">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              v2.0 is now live for MITS Gwalior
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              The Operating System for <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Campus Life</span>
            </h1>
            
            <p className="text-xl text-slate-500 max-w-lg leading-relaxed">
              Manage clubs, organize events, and track student leadership—all in one unified platform designed for the modern campus.
            </p>

            <div className="flex flex-wrap gap-4">
              <button 
                  onClick={onRegister}
                  className="px-8 py-4 bg-black text-white rounded-2xl font-bold text-base shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-2"
              >
                  Start Your Journey <ArrowRight size={18} />
              </button>
              <button 
                  onClick={() => onNavigate?.('events')}
                  className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold text-base hover:bg-slate-50 transition-all flex items-center gap-2"
              >
                  Browse Events
              </button>
            </div>

            <div className="flex items-center gap-4 pt-4 text-sm font-medium text-slate-500">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                    {String.fromCharCode(64+i)}
                  </div>
                ))}
              </div>
              <p>Trusted by 50+ Clubs & Societies</p>
            </div>
          </div>

          {/* Right Visual (Floating UI Cards) */}
          <div className={`relative hidden lg:block h-[600px] transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            {/* Abstract Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
            
            {/* Card 1: Main Dashboard Mockup */}
            <div className="absolute top-10 left-10 right-10 bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 z-20 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"><Activity size={20} /></div>
                  <div>
                    <h4 className="font-bold text-slate-900">Campus Overview</h4>
                    <p className="text-xs text-slate-500">Real-time metrics</p>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">Live</div>
              </div>
              <div className="space-y-4">
                <div className="h-24 rounded-xl bg-slate-50 w-full flex items-end p-4 gap-2">
                  {[40, 70, 50, 90, 60, 80, 45].map((h, i) => (
                    <div key={i} className="flex-1 bg-blue-500 rounded-t-sm opacity-20 hover:opacity-100 transition-opacity" style={{ height: `${h}%` }}></div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-20 rounded-xl bg-slate-50"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2: Notification Toast */}
            <div className="absolute top-[60%] -right-4 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-30 flex items-center gap-4 animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm">Budget Approved</h4>
                <p className="text-xs text-slate-500">Finance Dept • Just now</p>
              </div>
            </div>

            {/* Card 3: User Profile */}
            <div className="absolute bottom-20 -left-4 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-30 flex items-center gap-4 transform rotate-[3deg]">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                NL
              </div>
              <div>
                <h4 className="font-bold text-sm">Naman Lahariya</h4>
                <p className="text-xs text-slate-500">Lead Developer</p>
              </div>
              <div className="ml-2 px-2 py-1 bg-slate-100 rounded text-xs font-bold">Admin</div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-24 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Everything you need to run a <span className="text-blue-600">world-class</span> campus.</h2>
            <p className="text-slate-500 text-lg">Powerful tools integrated into one seamless platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Large Feature */}
            <div className="md:col-span-2 row-span-2 rounded-[2.5rem] bg-white p-10 shadow-sm border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                    <Calendar size={28} />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Centralized Event Registry</h3>
                  <p className="text-slate-500 text-lg max-w-md">The heartbeat of campus life. Discover, register, and manage events with a unified calendar system that syncs across all devices.</p>
                </div>
                <div className="w-full h-48 bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden relative">
                   {/* Mock Calendar UI */}
                   <div className="absolute inset-0 p-4 grid grid-cols-7 gap-2 opacity-50">
                      {Array.from({length: 28}).map((_, i) => (
                        <div key={i} className={`rounded-lg ${i === 12 ? 'bg-blue-500 shadow-lg shadow-blue-500/20' : 'bg-white border border-slate-100'}`}></div>
                      ))}
                   </div>
                </div>
              </div>
            </div>

            {/* Tall Feature */}
            <div className="row-span-2 rounded-[2.5rem] bg-[#18181B] text-white p-10 shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
              <div className="relative z-10 h-full flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6 backdrop-blur-md">
                  <ShieldCheck size={28} />
                </div>
                <h3 className="text-3xl font-bold mb-4">Enterprise Grade Security</h3>
                <p className="text-slate-400 text-lg mb-8">Role-based access control, encrypted data, and secure authentication.</p>
                
                <div className="mt-auto space-y-3">
                  {['End-to-end Encryption', 'Audit Logs', 'Role Management', 'Data Privacy'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                      <CheckCircle2 size={16} className="text-emerald-400" />
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Small Feature 1 */}
            <div className="rounded-[2.5rem] bg-white p-8 shadow-sm border border-slate-100 flex flex-col justify-between group hover:border-purple-200 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                <Globe size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Club Directory</h3>
                <p className="text-slate-500 text-sm">Explore and join student organizations.</p>
              </div>
            </div>

            {/* Small Feature 2 */}
            <div className="rounded-[2.5rem] bg-white p-8 shadow-sm border border-slate-100 flex flex-col justify-between group hover:border-emerald-200 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <Award size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Certifications</h3>
                <p className="text-slate-500 text-sm">Automated issuance and verification.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="py-20 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: "Active Users", val: "10k+", icon: Users },
              { label: "Events Hosted", val: events.length.toString(), icon: Activity },
              { label: "Clubs Onboarded", val: clubs.length.toString(), icon: Globe },
              { label: "System Uptime", val: "99.9%", icon: Server }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2 text-slate-400">
                  <stat.icon size={20} />
                  <span className="text-sm font-bold uppercase tracking-wider">{stat.label}</span>
                </div>
                <p className="text-4xl md:text-5xl font-black text-slate-900">{stat.val}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto bg-black rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[100px] opacity-30"></div>
          
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">Ready to transform your campus experience?</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">Join thousands of students and faculty members already using CLIX to streamline their academic and extracurricular life.</p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button 
                  onClick={onRegister}
                  className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-transform w-full sm:w-auto"
              >
                  Get Started Now
              </button>
              <button 
                  onClick={onOpenDeveloper}
                  className="px-8 py-4 bg-white/10 text-white border border-white/10 rounded-full font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                  <Terminal size={20} /> Developer Console
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer 
        onOpenDeveloper={onOpenDeveloper || (() => {})} 
        onOpenProfile={onOpenProfile} 
        onNavigate={onNavigate || (() => {})}
        isDarkMode={isDarkMode} 
        variant="default"
      />
    </div>
  );
};

// Helper Icon for Stats
const Server = ({ size, className }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>
);

export default LandingPage;
