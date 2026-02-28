import React, { useState, useMemo } from 'react';
import { Event, Club } from '../../types';
import { 
  Calendar, Search, Filter, MapPin, Clock, Tag, ArrowLeft, 
  ChevronRight, Users, Zap, ExternalLink, Share2, Bookmark, ArrowRight
} from 'lucide-react';

interface Props {
  events: Event[];
  clubs: Club[];
  onBack: () => void;
  isDarkMode: boolean;
}

const EventRegistry: React.FC<Props> = ({ events, clubs, onBack, isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter Logic
  const filteredEvents = useMemo(() => {
    const now = new Date();
    return events.filter(event => {
      const eventDate = new Date(event.date);
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            event.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTab = activeTab === 'all' 
        ? true 
        : activeTab === 'upcoming' 
          ? eventDate >= now 
          : eventDate < now;

      const matchesCategory = selectedCategory 
        ? clubs.find(c => c.id === event.clubId)?.category === selectedCategory 
        : true;

      return matchesSearch && matchesTab && matchesCategory;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events, searchTerm, activeTab, selectedCategory, clubs]);

  const categories = Array.from(new Set(clubs.map(c => c.category)));

  return (
    <div className={`min-h-screen font-sans flex flex-col ${isDarkMode ? 'bg-[#09090b] text-white' : 'bg-[#FAFAF9] text-slate-900'}`}>
      
      {/* Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${isDarkMode ? 'bg-[#09090b]/80 border-white/5' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className={`p-2 rounded-full transition-all ${isDarkMode ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-black'}`}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-lg font-bold tracking-tight flex items-center gap-2">
                Event Registry <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${isDarkMode ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{filteredEvents.length}</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`hidden md:flex items-center px-4 py-2 rounded-full border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <Search size={14} className="text-slate-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search events..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none text-sm font-medium w-48 placeholder:text-slate-500"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <div className="flex gap-2 p-1 rounded-xl border bg-slate-100/50 dark:bg-white/5 dark:border-white/5">
            {['upcoming', 'past', 'all'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === tab 
                  ? 'bg-white text-black shadow-sm dark:bg-white dark:text-black' 
                  : 'text-slate-500 hover:text-black dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                selectedCategory === null 
                ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' 
                : 'bg-transparent text-slate-500 border-slate-200 hover:border-slate-300 dark:border-white/10 dark:text-slate-400 dark:hover:border-white/20'
              }`}
            >
              All Categories
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                  selectedCategory === cat 
                  ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' 
                  : 'bg-transparent text-slate-500 border-slate-200 hover:border-slate-300 dark:border-white/10 dark:text-slate-400 dark:hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Event Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map(event => {
              const club = clubs.find(c => c.id === event.clubId);
              const isUpcoming = new Date(event.date) >= new Date();

              return (
                <div 
                  key={event.id} 
                  className={`group flex flex-col rounded-3xl border overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                    isDarkMode 
                    ? 'bg-[#0d0d10] border-white/5 hover:border-white/10' 
                    : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Image / Banner */}
                  <div className="h-48 relative overflow-hidden bg-slate-100 dark:bg-white/5">
                    {event.bannerUrl ? (
                      <img src={event.bannerUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Calendar size={48} className="text-slate-300 dark:text-slate-700" />
                      </div>
                    )}
                    
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md ${
                        isUpcoming 
                        ? 'bg-emerald-500/90 text-white' 
                        : 'bg-slate-500/90 text-white'
                      }`}>
                        {isUpcoming ? 'Open' : 'Closed'}
                      </span>
                    </div>

                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 rounded-full bg-white/90 text-black hover:bg-white shadow-sm"><Share2 size={14} /></button>
                        <button className="p-2 rounded-full bg-white/90 text-black hover:bg-white shadow-sm"><Bookmark size={14} /></button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm`} style={{ backgroundColor: club?.themeColor || '#000' }}>
                        {club?.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold uppercase tracking-wider truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{club?.name}</p>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold leading-tight mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">{event.title}</h3>
                    
                    <p className={`text-sm leading-relaxed line-clamp-3 mb-6 flex-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>
                      {event.description}
                    </p>

                    <div className={`pt-6 mt-auto border-t flex items-center justify-between ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                      <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                        <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(event.date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1.5"><MapPin size={14} /> Campus</span>
                      </div>
                      
                      <button className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-black'}`}>
                        <ArrowRight size={18} className="-rotate-45 group-hover:rotate-0 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center opacity-50">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
              <Search size={32} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-bold">No events found</h3>
            <p className="text-slate-500 mt-2">Try adjusting your filters or search query.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default EventRegistry;
