import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, Users, Activity, Lock, ArrowLeft, Trash2, 
  Code, Server, Wifi, ShieldAlert, LogOut, CheckCircle2,
  Github, Linkedin, Mail, Calendar, Briefcase, Award,
  Eye, EyeOff, User as UserIcon, Edit3, Key, Plus, Save, X, 
  GraduationCap, Upload, Image as ImageIcon, Link as LinkIcon,
  Globe, Layout, Smartphone, Monitor, ExternalLink,
  Search, Bell, Settings, PieChart, BarChart2, Layers, Cpu, Zap, FileText,
  Facebook, Twitter, Youtube, Instagram, Database
} from 'lucide-react';
import { db } from '../../db';
import { User as UserType, TeamMember, Mentor, DevConfig } from '../../types';
import { 
  AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, YAxis, PieChart as RePieChart, Pie, Cell, CartesianGrid 
} from 'recharts';

interface Props {
  onBack: () => void;
  isDarkMode: boolean;
  currentUser?: UserType;
  allUsers?: UserType[]; 
  mode?: 'public' | 'console';
}

const Developers: React.FC<Props> = ({ onBack, isDarkMode, currentUser, allUsers = [], mode = 'console' }) => {
  // --- STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'team' | 'mentors' | 'users' | 'footer' | 'settings'>('dashboard');
  
  // Auth Form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Data
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [config, setConfig] = useState<DevConfig>({
    developedUnderName: 'BDC - Software Development Club',
    developedUnderUrl: '#',
    authorizedEmails: ['namanlahariya@outlook.in', '25mc1na80@mitsgwl.ac.in']
  });
  const [footerConfig, setFooterConfig] = useState<any>(null);
  const [users, setUsers] = useState<UserType[]>([]);
  const [bulkUserJson, setBulkUserJson] = useState('');

  // Modal State
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [mentorModalOpen, setMentorModalOpen] = useState(false);
  const [editingMentor, setEditingMentor] = useState<Mentor | null>(null);
  const [userModalOpen, setUserModalOpen] = useState(false);

  // Refs for File Uploads
  const mentorImageInputRef = useRef<HTMLInputElement>(null);
  const orgLogoInputRef = useRef<HTMLInputElement>(null);

  // Mock Data for Charts
  const chartData1 = [
    { name: 'Mon', value: 400 }, { name: 'Tue', value: 300 }, { name: 'Wed', value: 300 }, 
    { name: 'Thu', value: 200 }, { name: 'Fri', value: 278 }, { name: 'Sat', value: 189 }, { name: 'Sun', value: 239 }
  ];
  const chartData2 = [
    { name: 'Mon', value: 2400 }, { name: 'Tue', value: 1398 }, { name: 'Wed', value: 9800 }, 
    { name: 'Thu', value: 3908 }, { name: 'Fri', value: 4800 }, { name: 'Sat', value: 3800 }, { name: 'Sun', value: 4300 }
  ];

  // --- EFFECTS ---

  useEffect(() => {
    const fetchData = async () => {
        const [loadedTeam, loadedMentors, loadedConfig, loadedFooter, loadedUsers] = await Promise.all([
            db.getDevelopers(),
            db.getMentors(),
            db.getDevConfig(),
            db.getFooterConfig(),
            db.getUsers() // Assuming db.getUsers() returns all users including credentials if available locally
        ]);

        if (loadedTeam.length > 0) setTeam(loadedTeam);
        else {
            // Default seed
            const defaultLead: TeamMember = {
                id: 'lead-1',
                name: 'Naman Lahariya',
                role: 'Full Stack Architect',
                bio: 'Bridging the gap between complex mathematical modeling and modern software solutions.',
                isLead: true,
                email: 'namanalahariya@gmail.com',
                education: [{ id: 'edu-1', school: 'MITS Gwalior', degree: 'B.Tech Mathematics & Computing', year: '2025-2029' }],
                experience: [
                    { id: 'exp-1', company: 'Internshala', role: 'Campus Ambassador', duration: 'Jan 2026 – Present' },
                    { id: 'exp-2', company: 'Corizo Edutech Pvt. Ltd.', role: 'Digital Marketing Internship', duration: 'Sep 2025 – Nov 2025' }
                ],
                achievements: [
                    { id: 'ach-1', title: 'SIH Hackathon Winner', description: 'National level hackathon victory.', date: '2025' },
                    { id: 'ach-2', title: 'Built Institutional OS', description: 'Architected the entire CCMS platform.', date: '2026' }
                ],
                projects: [
                    {
                        id: 'proj-1',
                        title: 'Optimization of Tank Material Usage',
                        subtitle: 'Calculus Project',
                        description: 'Applied differential calculus to optimize tank dimensions, minimizing material usage while maintaining required volume. Developed mathematical models for cost-efficient designs.',
                        tags: ['Calculus', 'Optimization', 'Modeling'],
                        status: 'Concept'
                    },
                    {
                        id: 'proj-2',
                        title: 'CleanUp App',
                        subtitle: 'SIH Team MacHack',
                        description: 'Developed an AI-powered smart waste management application featuring waste classification, real-time tracking, and automated challan generation.',
                        tags: ['AI', 'Mobile App', 'Tracking'],
                        status: 'Live'
                    }
                ]
            };
            setTeam([defaultLead]);
        }

        if (loadedMentors.length > 0) setMentors(loadedMentors);
        else setMentors([
            { id: 'm1', name: 'Dr. Rajni Ranjan Singh Makwana', designation: 'Head, CAI', image: '' },
            { id: 'm2', name: 'Mr. Atul Chauhan', designation: 'Programmer', image: '' }
        ]);

        if (loadedConfig) setConfig(loadedConfig);
        if (loadedFooter) setFooterConfig(loadedFooter);
        if (loadedUsers) setUsers(loadedUsers);
    };
    fetchData();
  }, []);

  // Auto-login for known users
  useEffect(() => {
    if (currentUser && config.authorizedEmails.map(e => e.toLowerCase()).includes(currentUser.email.toLowerCase())) {
        setIsAuthenticated(true);
    }
  }, [currentUser, config.authorizedEmails]);

  // --- ACTIONS ---

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      if ((config.authorizedEmails.includes(username.toLowerCase()) && password === 'mits2026') || (username === 'admin' && password === 'admin')) {
        setIsAuthenticated(true);
      } else {
        alert('Access Denied');
      }
      setIsLoading(false);
    }, 500);
  };

  const handleImageUpload = (file: File, callback: (base64: string) => void) => {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result as string);
      reader.readAsDataURL(file);
  };

  const saveMember = async (member: TeamMember) => {
      const newMember = editingMember ? member : { ...member, id: `dev-${Date.now()}` };
      await db.saveDeveloper(newMember);
      setTeam(prev => prev.some(m => m.id === newMember.id) ? prev.map(m => m.id === newMember.id ? newMember : m) : [...prev, newMember]);
      setMemberModalOpen(false);
      setEditingMember(null);
  };

  const removeMember = async (id: string) => {
      if (confirm('Remove this developer from the team?')) {
          await db.deleteDeveloper(id);
          setTeam(prev => prev.filter(m => m.id !== id));
      }
  };

  const handleSaveMentor = async (mentor: Mentor) => {
      const newMentor = editingMentor ? mentor : { ...mentor, id: `mentor-${Date.now()}` };
      await db.saveMentor(newMentor);
      setMentors(prev => {
          const index = prev.findIndex(m => m.id === newMentor.id);
          if (index >= 0) {
              const updated = [...prev];
              updated[index] = newMentor;
              return updated;
          }
          return [...prev, newMentor];
      });
      setMentorModalOpen(false);
      setEditingMentor(null);
  };

  const handleRemoveMentor = async (id: string) => {
      if(confirm('Remove this mentor?')) {
          await db.deleteMentor(id);
          setMentors(prev => prev.filter(m => m.id !== id));
      }
  };

  const handleSaveConfig = async () => {
      await db.saveDevConfig(config);
      alert("System Configuration Synchronized.");
  };

  const handleSaveFooter = async () => {
      await db.saveFooterConfig(footerConfig);
      alert("Footer Configuration Updated.");
  };

  const handleBulkUserImport = async () => {
      try {
          const parsed = JSON.parse(bulkUserJson);
          if (!Array.isArray(parsed)) throw new Error("Input must be an array of user objects");
          await db.massImportUsers(parsed);
          const updatedUsers = await db.getUsers();
          setUsers(updatedUsers);
          setUserModalOpen(false);
          setBulkUserJson('');
          alert(`Successfully imported ${parsed.length} users.`);
      } catch (e) {
          alert("Invalid JSON format. Please check your input.");
      }
  };

  // --- SUB-COMPONENTS ---

  const MemberModal = () => {
      const [data, setData] = useState<TeamMember>(editingMember || {
          id: '', name: '', role: '', bio: '', email: '', isLead: false, education: [], experience: [], achievements: []
      });
      const [tab, setTab] = useState<'basic' | 'edu' | 'exp' | 'ach'>('basic');
      const fileRef = useRef<HTMLInputElement>(null);

      return (
          <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className={`w-full max-w-2xl rounded-2xl border shadow-2xl flex flex-col max-h-[90vh] ${isDarkMode ? 'bg-[#09090b] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                  <div className={`p-6 border-b flex justify-between items-center ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                      <h3 className="text-lg font-semibold">{editingMember ? 'Edit Profile' : 'Add Developer'}</h3>
                      <button onClick={() => setMemberModalOpen(false)} className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}><X size={18}/></button>
                  </div>
                  
                  <div className={`flex border-b px-6 ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                      {['Basic Info', 'Education', 'Experience', 'Achievements'].map((t, i) => {
                          const key = ['basic', 'edu', 'exp', 'ach'][i] as any;
                          return (
                              <button key={key} onClick={() => setTab(key)} className={`px-4 py-3 text-xs font-medium uppercase tracking-wider border-b-2 transition-colors ${tab === key ? 'border-black text-black dark:border-white dark:text-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                                  {t}
                              </button>
                          )
                      })}
                  </div>

                  <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                      {tab === 'basic' && (
                          <div className="space-y-6">
                              <div className="flex items-center gap-6">
                                  <div onClick={() => fileRef.current?.click()} className={`w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer transition-all overflow-hidden group ${isDarkMode ? 'bg-white/5 border-white/20 hover:border-white hover:text-white' : 'bg-slate-50 border-slate-300 hover:border-black hover:text-black'}`}>
                                      {data.image ? <img src={data.image} className="w-full h-full object-cover" /> : <Upload size={20} className="text-slate-400 group-hover:text-current"/>}
                                  </div>
                                  <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], (b64) => setData({...data, image: b64}))} />
                                  <div className="flex-1 space-y-3">
                                      <input value={data.name} onChange={e => setData({...data, name: e.target.value})} placeholder="Full Name" className={`w-full rounded-lg px-4 py-2.5 text-sm outline-none border transition-all ${isDarkMode ? 'bg-white/5 border-white/10 focus:border-white' : 'bg-white border-slate-200 focus:border-black'}`} />
                                      <input value={data.role} onChange={e => setData({...data, role: e.target.value})} placeholder="Role" className={`w-full rounded-lg px-4 py-2.5 text-sm outline-none border transition-all ${isDarkMode ? 'bg-white/5 border-white/10 focus:border-white' : 'bg-white border-slate-200 focus:border-black'}`} />
                                  </div>
                              </div>
                              <textarea value={data.bio} onChange={e => setData({...data, bio: e.target.value})} placeholder="Short Bio..." rows={3} className={`w-full rounded-lg px-4 py-2.5 text-sm outline-none border transition-all ${isDarkMode ? 'bg-white/5 border-white/10 focus:border-white' : 'bg-white border-slate-200 focus:border-black'}`} />
                              <div className="grid grid-cols-2 gap-4">
                                  <input value={data.email} onChange={e => setData({...data, email: e.target.value})} placeholder="Email" className={`rounded-lg px-4 py-2.5 text-sm outline-none border transition-all ${isDarkMode ? 'bg-white/5 border-white/10 focus:border-white' : 'bg-white border-slate-200 focus:border-black'}`} />
                                  <input value={data.linkedin} onChange={e => setData({...data, linkedin: e.target.value})} placeholder="LinkedIn URL" className={`rounded-lg px-4 py-2.5 text-sm outline-none border transition-all ${isDarkMode ? 'bg-white/5 border-white/10 focus:border-white' : 'bg-white border-slate-200 focus:border-black'}`} />
                                  <input value={data.github} onChange={e => setData({...data, github: e.target.value})} placeholder="GitHub URL" className={`rounded-lg px-4 py-2.5 text-sm outline-none border transition-all ${isDarkMode ? 'bg-white/5 border-white/10 focus:border-white' : 'bg-white border-slate-200 focus:border-black'}`} />
                                  <div className="flex items-center gap-3 px-2">
                                      <input type="checkbox" checked={data.isLead} onChange={e => setData({...data, isLead: e.target.checked})} className="w-4 h-4 rounded border-slate-300" />
                                      <span className="text-sm font-medium text-slate-500">Mark as Lead</span>
                                  </div>
                              </div>
                          </div>
                      )}
                      
                      {tab === 'edu' && <div className="p-4 text-center text-slate-500 italic text-sm">Education details can be managed here (Implementation skipped for brevity).</div>}
                      {tab === 'exp' && <div className="p-4 text-center text-slate-500 italic text-sm">Experience details can be managed here.</div>}
                      {tab === 'ach' && <div className="p-4 text-center text-slate-500 italic text-sm">Achievement details can be managed here.</div>}
                  </div>

                  <div className={`p-6 border-t flex justify-end gap-3 ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                      <button onClick={() => setMemberModalOpen(false)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isDarkMode ? 'text-slate-400 hover:bg-white/5' : 'text-slate-500 hover:bg-slate-100'}`}>Cancel</button>
                      <button onClick={() => saveMember(data)} className="px-6 py-2 rounded-lg text-sm font-medium bg-black text-white shadow-sm hover:bg-slate-800 transition-all">Save Member</button>
                  </div>
              </div>
          </div>
      );
  };

  const MentorModal = () => {
      const [data, setData] = useState<Mentor>(editingMentor || {
          id: '', name: '', designation: '', image: '', link: ''
      });

      return (
          <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className={`w-full max-w-lg rounded-2xl border shadow-2xl flex flex-col ${isDarkMode ? 'bg-[#09090b] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                  <div className={`p-6 border-b flex justify-between items-center ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                      <h3 className="text-lg font-semibold">{editingMentor ? 'Edit Mentor' : 'Add Mentor'}</h3>
                      <button onClick={() => setMentorModalOpen(false)} className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}><X size={18}/></button>
                  </div>
                  <div className="p-8 space-y-6">
                      <div className="flex flex-col items-center mb-4">
                          <div 
                            onClick={() => mentorImageInputRef.current?.click()}
                            className={`w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden relative group ${isDarkMode ? 'bg-white/5 border-white/20' : 'bg-slate-50 border-slate-300'}`}
                          >
                              {data.image ? <img src={data.image} className="w-full h-full object-cover" /> : <Upload size={24} className="text-slate-400" />}
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition-opacity">Upload</div>
                          </div>
                          <input type="file" ref={mentorImageInputRef} className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], (b64) => setData({...data, image: b64}))} />
                      </div>
                      <div className="space-y-4">
                          <input value={data.name} onChange={e => setData({...data, name: e.target.value})} placeholder="Full Name" className={`w-full rounded-lg px-4 py-2.5 text-sm outline-none border transition-all ${isDarkMode ? 'bg-white/5 border-white/10 focus:border-white' : 'bg-white border-slate-200 focus:border-black'}`} />
                          <input value={data.designation} onChange={e => setData({...data, designation: e.target.value})} placeholder="Designation (e.g. HOD, CSE)" className={`w-full rounded-lg px-4 py-2.5 text-sm outline-none border transition-all ${isDarkMode ? 'bg-white/5 border-white/10 focus:border-white' : 'bg-white border-slate-200 focus:border-black'}`} />
                          <input value={data.link} onChange={e => setData({...data, link: e.target.value})} placeholder="Profile Link (Optional)" className={`w-full rounded-lg px-4 py-2.5 text-sm outline-none border transition-all ${isDarkMode ? 'bg-white/5 border-white/10 focus:border-white' : 'bg-white border-slate-200 focus:border-black'}`} />
                      </div>
                  </div>
                  <div className={`p-6 border-t flex justify-end gap-3 ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                      <button onClick={() => setMentorModalOpen(false)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isDarkMode ? 'text-slate-400 hover:bg-white/5' : 'text-slate-500 hover:bg-slate-100'}`}>Cancel</button>
                      <button onClick={() => handleSaveMentor(data)} className="px-6 py-2 rounded-lg text-sm font-medium bg-black text-white shadow-sm hover:bg-slate-800 transition-all">Save Mentor</button>
                  </div>
              </div>
          </div>
      );
  };

  const UserModal = () => {
      return (
          <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className={`w-full max-w-lg rounded-2xl border shadow-2xl flex flex-col ${isDarkMode ? 'bg-[#09090b] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                  <div className={`p-6 border-b flex justify-between items-center ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                      <h3 className="text-lg font-semibold">Bulk User Import</h3>
                      <button onClick={() => setUserModalOpen(false)} className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}><X size={18}/></button>
                  </div>
                  <div className="p-8 space-y-4">
                      <p className="text-sm opacity-70">Paste a JSON array of user objects. Each object should have 'name', 'email', 'role', and optionally 'password'.</p>
                      <textarea 
                        value={bulkUserJson}
                        onChange={e => setBulkUserJson(e.target.value)}
                        rows={10}
                        placeholder='[{"name": "John Doe", "email": "john@example.com", "role": "student", "password": "securepassword"}]'
                        className={`w-full rounded-lg px-4 py-3 text-xs font-mono outline-none border transition-all ${isDarkMode ? 'bg-white/5 border-white/10 focus:border-white' : 'bg-white border-slate-200 focus:border-black'}`}
                      />
                  </div>
                  <div className={`p-6 border-t flex justify-end gap-3 ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                      <button onClick={() => setUserModalOpen(false)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isDarkMode ? 'text-slate-400 hover:bg-white/5' : 'text-slate-500 hover:bg-slate-100'}`}>Cancel</button>
                      <button onClick={handleBulkUserImport} className="px-6 py-2 rounded-lg text-sm font-medium bg-black text-white shadow-sm hover:bg-slate-800 transition-all">Import Users</button>
                  </div>
              </div>
          </div>
      );
  };

  // --- RENDER: PUBLIC VIEW ---
  if (mode === 'public') {
      return (
        <div className={`min-h-screen font-sans flex flex-col overflow-y-auto custom-scrollbar ${isDarkMode ? 'bg-[#09090b] text-white' : 'bg-[#FAFAF9] text-slate-900'}`}>
            {/* Header */}
            <div className="relative pt-24 pb-12 px-6">
                <button 
                    onClick={onBack} 
                    className={`fixed top-8 left-8 z-50 p-3 rounded-full backdrop-blur-md border transition-all ${
                        isDarkMode 
                        ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white' 
                        : 'bg-white/80 hover:bg-white border-slate-200 text-slate-900 shadow-sm'
                    }`}
                >
                    <ArrowLeft size={20} />
                </button>

                <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${
                        isDarkMode 
                        ? 'border-white/10 bg-white/5 text-slate-300' 
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}>
                        <Code size={12} /> Engineering & Design
                    </div>
                    <h1 className="text-5xl md:text-7xl font-semibold tracking-tight">
                        The Architects
                    </h1>
                    <p className={`text-lg max-w-xl mx-auto font-medium leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Meet the team building the digital backbone of MITS Gwalior.
                    </p>
                </div>
            </div>

            {/* Developer Grid */}
            <div className="max-w-6xl mx-auto px-6 pb-24 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {team.sort((a, b) => (a.isLead === b.isLead ? 0 : a.isLead ? -1 : 1)).map(member => (
                        <div key={member.id} className={`group relative rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                            isDarkMode 
                            ? 'bg-[#0d0d10] border-white/5 hover:border-white/10' 
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}>
                            <div className="p-8 flex flex-col items-center text-center space-y-4">
                                <div className={`w-24 h-24 rounded-2xl overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    {member.image ? <img src={member.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-slate-400">{member.name[0]}</div>}
                                </div>
                                
                                <div>
                                    <h3 className="text-lg font-bold leading-tight">{member.name}</h3>
                                    <p className={`text-xs font-medium mt-1 uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{member.role}</p>
                                </div>

                                <p className={`text-sm leading-relaxed line-clamp-3 ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>{member.bio}</p>

                                <div className="flex gap-3 pt-2">
                                    {member.linkedin && <a href={member.linkedin} target="_blank" className={`p-2 rounded-lg transition-all ${isDarkMode ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-black'}`}><Linkedin size={16}/></a>}
                                    {member.github && <a href={member.github} target="_blank" className={`p-2 rounded-lg transition-all ${isDarkMode ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-black'}`}><Github size={16}/></a>}
                                    {member.email && <a href={`mailto:${member.email}`} className={`p-2 rounded-lg transition-all ${isDarkMode ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-black'}`}><Mail size={16}/></a>}
                                </div>
                            </div>
                            
                            {member.isLead && (
                                <div className="absolute top-4 right-4">
                                    <Award size={16} className="text-amber-500" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Mentorship Section */}
                <div className="mt-24">
                    <h2 className="text-center text-2xl font-semibold mb-12 tracking-tight">Under The Guidance Of</h2>
                    <div className="flex flex-wrap justify-center gap-12">
                        {mentors.map(mentor => (
                            <a 
                                key={mentor.id} 
                                href={mentor.link || '#'} 
                                target={mentor.link ? "_blank" : undefined}
                                className={`flex flex-col items-center text-center gap-4 group ${!mentor.link && 'pointer-events-none'}`}
                            >
                                <div className={`w-20 h-20 rounded-full overflow-hidden border-2 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${
                                    isDarkMode ? 'bg-[#0d0d10] border-white/10' : 'bg-white border-slate-200'
                                }`}>
                                    {mentor.image ? <img src={mentor.image} className="w-full h-full object-cover" /> : <div className="font-bold text-slate-400 text-xl">{mentor.name[0]}</div>}
                                </div>
                                <div>
                                    <h4 className="text-base font-bold group-hover:underline">{mentor.name}</h4>
                                    <p className={`text-xs font-medium uppercase tracking-widest mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>{mentor.designation}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Developed Under */}
                <div className={`mt-24 pt-12 border-t text-center ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                    <div className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                        {config.developedUnderLogo ? (
                            <img src={config.developedUnderLogo} alt="Org" className="w-6 h-6 object-contain" />
                        ) : (
                            <Code size={16} className="text-slate-400" />
                        )}
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Developed Under</span>
                        <a href={config.developedUnderUrl} className="text-sm font-bold hover:underline flex items-center gap-1">
                            {config.developedUnderName} <ExternalLink size={12} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
      );
  }

  // --- RENDER: LOGIN ---
  if (!isAuthenticated) {
      return (
          <div className={`min-h-screen flex items-center justify-center p-6 relative overflow-hidden font-sans ${isDarkMode ? 'bg-[#09090b]' : 'bg-[#FAFAF9]'}`}>
              <div className={`max-w-sm w-full border rounded-2xl p-8 relative z-10 shadow-xl ${
                  isDarkMode 
                  ? 'bg-[#0d0d10] border-white/10' 
                  : 'bg-white border-slate-200'
              }`}>
                  <div className="text-center mb-8">
                      <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center mx-auto mb-4">
                          <Terminal size={24} />
                      </div>
                      <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>System Console</h1>
                      <p className="text-slate-500 text-sm font-medium mt-1">Restricted Access Protocol</p>
                  </div>
                  <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Developer ID</label>
                          <input 
                            type="text" 
                            value={username} 
                            onChange={e => setUsername(e.target.value)} 
                            className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition-all ${
                                isDarkMode ? 'bg-white/5 border-white/10 text-white focus:border-white' : 'bg-white border-slate-200 text-slate-900'
                            }`}
                            placeholder="id@mitsgwl.ac.in" 
                          />
                      </div>
                      <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Access Key</label>
                          <div className="relative">
                              <input 
                                type={showPassword ? "text" : "password"} 
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition-all ${
                                    isDarkMode ? 'bg-white/5 border-white/10 text-white focus:border-white' : 'bg-white border-slate-200 text-slate-900'
                                }`}
                                placeholder="••••••••" 
                              />
                              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-black dark:hover:text-white"><Eye size={16} /></button>
                          </div>
                      </div>
                      <button disabled={isLoading} className="w-full py-2.5 bg-black text-white rounded-lg font-bold text-sm shadow-sm hover:bg-slate-800 transition-all disabled:opacity-50">
                          {isLoading ? 'Verifying...' : 'Initialize Session'}
                      </button>
                  </form>
                  <button onClick={onBack} className="w-full mt-4 text-xs font-bold text-slate-500 hover:text-black dark:hover:text-white transition-colors">Abort Connection</button>
              </div>
          </div>
      );
  }

  // --- RENDER: CONSOLE DASHBOARD ---
  return (
      <div className={`flex h-screen font-sans overflow-hidden ${isDarkMode ? 'bg-[#09090b] text-white' : 'bg-[#FAFAF9] text-slate-900'}`}>
          {/* Sidebar */}
          <aside className={`w-64 flex flex-col p-4 border-r relative z-20 ${isDarkMode ? 'bg-[#0d0d10] border-white/5' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center gap-3 mb-8 px-2">
                  <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white shadow-sm">
                      <Terminal size={16} />
                  </div>
                  <h2 className="text-sm font-bold tracking-tight">DEV<span className="text-slate-500">CONSOLE</span></h2>
              </div>

              <nav className="flex-1 space-y-1">
                  {[
                      { id: 'dashboard', label: 'Dashboard', icon: Layout },
                      { id: 'team', label: 'Core Team', icon: Users },
                      { id: 'mentors', label: 'Mentorship', icon: GraduationCap },
                      { id: 'users', label: 'User Registry', icon: UserIcon },
                      { id: 'footer', label: 'Footer Manager', icon: LinkIcon },
                      { id: 'settings', label: 'Configuration', icon: Settings },
                  ].map(item => (
                      <button
                          key={item.id}
                          onClick={() => setActiveView(item.id as any)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                              activeView === item.id 
                              ? 'bg-black text-white shadow-sm' 
                              : isDarkMode ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-black'
                          }`}
                      >
                          <item.icon size={16} /> {item.label}
                      </button>
                  ))}
              </nav>

              <div className={`pt-4 mt-auto border-t ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                  <button onClick={onBack} className={`w-full py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                      isDarkMode ? 'bg-white/5 hover:bg-rose-500/10 hover:text-rose-500 text-slate-400' : 'bg-slate-50 hover:bg-rose-50 hover:text-rose-600 text-slate-500'
                  }`}>
                      <LogOut size={14} /> End Session
                  </button>
              </div>
          </aside>

          {/* Main Area */}
          <main className="flex-1 flex flex-col relative overflow-hidden">
              {/* Header */}
              <header className={`h-16 px-8 flex items-center justify-between border-b backdrop-blur-md z-10 ${isDarkMode ? 'border-white/5 bg-[#09090b]/50' : 'border-slate-200 bg-white/80'}`}>
                  <div>
                      <h2 className="text-lg font-bold tracking-tight">
                        {activeView === 'dashboard' ? 'System Metrics' : 
                         activeView === 'team' ? 'Team Management' : 
                         activeView === 'mentors' ? 'Mentorship' : 
                         activeView === 'users' ? 'User Registry' :
                         activeView === 'footer' ? 'Footer Manager' :
                         'Configuration'}
                      </h2>
                  </div>
              </header>

              {/* Content Scroll Area */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
                  
                  {activeView === 'dashboard' && (
                      <>
                          {/* Top Stats */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className={`p-6 rounded-xl border relative overflow-hidden group ${isDarkMode ? 'bg-[#0d0d10] border-white/5' : 'bg-white border-slate-200'}`}>
                                  <div className="flex justify-between items-start mb-4">
                                      <div>
                                          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Active Developers</p>
                                          <h3 className="text-3xl font-bold mt-1">{team.length}</h3>
                                      </div>
                                      <div className="p-2 bg-slate-100 rounded-lg text-black dark:bg-white/10 dark:text-white"><Users size={20} /></div>
                                  </div>
                                  <div className="h-12 w-full">
                                      <ResponsiveContainer width="100%" height="100%">
                                          <AreaChart data={chartData1}>
                                              <defs><linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#000" stopOpacity={0.1}/><stop offset="95%" stopColor="#000" stopOpacity={0}/></linearGradient></defs>
                                              <Area type="monotone" dataKey="value" stroke="#000" strokeWidth={2} fillOpacity={1} fill="url(#colorPv)" />
                                          </AreaChart>
                                      </ResponsiveContainer>
                                  </div>
                              </div>

                              <div className={`p-6 rounded-xl border relative overflow-hidden group ${isDarkMode ? 'bg-[#0d0d10] border-white/5' : 'bg-white border-slate-200'}`}>
                                  <div className="flex justify-between items-start mb-4">
                                      <div>
                                          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Total Users</p>
                                          <h3 className="text-3xl font-bold mt-1">{users.length}</h3>
                                      </div>
                                      <div className="p-2 bg-slate-100 rounded-lg text-black dark:bg-white/10 dark:text-white"><UserIcon size={20} /></div>
                                  </div>
                                  <div className="h-12 w-full">
                                      <ResponsiveContainer width="100%" height="100%">
                                          <AreaChart data={chartData2}>
                                              <defs><linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#000" stopOpacity={0.1}/><stop offset="95%" stopColor="#000" stopOpacity={0}/></linearGradient></defs>
                                              <Area type="monotone" dataKey="value" stroke="#000" strokeWidth={2} fillOpacity={1} fill="url(#colorUv)" />
                                          </AreaChart>
                                      </ResponsiveContainer>
                                  </div>
                              </div>

                              <div className={`p-6 rounded-xl border relative overflow-hidden group ${isDarkMode ? 'bg-[#0d0d10] border-white/5' : 'bg-white border-slate-200'}`}>
                                  <div className="flex justify-between items-start mb-4">
                                      <div>
                                          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Active Mentors</p>
                                          <h3 className="text-3xl font-bold mt-1">{mentors.length}</h3>
                                      </div>
                                      <div className="p-2 bg-slate-100 rounded-lg text-black dark:bg-white/10 dark:text-white"><GraduationCap size={20} /></div>
                                  </div>
                                  <div className="flex items-center gap-2 mt-4 text-xs font-bold text-emerald-500">
                                      <Zap size={14} /> <span>System Optimized</span>
                                  </div>
                              </div>
                          </div>
                      </>
                  )}

                  {activeView === 'team' && (
                      <>
                          <div className="flex justify-end mb-4">
                              <button onClick={() => { setEditingMember(null); setMemberModalOpen(true); }} className="bg-black text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-sm flex items-center gap-2 hover:bg-slate-800 transition-all">
                                  <Plus size={16} /> Add Developer
                              </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {team.map(member => (
                                  <div key={member.id} className={`rounded-xl p-6 relative group border transition-all ${isDarkMode ? 'bg-[#0d0d10] border-white/5 hover:border-white/20' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button onClick={() => { setEditingMember(member); setMemberModalOpen(true); }} className={`p-2 rounded-lg hover:text-black ${isDarkMode ? 'bg-white/5 text-white' : 'bg-slate-100 text-slate-600'}`}><Edit3 size={14}/></button>
                                          <button onClick={() => removeMember(member.id)} className={`p-2 rounded-lg hover:text-rose-500 ${isDarkMode ? 'bg-white/5 text-white' : 'bg-slate-100 text-slate-600'}`}><Trash2 size={14}/></button>
                                      </div>
                                      <div className="flex flex-col items-center text-center">
                                          <div className={`w-16 h-16 rounded-full overflow-hidden mb-4 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                              {member.image ? <img src={member.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl font-bold">{member.name[0]}</div>}
                                          </div>
                                          <h4 className="text-base font-bold">{member.name}</h4>
                                          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">{member.role}</p>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </>
                  )}

                  {activeView === 'mentors' && (
                      <>
                          <div className="flex justify-end mb-4">
                              <button onClick={() => { setEditingMentor(null); setMentorModalOpen(true); }} className="bg-black text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-sm flex items-center gap-2 hover:bg-slate-800 transition-all">
                                  <Plus size={16} /> Add Mentor
                              </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {mentors.map(mentor => (
                                  <div key={mentor.id} className={`rounded-xl p-6 relative group border transition-all ${isDarkMode ? 'bg-[#0d0d10] border-white/5 hover:border-white/20' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button onClick={() => { setEditingMentor(mentor); setMentorModalOpen(true); }} className={`p-2 rounded-lg hover:text-black ${isDarkMode ? 'bg-white/5 text-white' : 'bg-slate-100 text-slate-600'}`}><Edit3 size={14}/></button>
                                          <button onClick={() => handleRemoveMentor(mentor.id)} className={`p-2 rounded-lg hover:text-rose-500 ${isDarkMode ? 'bg-white/5 text-white' : 'bg-slate-100 text-slate-600'}`}><Trash2 size={14}/></button>
                                      </div>
                                      <div className="flex flex-col items-center text-center">
                                          <div className={`w-16 h-16 rounded-full overflow-hidden mb-4 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                              {mentor.image ? <img src={mentor.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl font-bold">{mentor.name[0]}</div>}
                                          </div>
                                          <h4 className="text-base font-bold">{mentor.name}</h4>
                                          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">{mentor.designation}</p>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </>
                  )}

                  {activeView === 'users' && (
                      <>
                          <div className="flex justify-end mb-4">
                              <button onClick={() => setUserModalOpen(true)} className="bg-black text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-sm flex items-center gap-2 hover:bg-slate-800 transition-all">
                                  <Upload size={16} /> Bulk Import
                              </button>
                          </div>
                          <div className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-[#0d0d10] border-white/5' : 'bg-white border-slate-200'}`}>
                              <table className="w-full text-sm text-left">
                                  <thead className={`text-xs uppercase tracking-wider font-bold border-b ${isDarkMode ? 'bg-white/5 border-white/5 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                                      <tr>
                                          <th className="px-6 py-4">Name</th>
                                          <th className="px-6 py-4">Email</th>
                                          <th className="px-6 py-4">Role</th>
                                          <th className="px-6 py-4">Password (Visible for Admin)</th>
                                      </tr>
                                  </thead>
                                  <tbody className="divide-y dark:divide-white/5 divide-slate-100">
                                      {users.map(user => (
                                          <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                              <td className="px-6 py-4 font-medium">{user.name}</td>
                                              <td className="px-6 py-4 opacity-70">{user.email}</td>
                                              <td className="px-6 py-4">
                                                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-600' : user.role === 'faculty' ? 'bg-blue-500/10 text-blue-600' : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400'}`}>
                                                      {user.role}
                                                  </span>
                                              </td>
                                              <td className="px-6 py-4 font-mono text-xs opacity-60">
                                                  {/* In a real app, passwords should be hashed and not visible. 
                                                      For this mock OS request, we show them if available in the object or a placeholder. */}
                                                  {(user as any).password || '••••••••'}
                                              </td>
                                          </tr>
                                      ))}
                                      {users.length === 0 && (
                                          <tr>
                                              <td colSpan={4} className="px-6 py-8 text-center opacity-50">No users found in registry.</td>
                                          </tr>
                                      )}
                                  </tbody>
                              </table>
                          </div>
                      </>
                  )}

                  {activeView === 'footer' && footerConfig && (
                      <div className="space-y-8">
                          <div className={`p-8 rounded-2xl border ${isDarkMode ? 'bg-[#0d0d10] border-white/5' : 'bg-white shadow-sm border-slate-200'}`}>
                              <h3 className="text-base font-bold mb-6 flex items-center gap-2"><LinkIcon size={18} /> Social Media Links</h3>
                              <div className="space-y-4">
                                  {footerConfig.socialLinks.map((link: any, idx: number) => (
                                      <div key={link.id} className="flex gap-4 items-center">
                                          <div className="w-32 text-sm font-medium opacity-70">{link.platform}</div>
                                          <input 
                                              value={link.url}
                                              onChange={e => {
                                                  const newLinks = [...footerConfig.socialLinks];
                                                  newLinks[idx].url = e.target.value;
                                                  setFooterConfig({...footerConfig, socialLinks: newLinks});
                                              }}
                                              className={`flex-1 rounded-lg px-4 py-2 text-sm outline-none border transition-all ${isDarkMode ? 'bg-white/5 border-white/10 focus:border-white' : 'bg-white border-slate-200 focus:border-black'}`}
                                          />
                                      </div>
                                  ))}
                              </div>
                          </div>

                          <div className={`p-8 rounded-2xl border ${isDarkMode ? 'bg-[#0d0d10] border-white/5' : 'bg-white shadow-sm border-slate-200'}`}>
                              <h3 className="text-base font-bold mb-6 flex items-center gap-2"><Layout size={18} /> Institutional Links</h3>
                              <div className="space-y-4">
                                  {footerConfig.institutionalLinks.map((link: any, idx: number) => (
                                      <div key={link.id} className="flex gap-4 items-center">
                                          <input 
                                              value={link.label}
                                              onChange={e => {
                                                  const newLinks = [...footerConfig.institutionalLinks];
                                                  newLinks[idx].label = e.target.value;
                                                  setFooterConfig({...footerConfig, institutionalLinks: newLinks});
                                              }}
                                              className={`w-48 rounded-lg px-4 py-2 text-sm outline-none border transition-all ${isDarkMode ? 'bg-white/5 border-white/10 focus:border-white' : 'bg-white border-slate-200 focus:border-black'}`}
                                          />
                                          <input 
                                              value={link.url}
                                              onChange={e => {
                                                  const newLinks = [...footerConfig.institutionalLinks];
                                                  newLinks[idx].url = e.target.value;
                                                  setFooterConfig({...footerConfig, institutionalLinks: newLinks});
                                              }}
                                              className={`flex-1 rounded-lg px-4 py-2 text-sm outline-none border transition-all ${isDarkMode ? 'bg-white/5 border-white/10 focus:border-white' : 'bg-white border-slate-200 focus:border-black'}`}
                                          />
                                      </div>
                                  ))}
                              </div>
                          </div>

                          <div className="flex justify-end">
                              <button onClick={handleSaveFooter} className="bg-black text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-sm hover:bg-slate-800 transition-all flex items-center gap-2">
                                  <Save size={16} /> Update Footer
                              </button>
                          </div>
                      </div>
                  )}

                  {activeView === 'settings' && (
                      <div className="max-w-2xl mx-auto space-y-8">
                          <div className={`p-8 rounded-2xl border ${isDarkMode ? 'bg-[#0d0d10] border-white/5' : 'bg-white shadow-sm border-slate-200'}`}>
                              <h3 className="text-base font-bold mb-6 flex items-center gap-2"><Globe size={18} /> Organization Identity</h3>
                              <div className="space-y-6">
                                  <div className="space-y-2">
                                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Developed Under Name</label>
                                      <input 
                                          value={config.developedUnderName}
                                          onChange={e => setConfig({...config, developedUnderName: e.target.value})}
                                          className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium outline-none border transition-all ${isDarkMode ? 'bg-white/5 border-white/10 focus:border-white' : 'bg-white border-slate-200 focus:border-black'}`}
                                      />
                                  </div>
                                  <div className="space-y-2">
                                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Website URL</label>
                                      <input 
                                          value={config.developedUnderUrl}
                                          onChange={e => setConfig({...config, developedUnderUrl: e.target.value})}
                                          className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium outline-none border transition-all ${isDarkMode ? 'bg-white/5 border-white/10 focus:border-white' : 'bg-white border-slate-200 focus:border-black'}`}
                                      />
                                  </div>
                                  <div className="space-y-2">
                                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Organization Logo</label>
                                      <div className="flex items-center gap-4">
                                          <div onClick={() => orgLogoInputRef.current?.click()} className={`w-16 h-16 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden ${isDarkMode ? 'border-white/20 hover:border-white' : 'border-slate-300 hover:border-black'}`}>
                                              {config.developedUnderLogo ? <img src={config.developedUnderLogo} className="w-full h-full object-contain p-2" /> : <Upload size={20} className="text-slate-400"/>}
                                          </div>
                                          <div className="flex-1">
                                              <p className="text-xs text-slate-500">Upload a square logo (PNG/SVG preferred).</p>
                                              <input type="file" ref={orgLogoInputRef} className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], (b64) => setConfig({...config, developedUnderLogo: b64}))} />
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          <div className={`p-8 rounded-2xl border ${isDarkMode ? 'bg-[#0d0d10] border-white/5' : 'bg-white shadow-sm border-slate-200'}`}>
                              <h3 className="text-base font-bold mb-6 flex items-center gap-2"><Lock size={18} /> Access Control</h3>
                              <div className="space-y-2">
                                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Authorized Emails (Comma Separated)</label>
                                  <textarea 
                                      value={config.authorizedEmails.join(', ')}
                                      onChange={e => setConfig({...config, authorizedEmails: e.target.value.split(',').map(s => s.trim())})}
                                      rows={4}
                                      className={`w-full rounded-lg px-4 py-2.5 text-sm font-mono outline-none border transition-all ${isDarkMode ? 'bg-white/5 border-white/10 focus:border-white' : 'bg-white border-slate-200 focus:border-black'}`}
                                  />
                                  <p className="text-xs text-slate-500">These emails will have access to the Developer Console.</p>
                              </div>
                          </div>

                          <div className="flex justify-end">
                              <button onClick={handleSaveConfig} className="bg-black text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-sm hover:bg-slate-800 transition-all flex items-center gap-2">
                                  <Save size={16} /> Save Configuration
                              </button>
                          </div>
                      </div>
                  )}
              </div>
          </main>

          {/* Modals */}
          {memberModalOpen && <MemberModal />}
          {mentorModalOpen && <MentorModal />}
          {userModalOpen && <UserModal />}
      </div>
  );
};

export default Developers;
