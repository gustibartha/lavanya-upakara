"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import Link from "next/link";
import { products } from "@/lib/data";
import { useChat } from "@ai-sdk/react";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const chatHelper: any = useChat({
    api: "/api/chat",
  } as any);
  
  const { messages, append, isLoading } = chatHelper;
  const [input, setInput] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    // Kirim pesan ke API chat
    if (append) {
      append({ role: "user", content: input });
    }
    setInput("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Fungsi untuk mem-parsing teks dari AI dan mengekstrak rekomendasi produk [PROD:slug]
  const parseMessageContent = (content: string) => {
    if (!content) return { cleanText: "", recommendations: [] };
    const regex = /\[PROD:([a-zA-Z0-9-]+)\]/g;
    let match;
    const recommendations = [];
    
    // Cari semua kode produk dalam teks
    while ((match = regex.exec(content)) !== null) {
      const slug = match[1];
      const product = products.find(p => p.slug === slug);
      if (product) recommendations.push(product);
    }

    // Buang teks [PROD:slug] dari tampilan
    const cleanText = content.replace(/\[PROD:([a-zA-Z0-9-]+)\]/g, "");

    return { cleanText, recommendations };
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`chat-widget-btn ${isOpen ? 'hidden' : 'flex'}`}
        aria-label="Buka Asisten Lavanya"
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window anim-fadeup">
          <div className="chat-header">
            <div className="flex items-center gap-2">
              <div className="chat-header-avatar"><Bot size={20} /></div>
              <div>
                <h3 className="chat-header-title">Asisten Lavanya</h3>
                <p className="chat-header-subtitle">Siap membantu kebutuhanmu</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition">
              <X size={20} />
            </button>
          </div>

          <div className="chat-body">
            {(messages?.length ? messages : [
              {
                id: "welcome",
                role: "assistant",
                content: "Om Swastyastu 🙏 Ada yang bisa saya bantu untuk keperluan sembahyang Anda hari ini? (Misal: 'Butuh banten Kuningan')",
              }
            ]).map((msg: any) => {
              const { cleanText, recommendations } = parseMessageContent(msg.content);
              return (
                <div key={msg.id} className={`chat-bubble-wrapper ${msg.role === 'user' ? 'user' : 'assistant'}`}>
                  {msg.role === 'assistant' && (
                    <div className="chat-avatar bg-kunyit/20 text-kunyit"><Bot size={16} /></div>
                  )}
                  <div className="chat-bubble-content">
                    <div className={`chat-bubble ${msg.role === 'user' ? 'bg-[#B84A2A] text-white' : 'bg-gray-100 text-[#1C1917]'}`} style={{ whiteSpace: "pre-wrap" }}>
                      {cleanText}
                    </div>
                    
                    {/* Recommendations Card */}
                    {recommendations.length > 0 && (
                      <div className="chat-recommendations">
                        {recommendations.map(prod => (
                          <Link href={`/katalog/${prod.slug}`} key={prod.id} className="chat-rec-card">
                            <img src={prod.image} alt={prod.nama_produk} className="chat-rec-img" />
                            <div className="chat-rec-info">
                              <h4 className="chat-rec-name">{prod.nama_produk}</h4>
                              <span className="chat-rec-price">Rp {prod.harga.toLocaleString('id-ID')}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="chat-avatar bg-gray-200 text-gray-600"><User size={16} /></div>
                  )}
                </div>
              );
            })}
            
            {isLoading && messages?.length > 0 && messages[messages.length - 1]?.role === 'user' && (
              <div className="chat-bubble-wrapper assistant">
                <div className="chat-avatar bg-kunyit/20 text-kunyit"><Bot size={16} /></div>
                <div className="chat-bubble bg-gray-100 text-[#1C1917] flex gap-1 items-center px-4 py-3">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: "0.2s"}}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: "0.4s"}}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="chat-footer">
            <input
              type="text"
              placeholder="Tanya perlengkapan sembahyang..."
              className="chat-input"
              value={input || ""}
              onChange={handleInputChange}
            />
            <button type="submit" className="chat-send-btn" disabled={!input?.trim() || isLoading}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
