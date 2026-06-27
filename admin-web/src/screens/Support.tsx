import React, { useState, useEffect, useRef, useCallback } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { C, DT } from "../tokens";
import { AnimatedCounter, FadeIn, Badge, Btn, StatCard, ChartCard, Breadcrumb, PageHeader, Modal, AllergenPieChart, DataTable, Pagination, Toggle, Input, Select, AlertBanner, Spinner, AdminProgressBar, AdminTooltip, CheckboxInput, RadioGroup, AdminTextarea } from "../components/Shared";
import { exportToCSV } from "../utils";
import { userGrowthData, topProducts, allergenData, expirationTimeline, categoryData, alertsData, USERS, REPORTS, LIVE_EVENTS } from "../data";
import { useLiveFeed } from "../hooks";

const SUPPORT_TICKETS = [
  {id:"TKT-001",user:"Alice Johnson",  subject:"Barcode scanner not recognizing items", priority:"high",   status:"Open",     created:"Jun 6"},
  {id:"TKT-002",user:"Bob Smith",      subject:"Expiry alerts not sending on iOS 17",   priority:"medium", status:"In Progress",created:"Jun 5"},
  {id:"TKT-003",user:"Carol Davis",    subject:"Dark mode doesn't persist after restart",priority:"low",   status:"Resolved",  created:"Jun 4"},
  {id:"TKT-004",user:"David Lee",      subject:"Request: Family sharing feature",        priority:"low",   status:"Open",      created:"Jun 3"},
  {id:"TKT-005",user:"Eve Martinez",   subject:"AI recommendations seem inaccurate",     priority:"medium",status:"Open",      created:"Jun 2"},
];

export default function SupportScreen({ theme, reduced, toast }) {
  const [activeTab, setActiveTab] = useState("tickets");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText]   = useState("");
  const [newFeedback, setFeedback]  = useState({type:"bug",title:"",desc:""});

  const statusColor = s => s==="Open"?"#EF4444":s==="In Progress"?"#F59E0B":"#10B981";
  const statusBg    = s => s==="Open"?C.errorSoft:s==="In Progress"?C.warningSoft:C.successSoft;
  const prioColor   = p => p==="high"?C.error:p==="medium"?C.warning:C.info;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      <Breadcrumb items={["Admin","Support & Feedback"]} theme={theme} />
      <PageHeader icon="🎫" title="Support & Feedback" subtitle="Manage user tickets, bug reports, and feature requests" theme={theme}
        action={<Btn variant="primary" size="sm" onClick={() => toast("New ticket created","success")}>+ New Ticket</Btn>} />

      {/* KPIs */}
      <div className="admin-kpi-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:14 }}>
        <StatCard icon="🎫" title="Open Tickets"   value={3}  trend="2 high priority"   trendUp={false} color={C.error}   delay={0}  reduced={reduced} theme={theme} />
        <StatCard icon="⏳" title="In Progress"    value={1}  trend="Avg 6h response"   trendUp color={C.warning} delay={70} reduced={reduced} theme={theme} />
        <StatCard icon="✅" title="Resolved"       value={47} trend="+12 this week"      trendUp color={C.success} delay={140} reduced={reduced} theme={theme} />
        <StatCard icon="⭐" title="Satisfaction"   value="4.7" trend="+0.2 this month"  trendUp color={C.primary} delay={210} reduced={reduced} theme={theme} />
      </div>

      {/* Tab switcher */}
      <FadeIn delay={280} reduced={reduced}>
        <div style={{ display:"flex", background:theme.card, border:`1.5px solid ${theme.border}`, borderRadius:10, overflow:"hidden", width:"fit-content" }}>
          {[{id:"tickets",label:"🎫 Tickets"},{id:"feedback",label:"💬 Feedback"},{id:"bugs",label:"🐛 Bug Reports"},{id:"features",label:"✨ Feature Requests"}].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ height:38, padding:"0 16px", border:"none", cursor:"pointer", fontSize:13, fontWeight:700, background:activeTab===t.id?C.primary:"transparent", color:activeTab===t.id?"white":theme.textSub, fontFamily:"'Plus Jakarta Sans',sans-serif", transition:"all 0.18s", whiteSpace:"nowrap" }}>
              {t.label}
            </button>
          ))}
        </div>
      </FadeIn>

      {/* Tickets Table */}
      {activeTab === "tickets" && (
        <FadeIn delay={0} reduced={reduced}>
          <div style={{ background:theme.card, border:`1.5px solid ${theme.border}`, borderRadius:12, overflow:"hidden" }}>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", minWidth:500 }}>
                <thead>
                  <tr style={{ background:theme.hover }}>
                    {["ID","User","Subject","Priority","Status","Created","Actions"].map(h => (
                      <th key={h} scope="col" style={{ padding:"11px 14px", textAlign:"left", fontSize:12, fontWeight:700, color:theme.textSub, borderBottom:`1.5px solid ${theme.border}`, whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SUPPORT_TICKETS.map((tk,i) => (
                    <tr key={tk.id} style={{ borderTop:`1px solid ${theme.border}`, transition:"background 0.12s", cursor:"pointer" }}
                      onMouseEnter={e => e.currentTarget.style.background=theme.hover}
                      onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                      <td style={{ padding:"12px 14px", fontSize:12, fontWeight:700, color:theme.textSub }}>{tk.id}</td>
                      <td style={{ padding:"12px 14px", fontSize:13, fontWeight:600, color:theme.text }}>{tk.user}</td>
                      <td style={{ padding:"12px 14px", fontSize:13, color:theme.text, maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{tk.subject}</td>
                      <td style={{ padding:"12px 14px" }}><Badge color={prioColor(tk.priority)}>{tk.priority}</Badge></td>
                      <td style={{ padding:"12px 14px" }}><Badge color={statusColor(tk.status)} bg={statusBg(tk.status)}>{tk.status}</Badge></td>
                      <td style={{ padding:"12px 14px", fontSize:12, color:theme.textSub }}>{tk.created}</td>
                      <td style={{ padding:"12px 14px" }}>
                        <div style={{ display:"flex", gap:6 }}>
                          <Btn variant="secondary" size="sm" onClick={() => { setSelectedTicket(tk); }}>Reply</Btn>
                          <Btn variant="success"   size="sm" onClick={() => toast(`${tk.id} resolved!`)}>Resolve</Btn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Reply panel */}
          {selectedTicket && (
            <div style={{ background:theme.card, border:`1.5px solid ${C.primary}30`, borderRadius:12, padding:20, marginTop:16 }}>
              <div style={{ fontSize:15, fontWeight:700, color:theme.text, marginBottom:4 }}>Reply to {selectedTicket.id} — {selectedTicket.user}</div>
              <div style={{ fontSize:13, color:theme.textSub, marginBottom:14 }}>{selectedTicket.subject}</div>
              <textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Type your reply…" rows={4}
                style={{ width:"100%", boxSizing:"border-box", padding:"12px", border:`1.5px solid ${theme.border}`, borderRadius:10, fontSize:14, background:theme.inputBg, color:theme.text, fontFamily:"'Plus Jakarta Sans',sans-serif", outline:"none", resize:"vertical" }} />
              <div style={{ display:"flex", gap:10, marginTop:12 }}>
                <Btn variant="primary"   size="md" onClick={() => { toast("Reply sent!"); setSelectedTicket(null); setReplyText(""); }}>Send Reply</Btn>
                <Btn variant="secondary" size="md" onClick={() => setSelectedTicket(null)}>Cancel</Btn>
              </div>
            </div>
          )}
        </FadeIn>
      )}

      {(activeTab === "feedback" || activeTab === "bugs" || activeTab === "features") && (
        <FadeIn delay={0} reduced={reduced}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16 }}>
            {/* Submit form */}
            <div style={{ background:theme.card, border:`1.5px solid ${theme.border}`, borderRadius:12, padding:20 }}>
              <div style={{ fontSize:15, fontWeight:700, color:theme.text, marginBottom:16 }}>
                {activeTab==="feedback"?"💬 Submit Feedback":activeTab==="bugs"?"🐛 Report a Bug":"✨ Request a Feature"}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <Input label="Title" id="fb-title" placeholder="Brief description…" theme={theme} value={newFeedback.title} onChange={e => setFeedback(p => ({...p,title:e.target.value}))} />
                <div>
                  <label style={{ fontSize:13, fontWeight:700, color:theme.textSub, display:"block", marginBottom:5 }}>Details</label>
                  <textarea rows={4} placeholder="Provide as much detail as possible…"
                    style={{ width:"100%", boxSizing:"border-box", padding:"10px 12px", border:`1.5px solid ${theme.border}`, borderRadius:8, fontSize:14, background:theme.inputBg, color:theme.text, fontFamily:"'Plus Jakarta Sans',sans-serif", outline:"none", resize:"vertical" }} />
                </div>
                <Btn variant="primary" size="md" onClick={() => toast(`${activeTab==="feedback"?"Feedback":"Report"} submitted!`)}>Submit</Btn>
              </div>
            </div>
            {/* Recent items */}
            <div style={{ background:theme.card, border:`1.5px solid ${theme.border}`, borderRadius:12, padding:20 }}>
              <div style={{ fontSize:15, fontWeight:700, color:theme.text, marginBottom:14 }}>Recent {activeTab==="features"?"Requests":"Reports"}</div>
              {[
                {title:"Add family sharing",votes:24,status:"Planned"},
                {title:"AR item detection improvement",votes:18,status:"In Review"},
                {title:"Offline mode support",votes:15,status:"Backlog"},
                {title:"Apple Watch integration",votes:12,status:"Backlog"},
              ].map((item,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 0", borderBottom:i<3?`1px solid ${theme.border}`:"none" }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:theme.text }}>{item.title}</div>
                    <div style={{ fontSize:11, color:theme.textSub, marginTop:2 }}>{item.votes} votes</div>
                  </div>
                  <Badge color={item.status==="Planned"?C.success:item.status==="In Review"?C.warning:C.n400}>{item.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// API DOCUMENTATION SCREEN — doc: WEB Part 4 Page 6
// ══════════════════════════════════════════════════════════════════════════════
const API_ENDPOINTS = [
  {method:"GET",  path:"/api/v1/items",       desc:"List all inventory items",       auth:true, rateLimit:"100/min"},
  {method:"POST", path:"/api/v1/items",       desc:"Add a new inventory item",       auth:true, rateLimit:"50/min"},
  {method:"GET",  path:"/api/v1/items/:id",   desc:"Get item by ID",                 auth:true, rateLimit:"200/min"},
  {method:"PUT",  path:"/api/v1/items/:id",   desc:"Update item",                    auth:true, rateLimit:"50/min"},
  {method:"DELETE",path:"/api/v1/items/:id",  desc:"Delete item",                    auth:true, rateLimit:"30/min"},
  {method:"POST", path:"/api/v1/scan",        desc:"Process barcode scan",           auth:true, rateLimit:"100/min"},
  {method:"GET",  path:"/api/v1/nutrition/:id",desc:"Get nutritional data for item", auth:true, rateLimit:"200/min"},
  {method:"GET",  path:"/api/v1/recipes",     desc:"Get AI recipe suggestions",      auth:true, rateLimit:"50/min"},
  {method:"GET",  path:"/api/v1/analytics",   desc:"Get user analytics data",        auth:true, rateLimit:"20/min"},
  {method:"POST", path:"/api/v1/ai/chat",     desc:"Send message to AI assistant",   auth:true, rateLimit:"30/min"},
];

const GRAPHQL_SCHEMA = `type Query {
  items(userId: ID!, filter: ItemFilter): [Item!]!
  item(id: ID!): Item
  recipes(userId: ID!): [Recipe!]!
  nutrition(itemId: ID!): Nutrition
  sustainability(userId: ID!): SustainabilityImpact!
  aiInsights(userId: ID!): [AIInsight!]!
  priceComparison(productId: ID!): PriceComparison!
}

type Mutation {
  addItem(input: AddItemInput!): Item!
  scanBarcode(barcode: String!): Item!
  updateHealthProfile(input: HealthInput!): HealthProfile!
  mintAchievementNFT(type: String!): NFTAchievement!
}

type Subscription {
  onExpirationAlert(userId: ID!): ExpirationAlert!
  onPriceAlert(userId: ID!): PriceAlert!
  onARFrameUpdate(userId: ID!): ARFrame!
}`;

