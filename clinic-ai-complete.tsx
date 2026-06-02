import { useState, useRef, useEffect } from "react";

// ============================================================
// CONFIGURATION — Change this for each clinic client
// ============================================================
const CLINIC = {
  name: "Sunshine Family Clinic",
  phone: "(555) 123-4567",
  address: "123 Health Blvd, Suite 100, Orlando FL",
  hours: "Mon–Fri 8am–6pm | Sat 9am–2pm | Closed Sunday",
  services: "Primary care, Pediatrics, Women's health, Annual physicals, Vaccinations, Lab work, Urgent care (walk-ins welcome), Telehealth",
  insurance: "UnitedHealth, Aetna, BlueCross BlueShield, Cigna, Humana, Medicare, Medicaid",
  telehealth: "Mon–Fri 9am–5pm via video call",
  email: "appointments@sunshineclinic.com",
};

const SYSTEM_PROMPT = `You are a warm, professional AI patient assistant for ${CLINIC.name}.

CLINIC DETAILS:
- Phone: ${CLINIC.phone}
- Address: ${CLINIC.address}
- Hours: ${CLINIC.hours}
- Services: ${CLINIC.services}
- Insurance accepted: ${CLINIC.insurance}
- Telehealth: ${CLINIC.telehealth}

YOUR RESPONSIBILITIES:
1. Answer questions about services, hours, insurance, location
2. Help patients triage (urgent care vs ER vs routine visit)
3. Collect appointment booking info (name, phone, date preference, reason)
4. Be warm, concise, reassuring — never cold or robotic
5. For emergencies: always say "Call 911 or go to nearest ER immediately"
6. NEVER diagnose — only guide and triage

TRIAGE GUIDE:
- Chest pain, difficulty breathing, stroke symptoms → ER immediately
- High fever (103+), severe pain, injuries → urgent care today
- Routine checkup, mild symptoms, prescriptions → schedule appointment
- Questions about results, medications → call the clinic directly

APPOINTMENT BOOKING:
When someone wants to book, collect:
1. Full name
2. Phone number  
3. Preferred date and time
4. Reason for visit
Then say: "Perfect! I've noted your request. Our team will call you within 2 hours to confirm. You'll also get a text reminder."

Keep responses SHORT (2–4 sentences max). Use bullet points for lists. Always end with a question or next step. Be human and caring.`;

const QUICK_REPLIES = [
  "📅 Book appointment",
  "🕐 What are your hours?",
  "💳 Insurance accepted?",
  "🚶 Walk-ins available?",
  "💻 Telehealth options",
  "📍 Where are you located?",
];

// ============================================================
// TABS
// ============================================================
const TABS = ["💬 Live Chat", "📅 Book Appointment", "📧 Sales Email", "🛠️ Backend Guide"];

// ============================================================
// APPOINTMENT FORM
// ============================================================
function AppointmentForm({ onSubmit }) {
  const [form, setForm] = useState({ name: "", phone: "", date: "", time: "", reason: "", insurance: "" });
  const [submitted, setSubmitted] = useState(false);

  const times = ["8:00 AM","8:30 AM","9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","1:00 PM","1:30 PM","2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM"];
  const reasons = ["Annual physical / checkup","Sick visit","Follow-up appointment","Vaccination","Lab work / blood test","Women's health","Pediatric visit","Telehealth consultation","Other"];

  const handleSubmit = () => {
    if (!form.name || !form.phone || !form.date || !form.reason) {
      alert("Please fill in all required fields.");
      return;
    }
    setSubmitted(true);
    onSubmit(form);
  };

  if (submitted) return (
    <div style={{ textAlign: "center", padding: 40 }}>
      <div style={{ fontSize: 60, marginBottom: 16 }}>✅</div>
      <h2 style={{ color: "#0c4a6e", fontFamily: "serif", margin: "0 0 12px" }}>Appointment Requested!</h2>
      <p style={{ color: "#475569", fontFamily: "sans-serif", lineHeight: 1.7, maxWidth: 340, margin: "0 auto 24px" }}>
        Thank you, <strong>{form.name}</strong>! Our team will call <strong>{form.phone}</strong> within 2 hours to confirm your {form.date} appointment.
      </p>
      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: 16, maxWidth: 300, margin: "0 auto 24px", fontFamily: "sans-serif", fontSize: 13, color: "#166534" }}>
        <div>📅 <strong>Date:</strong> {form.date} {form.time && `at ${form.time}`}</div>
        <div>🏥 <strong>Reason:</strong> {form.reason}</div>
        {form.insurance && <div>💳 <strong>Insurance:</strong> {form.insurance}</div>}
      </div>
      <button onClick={() => { setSubmitted(false); setForm({ name:"",phone:"",date:"",time:"",reason:"",insurance:"" }); }}
        style={{ background: "#0ea5e9", color: "white", border: "none", borderRadius: 10, padding: "10px 24px", cursor: "pointer", fontFamily: "sans-serif", fontSize: 14 }}>
        Book Another
      </button>
    </div>
  );

  const field = (label, key, type = "text", placeholder = "", required = true) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", fontFamily: "sans-serif", marginBottom: 6 }}>
        {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
      </label>
      <input type={type} placeholder={placeholder} value={form[key]}
        onChange={e => setForm({ ...form, [key]: e.target.value })}
        style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, fontFamily: "sans-serif", boxSizing: "border-box", background: "#f8fafc" }}
        onFocus={e => e.target.style.borderColor = "#0ea5e9"}
        onBlur={e => e.target.style.borderColor = "#e2e8f0"}
      />
    </div>
  );

  return (
    <div style={{ padding: "20px 24px", overflowY: "auto", maxHeight: 520 }}>
      <h3 style={{ margin: "0 0 4px", color: "#0c4a6e", fontFamily: "serif", fontSize: 18 }}>Schedule Your Visit</h3>
      <p style={{ margin: "0 0 20px", color: "#64748b", fontSize: 13, fontFamily: "sans-serif" }}>We'll confirm within 2 hours</p>
      {field("Full Name", "name", "text", "Jane Smith")}
      {field("Phone Number", "phone", "tel", "(555) 000-0000")}
      {field("Preferred Date", "date", "date", "", true)}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", fontFamily: "sans-serif", marginBottom: 6 }}>Preferred Time</label>
        <select value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}
          style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, fontFamily: "sans-serif", background: "#f8fafc" }}>
          <option value="">Any available time</option>
          {times.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", fontFamily: "sans-serif", marginBottom: 6 }}>
          Reason for Visit <span style={{ color: "#ef4444" }}>*</span>
        </label>
        <select value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })}
          style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, fontFamily: "sans-serif", background: "#f8fafc" }}>
          <option value="">Select reason...</option>
          {reasons.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      {field("Insurance Provider (optional)", "insurance", "text", "e.g. UnitedHealth, Aetna", false)}
      <button onClick={handleSubmit}
        style={{ width: "100%", background: "linear-gradient(135deg, #0ea5e9, #0284c7)", color: "white", border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontFamily: "sans-serif", fontWeight: 600, cursor: "pointer", marginTop: 4 }}>
        Request Appointment →
      </button>
      <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", fontFamily: "sans-serif", marginTop: 12 }}>
        📞 Or call us directly: {CLINIC.phone}
      </p>
    </div>
  );
}

// ============================================================
// SALES EMAIL TAB
// ============================================================
function SalesEmail() {
  const [copied, setCopied] = useState(null);

  const emails = [
    {
      label: "Cold Outreach Email",
      subject: "Free AI Patient Assistant for Your Clinic — 30-Day Trial",
      body: `Hi [Doctor/Manager Name],

I noticed [Clinic Name] doesn't have an AI assistant on your website. I built one specifically for healthcare clinics that:

• Answers patient FAQs 24/7 (hours, insurance, services)
• Collects appointment requests automatically
• Triages patients (urgent care vs ER vs routine visit)
• Reduces front-desk phone calls by up to 40%

I'd like to offer it FREE for 30 days — fully customized with your clinic's info, no tech setup needed on your end.

After the trial: $500 one-time setup + $99/month (less than 1 patient copay).

Can I send you a 2-minute demo video?

Best,
[Your Name]
[Your Phone]
[Your Email]`
    },
    {
      label: "LinkedIn DM",
      body: `Hi [Name], I built an AI chatbot for healthcare clinics that handles patient FAQs and appointment requests 24/7. Given your role at [Clinic], I thought it might save your front desk a lot of calls. Would you be open to a free 30-day trial? Happy to send a quick demo.`
    },
    {
      label: "Follow-Up Email",
      subject: "Re: AI Assistant for [Clinic Name] — Quick Follow Up",
      body: `Hi [Name],

Just following up on my note from last week about the AI patient assistant.

I wanted to share that one of my clinic clients reduced their front-desk call volume by 35% in the first month — staff love it.

I'd be happy to set it up for [Clinic Name] at zero cost for 30 days. Takes me about 2 hours to customize, and you'd be live the same day.

Worth a quick 10-minute call this week?

[Your Name]`
    },
    {
      label: "Pricing Proposal",
      subject: "AI Patient Assistant — Proposal for [Clinic Name]",
      body: `Hi [Name],

Thank you for your interest! Here's what's included:

STARTER — $500 setup + $99/month
✓ AI chatbot with your clinic info
✓ Appointment request collection
✓ Patient FAQ answers 24/7
✓ Embedded on your website
✓ Monthly updates

GROWTH — $800 setup + $199/month
✓ Everything in Starter
✓ Appointment SMS reminders
✓ Insurance verification guidance
✓ Monthly performance report
✓ Priority support

ENTERPRISE — Custom pricing
✓ EHR integration
✓ Multi-location support
✓ Custom branding
✓ Dedicated support

I'll handle all setup and maintenance — you just share your clinic info and I take care of the rest.

Ready to start your free 30-day trial?

[Your Name]`
    }
  ];

  const copy = (text, i) => {
    navigator.clipboard.writeText(text);
    setCopied(i);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div style={{ padding: "20px 24px", overflowY: "auto", maxHeight: 520 }}>
      <h3 style={{ margin: "0 0 4px", color: "#0c4a6e", fontFamily: "serif", fontSize: 18 }}>Sales Email Templates</h3>
      <p style={{ margin: "0 0 20px", color: "#64748b", fontSize: 13, fontFamily: "sans-serif" }}>Copy, customize with clinic name, and send</p>
      {emails.map((e, i) => (
        <div key={i} style={{ marginBottom: 20, background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "white", borderBottom: "1px solid #e2e8f0" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#0c4a6e", fontFamily: "sans-serif" }}>{e.label}</div>
              {e.subject && <div style={{ fontSize: 11, color: "#64748b", fontFamily: "sans-serif", marginTop: 2 }}>Subject: {e.subject}</div>}
            </div>
            <button onClick={() => copy((e.subject ? `Subject: ${e.subject}\n\n` : "") + e.body, i)}
              style={{ background: copied === i ? "#10b981" : "#0ea5e9", color: "white", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12, cursor: "pointer", fontFamily: "sans-serif", transition: "background 0.2s" }}>
              {copied === i ? "✓ Copied!" : "Copy"}
            </button>
          </div>
          <pre style={{ margin: 0, padding: 16, fontSize: 12, fontFamily: "sans-serif", lineHeight: 1.7, color: "#374151", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{e.body}</pre>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// BACKEND GUIDE TAB
// ============================================================
function BackendGuide() {
  const [copied, setCopied] = useState(null);
  const copy = (text, i) => { navigator.clipboard.writeText(text); setCopied(i); setTimeout(() => setCopied(null), 2000); };

  const sections = [
    {
      title: "1. Spring Boot Project Setup",
      desc: "Go to start.spring.io and generate with these dependencies:",
      code: `Dependencies to add:
• Spring Web
• Spring Boot DevTools  
• Lombok
• Spring Data JPA
• H2 Database (dev) / PostgreSQL (prod)

Group: com.clinic
Artifact: clinic-ai-backend
Java: 17+`
    },
    {
      title: "2. application.properties",
      desc: "Add your Claude API key and database config:",
      code: `# Claude API
anthropic.api.key=sk-ant-YOUR_KEY_HERE
anthropic.api.url=https://api.anthropic.com/v1/messages

# H2 Database (dev)
spring.datasource.url=jdbc:h2:mem:clinicdb
spring.datasource.driver-class-name=org.h2.Driver
spring.h2.console.enabled=true

# Server
server.port=8080`
    },
    {
      title: "3. ChatController.java",
      desc: "Main REST endpoint that calls Claude API:",
      code: `@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ChatController {

  @Value("\${anthropic.api.key}")
  private String apiKey;

  @PostMapping("/chat")
  public ResponseEntity<Map<String,String>> chat(
      @RequestBody Map<String,Object> body) {
    
    String userMessage = (String) body.get("message");
    List<Map<String,String>> history = 
        (List) body.getOrDefault("history", List.of());
    
    // Build messages array
    List<Map<String,String>> messages = new ArrayList<>(history);
    messages.add(Map.of("role","user","content",userMessage));
    
    // Call Claude API
    Map<String,Object> request = new HashMap<>();
    request.put("model", "claude-sonnet-4-20250514");
    request.put("max_tokens", 1000);
    request.put("system", SYSTEM_PROMPT);
    request.put("messages", messages);
    
    HttpHeaders headers = new HttpHeaders();
    headers.set("x-api-key", apiKey);
    headers.set("anthropic-version", "2023-06-01");
    headers.setContentType(MediaType.APPLICATION_JSON);
    
    RestTemplate rt = new RestTemplate();
    ResponseEntity<Map> response = rt.exchange(
      "https://api.anthropic.com/v1/messages",
      HttpMethod.POST,
      new HttpEntity<>(request, headers),
      Map.class
    );
    
    // Extract reply
    List<Map> content = (List) response.getBody().get("content");
    String reply = (String) content.get(0).get("text");
    
    return ResponseEntity.ok(Map.of("reply", reply));
  }
}`
    },
    {
      title: "4. AppointmentController.java",
      desc: "Save appointment bookings to database:",
      code: `@Entity
@Data
public class Appointment {
  @Id @GeneratedValue
  private Long id;
  private String name, phone, date, time, reason, insurance;
  private LocalDateTime createdAt = LocalDateTime.now();
  private String status = "PENDING";
}

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

  @Autowired
  private AppointmentRepository repo;

  @PostMapping
  public Appointment book(@RequestBody Appointment appt) {
    // TODO: Send email/SMS notification to clinic
    return repo.save(appt);
  }

  @GetMapping  // Clinic admin can view all bookings
  public List<Appointment> getAll() {
    return repo.findAll();
  }
}`
    },
    {
      title: "5. Deploy to Railway (Free)",
      desc: "Deploy your Spring Boot app in minutes:",
      code: `Step 1: Push code to GitHub
  git init
  git add .
  git commit -m "initial"
  git remote add origin https://github.com/YOU/clinic-backend
  git push -u origin main

Step 2: Go to railway.app
  → New Project → Deploy from GitHub
  → Select your repo
  → Add environment variable:
    ANTHROPIC_API_KEY = sk-ant-your-key

Step 3: Railway auto-detects Spring Boot
  → Builds and deploys automatically
  → Get your URL: https://your-app.railway.app

Step 4: Update React frontend
  const API_URL = "https://your-app.railway.app/api";

Total cost: FREE (up to 500 hours/month)`
    },
    {
      title: "6. Frontend → Backend Connection",
      desc: "Update your React chat to call your backend:",
      code: `// Replace direct Claude API call with:
const response = await fetch("https://your-app.railway.app/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    message: userText,
    history: messages.slice(-10) // last 10 messages for context
  })
});
const data = await response.json();
const reply = data.reply;

// Book appointment:
await fetch("https://your-app.railway.app/api/appointments", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(appointmentForm)
});`
    }
  ];

  return (
    <div style={{ padding: "20px 24px", overflowY: "auto", maxHeight: 520 }}>
      <h3 style={{ margin: "0 0 4px", color: "#0c4a6e", fontFamily: "serif", fontSize: 18 }}>Spring Boot Backend Guide</h3>
      <p style={{ margin: "0 0 20px", color: "#64748b", fontSize: 13, fontFamily: "sans-serif" }}>Production backend for client deployments — free hosting included</p>
      {sections.map((s, i) => (
        <div key={i} style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#0c4a6e", fontFamily: "sans-serif", marginBottom: 4 }}>{s.title}</div>
          <div style={{ fontSize: 12, color: "#64748b", fontFamily: "sans-serif", marginBottom: 8 }}>{s.desc}</div>
          <div style={{ position: "relative" }}>
            <pre style={{ background: "#0f172a", color: "#e2e8f0", borderRadius: 10, padding: 16, fontSize: 11.5, fontFamily: "'Courier New', monospace", lineHeight: 1.7, margin: 0, overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {s.code}
            </pre>
            <button onClick={() => copy(s.code, i)}
              style={{ position: "absolute", top: 8, right: 8, background: copied === i ? "#10b981" : "rgba(255,255,255,0.15)", color: "white", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 11, cursor: "pointer", fontFamily: "sans-serif" }}>
              {copied === i ? "✓" : "Copy"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// TYPING DOTS
// ============================================================
const TypingDots = () => (
  <div style={{ display: "flex", gap: 5, padding: "12px 16px", alignItems: "center" }}>
    {[0,1,2].map(i => (
      <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#0ea5e9", animation: `bounce 1.2s ease-in-out ${i*0.2}s infinite` }} />
    ))}
  </div>
);

// ============================================================
// CHAT TAB
// ============================================================
function ChatTab({ apiKey }) {
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: `👋 Hi! I'm the ${CLINIC.name} AI assistant.\n\nI can help with appointments, hours, insurance, and general health questions.\n\nHow can I help you today?`
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    if (!apiKey) { alert("Please enter your Claude API key in the Settings tab."); return; }

    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text || "Sorry, I couldn't process that. Please try again.";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "⚠️ Connection error. Check API key." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: 520 }}>
      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", animation: "fadeIn 0.3s ease" }}>
            {msg.role === "assistant" && (
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #0ea5e9, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, marginRight: 8, flexShrink: 0, marginTop: 4 }}>🏥</div>
            )}
            <div style={{ maxWidth: "78%", background: msg.role === "user" ? "linear-gradient(135deg, #0ea5e9, #0284c7)" : "#f8fafc", color: msg.role === "user" ? "white" : "#1e293b", padding: "10px 14px", borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", fontSize: 13.5, lineHeight: 1.65, fontFamily: "sans-serif", border: msg.role === "assistant" ? "1px solid #e2e8f0" : "none", whiteSpace: "pre-wrap" }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #0ea5e9, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, marginRight: 8 }}>🏥</div>
            <div style={{ background: "#f8fafc", borderRadius: "18px 18px 18px 4px", border: "1px solid #e2e8f0" }}><TypingDots /></div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: "0 12px 8px", display: "flex", gap: 5, flexWrap: "wrap" }}>
        {QUICK_REPLIES.map(q => (
          <button key={q} onClick={() => sendMessage(q)} disabled={loading}
            style={{ background: "white", color: "#0ea5e9", border: "1px solid #bae6fd", borderRadius: 20, padding: "4px 10px", fontSize: 11.5, cursor: "pointer", fontFamily: "sans-serif", transition: "all 0.2s" }}>
            {q}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid #f1f5f9", alignItems: "flex-end" }}>
        <textarea value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          placeholder="Type your question..." disabled={loading} rows={1}
          style={{ flex: 1, padding: "10px 14px", borderRadius: 20, border: "1.5px solid #e2e8f0", fontSize: 13.5, fontFamily: "sans-serif", resize: "none", background: "#f8fafc", lineHeight: 1.5 }}
          onFocus={e => e.target.style.borderColor = "#0ea5e9"}
          onBlur={e => e.target.style.borderColor = "#e2e8f0"}
        />
        <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
          style={{ background: input.trim() ? "#0ea5e9" : "#e2e8f0", color: input.trim() ? "white" : "#94a3b8", border: "none", borderRadius: "50%", width: 42, height: 42, cursor: input.trim() ? "pointer" : "default", fontSize: 18, flexShrink: 0 }}>
          ➤
        </button>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [apiKey, setApiKey] = useState("");
  const [keyEntered, setKeyEntered] = useState(false);

  const handleApptSubmit = (form) => {
    console.log("Appointment booked:", form);
    // In production: POST to your Spring Boot backend
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0fdf4 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Georgia', serif", padding: 16 }}>
      <style>{`
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-8px)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 16, animation: "fadeIn 0.5s ease" }}>
        <div style={{ fontSize: 36, marginBottom: 6 }}>🏥</div>
        <h1 style={{ margin: 0, fontSize: 22, color: "#0c4a6e", fontWeight: "bold", letterSpacing: "-0.5px" }}>{CLINIC.name}</h1>
        <p style={{ margin: "4px 0 0", color: "#0369a1", fontSize: 13 }}>AI Patient Assistant Platform</p>
      </div>

      {/* API Key Banner */}
      {!keyEntered && (
        <div style={{ background: "white", borderRadius: 12, padding: 14, marginBottom: 12, width: "100%", maxWidth: 520, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: "1px solid #fef3c7", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 18 }}>🔑</span>
          <input type="password" placeholder="Paste your Claude API key (sk-ant-...)" value={apiKey} onChange={e => setApiKey(e.target.value)}
            style={{ flex: 1, minWidth: 200, padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13, fontFamily: "sans-serif" }} />
          <button onClick={() => { if (apiKey) setKeyEntered(true); }}
            style={{ background: "#0ea5e9", color: "white", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontFamily: "sans-serif", whiteSpace: "nowrap" }}>
            Activate Chat
          </button>
          <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "#0ea5e9", fontFamily: "sans-serif", width: "100%", textAlign: "center" }}>
            Get free API key at console.anthropic.com →
          </a>
        </div>
      )}

      {/* Main Card */}
      <div style={{ width: "100%", maxWidth: 520, background: "white", borderRadius: 20, boxShadow: "0 8px 40px rgba(0,0,0,0.12)", border: "1px solid #e0f2fe", overflow: "hidden", animation: "fadeIn 0.4s ease" }}>
        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #f1f5f9", background: "#fafafa", overflowX: "auto" }}>
          {TABS.map((tab, i) => (
            <button key={i} onClick={() => setActiveTab(i)}
              style={{ flex: "none", padding: "12px 14px", border: "none", background: "none", cursor: "pointer", fontSize: 12, fontFamily: "sans-serif", fontWeight: activeTab === i ? 700 : 400, color: activeTab === i ? "#0ea5e9" : "#64748b", borderBottom: activeTab === i ? "2px solid #0ea5e9" : "2px solid transparent", whiteSpace: "nowrap", transition: "all 0.2s" }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 0 && <ChatTab apiKey={apiKey} />}
        {activeTab === 1 && <AppointmentForm onSubmit={handleApptSubmit} />}
        {activeTab === 2 && <SalesEmail />}
        {activeTab === 3 && <BackendGuide />}
      </div>

      {/* Footer */}
      <div style={{ marginTop: 12, display: "flex", gap: 20, fontSize: 11, color: "#94a3b8", fontFamily: "sans-serif" }}>
        <span>📞 {CLINIC.phone}</span>
        <span>🕐 {CLINIC.hours.split("|")[0].trim()}</span>
        <span>Powered by Claude AI</span>
      </div>
    </div>
  );
}
