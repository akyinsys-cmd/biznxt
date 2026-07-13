import { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Users, 
  Phone, 
  Video, 
  Search, 
  MoreVertical, 
  Paperclip, 
  Send, 
  Smile, 
  Clock, 
  CheckCheck,
  Plus,
  Filter,
  AtSign,
  Star,
  FileText,
  Image as ImageIcon,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CHAT_ROOMS } from '../data/communicationData';
import { ChatRoom, ChatMessage } from '../types/communication';
import { db } from '../lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  doc, 
  updateDoc,
  setDoc,
  limit,
  where
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function CommunicationHub() {
  const { user, role } = useAuth();
  const { success, error } = useToast();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync Rooms
  useEffect(() => {
    const q = query(collection(db, 'communication_channels'), orderBy('updatedAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const roomList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatRoom[];
      
      setRooms(roomList);

      // Seed if empty
      if (roomList.length === 0 && !snapshot.metadata.fromCache) {
        seedChannels();
      }
      
      // Auto-select first room if none selected
      if (roomList.length > 0 && !selectedRoom) {
        setSelectedRoom(roomList[0]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync Messages for selected room
  useEffect(() => {
    if (!selectedRoom) {
      setMessages([]);
      return;
    }

    const q = query(
      collection(db, 'communication_channels', selectedRoom.id, 'messages'),
      orderBy('timestamp', 'asc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()?.toISOString() || new Date().toISOString()
      })) as ChatMessage[];
      setMessages(msgList);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [selectedRoom]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const seedChannels = async () => {
    try {
      for (const room of CHAT_ROOMS) {
        await setDoc(doc(db, 'communication_channels', room.id), {
          ...room,
          updatedAt: serverTimestamp()
        });
      }
      success('Communication channels initialized.');
    } catch (err) {
      console.error('Seed error:', err);
    }
  };

  const handleSendMessage = async (e?: { preventDefault: () => void }) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!message.trim() || !selectedRoom || !user) return;

    const msgContent = message.trim();
    setMessage('');

    try {
      const msgData = {
        roomId: selectedRoom.id,
        senderId: user.uid,
        senderName: user.displayName || 'Anonymous User',
        senderAvatar: user.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.displayName || 'U'),
        content: msgContent,
        timestamp: serverTimestamp(),
        status: 'sent'
      };

      await addDoc(collection(db, 'communication_channels', selectedRoom.id, 'messages'), msgData);
      
      // Update last message in channel
      await updateDoc(doc(db, 'communication_channels', selectedRoom.id), {
        lastMessage: {
          ...msgData,
          timestamp: new Date().toISOString() // for immediate local display
        },
        updatedAt: serverTimestamp()
      });

    } catch (err) {
      error('Failed to send message.');
      console.error(err);
    }
  };

  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (

    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar - Rooms List */}
      <motion.div 
        animate={{ width: isSidebarOpen ? 400 : 0 }}
        className="bg-white border-r border-slate-200/50 flex flex-col h-full overflow-hidden relative z-20 shadow-xl"
      >
        <div className="p-8 border-b border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter">Inbox</h1>
            <button className="w-10 h-10 bg-primary/10 text-primary rounded-2xl hover:bg-primary/20 transition-all flex items-center justify-center">
              <Plus size={20} />
            </button>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search secure channels..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:border-primary/20 focus:outline-none transition-all placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-8 mb-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Direct Messages</p>
          </div>
          {filteredRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              className={`w-full px-8 py-5 flex gap-5 hover:bg-slate-50 transition-all text-left relative group ${
                selectedRoom?.id === room.id ? 'bg-primary/[0.03]' : ''
              }`}
            >
              <div className="relative">
                <div className="w-14 h-14 bg-slate-100 rounded-[1.25rem] flex items-center justify-center overflow-hidden border border-slate-100 shadow-sm">
                  {room.type === 'Project' ? (
                    <div className="grid grid-cols-2 w-full h-full">
                      {room.participants.slice(0, 4).map((p, i) => (
                        <img key={i} src={p.avatar} alt="" className="w-full h-full object-cover" />
                      ))}
                    </div>
                  ) : (
                    <img src={room.participants[1].avatar} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                {room.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-white rounded-2xl shadow-sm" />
                )}
              </div>

              <div className="flex-1 min-w-0 py-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-sm font-black text-slate-900 truncate tracking-tight">{room.name}</h3>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {room.lastMessage ? new Date(room.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500 truncate font-medium">
                    {room.lastMessage ? room.lastMessage.content : 'No secure logs initialized'}
                  </p>
                  {room.unreadCount > 0 && (
                    <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-2xl shadow-lg shadow-primary/20">
                      {room.unreadCount}
                    </span>
                  )}
                </div>
              </div>

              {selectedRoom?.id === room.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-r-full" />
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <div className="h-24 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-10 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-5">
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-3 bg-slate-50 text-slate-500 hover:text-slate-900 rounded-2xl lg:hidden">
                  <ChevronLeft size={20} />
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl overflow-hidden shadow-sm">
                    <img src={selectedRoom.participants[0].avatar} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">{selectedRoom.name}</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{selectedRoom.type}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{selectedRoom.participants.length} Active Node(s)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all border border-transparent hover:border-primary/10">
                  <Phone size={20} />
                </button>
                <button className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all border border-transparent hover:border-primary/10">
                  <Video size={20} />
                </button>
                <button className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all border border-transparent hover:border-primary/10">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-10 space-y-10 bg-slate-50/30">
              {messages.length > 0 ? messages.map((msg, i) => {
                const isMe = msg.senderId === user?.uid;
                return (
                  <motion.div
                    key={msg.id || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-6 ${isMe ? 'flex-row-reverse' : ''}`}
                  >
                    {!isMe && (
                      <div className="w-12 h-12 rounded-[1.25rem] overflow-hidden shadow-sm shrink-0 mt-1">
                        <img src={msg.senderAvatar} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className={`max-w-[65%] space-y-3 ${isMe ? 'items-end' : ''}`}>
                      {!isMe && <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{msg.senderName}</p>}
                      <div className={`p-6 rounded-[2.5rem] shadow-sm relative leading-relaxed ${
                        isMe ? 'bg-primary text-white rounded-tr-none shadow-primary/20' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                      }`}>
                        <p className="text-[15px] font-medium">{msg.content}</p>
                        
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-5 space-y-3">
                            {msg.attachments.map((file, i) => (
                              <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                                isMe ? 'bg-white/10 border-white/20 hover:bg-white/20' : 'bg-slate-50 border-slate-100 hover:border-primary/30'
                              }`}>
                                <div className={`w-10 h-10 flex items-center justify-center rounded-2xl ${isMe ? 'bg-white/10' : 'bg-white shadow-sm'}`}>
                                  <FileText size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold truncate">{file.name}</p>
                                  <p className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${isMe ? 'text-white/60' : 'text-slate-500'}`}>SECURE LEDGER • 2.4 MB</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ${isMe ? 'justify-end mr-2' : 'ml-2'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {isMe && <CheckCheck size={14} className="text-emerald-500" />}
                      </div>
                    </div>
                  </motion.div>
                );
              }) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 flex items-center justify-center mb-8">
                    <Clock size={48} className="opacity-10" />
                  </div>
                  <p className="text-sm font-black uppercase tracking-[0.2em]">Secure channel initialized</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="px-10 py-8 bg-white border-t border-slate-200/50">
              <form 
                onSubmit={handleSendMessage}
                className="max-w-5xl mx-auto flex items-end gap-6"
              >
                <div className="flex-1 relative">
                  <textarea
                    rows={1}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Compose strategic message..."
                    className="w-full pl-6 pr-24 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] text-[15px] font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary transition-all resize-none max-h-48 shadow-inner"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <div className="absolute right-4 bottom-3 flex gap-1">
                    <button type="button" className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-primary transition-all rounded-2xl hover:bg-slate-100">
                      <ImageIcon size={20} />
                    </button>
                    <button type="button" className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-primary transition-all rounded-2xl hover:bg-slate-100">
                      <Paperclip size={20} />
                    </button>
                  </div>
                </div>
                <button 
                  type="submit"
                  disabled={!message.trim()}
                  className="w-16 h-16 bg-primary text-white rounded-[1.5rem] shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center group"
                >
                  <Send size={24} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-slate-50/30">
            <div className="text-center">
              <div className="w-32 h-32 bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/50 flex items-center justify-center mx-auto mb-10 text-slate-200">
                <MessageSquare size={56} className="animate-float" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">Unified Terminal</h3>
              <p className="text-base text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                Select a strategic communication node from the directory to begin end-to-end encrypted collaboration.
              </p>
            </div>
          </div>
        )}

        {/* Floating AI Meta-Assistant */}
        <button className="absolute bottom-40 right-12 w-16 h-16 bg-slate-900 text-white rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-110 active:scale-95 transition-all group z-[100] flex items-center justify-center border border-white/10">
          <AtSign size={24} className="group-hover:rotate-12 transition-transform" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-2xl animate-ping shadow-lg shadow-primary/50" />
        </button>
      </div>

      {/* Right Sidebar - Info/Timeline */}
      {selectedRoom && (
        <div className="w-[400px] bg-white border-l border-slate-200/50 hidden xl:flex flex-col h-full overflow-hidden shadow-2xl">
          <div className="p-10 border-b border-slate-100 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent pointer-events-none" />
            <div className="w-32 h-32 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 overflow-hidden border-8 border-white shadow-2xl shadow-slate-200/50 relative z-10">
              <img src={selectedRoom.participants[0].avatar} alt="" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight relative z-10">{selectedRoom.name}</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 relative z-10">{selectedRoom.type}</p>
            <div className="flex gap-3 justify-center relative z-10">
              <button className="w-12 h-12 bg-slate-50 text-slate-500 rounded-2xl hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center border border-slate-100"><AtSign size={20} /></button>
              <button className="w-12 h-12 bg-slate-50 text-slate-500 rounded-2xl hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center border border-slate-100"><Star size={20} /></button>
              <button className="w-12 h-12 bg-slate-50 text-slate-500 rounded-2xl hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center border border-slate-100"><Search size={20} /></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-10 space-y-12">
            <div>
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Active Node Network</h4>
              <div className="space-y-5">
                {selectedRoom.participants.map(p => (
                  <div key={p.id} className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                      <img src={p.avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors">{p.name}</p>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{p.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Strategic Resources</h4>
              <div className="space-y-3">
                {['Timeline Blueprint', 'Ingested Documents', 'Payment Ledger', 'Sector Research'].map(link => (
                  <button key={link} className="w-full p-5 bg-slate-50 rounded-[1.5rem] text-left hover:bg-primary/5 group transition-all border border-transparent hover:border-primary/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-600 uppercase tracking-widest group-hover:text-primary transition-colors">{link}</span>
                      <ChevronLeft size={16} className="rotate-180 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
