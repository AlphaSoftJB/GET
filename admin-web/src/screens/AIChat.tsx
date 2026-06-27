import React, { useState, useEffect, useRef, useCallback } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { C, DT } from "../tokens";
import { AnimatedCounter, FadeIn, Badge, Btn, StatCard, ChartCard, Breadcrumb, PageHeader, Modal, AllergenPieChart, DataTable, Pagination, Toggle, Input, Select, AlertBanner, Spinner, AdminProgressBar, AdminTooltip, CheckboxInput, RadioGroup, AdminTextarea } from "../components/Shared";
import { exportToCSV } from "../utils";
import { userGrowthData, topProducts, allergenData, expirationTimeline, categoryData, alertsData, USERS, REPORTS, LIVE_EVENTS } from "../data";
import { useLiveFeed } from "../hooks";

const SUGGESTED_QUESTIONS = [
  "How do I set up health profile?","How does barcode scanning work?",
  "Can I export my inventory data?","How are expiry alerts calculated?",
  "What allergens are tracked?","How to compare prices?",
];

const CANNED_ANSWERS = {
  "How do I set up health profile?": "To set up your health profile: go to **Profile → Health Profile**, then add your allergens, dietary restrictions, and health conditions. This enables personalized alerts and recommendations.",
  "How does barcode scanning work?": "The barcode scanner uses your device camera to read product barcodes. Simply tap **Scan Item**, point at the barcode, and the app auto-detects the product, nutritional info, and allergens from our database.",
  "Can I export my inventory data?": "Yes! Go to **Analytics → Export** or **Reports** to download your inventory as CSV or Excel. You can also export individual reports from the Analytics and Inventory screens.",
  "How are expiry alerts calculated?": "Expiry alerts are based on the expiration date you set when adding items. Items are flagged as **Critical** (≤2 days), **Warning** (3-5 days), and **Fresh** (6+ days).",
  "What allergens are tracked?": "We track 10 major allergens: Peanuts, Tree Nuts, Milk, Eggs, Soy, Wheat, Gluten, Fish, Shellfish, and Sesame. Set your profile to get instant alerts when adding items.",
  "How to compare prices?": "Go to **Price Comparison** in the sidebar. You can search for any item to see prices across Walmart, Kroger, Aldi, and Trader Joe's, plus view price history charts.",
};

export default function AIChatScreen({ theme, reduced }) {
  const [messages, setMessages] = useState([
    { role:"ai", text:"👋 Hi! I'm your GET AI Assistant. I can help with account setup, features, troubleshooting, and more. What can I help you with today?", time:"Just now" }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" }); }, [messages, reduced]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { role:"user", text, time:"Just now" };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const answer = CANNED_ANSWERS[text] || "Thank you for your question! I'm looking that up for you. For complex issues, I can escalate this to a human support agent. Is there anything else I can help with right now?";
      setMessages(m => [...m, { role:"ai", text:answer, time:"Just now" }]);
      setTyping(false);
    }, 1200 + Math.random()*800);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:0, height:"calc(100vh - 120px)", minHeight:500 }}>
      <Breadcrumb items={["Admin","AI Support"]} theme={theme} />
      <PageHeader icon="🤖" title="AI Support Chat" subtitle="Get instant help from our AI assistant" theme={theme}
        action={<Badge color={C.success} bg={C.successSoft}>● Online</Badge>} />

      <div style={{ display:"flex", flexDirection:"column", flex:1, background:theme.card, border:`1.5px solid ${theme.border}`, borderRadius:12, overflow:"hidden", minHeight:400 }}>
        {/* Chat header */}
        <div style={{ padding:"14px 18px", borderBottom:`1px solid ${theme.border}`, display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:"50%", background:"linear-gradient(135deg,#4F46E5,#7C3AED)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🤖</div>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:theme.text }}>GET AI Assistant</div>
            <div style={{ fontSize:12, color:C.success, fontWeight:600 }}>● Always available</div>
          </div>
          <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
            <Btn variant="secondary" size="sm">📋 Chat History</Btn>
            <Btn variant="secondary" size="sm">👤 Escalate</Btn>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex:1, overflowY:"auto", padding:"16px 18px", display:"flex", flexDirection:"column", gap:12 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display:"flex", gap:10, justifyContent: msg.role==="user" ? "flex-end" : "flex-start", animation:!reduced?"fadeIn 0.25s ease":"none" }}>
              {msg.role === "ai" && <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#4F46E5,#7C3AED)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>🤖</div>}
              <div style={{ maxWidth:"72%", background: msg.role==="user" ? `linear-gradient(135deg,${C.primary},${C.primaryDark})` : theme.hover, color: msg.role==="user" ? "white" : theme.text, borderRadius: msg.role==="user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding:"12px 16px", fontSize:14, lineHeight:1.6, boxShadow:"0 2px 8px rgba(0,0,0,0.08)" }}>
                {msg.text}
                <div style={{ fontSize:11, opacity:0.6, marginTop:6, textAlign: msg.role==="user" ? "right" : "left" }}>{msg.time}</div>
              </div>
              {msg.role === "user" && <div style={{ width:32, height:32, borderRadius:"50%", background:theme.border, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>👤</div>}
            </div>
          ))}
          {typing && (
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#4F46E5,#7C3AED)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🤖</div>
              <div style={{ background:theme.hover, borderRadius:"18px 18px 18px 4px", padding:"12px 16px" }}>
                <div style={{ display:"flex", gap:5, alignItems:"center" }}>
                  {[0,1,2].map(i => <div key={i} style={{ width:7, height:7, borderRadius:"50%", background:theme.textSub, animation:reduced?"none":`dotPulse 1.2s ${i*0.15}s ease-in-out infinite` }} />)}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggested questions */}
        {messages.length <= 2 && (
          <div style={{ padding:"0 18px 12px" }}>
            <div style={{ fontSize:12, fontWeight:700, color:theme.textSub, marginBottom:8 }}>Suggested questions:</div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {SUGGESTED_QUESTIONS.slice(0,4).map(q => (
                <button key={q} onClick={() => sendMessage(q)}
                  style={{ height:30, padding:"0 12px", borderRadius:99, border:`1px solid ${theme.border}`, background:theme.card, cursor:"pointer", fontSize:12, fontWeight:600, color:C.primary, fontFamily:"'Plus Jakarta Sans',sans-serif", transition:"all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background=C.primarySoft; e.currentTarget.style.borderColor=C.primary; }}
                  onMouseLeave={e => { e.currentTarget.style.background=theme.card; e.currentTarget.style.borderColor=theme.border; }}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div style={{ padding:"12px 18px 16px", borderTop:`1px solid ${theme.border}`, display:"flex", gap:10 }}>
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type your question…"
            onKeyDown={e => e.key==="Enter" && !e.shiftKey && sendMessage(input)}
            style={{ flex:1, height:42, padding:"0 14px", border:`1.5px solid ${theme.border}`, borderRadius:10, fontSize:14, background:theme.inputBg, color:theme.text, fontFamily:"'Plus Jakarta Sans',sans-serif", outline:"none" }} />
          <Btn variant="primary" size="md" onClick={() => sendMessage(input)} disabled={!input.trim() || typing} ariaLabel="Send message">Send ↑</Btn>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SUPPORT & FEEDBACK SCREEN — doc: WEB Part 4 Page 4
// ══════════════════════════════════════════════════════════════════════════════
const SUPPORT_TICKETS = [
  {id:"TKT-001",user:"Alice Johnson",  subject:"Barcode scanner not recognizing items", priority:"high",   status:"Open",     created:"Jun 6"},
  {id:"TKT-002",user:"Bob Smith",      subject:"Expiry alerts not sending on iOS 17",   priority:"medium", status:"In Progress",created:"Jun 5"},
  {id:"TKT-003",user:"Carol Davis",    subject:"Dark mode doesn't persist after restart",priority:"low",   status:"Resolved",  created:"Jun 4"},
  {id:"TKT-004",user:"David Lee",      subject:"Request: Family sharing feature",        priority:"low",   status:"Open",      created:"Jun 3"},
  {id:"TKT-005",user:"Eve Martinez",   subject:"AI recommendations seem inaccurate",     priority:"medium",status:"Open",      created:"Jun 2"},
];

