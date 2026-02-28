import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, AlertCircle, CheckCircle2, XCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { db } from '../../db';
import { Registration, Event, Club } from '../../types';
import CertificatePreview from '../CertificatePreview';

interface Props {
  onBack: () => void;
  isDarkMode: boolean;
}

const CertificateVerification: React.FC<Props> = ({ onBack, isDarkMode }) => {
  const [searchId, setSearchId] = useState('');
  const [status, setStatus] = useState<'idle' | 'searching' | 'valid' | 'invalid'>('idle');
  const [result, setResult] = useState<{
    reg: Registration;
    event: Event;
    club: Club;
  } | null>(null);

  // --- AUTO VERIFY ON MOUNT ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
        setSearchId(id);
        verifyId(id);
    }
  }, []);

  const verifyId = async (id: string) => {
    setStatus('searching');
    setResult(null);

    // Fetch data directly from DB to ensure fresh check
    const [regs, events, clubs] = await Promise.all([
        db.getRegistrations(),
        db.getEvents(),
        db.getClubs()
    ]);

    const cleanId = id.trim();
    const reg = regs.find(r => r.certificateId === cleanId || r.ticketId === cleanId || r.id === cleanId);
    
    if (reg) {
        const event = events.find(e => e.id === reg.eventId);
        const club = clubs.find(c => c.id === event?.clubId);
        if (event && club) {
            setResult({ reg, event, club });
            setStatus('valid');
            return;
        }
    }
    
    setStatus('invalid');
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    verifyId(searchId);
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col ${isDarkMode ? 'bg-[#09090b] text-white' : 'bg-[#FAFAF9] text-slate-900'}`}>
      
      {/* Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${isDarkMode ? 'bg-[#09090b]/80 border-white/5' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-3xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className={`p-2 rounded-full transition-all ${isDarkMode ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-black'}`}
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-bold tracking-tight">Credential Verification</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12 flex flex-col items-center">
        
        <div className="text-center space-y-4 mb-12">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl ${isDarkMode ? 'bg-emerald-500/10 text-emerald-500' : 'bg-emerald-50 text-emerald-600'}`}>
                <ShieldCheck size={32} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Verify Authenticity</h2>
            <p className={`text-lg max-w-md mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Enter the unique credential ID found on the certificate or ticket to validate its origin.
            </p>
        </div>

        <div className="w-full max-w-lg space-y-8">
            <form onSubmit={handleVerify} className="relative group">
                <input 
                    type="text" 
                    value={searchId}
                    onChange={(e) => { setSearchId(e.target.value); setStatus('idle'); }}
                    placeholder="e.g. MITS-TECH-2026-X8Y9Z"
                    className={`w-full text-center text-lg font-mono font-bold py-6 px-12 rounded-2xl outline-none border-2 transition-all shadow-sm ${
                        isDarkMode 
                        ? 'bg-[#0d0d10] border-white/10 focus:border-emerald-500 text-white placeholder:text-slate-700' 
                        : 'bg-white border-slate-200 focus:border-emerald-500 text-slate-900 placeholder:text-slate-300 focus:shadow-xl'
                    }`}
                />
                <button 
                    type="submit"
                    disabled={status === 'searching' || !searchId.trim()}
                    className={`absolute right-3 top-3 bottom-3 aspect-square rounded-xl flex items-center justify-center transition-all ${
                        !searchId.trim() 
                        ? 'opacity-0 pointer-events-none' 
                        : isDarkMode ? 'bg-emerald-500 text-black hover:bg-emerald-400' : 'bg-black text-white hover:bg-slate-800'
                    }`}
                >
                    {status === 'searching' ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
                </button>
            </form>

            {status === 'invalid' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className={`p-6 rounded-2xl border flex items-center gap-4 ${isDarkMode ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                        <div className={`p-3 rounded-full ${isDarkMode ? 'bg-rose-500/20' : 'bg-rose-100'}`}>
                            <XCircle size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold">Invalid Credential</h3>
                            <p className={`text-sm mt-1 ${isDarkMode ? 'text-rose-400/80' : 'text-rose-600/80'}`}>The ID provided does not match any active record in the institutional ledger.</p>
                        </div>
                    </div>
                </div>
            )}

            {status === 'valid' && result && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className={`p-6 rounded-2xl border flex items-center gap-4 ${isDarkMode ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                        <div className={`p-3 rounded-full ${isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold">Verified Authentic</h3>
                            <p className={`text-sm mt-1 ${isDarkMode ? 'text-emerald-400/80' : 'text-emerald-600/80'}`}>This credential was legally issued by {result.club.name}.</p>
                        </div>
                    </div>

                    {result.reg.certificateId ? (
                        <div className="rounded-xl overflow-hidden shadow-2xl border-4 border-slate-800/5">
                            <CertificatePreview 
                                studentName={result.reg.studentName}
                                enrollmentNumber={result.reg.studentRoll}
                                eventName={result.event.title}
                                clubName={result.club.name}
                                clubLogoUrl={result.club.logoUrl}
                                id={result.reg.certificateId || result.reg.ticketId || 'UNKNOWN'}
                                date={result.event.date}
                                template={result.club.certificateConfig?.templateId || 'classic'}
                                customBackgroundUrl={result.club.certificateConfig?.customBackgroundUrl}
                                themeColor={result.club.themeColor}
                            />
                        </div>
                    ) : (
                        <div className={`p-10 rounded-[2.5rem] text-center space-y-8 border ${isDarkMode ? 'bg-[#0d0d10] border-white/10' : 'bg-white border-slate-200 shadow-xl'}`}>
                            <div>
                                <h3 className="text-2xl font-bold tracking-tight mb-2">{result.event.title}</h3>
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>Official Entry Ticket</span>
                            </div>
                            
                            <div className="flex justify-center py-4">
                                <div className="p-4 bg-white rounded-2xl shadow-sm">
                                    <img 
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${window.location.origin}/?page=verify%26id=${result.reg.ticketId}`} 
                                        alt="QR" 
                                        className="w-40 h-40 object-contain mix-blend-multiply" 
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-left max-w-sm mx-auto">
                                <div className={`p-5 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
                                    <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Holder</p>
                                    <p className="font-bold text-base truncate">{result.reg.studentName}</p>
                                </div>
                                <div className={`p-5 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
                                    <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Roll No.</p>
                                    <p className="font-bold text-base truncate">{result.reg.studentRoll}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default CertificateVerification;
