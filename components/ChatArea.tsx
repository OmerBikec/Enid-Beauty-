import React, { useState, useRef, useEffect } from 'react';
import { Send, ImagePlus, X, Loader2, Paperclip, Bot, User } from 'lucide-react';
import { Message, MessageRole, Attachment } from '../types';
import { streamChatResponse } from '../services/gemini';

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.role === MessageRole.USER;
  
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`flex max-w-[80%] md:max-w-[70%] gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
         
         <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-indigo-100 text-indigo-600' : 'bg-teal-100 text-teal-600'}`}>
            {isUser ? <User size={18} /> : <Bot size={18} />}
         </div>

         <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
            {message.attachments && message.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2 justify-end">
                    {message.attachments.map((att, idx) => (
                        <img 
                          key={idx} 
                          src={att.previewUrl} 
                          alt="attachment" 
                          className="h-32 w-32 object-cover rounded-xl border border-gray-200" 
                        />
                    ))}
                </div>
            )}
            
            <div className={`px-5 py-3.5 md:px-6 md:py-4 rounded-2xl text-sm md:text-base leading-relaxed shadow-sm ${
                isUser 
                ? 'bg-indigo-600 text-white rounded-tr-sm' 
                : 'bg-white text-slate-700 border border-gray-100 rounded-tl-sm'
            }`}>
                <div className="whitespace-pre-wrap">{message.text}</div>
            </div>
            {message.isError && <span className="text-xs text-red-500 mt-1 font-bold">İletilemedi</span>}
         </div>
      </div>
    </div>
  );
};

export const ChatArea: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: MessageRole.MODEL,
      text: "**Merhaba!** 👋\n\nSize kliniğimiz hakkında nasıl yardımcı olabilirim?",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        
        setAttachments(prev => [...prev, {
          mimeType: file.type,
          data: base64Data,
          previewUrl: base64String 
        }]);
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!input.trim() && attachments.length === 0) || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      text: input,
      attachments: [...attachments],
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setAttachments([]);
    setIsLoading(true);

    const modelMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: modelMessageId,
      role: MessageRole.MODEL,
      text: '',
      timestamp: Date.now()
    }]);

    try {
      await streamChatResponse(messages, userMessage.text, userMessage.attachments || [], (textChunk) => {
        setMessages(prev => prev.map(msg => 
          msg.id === modelMessageId ? { ...msg, text: textChunk } : msg
        ));
      });
    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.id === modelMessageId ? { ...msg, text: "Üzgünüm, bir hata oluştu.", isError: true } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-full relative z-10">
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 pb-48 custom-scrollbar pt-8">
        <div className="max-w-3xl mx-auto w-full space-y-8">
            {messages.map(msg => (
                <ChatMessage key={msg.id} message={msg} />
            ))}
            
            {isLoading && (
                <div className="flex justify-start w-full animate-fade-in pl-14">
                    <div className="bg-white rounded-2xl rounded-tl-none px-5 py-3 shadow-sm border border-slate-100 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Floating Input */}
      <div className="absolute bottom-6 left-0 right-0 px-4 flex justify-center pointer-events-none">
        <div className="max-w-3xl w-full pointer-events-auto flex flex-col items-center">
            
            {attachments.length > 0 && (
                <div className="flex gap-3 p-3 bg-white rounded-2xl mb-3 w-full shadow-lg border border-slate-100 animate-slide-up mx-auto">
                {attachments.map((att, i) => (
                    <div key={i} className="relative group shrink-0">
                    <img src={att.previewUrl} alt="upload" className="h-14 w-14 object-cover rounded-xl" />
                    <button 
                        onClick={() => removeAttachment(i)}
                        className="absolute -top-2 -right-2 bg-slate-900 text-white rounded-full p-1 shadow-md hover:scale-110 transition-transform"
                    >
                        <X size={10} />
                    </button>
                    </div>
                ))}
                </div>
            )}

            <div className="w-full glass-panel rounded-[2rem] p-2 flex items-end gap-2 shadow-2xl shadow-slate-200/50 bg-white/90">
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all shrink-0"
                >
                    <Paperclip size={20} />
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileSelect}
                />
                
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Bir şeyler sorun..."
                    className="flex-1 bg-transparent text-slate-800 placeholder-slate-400 resize-none focus:outline-none max-h-32 py-3.5 px-2 text-base font-medium"
                    rows={1}
                />

                <button 
                    onClick={() => handleSubmit()}
                    disabled={isLoading || (!input.trim() && attachments.length === 0)}
                    className={`w-12 h-12 rounded-[1.5rem] flex items-center justify-center transition-all duration-300 shrink-0 ${
                        isLoading || (!input.trim() && attachments.length === 0)
                        ? 'bg-slate-100 text-slate-300'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:scale-105 active:scale-95'
                    }`}
                >
                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className={input.trim() ? 'translate-x-0.5' : ''} />}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};