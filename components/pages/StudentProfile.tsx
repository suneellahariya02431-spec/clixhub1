
import React, { useState, useRef, useEffect } from 'react';
import { User, Registration, Applicant, Event, Role, ClubRole } from '../../types';
import { db } from '../../db';
import { 
  User as UserIcon, 
  MapPin, 
  ShieldCheck, 
  Save, 
  Edit2,
  Zap,
  CheckCircle2, 
  Camera, 
  Mail, 
  Phone, 
  Linkedin, 
  Github, 
  Plus, 
  X, 
  Heart, 
  Calendar, 
  Briefcase, 
  ListPlus, 
  Layers, 
  PenTool,
  Upload
} from 'lucide-react';

interface Props {
  user: User;
  onSave: (updatedUser: User) => void;
  isDarkMode: boolean;
  registrations: Registration[];
  applicants: Applicant[];
  events: Event[];
}

const StudentProfile: React.FC<Props> = ({ user, onSave, isDarkMode, registrations, applicants, events }) => {
  const [formData, setFormData] = useState<User>({ ...user });
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);
  
  // Dashboard Data
  const [savedEvents, setSavedEvents] = useState<Event[]>([]);
  const [myProposals, setMyProposals] = useState<Event[]>([]);
  
  // Filtered Lists
  const myRegistrations = registrations.filter(r => r.studentId === user.id);
  const myApplications = applicants.filter(a => a.name === user.name); 

  // Authority Check
  const isAuthority = user.globalRole === Role.FACULTY || user.clubMemberships.some(m => m.role === ClubRole.PRESIDENT);

  useEffect(() => {
    const fetchData = async () => {
        const saved = await db.getSavedEvents(user.id);
        const savedEventObjs = saved.map(s => events.find(e => e.id === s.eventId)).filter(e => e !== undefined) as Event[];
        setSavedEvents(savedEventObjs);
        const proposals = events.filter(e => e.createdBy === user.id);
        setMyProposals(proposals);
    };
    fetchData();
  }, [user.id, events]);

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0);
                    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imgData.data;
                    for (let i = 0; i < data.length; i += 4) {
                        const r = data[i];
                        const g = data[i + 1];
                        const b = data[i + 2];
                        if (r > 200 && g > 200 && b > 200) {
                            data[i + 3] = 0; // Alpha = 0
                        }
                    }
                    ctx.putImageData(imgData, 0, 0);
                    setFormData(prev => ({ ...prev, signatureUrl: canvas.toDataURL() }));
                }
            };
        };
        reader.readAsDataURL(file);
    }
  };

  const addSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !(formData.skills || []).includes(newSkill.trim())) {
      setFormData(prev => ({ ...prev, skills: [...(prev.skills || []), newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    if (!isEditing) return;
    setFormData(prev => ({ ...prev, skills: (prev.skills || []).filter(s => s !== skillToRemove) }));
  };

  const removeSavedEvent = async (eventId: string) => {
      await db.toggleSavedEvent(user.id, eventId);
      setSavedEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const inputClasses = `w-full px-6 py-4 rounded-2xl border outline-none transition-all text-sm font-bold ${
    isDarkMode 
      ? 'bg-[#0B1437] border-white/10 text-white focus:border-blue-500 placeholder:text-slate-600' 
      : 'bg-white border-slate-200 focus:border-blue-500 placeholder:text-slate-400'
  } ${!isEditing ? 'opacity-70 cursor-default' : ''}`;

  return (
    <div className={`p-8 md:p-12 max-w-[1800px] mx-auto min-h-screen ${isDarkMode ? 'text-white' : 'text-[#1B2559]'}`}>
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Identity Matrix</h1>
          <p className="text-slate-500 font-medium">Manage your institutional profile, preferences, and digital assets.</p>
        </div>
        <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl hover:scale-105 active:scale-95 ${isEditing ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 'bg-blue-600 text-white shadow-blue-600/30'}`}
        >
            {isEditing ? <><Save size={18}/> Save Changes</> : <><Edit2 size={18}/> Edit Profile</>}
        </button>
      </header>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-28 right-10 z-[100] animate-in fade-in slide-in-from-right-8 duration-500">
          <div className="bg-emerald-600 text-white px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-4 font-black text-xs uppercase tracking-widest">
            <CheckCircle2 size={24} /> 
            <span>Ledger Updated Successfully</span>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Avatar & Skills (4 cols) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Avatar Card */}
          <div className={`p-10 rounded-[3rem] border flex flex-col items-center text-center relative overflow-hidden ${isDarkMode ? 'bg-[#111C44] border-white/5' : 'bg-white border-slate-100 shadow-soft'}`}>
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
            
            <div className="relative group mt-8">
              <div className={`w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 relative shadow-2xl ${isDarkMode ? 'bg-slate-800 border-white/10' : 'bg-slate-100 border-white'}`}>
                {formData.photoUrl ? (
                  <img src={formData.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <UserIcon size={64} />
                  </div>
                )}
              </div>
              {isEditing && (
                <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 p-3 bg-blue-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-all z-10">
                  <Camera size={20} />
                </button>
              )}
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
            </div>
            
            <div className="mt-6 space-y-1">
              <h3 className="text-2xl font-black tracking-tight">{formData.name}</h3>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-500">{formData.globalRole}</p>
            </div>

            <div className="mt-8 flex gap-3 w-full">
               <div className={`flex-1 p-4 rounded-2xl flex flex-col items-center gap-1 border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                  <span className="text-lg font-black">{myRegistrations.length}</span>
                  <span className="text-[9px] font-bold uppercase text-slate-400">Events</span>
               </div>
               <div className={`flex-1 p-4 rounded-2xl flex flex-col items-center gap-1 border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                  <span className="text-lg font-black">{myApplications.length}</span>
                  <span className="text-[9px] font-bold uppercase text-slate-400">Apps</span>
               </div>
            </div>
          </div>

          {/* Signature Card (Authority) */}
          {isAuthority && (
            <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-[#111C44] border-white/5' : 'bg-white border-slate-100 shadow-soft'}`}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500"><PenTool size={20}/></div>
                    <h4 className="text-xs font-black uppercase tracking-widest opacity-60">Digital Signature</h4>
                </div>
                
                <div className={`h-32 w-full rounded-3xl border-2 border-dashed flex items-center justify-center relative overflow-hidden group ${isDarkMode ? 'border-slate-700 bg-[#0B1437]' : 'border-slate-200 bg-slate-50'}`}>
                    {formData.signatureUrl ? (
                        <img src={formData.signatureUrl} className="max-w-[80%] max-h-[80%] object-contain mix-blend-multiply dark:invert" alt="Signature" />
                    ) : (
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Not Configured</p>
                    )}
                    {isEditing && (
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer" onClick={() => signatureInputRef.current?.click()}>
                            <div className="text-white text-center">
                                <Upload size={24} className="mx-auto mb-2"/>
                                <span className="text-[8px] font-bold uppercase tracking-widest">Update Asset</span>
                            </div>
                        </div>
                    )}
                </div>
                <input type="file" ref={signatureInputRef} onChange={handleSignatureUpload} className="hidden" accept="image/*" />
            </div>
          )}

          {/* Skills Card */}
          <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-[#111C44] border-white/5' : 'bg-white border-slate-100 shadow-soft'}`}>
              <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500"><Zap size={20}/></div>
                      <h4 className="text-xs font-black uppercase tracking-widest opacity-60">Competencies</h4>
                  </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                  {(formData.skills || []).map(skill => (
                    <span key={skill} className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border flex items-center gap-2 ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                        {skill}
                        {isEditing && <button onClick={() => removeSkill(skill)} className="hover:text-rose-500"><X size={12}/></button>}
                    </span>
                  ))}
              </div>

              {isEditing && (
                  <form onSubmit={addSkill} className="relative">
                      <input 
                          type="text" 
                          value={newSkill}
                          onChange={e => setNewSkill(e.target.value)}
                          placeholder="Add skill..."
                          className={`w-full px-4 py-3 rounded-xl text-xs font-bold outline-none border focus:border-blue-500 ${isDarkMode ? 'bg-[#0B1437] border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                      />
                      <button type="submit" className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"><Plus size={14}/></button>
                  </form>
              )}
          </div>
        </div>

        {/* Right Column: Details & Activity (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
           
           {/* Personal Info Form */}
           <div className={`p-10 rounded-[3rem] border ${isDarkMode ? 'bg-[#111C44] border-white/5' : 'bg-white border-slate-100 shadow-soft'}`}>
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl"><ShieldCheck size={24} /></div>
                <h2 className="text-xl font-black uppercase tracking-widest opacity-80">Institutional Ledger</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Full Name</label>
                    <input type="text" value={formData.name} disabled={!isEditing} onChange={e => setFormData({...formData, name: e.target.value})} className={inputClasses}/>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Enrollment ID</label>
                    <div className="relative">
                        <input type="text" value={formData.enrollmentNumber || 'PENDING'} disabled={true} className={`${inputClasses} opacity-60 cursor-not-allowed`} />
                        {formData.enrollmentNumber && <ShieldCheck size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-500" />}
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Official Email</label>
                    <input type="text" value={formData.email} disabled={!isEditing} onChange={e => setFormData({...formData, email: e.target.value})} className={inputClasses}/>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Phone Contact</label>
                    <input type="text" value={formData.phoneNumber || ''} placeholder="+91..." disabled={!isEditing} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} className={inputClasses}/>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Department</label>
                    <input type="text" value={formData.branch || ''} placeholder="Ex: CSE" disabled={!isEditing} onChange={e => setFormData({...formData, branch: e.target.value})} className={inputClasses}/>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">LinkedIn Profile</label>
                    <input type="text" value={formData.linkedin || ''} placeholder="https://..." disabled={!isEditing} onChange={e => setFormData({...formData, linkedin: e.target.value})} className={inputClasses}/>
                </div>
                <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Biography</label>
                    <textarea value={formData.bio || ''} placeholder="Tell us about yourself..." disabled={!isEditing} onChange={e => setFormData({...formData, bio: e.target.value})} className={`${inputClasses} h-32 resize-none`}/>
                </div>
              </div>
           </div>

           {/* Activity Grid */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Event Registrations */}
              <div className={`p-8 rounded-[3rem] border flex flex-col ${isDarkMode ? 'bg-[#111C44] border-white/5' : 'bg-white border-slate-100 shadow-soft'}`}>
                  <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3 text-emerald-500">
                          <Calendar size={20} />
                          <h3 className={`font-black text-sm uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Event History</h3>
                      </div>
                      <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-black">{myRegistrations.length}</span>
                  </div>
                  <div className="flex-1 space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {myRegistrations.length > 0 ? myRegistrations.map(reg => {
                          const ev = events.find(e => e.id === reg.eventId);
                          return (
                              <div key={reg.id} className={`p-4 rounded-2xl border flex justify-between items-center ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                  <div>
                                      <p className="font-bold text-sm tracking-tight">{ev?.title}</p>
                                      <p className="text-[9px] font-bold uppercase tracking-widest opacity-50">{reg.status}</p>
                                  </div>
                                  {reg.status === 'Approved' ? <CheckCircle2 size={16} className="text-emerald-500"/> : <Zap size={16} className="text-amber-500 animate-pulse"/>}
                              </div>
                          )
                      }) : <p className="text-xs text-slate-400 italic text-center py-10">No active registrations.</p>}
                  </div>
              </div>

              {/* Saved Events */}
              <div className={`p-8 rounded-[3rem] border flex flex-col ${isDarkMode ? 'bg-[#111C44] border-white/5' : 'bg-white border-slate-100 shadow-soft'}`}>
                  <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3 text-rose-500">
                          <Heart size={20} />
                          <h3 className={`font-black text-sm uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Bookmarks</h3>
                      </div>
                      <span className="bg-rose-500/10 text-rose-500 px-3 py-1 rounded-full text-[10px] font-black">{savedEvents.length}</span>
                  </div>
                  <div className="flex-1 space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                       {savedEvents.length > 0 ? savedEvents.map(ev => (
                          <div key={ev.id} className={`p-4 rounded-2xl border flex justify-between items-center group transition-all ${isDarkMode ? 'bg-white/5 border-white/5 hover:border-rose-500/30' : 'bg-slate-50 border-slate-100 hover:border-rose-200'}`}>
                              <p className="font-bold text-sm truncate">{ev.title}</p>
                              <button onClick={() => removeSavedEvent(ev.id)} className="text-rose-500 p-2 rounded-full hover:bg-rose-500/10 transition-all"><Heart size={16} fill="currentColor" /></button>
                          </div>
                      )) : <p className="text-xs text-slate-400 italic text-center py-10">No saved items.</p>}
                  </div>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
};

export default StudentProfile;
