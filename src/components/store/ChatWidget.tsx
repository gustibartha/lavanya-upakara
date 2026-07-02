"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import Link from "next/link";
import { products } from "@/lib/data";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  recommendations?: any[];
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Om Swastyastu 🙏 Ada yang bisa saya bantu untuk keperluan sembahyang Anda hari ini? (Misal: 'Butuh banten Kuningan')",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const simulateResponse = (text: string) => {
    const lowerText = text.toLowerCase();
    let responseContent = "Mohon maaf, saya belum memahami permintaan Anda. Bisa dicoba dengan menyebutkan hari raya atau jenis banten yang dicari?";
    let recommendations: any[] = [];

    // Simple Rule-based matching
    if (lowerText.includes("kuningan")) {
      responseContent = "Untuk perayaan Hari Raya Kuningan, kami merekomendasikan perlengkapan persembahyangan ini untuk Anda. Rahajeng Kuningan!";
      recommendations = products.filter(p => 
        p.id === "prod-3" || // Banten Pejati
        p.id === "prod-4" || // Canang Gede
        p.id === "prod-13"   // Bokor Kuningan
      );
    } else if (lowerText.includes("galungan")) {
      responseContent = "Untuk perayaan Hari Raya Galungan yang suci, kami memiliki paket khusus sesajen Galungan yang sangat lengkap. Rahajeng Galungan!";
      recommendations = products.filter(p => 
        p.id === "prod-5" || // Sesajen Galungan Komplit
        p.id === "prod-11"   // Buah Sesajen Komplit
      );
    } else if (lowerText.includes("purnama") || lowerText.includes("tilem")) {
      responseContent = "Untuk persembahyangan Purnama/Tilem, kami merekomendasikan perlengkapan berikut ini:";
      recommendations = products.filter(p => 
        p.id === "prod-3" || // Banten Pejati
        p.id === "prod-6" || // Dupa Harum
        p.id === "prod-1"    // Canang harian
      );
    } else if (lowerText.includes("sehari") || lowerText.includes("harian") || lowerText.includes("canang")) {
      responseContent = "Tentu, untuk persembahyangan sehari-hari, ini pilihan terbaik kami:";
      recommendations = products.filter(p => 
        p.id === "prod-1" || // Canang Sari
        p.id === "prod-6" || // Dupa Harum Pandan
        p.id === "prod-2"    // Canang ceper
      );
    } else if (lowerText.includes("pakaian") || lowerText.includes("baju") || lowerText.includes("kain") || lowerText.includes("udeng")) {
      responseContent = "Untuk pakaian adat persembahyangan, kami merekomendasikan perlengkapan elegan ini:";
      recommendations = products.filter(p => 
        p.id === "prod-17" || // Kebaya
        p.id === "prod-18" || // Udeng
        p.id === "prod-19" || // Kamen
        p.id === "prod-20"    // Selendang
      );
    }

    return { content: responseContent, recommendations };
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate network delay for realism
    setTimeout(() => {
      const { content, recommendations } = simulateResponse(userMsg.content);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content,
        recommendations: recommendations.length > 0 ? recommendations : undefined,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
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
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-bubble-wrapper ${msg.role === 'user' ? 'user' : 'assistant'}`}>
                {msg.role === 'assistant' && (
                  <div className="chat-avatar bg-kunyit/20 text-kunyit"><Bot size={16} /></div>
                )}
                <div className="chat-bubble-content">
                  <div className={`chat-bubble ${msg.role === 'user' ? 'bg-[#B84A2A] text-white' : 'bg-gray-100 text-[#1C1917]'}`}>
                    {msg.content}
                  </div>
                  
                  {/* Recommendations */}
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="chat-recommendations">
                      {msg.recommendations.map(prod => (
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
            ))}
            
            {isTyping && (
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

          <div className="chat-footer">
            <input
              type="text"
              placeholder="Tanya perlengkapan sembahyang..."
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={handleSend} className="chat-send-btn" disabled={!input.trim() || isTyping}>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
