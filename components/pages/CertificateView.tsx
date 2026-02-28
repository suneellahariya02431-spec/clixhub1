import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../db';
import { Registration, Event, Club } from '../../types';
import { QrCode, Download, Share2, CheckCircle2 } from 'lucide-react';

const CertificateView: React.FC = () => {
  const { id } = useParams();
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      // In a real app, we would fetch by certificate ID. 
      // Here we iterate to find the registration with this certificate ID.
      const regs = await db.getRegistrations();
      const reg = regs.find(r => r.certificateId === id);
      
      if (reg) {
        setRegistration(reg);
        const events = await db.getEvents();
        const evt = events.find(e => e.id === reg.eventId);
        setEvent(evt || null);
        
        if (evt) {
            const clubs = await db.getClubs();
            const clb = clubs.find(c => c.id === evt.clubId);
            setClub(clb || null);
        }
      }
      setLoading(false);
    };
    loadData();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400 font-bold">Verifying Certificate...</div>;

  if (!registration || !event || !club) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center">
                <QrCode size={32} />
            </div>
            <h1 className="text-2xl font-black text-slate-800">Invalid Certificate</h1>
            <p className="text-slate-500 font-medium max-w-md">The certificate ID you provided could not be verified in our records.</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 flex flex-col items-center">
        
        {/* Certificate Container */}
        <div className="bg-white w-full max-w-[800px] aspect-[1.414/1] shadow-2xl relative overflow-hidden flex flex-col p-12 text-center border-8 border-double border-[#1B2559]/10">
            
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
            />

            {/* Header */}
            <div className="space-y-2 mb-12 relative z-10">
                <div className="flex items-center justify-center gap-4 mb-6">
                    <img src="https://upload.wikimedia.org/wikipedia/en/b/b0/Madhav_Institute_of_Technology_and_Science_logo.png" alt="MITS Logo" className="h-16 object-contain" />
                    <div className="text-left">
                        <h1 className="text-xl font-black uppercase tracking-widest text-[#1B2559]">Madhav Institute of Technology & Science, Gwalior</h1>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">A Govt. Aided UGC Autonomous Institute</p>
                    </div>
                </div>
                <div className="h-1 w-32 bg-[#1B2559] mx-auto rounded-full" />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center space-y-8 relative z-10">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">This is to certify that</p>
                <h2 className="text-4xl font-black text-[#1B2559] font-serif italic">{registration.studentName}</h2>
                <p className="text-sm font-medium text-slate-600 max-w-lg mx-auto leading-relaxed">
                    has successfully participated in <span className="font-black text-[#1B2559]">{event.title}</span> organized by <span className="font-bold text-[#1B2559]">{club.name}</span> on {event.date}.
                </p>
            </div>

            {/* Footer */}
            <div className="mt-12 flex justify-between items-end relative z-10">
                <div className="text-left">
                    <div className="mb-2">
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${window.location.href}`} alt="Verification QR" className="w-20 h-20 border-2 border-slate-100" />
                    </div>
                    <p className="text-[10px] font-mono text-slate-400">ID: {registration.certificateId}</p>
                    <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 size={10} /> Verified Credential</p>
                </div>

                <div className="flex gap-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-32 h-12 border-b-2 border-slate-300 flex items-end justify-center pb-1">
                            <span className="font-serif italic text-lg opacity-80">Signed</span>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Faculty Coordinator</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-32 h-12 border-b-2 border-slate-300 flex items-end justify-center pb-1">
                            <span className="font-serif italic text-lg opacity-80">Signed</span>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Club President</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4 print:hidden">
            <button onClick={() => window.print()} className="px-6 py-3 bg-[#1B2559] text-white rounded-xl font-bold shadow-xl hover:bg-[#2B3674] flex items-center gap-2">
                <Download size={18} /> Download PDF
            </button>
            <button onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
            }} className="px-6 py-3 bg-white text-[#1B2559] rounded-xl font-bold shadow-xl hover:bg-slate-50 flex items-center gap-2">
                <Share2 size={18} /> Share
            </button>
        </div>

    </div>
  );
};

export default CertificateView;
