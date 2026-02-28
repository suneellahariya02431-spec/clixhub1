
import React, { useState } from 'react';
import { User, Event, Club, AuditLog, Registration, Applicant } from '../../types';
import { 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  MoreHorizontal, 
  Plus, 
  Upload, 
  Search, 
  Filter, 
  PieChart as PieChartIcon,
  TrendingUp,
  Users
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  user: User;
  events: Event[];
  clubs: Club[];
  certCount: number;
  onRegister: (eventId: string) => void;
  isDarkMode: boolean;
  logs: AuditLog[];
  registrations: Registration[];
  applicants: Applicant[];
}

const GlobalStudentDashboard: React.FC<Props> = ({ 
  user, events, clubs, registrations, onRegister, isDarkMode 
}) => {
  // Sort upcoming events
  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Dummy Chart Data
  const activityData = [
    { name: 'Mon', value: 20 },
    { name: 'Tue', value: 45 },
    { name: 'Wed', value: 30 },
    { name: 'Thu', value: 60 },
    { name: 'Fri', value: 55 },
    { name: 'Sat', value: 80 },
    { name: 'Sun', value: 65 },
  ];

  return (
    <div className={`p-4 md:p-8 max-w-[1800px] mx-auto min-h-screen space-y-8 md:space-y-10 font-sans ${isDarkMode ? 'text-white' : 'text-[#1F2937]'}`}>
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight">Student Journey</h1>
          <div className="flex items-center gap-2 mt-2 text-xs md:text-sm font-medium text-slate-400">
             <span>Academic Year 2025-26</span>
             <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
             <span>Semester 6</span>
          </div>
        </div>

        {/* Avatar Pile & Actions */}
        <div className="flex flex-wrap items-center gap-4 md:gap-6">
           <div className="flex -space-x-3">
              {[1,2,3,4,5].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white" alt="Peer" />
              ))}
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] md:text-xs font-bold text-slate-500">
                  +12
              </div>
           </div>
           
           <div className="flex gap-2 md:gap-3">
              <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-all text-slate-600">
                  <Plus size={20} />
              </button>
              <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-all text-slate-600">
                  <Calendar size={20} />
              </button>
           </div>
        </div>
      </div>

      {/* --- JOURNEY FLOW (Horizontal Scroll) --- */}
      <section className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-soft relative overflow-hidden">
         <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-bold">Upcoming Milestones</h2>
            <div className="flex gap-2">
               <button className="px-3 py-1.5 md:px-4 md:py-2 bg-black text-white text-[10px] md:text-xs font-bold rounded-full">Timeline</button>
            </div>
         </div>

         {/* Flow Container */}
         <div className="flex gap-4 md:gap-8 overflow-x-auto pb-4 md:pb-8 custom-scrollbar snap-x">
            {upcomingEvents.slice(0, 4).map((event, index) => {
               const club = clubs.find(c => c.id === event.clubId);
               const isRegistered = registrations.some(r => r.eventId === event.id && r.studentId === user.id);
               
               return (
                  <div key={event.id} className="relative flex-shrink-0 group snap-center">
                     {/* Connector Line (Desktop Only) */}
                     {index < 3 && (
                        <div className="absolute top-1/2 -right-10 w-12 h-0.5 bg-slate-100 hidden md:block">
                           <div className="absolute right-0 -top-1 w-2 h-2 bg-slate-200 rounded-full"></div>
                        </div>
                     )}

                     <div className="w-[280px] md:w-[320px] bg-[#F8F9FA] hover:bg-white p-5 md:p-6 rounded-[2rem] border border-transparent hover:border-slate-100 hover:shadow-xl transition-all duration-300">
                        <div className="flex justify-between items-start mb-6">
                           <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-lg md:text-xl" style={{ color: club?.themeColor }}>
                              {club?.name[0]}
                           </div>
                           {isRegistered ? (
                              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full">
                                 <CheckCircle2 size={16} />
                              </div>
                           ) : (
                              <button onClick={() => onRegister(event.id)} className="p-2 bg-slate-200 hover:bg-black hover:text-white rounded-full transition-colors text-slate-500">
                                 <Plus size={16} />
                              </button>
                           )}
                        </div>

                        <h3 className="text-base md:text-lg font-bold mb-2 line-clamp-1">{event.title}</h3>
                        <div className="flex items-center gap-4 text-[10px] md:text-xs font-medium text-slate-500 mb-6">
                           <span className="flex items-center gap-1"><Calendar size={14}/> {event.date}</span>
                           <span className="flex items-center gap-1"><Clock size={14}/> 10:00 AM</span>
                        </div>

                        <div className="flex items-center gap-3">
                           <div className="flex -space-x-2">
                              <img src="https://i.pravatar.cc/100?img=12" className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-white" />
                              <img src="https://i.pravatar.cc/100?img=15" className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-white" />
                           </div>
                           <p className="text-[10px] md:text-xs font-bold text-slate-400">+42 attending</p>
                        </div>
                     </div>
                  </div>
               );
            })}
            
            {/* Add New Placeholder */}
            <div className="flex-shrink-0 w-[80px] md:w-[100px] flex items-center justify-center">
               <button className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-dashed border-slate-300 text-slate-400 hover:border-blue-500 hover:text-blue-500 flex items-center justify-center transition-all">
                  <Plus size={24} />
               </button>
            </div>
         </div>
      </section>

      {/* --- BOTTOM SECTION (Split View) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
         
         {/* Left: Suggested / List */}
         <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-soft flex flex-col">
            <div className="flex justify-between items-center mb-6 md:mb-8">
               <h2 className="text-lg md:text-xl font-bold">Suggested Knowledge</h2>
               <div className="flex gap-2">
                  <button className="p-2 hover:bg-slate-50 rounded-full text-slate-400"><Plus size={20}/></button>
               </div>
            </div>

            <div className="flex-1 space-y-2">
               <div className="grid grid-cols-12 text-[10px] font-bold text-slate-400 px-4 py-2 uppercase tracking-wider">
                  <div className="col-span-6 md:col-span-5">Subject</div>
                  <div className="hidden md:block col-span-2">Status</div>
                  <div className="col-span-4 md:col-span-3">Date</div>
                  <div className="col-span-2 hidden md:block">Assigned</div>
               </div>
               
               {events.slice(0, 5).map((e, i) => (
                  <div key={e.id} className="grid grid-cols-12 items-center p-3 md:p-4 rounded-2xl hover:bg-slate-50 transition-colors group cursor-pointer">
                     <div className="col-span-6 md:col-span-5 flex items-center gap-3">
                        <button className="text-slate-300 group-hover:text-blue-500 transition-colors shrink-0"><CheckCircle2 size={18}/></button>
                        <span className="font-bold text-xs md:text-sm text-slate-700 truncate">{e.title}</span>
                     </div>
                     <div className="hidden md:block col-span-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                           i % 3 === 0 ? 'bg-blue-100 text-blue-600' : (i % 2 === 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600')
                        }`}>
                           {i % 3 === 0 ? 'Active' : (i % 2 === 0 ? 'Executed' : 'Planned')}
                        </span>
                     </div>
                     <div className="col-span-4 md:col-span-3 text-[10px] md:text-xs font-medium text-slate-500 font-mono">
                        {e.date}
                     </div>
                     <div className="hidden md:flex col-span-2 items-center gap-2 text-xs font-bold text-slate-600">
                        <img src={`https://i.pravatar.cc/100?img=${i+20}`} className="w-6 h-6 rounded-full" />
                        {clubs.find(c => c.id === e.clubId)?.name.split(' ')[0]}
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Right: Stats / Charts */}
         <div className="lg:col-span-5 space-y-6 md:space-y-8">
            {/* Chart Card */}
            <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-soft">
               <div className="flex justify-between items-center mb-6 md:mb-8">
                  <h2 className="text-lg md:text-xl font-bold">Participation Trend</h2>
               </div>
               
               <div className="h-40 md:h-48 w-full relative">
                  <div className="absolute top-0 left-0 text-2xl md:text-3xl font-bold">5 <span className="text-xs md:text-sm font-medium text-slate-400 ml-1">Events this month</span></div>
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={activityData}>
                        <defs>
                           <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                        <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
               
               <div className="flex justify-between mt-6">
                  <div className="p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-blue-500 w-[48%] relative overflow-hidden text-white group cursor-pointer hover:bg-blue-600 transition-colors">
                     <div className="absolute top-0 right-0 p-4 opacity-20"><TrendingUp size={48} className="md:w-16 md:h-16"/></div>
                     <p className="text-xs md:text-sm font-medium opacity-80">Executed</p>
                     <p className="text-xl md:text-2xl font-bold mt-1">12</p>
                  </div>
                  <div className="p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-rose-500 w-[48%] relative overflow-hidden text-white group cursor-pointer hover:bg-rose-600 transition-colors">
                     <div className="absolute top-0 right-0 p-4 opacity-20"><Users size={48} className="md:w-16 md:h-16"/></div>
                     <p className="text-xs md:text-sm font-medium opacity-80">Active</p>
                     <p className="text-xl md:text-2xl font-bold mt-1">4</p>
                  </div>
               </div>
            </div>
         </div>

      </div>
    </div>
  );
};

export default GlobalStudentDashboard;
