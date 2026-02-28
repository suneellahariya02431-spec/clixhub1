import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  FileText, 
  AlertTriangle, 
  Send, 
  CheckCircle2,
  GraduationCap,
  Lock,
  Globe,
  Users
} from 'lucide-react';
import { db } from '../../db';
import { User, Club, Role, ClubRole } from '../../types';

// --- SHARED LAYOUT ---
interface LayoutProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onBack: () => void;
  children: React.ReactNode;
}

export const PublicLayout: React.FC<LayoutProps> = ({ title, subtitle, icon, onBack, children }) => (
  <div className="min-h-screen bg-[#0B1437] text-white font-sans flex flex-col items-center p-6 relative overflow-y-auto custom-scrollbar">
    <button 
      onClick={onBack} 
      className="fixed top-8 left-8 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all z-50 backdrop-blur-md text-white"
    >
      <ArrowLeft size={24} />
    </button>

    <div className="max-w-5xl w-full relative z-10 py-20 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center space-y-4">
        {icon && (
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-white/5 border border-white/10 mb-4 shadow-2xl">
            {icon}
          </div>
        )}
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">
            {subtitle}
          </p>
        )}
      </div>
      <div className="w-full">
        {children}
      </div>
    </div>
  </div>
);

// --- LEGAL PAGES ---
export const LegalDocs: React.FC<{ type: 'privacy' | 'tos'; onBack: () => void }> = ({ type, onBack }) => {
  const content = type === 'privacy' ? {
    title: 'Privacy Protocol',
    subtitle: 'Institutional Data Handling & Encryption Standards',
    body: (
      <div className="space-y-8 text-slate-300 leading-relaxed font-light">
        <p>At Madhav Institute of Technology & Science (MITS), data integrity is paramount. The Club Connect Management System (CCMS) operates under strict encryption protocols.</p>
        <h3 className="text-xl font-bold text-white">1. Data Collection</h3>
        <p>We collect minimal identity markers (Enrollment No, Institutional Email) required for authentication and event registration. All biometric data (signatures) is processed locally or stored in secured buckets.</p>
        <h3 className="text-xl font-bold text-white">2. Blockchain Verification</h3>
        <p>Credentials issued via CCMS are hashed and timestamped. This ensures issued certificates are immutable and verifiable by third parties.</p>
        <h3 className="text-xl font-bold text-white">3. Access Control</h3>
        <p>Faculty and Student Admins have tiered access. Your personal contact details are never exposed publicly without explicit consent (e.g., leadership directory).</p>
      </div>
    )
  } : {
    title: 'Institutional Policies',
    subtitle: 'For Student Clubs & Councils',
    body: (
      <div className="space-y-8 text-slate-300 leading-relaxed font-light">
        <div className="text-center border-b border-white/10 pb-8 mb-8">
            <h2 className="text-2xl font-bold text-white">Madhav Institute of Technology & Science, Gwalior</h2>
            <p className="text-slate-400 mt-2">Applicable to all Academic, Technical, Cultural, Sports & Social Clubs</p>
        </div>

        <div className="space-y-6">
            <section>
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm">1</span>
                    Purpose & Governance
                </h3>
                <div className="pl-11 space-y-3">
                    <p>The Student Club System at MITS Gwalior exists to promote:</p>
                    <ul className="list-disc pl-5 space-y-1 text-slate-400">
                        <li>Holistic student development</li>
                        <li>Leadership, innovation, teamwork, and social responsibility</li>
                        <li>Structured extracurricular engagement aligned with institutional values</li>
                    </ul>
                    <p className="text-sm bg-white/5 p-3 rounded-lg border border-white/10 mt-2">
                        All clubs operate under the authority of MITS Gwalior and are governed by Institute Administration, Faculty Coordinators, and Approved Student Council Members.
                    </p>
                </div>
            </section>

            <section>
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm">2</span>
                    Club Recognition & Registration
                </h3>
                <div className="pl-11 space-y-3">
                    <p>Every club must be officially registered with MITS Gwalior. A club is considered active only after:</p>
                    <ul className="list-disc pl-5 space-y-1 text-slate-400">
                        <li>Submission of constitution</li>
                        <li>Appointment of Faculty Coordinator</li>
                        <li>Approval by Institute Authority / CCMS Admin</li>
                    </ul>
                    <p className="text-rose-400 text-sm font-medium">Unregistered or unapproved groups cannot operate under the institute name.</p>
                </div>
            </section>

            <section>
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm">3</span>
                    Membership & Recruitment Policy
                </h3>
                <div className="pl-11 space-y-4">
                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
                        <h4 className="text-amber-400 font-bold text-sm uppercase tracking-widest mb-2">Mandatory Recruitment Rule</h4>
                        <p className="text-sm">No student may join any club directly. All memberships must follow a recruitment & selection process.</p>
                    </div>
                    
                    <div>
                        <h4 className="font-bold text-white text-sm uppercase tracking-widest mb-2">Recruitment Workflow (Compulsory)</h4>
                        <ol className="list-decimal pl-5 space-y-1 text-slate-400">
                            <li>Application submission through official club form</li>
                            <li>Screening by club council</li>
                            <li>Interview / evaluation round</li>
                            <li>Selection approval</li>
                            <li>Role/domain assignment</li>
                        </ol>
                    </div>

                    <div>
                        <h4 className="font-bold text-white text-sm uppercase tracking-widest mb-2">Authority to Manage Recruitment</h4>
                        <p className="text-sm mb-2">Only the following roles within that club can view applications, move applicants, and assign domains:</p>
                        <div className="flex flex-wrap gap-2">
                            {['President', 'Vice President', 'Secretary', 'Domain Head', 'Faculty Coordinator'].map(role => (
                                <span key={role} className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-white border border-white/10">{role}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm">4</span>
                    Roles & Responsibilities
                </h3>
                <div className="pl-11 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <h4 className="font-bold text-white mb-2">Faculty Coordinator</h4>
                        <ul className="list-disc pl-4 text-xs text-slate-400 space-y-1">
                            <li>Acts as institutional representative</li>
                            <li>Approves events, budgets, and reports</li>
                            <li>Resolves disputes & final authority in violations</li>
                        </ul>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <h4 className="font-bold text-white mb-2">President</h4>
                        <ul className="list-disc pl-4 text-xs text-slate-400 space-y-1">
                            <li>Overall head of the club</li>
                            <li>Responsible for discipline, performance & reporting</li>
                            <li>Can assign/remove roles (except Faculty)</li>
                        </ul>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <h4 className="font-bold text-white mb-2">Vice President</h4>
                        <ul className="list-disc pl-4 text-xs text-slate-400 space-y-1">
                            <li>Assists President</li>
                            <li>Oversees operations & recruitment</li>
                            <li>Acts as President in absence</li>
                        </ul>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <h4 className="font-bold text-white mb-2">Secretary</h4>
                        <ul className="list-disc pl-4 text-xs text-slate-400 space-y-1">
                            <li>Manages documentation & notices</li>
                            <li>Handles official communication</li>
                            <li>Maintains member records</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm">5</span>
                    Event Management Policy
                </h3>
                <div className="pl-11 space-y-3">
                    <ul className="list-disc pl-5 space-y-1 text-slate-400">
                        <li>All events must be created via official CCMS and approved by Faculty Coordinator.</li>
                        <li>Paid events must clearly declare fee amount and payment mode.</li>
                        <li>Attendance must be digitally recorded.</li>
                        <li>Certificates are issued only after verified attendance.</li>
                    </ul>
                </div>
            </section>

            <section>
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm">6</span>
                    Finance & Payment Policy
                </h3>
                <div className="pl-11 space-y-3">
                    <p>Clubs may organize free or paid events. Allowed payment methods:</p>
                    <ul className="list-disc pl-5 space-y-1 text-slate-400">
                        <li>Manual UPI (QR upload + verification)</li>
                        <li>Approved payment gateways</li>
                    </ul>
                    <p className="text-sm text-slate-400">Manual UPI events require screenshot upload by participant and manual verification by Club Admin. All finances are subject to audit.</p>
                </div>
            </section>

            <section>
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm">7</span>
                    Certificate Policy
                </h3>
                <div className="pl-11 space-y-3">
                    <p>Certificates are issued only if event attendance is marked “Present” and approved by authorized roles.</p>
                    <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Must Contain</p>
                        <div className="flex flex-wrap gap-2">
                            {['MITS Official Header', 'Club Name & Logo', 'Event Name', 'Unique Certificate ID', 'QR Code'].map(item => (
                                <span key={item} className="px-2 py-1 bg-black/30 rounded text-xs text-slate-300">{item}</span>
                            ))}
                        </div>
                    </div>
                    <p className="text-rose-400 text-sm mt-2">Tampering or misuse leads to strict disciplinary action.</p>
                </div>
            </section>

            <section>
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm">8</span>
                    Discipline & Code of Conduct
                </h3>
                <div className="pl-11 space-y-3">
                    <p>Members must uphold Institute dignity, respect, inclusivity, and professionalism.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl">
                            <h4 className="text-rose-400 font-bold text-sm uppercase mb-2">Misconduct Includes</h4>
                            <ul className="list-disc pl-4 text-xs text-slate-300 space-y-1">
                                <li>Fake certificates</li>
                                <li>Financial misuse</li>
                                <li>Unauthorized events</li>
                                <li>Harassment or discrimination</li>
                            </ul>
                        </div>
                        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
                            <h4 className="text-amber-400 font-bold text-sm uppercase mb-2">Disciplinary Actions</h4>
                            <ul className="list-disc pl-4 text-xs text-slate-300 space-y-1">
                                <li>Warning</li>
                                <li>Removal from role</li>
                                <li>Club suspension</li>
                                <li>Institutional action as per rules</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm">9</span>
                    Digital System Usage (CCMS)
                </h3>
                <div className="pl-11 space-y-3">
                    <p>All clubs must use the official CCMS. Manual or unofficial records are discouraged. Data integrity, role-based access & audit logs are enforced.</p>
                </div>
            </section>

            <section className="pt-8 border-t border-white/10 mt-8">
                <h3 className="text-xl font-bold text-white mb-3">Final Authority</h3>
                <p className="text-slate-400 mb-4">MITS Gwalior reserves the right to amend, suspend, or revoke any club, role, or activity in the interest of discipline, safety, and institutional integrity.</p>
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <span className="text-2xl">🏛</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Issued Under Authority of</p>
                        <p className="text-white font-bold">Madhav Institute of Technology & Science, Gwalior</p>
                    </div>
                </div>
            </section>
        </div>
      </div>
    )
  };

  return (
    <PublicLayout 
      title={content.title} 
      subtitle={content.subtitle} 
      icon={<FileText size={32} className="text-blue-400" />} 
      onBack={onBack}
    >
      <div className="bg-[#111C44]/50 border border-white/10 rounded-[2.5rem] p-10 md:p-16 shadow-2xl backdrop-blur-md">
        {content.body}
      </div>
    </PublicLayout>
  );
};

// --- REPORT ISSUE ---
export const ReportIssue: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [desc, setDesc] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.addLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      user: 'Anonymous Reporter',
      action: `ISSUE REPORTED: ${desc}`,
      clubId: 'Global'
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <PublicLayout title="Report Received" onBack={onBack} icon={<CheckCircle2 size={32} className="text-emerald-500"/>}>
        <div className="text-center space-y-6 bg-[#111C44]/50 border border-white/10 rounded-[2.5rem] p-16">
          <p className="text-xl text-slate-300">Your report has been logged in the audit trail. The technical council will investigate shortly.</p>
          <button onClick={onBack} className="px-8 py-4 bg-white text-black rounded-xl font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform">
            Return Home
          </button>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout 
      title="System Diagnostics" 
      subtitle="Report bugs, security vulnerabilities, or operational failures." 
      icon={<AlertTriangle size={32} className="text-amber-500" />} 
      onBack={onBack}
    >
      <div className="bg-[#111C44]/50 border border-white/10 rounded-[2.5rem] p-10 md:p-16 shadow-2xl backdrop-blur-md max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-4">Issue Description</label>
            <textarea 
              required
              rows={6}
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Describe the anomaly or error encountered..."
              className="w-full bg-[#0B1437] border border-white/10 rounded-3xl p-6 text-white outline-none focus:border-amber-500 transition-all font-medium text-lg placeholder:text-slate-600"
            />
          </div>
          <button className="w-full py-5 bg-amber-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-amber-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-amber-600/20">
            <Send size={18} /> Transmit Log
          </button>
        </form>
      </div>
    </PublicLayout>
  );
};

// --- FACULTY PORTAL INFO ---
export const FacultyPortalInfo: React.FC<{ onBack: () => void; onLogin: () => void }> = ({ onBack, onLogin }) => {
  return (
    <PublicLayout 
      title="Faculty Governance" 
      subtitle="Institutional oversight and approval gateway." 
      icon={<GraduationCap size={32} className="text-emerald-500" />} 
      onBack={onBack}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#111C44]/50 border border-white/10 rounded-[2.5rem] p-10 space-y-6">
          <ShieldCheck size={48} className="text-emerald-500" />
          <h3 className="text-2xl font-bold text-white">Administrative Access</h3>
          <p className="text-slate-400 leading-relaxed">
            Faculty coordinators act as the primary approval authority for all student club events, budget allocations, and certification issuance.
          </p>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"/> Review Event Proposals</li>
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"/> Digital Signature Authority</li>
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"/> Budget Auditing</li>
          </ul>
        </div>

        <div className="bg-[#111C44]/50 border border-white/10 rounded-[2.5rem] p-10 flex flex-col justify-center items-center text-center space-y-8">
          <Lock size={48} className="text-slate-500" />
          <div>
            <h3 className="text-2xl font-bold text-white">Secure Entry</h3>
            <p className="text-slate-400 mt-2">Access restricted to registered institutional IDs.</p>
          </div>
          <button 
            onClick={onLogin}
            className="px-10 py-4 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform"
          >
            Faculty Login
          </button>
        </div>
      </div>
    </PublicLayout>
  );
};

// --- STUDENT LEADERSHIP ---
export const StudentLeadership: React.FC<{ clubs: Club[]; users: User[]; onBack: () => void }> = ({ clubs, users, onBack }) => {
  const leaders = clubs.map(club => {
    const president = users.find(u => u.clubMemberships.some(m => m.clubId === club.id && m.role === ClubRole.PRESIDENT));
    return {
      club,
      president
    };
  }).filter(item => item.president);

  return (
    <PublicLayout 
      title="Leadership Council" 
      subtitle="The student architects driving campus innovation." 
      icon={<Users size={32} className="text-purple-500" />} 
      onBack={onBack}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {leaders.map(({ club, president }) => (
          <div key={club.id} className="bg-[#111C44]/50 border border-white/10 rounded-[2.5rem] overflow-hidden group hover:border-purple-500/50 transition-all">
            <div className="h-32 bg-gradient-to-r from-purple-900/50 to-blue-900/50 relative">
              <div className="absolute -bottom-10 left-8 p-1 bg-[#0B1437] rounded-full">
                <div className="w-20 h-20 rounded-full bg-slate-800 overflow-hidden">
                  {president?.photoUrl ? (
                    <img src={president.photoUrl} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-slate-500">
                      {president?.name[0]}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="pt-14 p-8">
              <h3 className="text-xl font-bold text-white">{president?.name}</h3>
              <p className="text-purple-400 text-xs font-black uppercase tracking-widest mt-1">President, {club.name}</p>
              
              <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Department</p>
                  <p className="text-sm font-medium text-slate-300">{president?.branch || 'General'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Tenure</p>
                  <p className="text-sm font-medium text-slate-300">2025-26</p>
                </div>
              </div>
            </div>
          </div>
        ))}
        {leaders.length === 0 && (
          <div className="col-span-full py-20 text-center opacity-30">
            <Users size={64} className="mx-auto mb-4" />
            <p className="text-xl font-bold">Leadership Roster Syncing...</p>
          </div>
        )}
      </div>
    </PublicLayout>
  );
};