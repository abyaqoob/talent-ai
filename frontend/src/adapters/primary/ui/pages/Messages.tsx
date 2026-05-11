import { motion } from 'motion/react';
import { Send, MessageSquare, User } from 'lucide-react';
import { AppLayout } from '@/adapters/primary/ui/components/layout/AppLayout';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/presentation/hooks/useAuth';
import { apiClient } from '@/infrastructure/api/apiClient';

interface MessageItem {
  _id?: string;
  id?: string;
  senderId: string;
  receiverId: string;
  content: string;
  subject?: string;
  createdAt?: string;
  read?: boolean;
}

interface Conversation {
  userId: string;
  name: string;
  email: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
}

function getIdFromMsg(msg: MessageItem) { return msg._id || msg.id || ''; }

export default function Messages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.id) loadMessages();
  }, [user?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedConvId]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<any[]>('/messages');
      const msgs: MessageItem[] = Array.isArray(data) ? data : [];
      setMessages(msgs);
      buildConversations(msgs);
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const buildConversations = (msgs: MessageItem[]) => {
    if (!user?.id) return;
    const convMap = new Map<string, Conversation>();
    msgs.forEach(msg => {
      const otherId = msg.senderId === user.id ? msg.receiverId : msg.senderId;
      if (!convMap.has(otherId)) {
        convMap.set(otherId, {
          userId: otherId,
          name: otherId.slice(0, 8) + '…',
          email: '',
          lastMessage: msg.content,
          lastTime: msg.createdAt || '',
          unread: (!msg.read && msg.senderId !== user.id) ? 1 : 0,
        });
      } else {
        const conv = convMap.get(otherId)!;
        if (!msg.read && msg.senderId !== user.id) conv.unread++;
        conv.lastMessage = msg.content;
        conv.lastTime = msg.createdAt || '';
      }
    });
    setConversations(Array.from(convMap.values()));
  };

  const getConvMessages = () => {
    if (!selectedConvId || !user?.id) return [];
    return messages.filter(m =>
      (m.senderId === user.id && m.receiverId === selectedConvId) ||
      (m.senderId === selectedConvId && m.receiverId === user.id)
    );
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConvId || sending) return;
    setSending(true);
    try {
      const sent = await apiClient.post<any>('/messages', {
        recipientId: selectedConvId,
        content: newMessage.trim(),
        subject: 'Message',
      });
      const msgItem: MessageItem = {
        ...sent,
        senderId: user?.id || '',
        receiverId: selectedConvId,
        content: newMessage.trim(),
        createdAt: new Date().toISOString(),
        read: true,
      };
      setMessages(prev => [...prev, msgItem]);
      setNewMessage('');
    } catch (e: any) {
      alert(e?.message || 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  const convMessages = getConvMessages();

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto flex gap-0 rounded-2xl overflow-hidden" style={{ height: 'calc(100vh - 160px)', border: '1px solid var(--border-subtle)' }}>
        {/* Conversation List */}
        <div className="w-80 shrink-0 flex flex-col" style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-subtle)' }}>
          <div className="p-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Messages</h2>
          </div>

          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: 'var(--bg-tertiary)' }} />)}
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <MessageSquare className="w-12 h-12 mb-3" style={{ color: 'var(--text-muted)' }} />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No messages yet</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {conversations.map(conv => (
                <button key={conv.userId} onClick={() => setSelectedConvId(conv.userId)}
                  className="w-full p-4 text-left transition-all"
                  style={{ background: selectedConvId === conv.userId ? 'var(--bg-tertiary)' : 'transparent', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: 'linear-gradient(135deg,#047857,#059669)' }}>
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{conv.name}</p>
                        {conv.unread > 0 && (
                          <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs text-white shrink-0"
                            style={{ background: 'var(--accent-primary)' }}>{conv.unread}</span>
                        )}
                      </div>
                      <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{conv.lastMessage}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Message Thread */}
        <div className="flex-1 flex flex-col" style={{ background: 'var(--bg-primary)' }}>
          {!selectedConvId ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <MessageSquare className="w-16 h-16 mb-4" style={{ color: 'var(--text-muted)' }} />
              <p style={{ color: 'var(--text-muted)' }}>Select a conversation to start messaging</p>
            </div>
          ) : (
            <>
              <div className="p-4" style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)' }}>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Conversation with {selectedConvId.slice(0, 12)}…</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {convMessages.map(msg => {
                  const isMe = msg.senderId === user?.id;
                  return (
                    <div key={getIdFromMsg(msg)} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className="max-w-xs px-4 py-2.5 rounded-2xl text-sm"
                        style={{
                          background: isMe ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                          color: isMe ? 'white' : 'var(--text-primary)',
                          borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        }}>
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
                {convMessages.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No messages yet. Start the conversation!</p>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
              <div className="p-4 flex gap-3" style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)' }}>
                <input value={newMessage} onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder="Type a message…" className="flex-1 px-4 py-2.5 rounded-xl text-sm focus:outline-none"
                  style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }} />
                <button onClick={handleSend} disabled={sending || !newMessage.trim()}
                  className="w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-40"
                  style={{ background: 'var(--accent-primary)', color: 'white' }}>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
