
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { User, Club, Message, Role, PollOption } from '../../types';
import { db } from '../../db';
import { 
  Send, 
  Search, 
  MoreVertical, 
  Paperclip,
  CheckCheck,
  Check,
  Phone,
  Video,
  ArrowLeft,
  Users,
  Camera,
  Mic,
  Plus,
  Image as ImageIcon,
  MapPin,
  BarChart2,
  X,
  Map as MapIcon,
  MessageSquare
} from 'lucide-react';

interface Props {
  user: User;
  clubs: Club[];
  allUsers: User[];
  activeContext?: string;
  isDarkMode: boolean;
}

const ChatSystem: React.FC<Props> = ({ user, clubs, allUsers, activeContext, isDarkMode }) => {
  const [activeChannel, setActiveChannel] = useState<{ type: 'club' | 'dm', id: string, name: string, image?: string, color?: string, subtitle?: string, isOnline?: boolean, lastSeen?: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showPollModal, setShowPollModal] = useState(false);
  
  // Poll State
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- ACCESS CONTROL LOGIC ---
  const allowedClubs = useMemo(() => {
    if (user.globalRole !== Role.STUDENT) return clubs;
    const myClubIds = user.clubMemberships.map(m => m.clubId);
    return clubs.filter(c => myClubIds.includes(c.id));
  }, [clubs, user]);

  const allowedUsers = useMemo(() => {
    if (user.globalRole !== Role.STUDENT) return allUsers.filter(u => u.id !== user.id);
    
    const myClubIds = user.clubMemberships.map(m => m.clubId);
    return allUsers.filter(u => {
      if (u.id === user.id) return false;
      if (u.globalRole !== Role.STUDENT) return true; // Can chat with faculty
      const theirClubIds = u.clubMemberships.map(m => m.clubId);
      return myClubIds.some(id => theirClubIds.includes(id));
    });
  }, [allUsers, user]);

  // --- INITIALIZATION ---
  useEffect(() => {
    if (activeContext && activeContext !== 'Global') {
      const club = allowedClubs.find(c => c.id === activeContext);
      if (club) {
        setActiveChannel({ 
            type: 'club', 
            id: club.id, 
            name: club.name, 
            color: club.themeColor,
            subtitle: `${club.category} Council` 
        });
      }
    }
  }, [activeContext, allowedClubs]);

  // --- REAL-TIME MESSAGE HANDLING ---
  useEffect(() => {
    const fetchHistory = async () => {
        if (!activeChannel) return;
        const msgs = await db.getMessages(
            activeChannel.type === 'club' ? activeChannel.id : undefined,
            user.id,
            activeChannel.type === 'dm' ? activeChannel.id : undefined
        );
        setMessages(msgs);
    };
    fetchHistory();

    const channel = db.subscribeToMessages((newMsg) => {
        const isForCurrentClub = activeChannel?.type === 'club' && newMsg.clubId === activeChannel.id;
        const isForCurrentDM = activeChannel?.type === 'dm' && 
            ((newMsg.senderId === activeChannel.id && newMsg.recipientId === user.id) || 
             (newMsg.senderId === user.id && newMsg.recipientId === activeChannel.id));

        if (isForCurrentClub || isForCurrentDM) {
            setMessages(prev => {
                if (prev.some(m => m.id === newMsg.id)) return prev;
                return [...prev, newMsg];
            });
        }
    });

    return () => {
        if (channel) db.unsubscribe(channel);
    };
  }, [activeChannel, user.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // --- HELPERS ---
  const formatTime = (iso: string) => {
      return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSend = async (type: Message['type'] = 'text', content?: string, extraData?: any) => {
    if (!activeChannel) return;
    if (type === 'text' && !input.trim()) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      content: type === 'text' ? input : content,
      timestamp: new Date().toISOString(),
      type: type,
      status: 'sent',
      clubId: activeChannel.type === 'club' ? activeChannel.id : undefined,
      recipientId: activeChannel.type === 'dm' ? activeChannel.id : undefined,
      ...extraData
    };

    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setShowAttachMenu(false);
    setShowPollModal(false);
    await db.sendMessage(newMsg);
  };

  const filteredClubs = allowedClubs.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const filteredUsers = allowedUsers.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));

  // --- RENDERERS ---
  const MessageStatusIcon = ({ status }: { status: Message['status'] }) => {
      if (status === 'read') return <CheckCheck size={16} className="text-[#53bdeb]" />;
      return <Check size={16} className="text-slate-400" />;
  };

  return (
    <div className={`flex h-full w-full overflow-hidden relative transition-colors duration-300 ${isDarkMode ? 'bg-[#0B1437]' : 'bg-[#F4F7FE]'}`}>
      
      {/* --- LIST VIEW (Left) --- */}
      <div className={`
        w-full md:w-[400px] flex flex-col border-r absolute md:relative inset-0 z-10 transition-transform duration-300 
        ${isDarkMode ? 'border-white/5 bg-[#111C44]' : 'border-slate-200 bg-white'}
        ${activeChannel ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}
      `}>
        
        {/* Header */}
        <div className={`px-4 py-3 flex justify-between items-center sticky top-0 z-20 ${isDarkMode ? 'bg-[#111C44]' : 'bg-white'}`}>
           <h1 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1B2559]'}`}>Chats</h1>
           <div className={`flex gap-4 ${isDarkMode ? 'text-slate-300' : 'text-[#A3AED0]'}`}>
              <Camera size={22} className="cursor-pointer" />
              <Search size={22} className="cursor-pointer" />
           </div>
        </div>

        {/* Search */}
        <div className="px-3 pb-2">
            <div className={`rounded-xl flex items-center px-3 py-2 ${isDarkMode ? 'bg-[#0B1437]' : 'bg-[#F4F7FE]'}`}>
                <Search size={18} className={isDarkMode ? 'text-slate-500' : 'text-[#A3AED0]'} />
                <input 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className={`bg-transparent border-none outline-none text-sm ml-3 w-full ${isDarkMode ? 'text-white placeholder-slate-500' : 'text-[#1B2559] placeholder-[#A3AED0]'}`}
                />
            </div>
        </div>

        {/* List Items */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredClubs.length > 0 && (
                <div className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500 bg-[#0B1437]/50' : 'text-[#A3AED0] bg-[#F4F7FE]'}`}>
                    My Groups
                </div>
            )}
            {filteredClubs.map(club => (
                <div 
                    key={club.id}
                    onClick={() => setActiveChannel({ type: 'club', id: club.id, name: club.name, color: club.themeColor, subtitle: `${club.category} Council` })}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-slate-100 hover:bg-slate-50'}`}
                >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shrink-0" style={{ backgroundColor: club.themeColor }}>
                        {club.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                            <h3 className={`font-bold truncate ${isDarkMode ? 'text-white' : 'text-[#1B2559]'}`}>{club.name}</h3>
                            <span className={`text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-[#A3AED0]'}`}>12:30 PM</span>
                        </div>
                        <p className={`text-sm truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{club.category} Wing</p>
                    </div>
                </div>
            ))}

            {filteredUsers.length > 0 && (
                <div className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest mt-2 ${isDarkMode ? 'text-slate-500 bg-[#0B1437]/50' : 'text-[#A3AED0] bg-[#F4F7FE]'}`}>
                    Direct Messages
                </div>
            )}
            {filteredUsers.map(u => (
                <div 
                    key={u.id}
                    onClick={() => setActiveChannel({ type: 'dm', id: u.id, name: u.name, image: u.photoUrl, subtitle: u.globalRole })}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-slate-100 hover:bg-slate-50'}`}
                >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center overflow-hidden border shrink-0 ${isDarkMode ? 'bg-slate-800 border-white/10' : 'bg-white border-slate-200'}`}>
                        {u.photoUrl ? <img src={u.photoUrl} className="w-full h-full object-cover" /> : <span className="font-bold text-slate-400">{u.name[0]}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className={`font-bold truncate ${isDarkMode ? 'text-white' : 'text-[#1B2559]'}`}>{u.name}</h3>
                        <p className={`text-sm truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{u.globalRole}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* --- CHAT VIEW (Right) --- */}
      <div className={`
        w-full md:flex-1 flex flex-col absolute md:relative inset-0 z-20 transition-transform duration-300 
        ${isDarkMode ? 'bg-[#0B1024]' : 'bg-[#F4F7FE]'}
        ${activeChannel ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
        {activeChannel ? (
            <>
                {/* Chat Header */}
                <div className={`h-16 px-4 flex items-center justify-between border-b shadow-md shrink-0 ${isDarkMode ? 'bg-[#111C44] border-white/5' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setActiveChannel(null)} className={`md:hidden p-2 -ml-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-500'}`}>
                            <ArrowLeft size={24} />
                        </button>
                        
                        {activeChannel.type === 'club' ? (
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: activeChannel.color }}>
                                {activeChannel.name[0]}
                            </div>
                        ) : (
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center">
                                {activeChannel.image ? <img src={activeChannel.image} className="w-full h-full object-cover" /> : activeChannel.name[0]}
                            </div>
                        )}
                        
                        <div>
                            <h3 className={`font-bold text-sm leading-tight ${isDarkMode ? 'text-white' : 'text-[#1B2559]'}`}>{activeChannel.name}</h3>
                            <p className={`text-xs truncate max-w-[150px] ${isDarkMode ? 'text-slate-400' : 'text-[#A3AED0]'}`}>{activeChannel.subtitle}</p>
                        </div>
                    </div>
                    <div className={`flex gap-4 ${isDarkMode ? 'text-slate-300' : 'text-[#A3AED0]'}`}>
                        <Phone size={20} />
                        <Video size={20} />
                    </div>
                </div>

                {/* Messages Area */}
                <div 
                    className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar"
                    style={{ backgroundColor: isDarkMode ? '#0B1024' : '#E5E5E5' }}
                    ref={scrollRef}
                >
                    {messages.map((msg, i) => {
                        const isMe = msg.senderId === user.id;
                        return (
                            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} mb-1`}>
                                <div className={`relative max-w-[85%] px-3 py-2 rounded-2xl shadow-sm text-sm ${isMe ? 'bg-[#005c4b] text-white rounded-tr-none' : (isDarkMode ? 'bg-[#202c33] text-slate-200' : 'bg-white text-black')} rounded-tl-none`}>
                                    {!isMe && activeChannel.type === 'club' && <p className="text-[10px] font-bold text-orange-400 mb-1">{msg.senderName}</p>}
                                    <span className="whitespace-pre-wrap">{msg.content}</span>
                                    <div className="flex items-center justify-end gap-1 mt-1 text-[9px] opacity-70">
                                        {formatTime(msg.timestamp)}
                                        {isMe && <MessageStatusIcon status={msg.status} />}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Input Area */}
                <div className={`p-3 flex items-center gap-2 shrink-0 ${isDarkMode ? 'bg-[#111C44]' : 'bg-[#F0F2F5]'}`}>
                    <button onClick={() => setShowAttachMenu(!showAttachMenu)} className="p-2 text-slate-500"><Plus size={24}/></button>
                    <div className={`flex-1 flex items-center gap-2 rounded-2xl px-4 py-3 ${isDarkMode ? 'bg-[#2a3942]' : 'bg-white'}`}>
                        <input 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type a message"
                            className={`flex-1 bg-transparent border-none outline-none text-base ${isDarkMode ? 'text-white' : 'text-black'}`}
                        />
                    </div>
                    <button onClick={() => handleSend()} className="p-3 rounded-full bg-[#00a884] text-white shadow-lg"><Send size={20} /></button>
                </div>
            </>
        ) : (
            <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center opacity-50">
                <MessageSquare size={48} className="mb-4 text-slate-400" />
                <p className="text-sm font-bold">Select a conversation to start messaging</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ChatSystem;
