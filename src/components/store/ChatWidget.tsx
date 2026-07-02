"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import Link from "next/link";
import { products } from "@/lib/data";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const WELCOME_MSG: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Om Swastyastu 🙏 Ada yang bisa saya bantu untuk keperluan sembahyang Anda hari ini? (Misal: 'Butuh banten Kuningan')",
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MSG]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const parseMessageContent = (content: string) => {
    if (!content) return { cleanText: "", recommendations: [] as typeof products };
    const regex = /\[PROD:([a-zA-Z0-9-]+)\]/g;
    let match;
    const recommendations: typeof products = [];
    while ((match = regex.exec(content)) !== null) {
      const slug = match[1];
      const product = products.find((p) => p.slug === slug);
      if (product) recommendations.push(product);
    }
    const cleanText = content.replace(/\[PROD:([a-zA-Z0-9-]+)\]/g, "").trim();
    return { cleanText, recommendations };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userText = input.trim();
    if (!userText || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: userText,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const history = [...messages, userMsg].filter((m) => m.id !== "welcome").map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok) throw new Error("API error");
      if (!res.body) throw new Error("No stream body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      const assistantId = (Date.now() + 1).toString();

      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "" },
      ]);

      let accumulated = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: accumulated } : m
          )
        );
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: "Maaf, terjadi gangguan. Silakan coba lagi 🙏",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="chat-widget-btn"
        style={{ display: isOpen ? "none" : "flex" }}
        aria-label="Buka Asisten Lavanya"
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window anim-fadeup">
          <div className="chat-header">
            <div className="flex items-center gap-2">
              <div className="chat-header-avatar">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="chat-header-title">Asisten Lavanya</h3>
                <p className="chat-header-subtitle">Siap membantu kebutuhanmu</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.8)", cursor: "pointer" }}
            >
              <X size={20} />
            </button>
          </div>

          <div className="chat-body">
            {messages.map((msg) => {
              const { cleanText, recommendations } = parseMessageContent(msg.content);
              return (
                <div
                  key={msg.id}
                  className="chat-bubble-wrapper"
                  style={{
                    alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                    flexDirection: msg.role === "user" ? "row-reverse" : "row",
                    maxWidth: "85%",
                  }}
                >
                  <div
                    className="chat-avatar"
                    style={{
                      background: msg.role === "user" ? "#e5e7eb" : "rgba(200,105,10,0.15)",
                      color: msg.role === "user" ? "#4b5563" : "#C8690A",
                    }}
                  >
                    {msg.role === "assistant" ? <Bot size={16} /> : <User size={16} />}
                  </div>
                  <div className="chat-bubble-content">
                    <div
                      className="chat-bubble"
                      style={{
                        background: msg.role === "user" ? "#B84A2A" : "#f3f4f6",
                        color: msg.role === "user" ? "#ffffff" : "#1C1917",
                        borderBottomRightRadius: msg.role === "user" ? "4px" : "16px",
                        borderBottomLeftRadius: msg.role === "assistant" ? "4px" : "16px",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {cleanText || (isLoading && msg.role === "assistant" && msg.content === "" ? (
                        <span style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#9ca3af", animation: "bounce 1s infinite" }}></span>
                          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#9ca3af", animation: "bounce 1s 0.2s infinite" }}></span>
                          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#9ca3af", animation: "bounce 1s 0.4s infinite" }}></span>
                        </span>
                      ) : cleanText)}
                    </div>

                    {recommendations.length > 0 && (
                      <div className="chat-recommendations">
                        {recommendations.map((prod) => (
                          <Link
                            href={`/katalog/${prod.slug}`}
                            key={prod.id}
                            className="chat-rec-card"
                          >
                            <img
                              src={prod.image}
                              alt={prod.nama_produk}
                              className="chat-rec-img"
                            />
                            <div className="chat-rec-info">
                              <h4 className="chat-rec-name">{prod.nama_produk}</h4>
                              <span className="chat-rec-price">
                                Rp {prod.harga.toLocaleString("id-ID")}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div
                className="chat-bubble-wrapper"
                style={{ alignSelf: "flex-start", maxWidth: "85%" }}
              >
                <div
                  className="chat-avatar"
                  style={{ background: "rgba(200,105,10,0.15)", color: "#C8690A" }}
                >
                  <Bot size={16} />
                </div>
                <div
                  className="chat-bubble"
                  style={{
                    background: "#f3f4f6",
                    color: "#1C1917",
                    borderBottomLeftRadius: "4px",
                    display: "flex",
                    gap: "4px",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#9ca3af", animation: "bounce 1s infinite" }}></div>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#9ca3af", animation: "bounce 1s 0.2s infinite" }}></div>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#9ca3af", animation: "bounce 1s 0.4s infinite" }}></div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef}></div>
          </div>

          <form onSubmit={handleSubmit} className="chat-footer">
            <input
              type="text"
              placeholder="Tanya perlengkapan sembahyang..."
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              autoFocus
            />
            <button
              type="submit"
              className="chat-send-btn"
              disabled={!input.trim() || isLoading}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
