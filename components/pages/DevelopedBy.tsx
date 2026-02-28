import React, { useState, useEffect } from 'react';
import { 
  Github, Linkedin, Mail, ArrowLeft, ExternalLink, Star, 
  Code, Database, Layout, Server, Globe, Cpu, Zap, Award, 
  BookOpen, Briefcase, ChevronRight, ChevronLeft, GraduationCap, Folder, Users
} from 'lucide-react';
import { db } from '../../db';
import { TeamMember, Mentor } from '../../types';

interface Props {
  onBack: () => void;
  isDarkMode: boolean;
}

const DevelopedBy: React.FC<Props> = ({ onBack, isDarkMode }) => {
  const [developer, setDeveloper] = useState<TeamMember | null>(null);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [devs, mentorsData] = await Promise.all([
          db.getDevelopers(),
          db.getMentors()
        ]);
        
        // Find the lead developer or the first one
        const lead = devs.find(d => d.isLead) || devs[0];
        setDeveloper(lead || null);
        setMentors(mentorsData);
      } catch (e) {
        console.error("Failed to fetch developer data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-[#0F172A] text-white' : 'bg-[#F8FAFC] text-slate-600'}`}>
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-blue-500 rounded-full animate-bounce"></div>
          <p className="text-sm font-bold opacity-50">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (!developer) {
    return (
       <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-[#0F172A] text-white' : 'bg-[#F8FAFC] text-slate-600'}`}>
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Developer Profile Not Found</h2>
          <button onClick={onBack} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Go Back</button>
        </div>
      </div>
    );
  }

  // Helper to map icon string to component if needed, or just use defaults
  // For now, we'll use hardcoded icons for project types based on tags or random
  const getProjectIcon = (tags: string[]) => {
    if (tags.includes('React')) return Layout;
    if (tags.includes('Node.js')) return Server;
    if (tags.includes('Database') || tags.includes('MongoDB')) return Database;
    return Code;
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-blue-500/30 ${isDarkMode ? 'bg-[#0F172A] text-slate-200' : 'bg-[#F8FAFC] text-slate-600'}`}>
      
      {/* Navbar / Header */}
      <div className={`sticky top-0 z-50 backdrop-blur-md border-b ${isDarkMode ? 'bg-[#0F172A]/80 border-white/5' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={onBack} className={`p-2 rounded-full transition-all ${isDarkMode ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-black'}`}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-bold text-lg">Developer Profile</h1>
          <div className="w-10"></div> {/* Spacer */}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 pb-2">
            Meet the Developer
          </h2>
          <p className="max-w-2xl mx-auto text-sm md:text-base opacity-80 leading-relaxed">
            {developer.bio || "Passionate about crafting intelligent web solutions and leveraging AI technologies to solve real-world challenges with innovation."}
          </p>
        </div>

        {/* Profile Card */}
        <div className={`rounded-3xl p-8 shadow-xl border ${isDarkMode ? 'bg-[#1E293B] border-white/5 shadow-black/20' : 'bg-white border-slate-100 shadow-slate-200/50'}`}>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-white shadow-lg relative z-10">
                {developer.image ? (
                  <img src={developer.image} alt={developer.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                    {developer.name[0]}
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full -z-10 group-hover:bg-blue-500/30 transition-all duration-500"></div>
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h3 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{developer.name}</h3>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-bold flex items-center gap-1">
                    <Code size={12} /> {developer.role}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 text-xs font-bold flex items-center gap-1">
                    <Zap size={12} /> AI Enthusiast
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-3">
                {developer.github && (
                  <a href={developer.github} target="_blank" rel="noreferrer" className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>
                    <Github size={16} /> GitHub
                  </a>
                )}
                {developer.linkedin && (
                  <a href={developer.linkedin} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 bg-[#0077B5]/10 text-[#0077B5] hover:bg-[#0077B5]/20 transition-all">
                    <Linkedin size={16} /> LinkedIn
                  </a>
                )}
                {developer.email && (
                  <a href={`mailto:${developer.email}`} className="px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-all">
                    <Mail size={16} /> Email
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Education */}
          <div className={`rounded-3xl p-8 border h-full ${isDarkMode ? 'bg-[#1E293B] border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
            <div className="flex items-center gap-3 mb-6">
              <GraduationCap className="text-blue-500" size={24} />
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Education</h3>
            </div>
            
            {developer.education && developer.education.length > 0 ? (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                  <img src="https://web.mitsgwalior.in/images/mits-logo.png" alt="MITS" className="w-8 h-8 object-contain" />
                </div>
                <div className="space-y-4 flex-1">
                  <div>
                    <h4 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{developer.education[0].school}</h4>
                    <p className="text-sm opacity-60">Gwalior, Madhya Pradesh</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
                      <p className="text-[10px] uppercase tracking-wider opacity-60 font-bold">Degree</p>
                      <p className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{developer.education[0].degree}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
                      <p className="text-[10px] uppercase tracking-wider opacity-60 font-bold">Duration</p>
                      <p className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{developer.education[0].year}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <p className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold">CGPA</p>
                      <p className="font-bold text-lg text-emerald-700">9.03</p>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                      <p className="text-[10px] uppercase tracking-wider text-blue-600 font-bold">Enrollment</p>
                      <p className="font-bold text-sm text-blue-700 mt-1">0901CS251021</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="opacity-50">No education details available.</p>
            )}
          </div>

          {/* Achievements */}
          <div className={`rounded-3xl p-8 border h-full ${isDarkMode ? 'bg-[#1E293B] border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
            <div className="flex items-center gap-3 mb-6">
              <Award className="text-purple-500" size={24} />
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Key Achievements</h3>
            </div>
            
            <ul className="space-y-4">
              {developer.achievements && developer.achievements.map((achievement, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Star size={16} className="text-yellow-500 shrink-0 mt-1 fill-yellow-500" />
                  <span className="text-sm font-medium opacity-80 leading-relaxed">{achievement.title} - {achievement.description}</span>
                </li>
              ))}
              {(!developer.achievements || developer.achievements.length === 0) && (
                <li className="opacity-50">No achievements listed.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Featured Projects */}
        <div className="space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 mb-4">
              <Code size={16} /> Featured Projects
            </div>
            <p className="text-sm opacity-60">Explore some of my featured projects showcasing various technologies and innovative solutions.</p>
          </div>

          {developer.projects && developer.projects.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Large Cards (Top 2) */}
                {developer.projects.slice(0, 2).map((project, i) => {
                  const Icon = getProjectIcon(project.tags);
                  return (
                    <div key={i} className={`rounded-3xl p-8 border transition-all hover:-translate-y-1 hover:shadow-xl ${isDarkMode ? 'bg-[#1E293B] border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${isDarkMode ? 'bg-white/10' : 'bg-slate-50'}`}>
                        <Icon size={24} className={isDarkMode ? 'text-white' : 'text-slate-900'} />
                      </div>
                      <h3 className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{project.title}</h3>
                      <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-4">{project.subtitle}</p>
                      <p className="text-sm opacity-70 leading-relaxed mb-6 min-h-[60px]">{project.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tags.map(tag => (
                          <span key={tag} className={`px-3 py-1 rounded-lg text-xs font-bold ${isDarkMode ? 'bg-white/5 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${project.status === 'Live' ? 'bg-blue-500/10 text-blue-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${project.status === 'Live' ? 'bg-blue-500' : 'bg-emerald-500'} animate-pulse`}></span>
                          {project.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Small Cards (Remaining) */}
                {developer.projects.slice(2).map((project, i) => {
                  const Icon = getProjectIcon(project.tags);
                  return (
                    <div key={i} className={`rounded-3xl p-6 border transition-all hover:-translate-y-1 hover:shadow-lg ${isDarkMode ? 'bg-[#1E293B] border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${isDarkMode ? 'bg-white/10' : 'bg-slate-50'}`}>
                        <Icon size={20} className={isDarkMode ? 'text-white' : 'text-slate-900'} />
                      </div>
                      <h3 className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{project.title}</h3>
                      <p className="text-[10px] font-bold text-purple-500 uppercase tracking-wider mb-3">{project.subtitle}</p>
                      <p className="text-xs opacity-70 leading-relaxed mb-4 line-clamp-3">{project.description}</p>
                      
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.tags.map(tag => (
                          <span key={tag} className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${isDarkMode ? 'bg-white/5 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                         <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${project.status === 'Live' ? 'bg-rose-500/10 text-rose-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                          <ExternalLink size={10} /> {project.status}
                        </span>
                        <button className={`px-3 py-1 rounded-lg text-[10px] font-bold border flex items-center gap-1 ${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-50'}`}>
                          <Code size={10} /> Code
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
             <p className="opacity-50 text-center">No projects listed yet.</p>
          )}
        </div>

        {/* Portfolio CTA */}
        <div className={`rounded-3xl p-12 text-center border relative overflow-hidden ${isDarkMode ? 'bg-[#1E293B] border-white/5' : 'bg-slate-100 border-slate-200'}`}>
           <div className="relative z-10 flex flex-col items-center gap-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-xl ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
                <Globe />
              </div>
              <div>
                <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Explore My Portfolio</h3>
                <p className="max-w-md mx-auto text-sm opacity-70">
                  Beyond the highlighted projects, my portfolio showcases case studies, technical insights, core skills, tech stacks, and my professional journey.
                </p>
              </div>
              <button className="px-6 py-3 bg-[#18181B] text-white rounded-xl font-bold text-sm shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                <Globe size={16} /> Visit Portfolio <ExternalLink size={14} />
              </button>
           </div>
        </div>

        {/* Guidance Section */}
        <div className="text-center space-y-8 pt-8">
          <h3 className="text-lg font-bold text-blue-500 flex items-center justify-center gap-2">
            <Users size={18} /> Under the Guidance of
          </h3>
          
          <div className="flex flex-wrap justify-center gap-8">
            {mentors.map((mentor, i) => (
              <div key={i} className={`group p-6 rounded-3xl border w-64 transition-all hover:-translate-y-1 hover:shadow-xl ${isDarkMode ? 'bg-[#1E293B] border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
                  {mentor.image ? (
                    <img src={mentor.image} alt={mentor.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-500">
                      <Users size={32} />
                    </div>
                  )}
                </div>
                <h4 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{mentor.name}</h4>
                <p className="text-xs font-medium text-blue-500 mt-1 leading-tight">{mentor.designation}</p>
              </div>
            ))}
            {mentors.length === 0 && (
              <p className="opacity-50">No mentors listed.</p>
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default DevelopedBy;
