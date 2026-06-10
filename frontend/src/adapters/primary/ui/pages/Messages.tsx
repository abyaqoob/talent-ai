import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Send, User, Search, Loader2 } from 'lucide-react';
import { AppLayout } from '@/adapters/primary/ui/components/layout/AppLayout';
import { Input } from '@/adapters/primary/ui/components/base/input';
import { Button } from '@/adapters/primary/ui/components/base/button';
import { useAuth } from '@/presentation/hooks/useAuth';
import { apiClient, SOCKET_BASE } from '@/infrastructure/api/apiClient';
import { io, Socket } from 'socket.io-client';

interface Message {
  _id: string;
  senderId: string;
  recipientId: string;
  senderName?: string;
  recipientName?: string;
  content: string;
  createdAt: string;
}

export default function Messages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<{ id: string, name: string, lastMessage: string, unread: boolean, date: string }[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    const fetchMessages = async () => {
      try {
        const res = await apiClient.get<Message[]>('/messages');
        const allMessages = res.data || res;
        setMessages(allMessages);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();

    // Setup Socket.io
    socketRef.current = io(SOCKET_BASE);
    socketRef.current.on('connect', () => {
      console.log('Connected to socket server');
      socketRef.current?.emit('join', user.id);
    });

    socketRef.current.on('receive_message', (msg: Message) => {
      setMessages(prev => {
        // Prevent duplicate if we just sent it and it already propagated through REST
        if (prev.find(m => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user]);

  // Derived conversations list based on messages
  useEffect(() => {
    if (!user) return;
    const grouped = new Map<string, Message[]>();
    messages.forEach((msg: Message) => {
      const otherId = msg.senderId === user.id ? msg.recipientId : msg.senderId;
      if (!grouped.has(otherId)) grouped.set(otherId, []);
      grouped.get(otherId)!.push(msg);
    });
    
    const convos = Array.from(grouped.entries()).map(([contactId, msgs]) => {
      const sorted = msgs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      const lastMsg = sorted[sorted.length - 1];
      
      let contactName = `Contact ${contactId.substring(contactId.length - 4)}`;
      let contactProfilePicture = '';
      const msgWithName = msgs.find(m => 
        (m.senderId === contactId && m.senderName) || 
        (m.recipientId === contactId && m.recipientName)
      );

      if (msgWithName) {
        if (msgWithName.senderId === contactId) {
          contactName = msgWithName.senderName!;
          contactProfilePicture = (msgWithName as any).senderProfilePicture || '';
        } else if (msgWithName.recipientId === contactId) {
          contactName = msgWithName.recipientName!;
          contactProfilePicture = (msgWithName as any).recipientProfilePicture || '';
        }
      }

      return {
        id: contactId,
        name: contactName, 
        profilePicture: contactProfilePicture,
        lastMessage: lastMsg.content,
        unread: false,
        date: new Date(lastMsg.createdAt).toLocaleDateString()
      };
    });
    convos.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setConversations(convos);
  }, [messages, user]);

  // Scroll to bottom when active messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChatId]);

  // Derived state for the active chat
  const activeChatMessages = messages
    .filter(m => (m.senderId === user?.id && m.recipientId === activeChatId) || (m.senderId === activeChatId && m.recipientId === user?.id))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatId || !user) return;

    try {
      const res = await apiClient.post<Message>('/messages', {
        recipientId: activeChatId,
        content: newMessage.trim()
      });
      const sentMsg = res.data || res;
      setNewMessage('');
      
      // Update state locally (the socket event to ourselves will also fire, so we handle dupes in receive_message)
      setMessages(prev => [...prev.filter(m => m._id !== sentMsg._id), sentMsg]);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <AppLayout sidebarType={user?.role as 'candidate' | 'recruiter' | 'admin'}>
      <div className="max-w-7xl mx-auto h-[calc(100vh-120px)] flex flex-col">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-6">
          <h1 className="text-3xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Messages</h1>
        </motion.div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-0">
          {/* Left Sidebar - Chat List */}
          <div className="md:col-span-1 rounded-2xl flex flex-col overflow-hidden" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
            <div className="p-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <Input placeholder="Search messages..." className="pl-9 w-full border-transparent" style={{ background: 'var(--bg-tertiary)' }} />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--text-muted)' }} /></div>
              ) : conversations.length === 0 ? (
                <div className="text-center p-8 text-sm" style={{ color: 'var(--text-muted)' }}>No messages yet</div>
              ) : (
                conversations.map(chat => (
                  <button
                    key={chat.id}
                    onClick={() => setActiveChatId(chat.id)}
                    className="w-full text-left p-4 transition-colors flex items-start gap-3"
                    style={{ 
                      background: activeChatId === chat.id ? 'var(--bg-tertiary)' : 'transparent',
                      borderLeft: activeChatId === chat.id ? '3px solid var(--accent-primary)' : '3px solid transparent',
                      borderBottom: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden text-white font-medium border border-[var(--border-subtle)]" style={{ background: 'var(--bg-primary)' }}>
                      {chat.profilePicture ? (
                        <img src={chat.profilePicture} alt={chat.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>{chat.name}</span>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{chat.date}</span>
                      </div>
                      <p className="text-sm truncate" style={{ color: chat.unread ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: chat.unread ? 600 : 400 }}>
                        {chat.lastMessage}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right Window - Chat Area */}
          <div className="md:col-span-2 rounded-2xl flex flex-col overflow-hidden" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
            {activeChatId ? (
              <>
                {/* Chat Header */}
                <div className="p-4 flex items-center gap-3" style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-tertiary)' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden text-white border border-[var(--border-subtle)]" style={{ background: 'var(--bg-primary)' }}>
                    {conversations.find(c => c.id === activeChatId)?.profilePicture ? (
                      <img src={conversations.find(c => c.id === activeChatId)?.profilePicture} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      {conversations.find(c => c.id === activeChatId)?.name || `Contact ${activeChatId.substring(activeChatId.length - 4)}`}
                    </h3>
                  </div>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {activeChatMessages.map(msg => {
                    const isMine = msg.senderId === user?.id;
                    return (
                      <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div 
                          className={`max-w-[70%] p-3 rounded-2xl text-sm ${isMine ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
                          style={{
                            background: isMine ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                            color: isMine ? 'white' : 'var(--text-primary)',
                            border: isMine ? 'none' : '1px solid var(--border-subtle)'
                          }}
                        >
                          <p>{msg.content}</p>
                          <span className={`text-[10px] mt-1 block opacity-70`} style={{ textAlign: isMine ? 'right' : 'left' }}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4" style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-primary)' }}>
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input 
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      placeholder="Type a message..." 
                      className="flex-1"
                    />
                    <Button type="submit" variant="gradient" disabled={!newMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center" style={{ color: 'var(--text-muted)' }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: 'var(--bg-tertiary)' }}>
                  <User className="w-8 h-8 opacity-50" />
                </div>
                <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Your Messages</h3>
                <p className="text-sm max-w-sm">Select a conversation from the sidebar to start chatting.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
