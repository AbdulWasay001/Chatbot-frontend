import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    {
      sender: "Astrix AI",
      text: "Hello! I’m your AI assistant. How can I help you today?",
      type: "assistant"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, isLoading]);

  const sendMessage = async () => {
    const trimmed = message.trim();
    if (!trimmed || isLoading) return;

    const userMsg = { sender: "You", text: trimmed, type: "user" };
    setChat((prev) => [...prev, userMsg]);
    setMessage("");
    setIsLoading(true);

    try {
      const res = await axios.post("https://chatbot-backend-beta-vert.vercel.app/chat", { message: trimmed });
      const aiMsg = {
        sender: "Astrix AI",
        text: res.data?.reply || "I’m sorry, I couldn’t generate a response.",
        type: "assistant"
      };
      setChat((prev) => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg = {
        sender: "Astrix AI",
        text: "**Error:** Backend connection failed. Please check your server.",
        type: "error"
      };
      setChat((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar (Optional decoration) */}
      <aside className="sidebar">
        <div className="logo">Astrix <span>AI</span></div>
        <button className="new-chat-btn">+ New Chat</button>
        <div className="history-label">Recent Chats</div>
        <div className="history-item">Code Review...</div>
        <div className="history-item">App Logic Help...</div>
      </aside>

      <main className="main-chat">
        <header className="chat-header">
          <div className="header-info">
            <h3>Astrix AI Assistant</h3>
            <p><span className="status-dot"></span> Online</p>
          </div>
          <div className="credits-tag"> Made By Abdul Wasay</div>
        </header>

        <section className="messages-container">
          {chat.map((msg, index) => (
            <div key={index} className={`message-wrapper ${msg.type}`}>
              <div className="avatar">
                {msg.type === "user" ? "U" : "A"}
              </div>
              <div className="message-content">
                <div className="sender-name">{msg.sender}</div>
                <div className="bubble">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="message-wrapper assistant">
              <div className="avatar">A</div>
              <div className="message-content">
                <div className="bubble typing">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </section>

        <footer className="input-area">
          <form className="input-box" onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
            <textarea
              placeholder="Ask me anything..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button type="submit" disabled={!message.trim() || isLoading}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
              </svg>
            </button>
          </form>
          <p className="disclaimer">Astrix AI may provide inaccurate info. Check important facts.</p>
        </footer>
      </main>
    </div>
  );
}

export default App;