import { useState, useRef, useEffect } from "react";

const CLINIC = {
  name: "Sunshine Family Clinic",
  phone: "(555) 123-4567",
  address: "123 Health Blvd, Suite 100, Orlando FL",
  hours: "Mon–Fri 8am–6pm | Sat 9am–2pm | Closed Sunday",
  services: "Primary care, Pediatrics, Women's health, Annual physicals, Vaccinations, Lab work, Urgent care, Telehealth",
  insurance: "UnitedHealth, Aetna, BlueCross, Cigna, Medicare, Medicaid",
};

const SYSTEM_PROMPT = `You are a warm, professional AI patient assistant for ${CLINIC.name}.
Phone: ${CLINIC.phone} | Address: ${CLINIC.address}
Hours: ${CLINIC.hours}
Services: ${CLINIC.services}
Insurance: ${CLINIC.insurance}
Rules:
- Answer questions about services, hours, insurance, appointments
- For emergencies say: "Call 911 or go to nearest ER immediately"
- Never diagnose — only guide
- Keep replies short (2-4 sentences)
- Always end with a helpful question
- Be warm and caring`;

const QUICK_REPLIES = [
  "📅 Book appointment",
  "🕐 What are your hours?",
  "💳 Insurance accepted?",
  "🚶 Walk-ins available?",
  "💻 Telehealth options",
];

const TypingDots = () => (
  <div style={{ display: "flex", gap: 5, padding: "12px 16px", alignItems: "center" }}>
    {[0,1,2].map(i => (
      <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", animation: `bounce 1.2s ease-in-out ${i*0.2}s infinite` }} />
    ))}
  </div>
);

export default function App() {
  const [apiKey, setApiKey] = useState("");
  const [activated, setActivated] = useState(false);
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: `👋 Hi! I'm the ${CLINIC.name} AI assistant.\n\nI can help with appointments, hours, insurance, and health questions.\n\nHow can I help you today?`
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          max_tokens: 500,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...newMessages.map(m => ({ role: m.role, content: m.content }))
          ]
        })
      });

      const data = await response.json();

      if (data.error) {
        setError(`Error: ${data.error.message}`);
        setMessages(newMessages);
        setLoading(false);
        return;
      }

      const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't process that.";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      setError("Connection failed. Check your API key and internet.");
      setMessages(newMessages);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #f0f9ff 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", padding: 16 }}>
      <style>{`
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-8px)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
      `}</style>

      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 40, marginBottom: 6 }}>🏥</div>
        <h1 style={{ margin: 0, fontSize: 22, color: "#064e3b", letterSpacing: "-0.5px" }}>{CLINIC.name}</h1>
        <p style={{ margin: "4px 0 0", color: "#059669", fontSize: 13 }}>AI Patient Assistant • Powered by OpenAI</p>
      </div>

      {!activated && (
        <div style={{ background: "white", borderRadius: 14, padding: 16, marginBottom: 14, width: "100%", maxWidth: 500, boxShadow: "0 2px 16px rgba(0,0,0,0.08)", border: "1px solid #a7f3d0" }}>
          <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 700, color: "#064e3b", fontFamily: "sans-serif" }}>
            🔑 Paste your OpenAI API key (starts with sk-)
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <input type="password" placeholder="sk-..." value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1.5px solid #d1fae5", fontSize: 13, fontFamily: "sans-serif", background: "#f0fdf4" }}
            />
            <button onClick={() => { if (apiKey.length > 10) { setActivated(true); setError(""); } else { setError("Please paste your full API key"); } }}
              style={{ background: "#10b981", color: "white", border: "none", borderRadius: 10, padding: "10px 20px", cursor: "pointer", fontSize: 13, fontFamily: "sans-serif", fontWeight: 600 }}>
              Activate
            </button>
          </div>
          {error && <p style={{ margin: "10px 0 0", fontSize: 12, color: "#ef4444", fontFamily: "sans-serif" }}>{error}</p>}
        </div>
      )}

      <div style={{ width: "100%", maxWidth: 500, background: "white", borderRadius: 20, boxShadow: "0 8px 40px rgba(0,0,0,0.1)", border: "1px solid #d1fae5", overflow: "hidden" }}>
        <div style={{ background: activated ? "#10b981" : "#f59e0b", padding: "8px 16px", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "white" }} />
          <span style={{ color: "white", fontSize: 12, fontFamily: "sans-serif", fontWeight: 600 }}>
            {activated ? "✅ AI Active — Powered by OpenAI" : "⚠️ Enter API key to activate"}
          </span>
        </div>

        <div style={{ height: 380, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", animation: "fadeIn 0.3s ease" }}>
              {msg.role === "assistant" && (
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #10b981, #059669)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, marginRight: 8, flexShrink: 0, marginTop: 4 }}>🏥</div>
              )}
              <div style={{ maxWidth: "78%", background: msg.role === "user" ? "linear-gradient(135deg, #10b981, #059669)" : "#f8fafc", color: msg.role === "user" ? "white" : "#1e293b", padding: "10px 14px", borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", fontSize: 13.5, lineHeight: 1.65, fontFamily: "sans-serif", border: msg.role === "assistant" ? "1px solid #e2e8f0" : "none", whiteSpace: "pre-wrap" }}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #10b981, #059669)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, marginRight: 8 }}>🏥</div>
              <div style={{ background: "#f8fafc", borderRadius: "18px 18px 18px 4px", border: "1px solid #e2e8f0" }}><TypingDots /></div>
            </div>
          )}
          {error && activated && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#ef4444", fontFamily: "sans-serif" }}>
              ⚠️ {error}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div style={{ padding: "0 12px 8px", display: "flex", gap: 5, flexWrap: "wrap" }}>
          {QUICK_REPLIES.map(q => (
            <button key={q} onClick={() => sendMessage(q)} disabled={loading || !activated}
              style={{ background: "white", color: "#10b981", border: "1px solid #a7f3d0", borderRadius: 20, padding: "4px 10px", fontSize: 11.5, cursor: activated ? "pointer" : "not-allowed", fontFamily: "sans-serif", opacity: activated ? 1 : 0.5 }}>
              {q}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid #f1f5f9", alignItems: "flex-end" }}>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder={activated ? "Type your question..." : "Activate chatbot first..."}
            disabled={loading || !activated} rows={1}
            style={{ flex: 1, padding: "10px 14px", borderRadius: 20, border: "1.5px solid #e2e8f0", fontSize: 13.5, fontFamily: "sans-serif", resize: "none", background: "#f8fafc", lineHeight: 1.5 }}
            onFocus={e => e.target.style.borderColor = "#10b981"}
            onBlur={e => e.target.style.borderColor = "#e2e8f0"}
          />
          <button onClick={() => sendMessage()} disabled={loading || !input.trim() || !activated}
            style={{ background: input.trim() && activated ? "#10b981" : "#e2e8f0", color: input.trim() && activated ? "white" : "#94a3b8", border: "none", borderRadius: "50%", width: 42, height: 42, cursor: "pointer", fontSize: 18, flexShrink: 0 }}>
            ➤
          </button>
        </div>
      </div>

      <p style={{ marginTop: 10, fontSize: 11, color: "#94a3b8", fontFamily: "sans-serif", textAlign: "center" }}>
        📞 {CLINIC.phone} • AI powered by OpenAI GPT
      </p>
    </div>
  );
}
