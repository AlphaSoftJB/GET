import React, { useState, useEffect, useRef, useCallback } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { C, DT } from "../tokens";
import { AnimatedCounter, FadeIn, Badge, Btn, StatCard, ChartCard, Breadcrumb, PageHeader, Modal, AllergenPieChart, DataTable, Pagination, Toggle, Input, Select, AlertBanner, Spinner, AdminProgressBar, AdminTooltip, CheckboxInput, RadioGroup, AdminTextarea } from "../components/Shared";
import { exportToCSV } from "../utils";
import { userGrowthData, topProducts, allergenData, expirationTimeline, categoryData, alertsData, USERS, REPORTS, LIVE_EVENTS } from "../data";
import { useLiveFeed } from "../hooks";

const AUDIT_EVENTS = [
  {hash:"0x4f3a…9c2e",block:45231847,type:"impact",    user:"Alice Johnson",  action:"Waste impact recorded: 2.4kg saved",   time:"Jun 7 14:23",gas:"0.0012",status:"confirmed"},
  {hash:"0x7b2c…4d1f",block:45228391,type:"nft",       user:"Alice Johnson",  action:"NFT minted: Top 15% Sustainability Badge",time:"Jun 7 09:10",gas:"0.0034",status:"confirmed"},
  {hash:"0xa9e1…c7b3",block:45220104,type:"item",       user:"Bob Smith",      action:"Item consumed: Chicken Breast (2 days left)",time:"Jun 6 18:45",gas:"0.0008",status:"confirmed"},
  {hash:"0xd5f2…8e1a",block:45211872,type:"goal",       user:"Eve Martinez",   action:"Goal completed: Monthly waste target",  time:"Jun 6 12:00",gas:"0.0015",status:"confirmed"},
  {hash:"0x2c8b…3f6d",block:45198543,type:"item",       user:"Carol Davis",    action:"Item consumed: Baby Spinach (1 day left)",time:"Jun 5 20:30",gas:"0.0008",status:"confirmed"},
  {hash:"0xf1a7…2b9c",block:45185020,type:"impact",    user:"David Lee",      action:"CO₂ reduction verified: 1.8kg",         time:"Jun 5 15:15",gas:"0.0012",status:"confirmed"},
  {hash:"0x8d4e…7a3f",block:45172401,type:"nft",       user:"Alice Johnson",  action:"NFT minted: Eco Hero badge",            time:"Jun 4 08:55",gas:"0.0034",status:"confirmed"},
  {hash:"0x3c9f…5e1b",block:45160192,type:"contract",  user:"System",         action:"Smart contract executed: Challenge reward",time:"Jun 3 23:59",gas:"0.0021",status:"confirmed"},
  {hash:"0x1e7a…9d4c",block:45140223,type:"item",       user:"Bob Smith",      action:"Item added: Organic Milk (barcode scan)", time:"Jun 2 14:20",gas:"0.0008",status:"confirmed"},
  {hash:"0xb3f5…2a8e",block:45128104,type:"goal",       user:"Eve Martinez",   action:"Goal created: Reduce waste 5kg/month",  time:"Jun 1 10:05",gas:"0.0012",status:"confirmed"},
];

const TX_TYPE_COLORS = {impact:"#0D9488",nft:"#8B5CF6",item:"#3B82F6",goal:"#F59E0B",contract:"#EF4444"};
const TX_TYPE_ICONS  = {impact:"♻️",nft:"🏆",item:"📦",goal:"🎯",contract:"⚡"};

export default function BlockchainAuditScreen({ theme, reduced, toast }) {
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch]         = useState("");
  const filtered = AUDIT_EVENTS
    .filter(e => typeFilter==="all" || e.type===typeFilter)
    .filter(e => !search || e.action.toLowerCase().includes(search.toLowerCase()) || e.user.toLowerCase().includes(search.toLowerCase()) || e.hash.includes(search));

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      <Breadcrumb items={["Admin","Blockchain Audit"]} theme={theme} />
      <PageHeader icon="⛓" title="Blockchain Audit Trail" subtitle="Immutable ledger of all item events, sustainability records, and smart contract interactions" theme={theme}
        action={
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <Badge color={C.success} bg={C.successSoft}>● Polygon Live</Badge>
            <Btn variant="secondary" size="sm" onClick={() => { exportToCSV(filtered,[{key:"hash",label:"Tx Hash"},{key:"block",label:"Block"},{key:"user",label:"User"},{key:"action",label:"Action"},{key:"time",label:"Time"}],"blockchain_audit"); toast("Audit log exported!"); }}>⬇ Export</Btn>
          </div>
        } />

      {/* Network KPIs */}
      <div className="admin-kpi-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:14 }}>
        <StatCard icon="⛓" title="Total Transactions" value={AUDIT_EVENTS.length}  trend="Immutable"           color={"#8B5CF6"} delay={0}   reduced={reduced} theme={theme} tooltip="Total on-chain transactions recorded for this app" />
        <StatCard icon="⛏" title="Latest Block"       value="45.2M"               trend="~2s block time"      color={C.teal}    delay={70}  reduced={reduced} theme={theme} tooltip="Latest Polygon mainnet block height" />
        <StatCard icon="💎" title="Gas Used (MATIC)"   value="0.248"               trend="~$0.12 total"        color={C.success} delay={140} reduced={reduced} theme={theme} tooltip="Total gas spent on transactions in MATIC" />
        <StatCard icon="🏆" title="NFTs Minted"        value={AUDIT_EVENTS.filter(e=>e.type==="nft").length}  trend="On Polygon" color={C.warning} delay={210} reduced={reduced} theme={theme} tooltip="Total NFT achievement tokens minted" />
      </div>

      {/* Filters */}
      <FadeIn delay={280} reduced={reduced}>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <div style={{ flex:1, position:"relative", minWidth:200 }}>
            <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:15, pointerEvents:"none", color:theme.textSub }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by hash, user, or action…"
              style={{ width:"100%", boxSizing:"border-box", height:40, padding:"0 14px 0 38px", border:`1.5px solid ${theme.border}`, borderRadius:10, fontSize:13, background:theme.inputBg, color:theme.text, fontFamily:"'Plus Jakarta Sans',sans-serif", outline:"none" }} />
          </div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {["all","impact","nft","item","goal","contract"].map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                style={{ height:40, padding:"0 14px", borderRadius:9, border:`1.5px solid ${typeFilter===t?(TX_TYPE_COLORS[t]||C.primary):theme.border}`, background:typeFilter===t?`${TX_TYPE_COLORS[t]||C.primary}15`:"transparent", cursor:"pointer", fontSize:12, fontWeight:700, color:typeFilter===t?(TX_TYPE_COLORS[t]||C.primary):theme.textSub, fontFamily:"'Plus Jakarta Sans',sans-serif", transition:DT.animation.transition.fast, display:"flex", alignItems:"center", gap:5 }}>
                {t!=="all" && TX_TYPE_ICONS[t]} {t.charAt(0).toUpperCase()+t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Audit trail table */}
      <ChartCard title={`📋 Audit Log (${filtered.length} records)`} theme={theme} delay={360} reduced={reduced}>
        <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
          {filtered.map((evt,i) => (
            <div key={evt.hash} style={{ padding:"14px 0", borderBottom:i<filtered.length-1?`1px solid ${theme.border}`:"none", display:"flex", alignItems:"flex-start", gap:14 }}>
              <div style={{ width:36, height:36, borderRadius:9, background:`${TX_TYPE_COLORS[evt.type]}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
                {TX_TYPE_ICONS[evt.type]}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", gap:7, alignItems:"center", flexWrap:"wrap", marginBottom:4 }}>
                  <Badge color={TX_TYPE_COLORS[evt.type]}>{evt.type}</Badge>
                  <span style={{ fontSize:12, fontWeight:600, color:theme.text }}>{evt.user}</span>
                  <span style={{ fontSize:11, color:C.success }}>✓ {evt.status}</span>
                </div>
                <div style={{ fontSize:13, color:theme.text, lineHeight:1.5, marginBottom:4 }}>{evt.action}</div>
                <div style={{ display:"flex", gap:12, fontSize:11, color:theme.textSub, flexWrap:"wrap" }}>
                  <code style={{ color:C.primary }}>{evt.hash}</code>
                  <span>Block #{evt.block.toLocaleString()}</span>
                  <span>{evt.time}</span>
                  <span>{evt.gas} MATIC gas</span>
                </div>
              </div>
              <AdminTooltip content="View on PolygonScan" position="left">
                <button onClick={() => toast(`Opening ${evt.hash} on PolygonScan`,"info")}
                  style={{ width:32, height:32, borderRadius:8, border:`1px solid ${theme.border}`, background:theme.card, cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>↗</button>
              </AdminTooltip>
            </div>
          ))}
        </div>
      </ChartCard>

      {/* Smart contract info */}
      <ChartCard title="📜 Smart Contract" theme={theme} delay={440} reduced={reduced}>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {[
            {label:"Contract Address", value:"0x1a2b3c4d5e6f…7890abcd",monospace:true,color:C.primary},
            {label:"Network",          value:"Polygon Mainnet (Chain ID: 137)",monospace:false,color:theme.text},
            {label:"Contract Type",    value:"ERC-1155 Multi-token (NFT + Fungible)",monospace:false,color:theme.text},
            {label:"Total Supply",     value:"3 NFTs minted · 47 impact records",monospace:false,color:theme.text},
            {label:"Last Interaction", value:"Jun 7 2026 14:23 UTC · Block #45,231,847",monospace:false,color:theme.text},
          ].map((row,i) => (
            <div key={row.label} style={{ display:"flex", gap:12, padding:"10px 0", borderBottom:i<4?`1px solid ${theme.border}`:"none" }}>
              <span style={{ fontSize:13, color:theme.textSub, minWidth:160, flexShrink:0 }}>{row.label}</span>
              <code style={{ fontSize:12, color:row.color, fontFamily:row.monospace?"monospace":"inherit", wordBreak:"break-all" }}>{row.value}</code>
            </div>
          ))}
          <div style={{ display:"flex", gap:10, marginTop:4 }}>
            <Btn variant="primary"   size="sm" onClick={() => toast("Contract ABI downloaded!","info")}>⬇ Download ABI</Btn>
            <Btn variant="secondary" size="sm" onClick={() => toast("Opening PolygonScan…","info")}>🔍 PolygonScan ↗</Btn>
            <Btn variant="secondary" size="sm" onClick={() => toast("Contract source verified","info")}>✓ Verify Source</Btn>
          </div>
        </div>
      </ChartCard>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SIDEBAR NAV ITEMS
// ══════════════════════════════════════════════════════════════════════════════
