import React, { useState, useEffect, useRef, useCallback } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { C, DT } from "../tokens";
import { AnimatedCounter, FadeIn, Badge, Btn, StatCard, ChartCard, Breadcrumb, PageHeader, Modal, AllergenPieChart, DataTable, Pagination, Toggle, Input, Select, AlertBanner, Spinner, AdminProgressBar, AdminTooltip, CheckboxInput, RadioGroup, AdminTextarea } from "../components/Shared";
import { exportToCSV } from "../utils";
import { userGrowthData, topProducts, allergenData, expirationTimeline, categoryData, alertsData, USERS, REPORTS, LIVE_EVENTS } from "../data";
import { useLiveFeed } from "../hooks";

const RETAILER_PARTNERS = [
  { name:"Walmart",      logo:"🛒", status:"connected", items:8420,  lastSync:"2 min ago",  deals:24, tier:"Premium",  color:"#0071CE" },
  { name:"Kroger",       logo:"🏪", status:"connected", items:6830,  lastSync:"8 min ago",  deals:18, tier:"Standard", color:"#003087" },
  { name:"Aldi",         logo:"🛍", status:"connected", items:3210,  lastSync:"15 min ago", deals:31, tier:"Standard", color:"#E31837" },
  { name:"Trader Joe's", logo:"🎯", status:"connected", items:2980,  lastSync:"5 min ago",  deals:15, tier:"Premium",  color:"#c0392b" },
  { name:"Whole Foods",  logo:"🌿", status:"pending",   items:0,     lastSync:"N/A",        deals:0,  tier:"—",        color:"#1B7A3E" },
  { name:"Costco",       logo:"📦", status:"inactive",  items:0,     lastSync:"N/A",        deals:0,  tier:"—",        color:"#005DAA" },
];

export default function RetailerIntegrationScreen({ theme, reduced, toast }) {
  const [syncAll, setSyncAll] = useState(false);
  const connected = RETAILER_PARTNERS.filter(r => r.status==="connected").length;

  const handleSyncAll = () => {
    setSyncAll(true);
    setTimeout(() => { setSyncAll(false); toast("All retailers synced!","success"); }, 2400);
  };

  const statusColor = s => s==="connected"?C.success:s==="pending"?C.warning:C.n400;
  const statusBg    = s => s==="connected"?C.successSoft:s==="pending"?C.warningSoft:theme.hover;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      <Breadcrumb items={["Admin","Retailer Integration"]} theme={theme} />
      <PageHeader icon="🏪" title="Retailer Integration" subtitle="Partner management, inventory sync, price feeds and deal management" theme={theme}
        action={
          <div style={{ display:"flex", gap:10 }}>
            <Btn variant="primary" size="sm" onClick={handleSyncAll} disabled={syncAll}>
              {syncAll ? <><Spinner size="sm" color="white" /> Syncing…</> : "↻ Sync All"}
            </Btn>
            <Btn variant="secondary" size="sm" onClick={() => toast("Partner invite sent","info")}>+ Add Partner</Btn>
          </div>
        } />

      {/* KPI Cards */}
      <div className="admin-kpi-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:14 }}>
        <StatCard icon="🏪" title="Connected Retailers" value={connected}     trend="2 pending"             trendUp color={C.primary}  delay={0}   reduced={reduced} theme={theme} tooltip="Actively syncing retailer integrations" />
        <StatCard icon="📦" title="Synced Products"     value={21440}         trend="+320 today"            trendUp color={C.success}  delay={70}  reduced={reduced} theme={theme} tooltip="Total unique products with live price data" />
        <StatCard icon="🎯" title="Active Deals"        value={88}            trend="24 expire today"       trendUp={false} color={C.warning}  delay={140} reduced={reduced} theme={theme} tooltip="Current promotional deals across all partners" />
        <StatCard icon="💰" title="Avg User Savings"    value="$34.50"        trend="+$4.20 this week"      trendUp color={C.teal}     delay={210} reduced={reduced} theme={theme} tooltip="Average weekly savings per active user from deals" />
      </div>

      {/* Partner table */}
      <ChartCard title="🤝 Retail Partners" theme={theme} delay={280} reduced={reduced}
        action={<Btn variant="secondary" size="sm" onClick={() => { exportToCSV(RETAILER_PARTNERS,[{key:"name",label:"Retailer"},{key:"status",label:"Status"},{key:"items",label:"Products"},{key:"deals",label:"Active Deals"},{key:"lastSync",label:"Last Sync"}],"retailer_partners"); toast("CSV downloaded!"); }}>⬇ Export</Btn>}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:12 }}>
          {RETAILER_PARTNERS.map((r,i) => (
            <FadeIn key={r.name} delay={i*55} reduced={reduced}>
              <div style={{ background:theme.hover, border:`1.5px solid ${r.status==="connected"?r.color+"25":theme.border}`, borderRadius:DT.radius.card, padding:"16px 18px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:12 }}>
                  <div style={{ width:46, height:46, borderRadius:12, background:`${r.color}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>{r.logo}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:theme.text }}>{r.name}</div>
                    <div style={{ fontSize:12, color:theme.textSub, marginTop:1 }}>Last sync: {r.lastSync}</div>
                  </div>
                  <Badge color={statusColor(r.status)} bg={statusBg(r.status)}>{r.status}</Badge>
                </div>
                {r.status === "connected" ? (
                  <>
                    <div style={{ display:"flex", gap:0, marginBottom:12 }}>
                      {[["📦",r.items.toLocaleString(),"Products"],["🎯",r.deals,"Live Deals"],["⭐",r.tier,"Tier"]].map(([icon,val,label],j) => (
                        <div key={label} style={{ flex:1, textAlign:"center", borderLeft:j>0?`1px solid ${theme.border}40`:"none" }}>
                          <div style={{ fontSize:11, color:theme.textSub }}>{icon} {label}</div>
                          <div style={{ fontSize:13, fontWeight:700, color:theme.text, marginTop:2 }}>{val}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display:"flex", gap:8 }}>
                      <Btn variant="secondary" size="sm" onClick={() => toast(`${r.name} synced!`)}>↻ Sync</Btn>
                      <Btn variant="secondary" size="sm" onClick={() => toast(`${r.name} deals refreshed`)}>🎯 Deals</Btn>
                      <Btn variant="secondary" size="sm" onClick={() => toast(`${r.name} settings opened`)}>⚙️</Btn>
                    </div>
                  </>
                ) : (
                  <Btn variant="primary" size="sm" full onClick={() => toast(`${r.name} connection initiated!`)}>
                    {r.status==="pending"?"Continue Setup →":"Connect Partner"}
                  </Btn>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </ChartCard>

      {/* Deal management table */}
      <ChartCard title="🎯 Active Deals Feed" theme={theme} delay={380} reduced={reduced}
        action={<Btn variant="primary" size="sm" onClick={() => toast("Deal created!","success")}>+ New Deal</Btn>}>
        <DataTable theme={theme}
          columns={[
            {key:"retailer",label:"Retailer",  render:v=><span style={{fontWeight:700,color:theme.text}}>{v}</span>},
            {key:"item",    label:"Item"},
            {key:"discount",label:"Discount",  render:v=><Badge color={C.success} bg={C.successSoft}>{v}</Badge>},
            {key:"expires", label:"Expires",   render:v=><Badge color={C.warning} bg={C.warningSoft}>{v}</Badge>},
            {key:"claims",  label:"Claims",    render:v=><span style={{fontWeight:700}}>{v}</span>},
            {key:"actions", label:"Actions",   render:(_,row)=><div style={{display:"flex",gap:6}}><Btn variant="secondary" size="sm" onClick={()=>toast("Deal edited")}>Edit</Btn><Btn variant="secondary" size="sm" onClick={()=>toast("Deal paused","info")}>Pause</Btn></div>},
          ]}
          rows={[
            {retailer:"Walmart",      item:"All Produce",     discount:"20% off",  expires:"Today",  claims:847,  actions:null},
            {retailer:"Kroger",       item:"Dairy (Buy 2+1)", discount:"33% off",  expires:"2 days", claims:612,  actions:null},
            {retailer:"Aldi",         item:"Weekly Meats",    discount:"30% off",  expires:"3 days", claims:1203, actions:null},
            {retailer:"Trader Joe's", item:"$5 off $30",      discount:"$5 off",   expires:"5 days", claims:394,  actions:null},
          ]} />
      </ChartCard>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// BLOCKCHAIN AUDIT SCREEN — Immutable audit trail, all item lifecycle events
// on Polygon, full ledger view, smart contract interactions, block explorer
// ══════════════════════════════════════════════════════════════════════════════
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

