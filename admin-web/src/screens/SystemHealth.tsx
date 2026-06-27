import React, { useState, useEffect, useRef, useCallback } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { C, DT } from "../tokens";
import { AnimatedCounter, FadeIn, Badge, Btn, StatCard, ChartCard, Breadcrumb, PageHeader, Modal, AllergenPieChart, DataTable, Pagination, Toggle, Input, Select, AlertBanner, Spinner, AdminProgressBar, AdminTooltip, CheckboxInput, RadioGroup, AdminTextarea } from "../components/Shared";
import { exportToCSV } from "../utils";
import { userGrowthData, topProducts, allergenData, expirationTimeline, categoryData, alertsData, USERS, REPORTS, LIVE_EVENTS } from "../data";
import { useLiveFeed } from "../hooks";

const SERVICES = [
  {name:"API Server",         status:"operational", uptime:"99.98%", latency:"124ms",  region:"us-east-1"},
  {name:"Database (MySQL)",   status:"operational", uptime:"99.99%", latency:"8ms",    region:"us-east-1"},
  {name:"AI Inference",       status:"operational", uptime:"99.92%", latency:"340ms",  region:"us-west-2"},
  {name:"Push Notifications", status:"degraded",    uptime:"98.70%", latency:"890ms",  region:"global"},
  {name:"Image Processing",   status:"operational", uptime:"99.88%", latency:"210ms",  region:"us-east-1"},
  {name:"Blockchain Node",    status:"operational", uptime:"99.95%", latency:"1.2s",   region:"global"},
  {name:"CDN",                status:"operational", uptime:"100%",   latency:"18ms",   region:"global"},
  {name:"Barcode Service",    status:"operational", uptime:"99.97%", latency:"56ms",   region:"us-east-1"},
];

const UPTIME_HISTORY = [
  {day:"Mon",uptime:99.98},{day:"Tue",uptime:99.99},{day:"Wed",uptime:99.94},
  {day:"Thu",uptime:98.70},{day:"Fri",uptime:99.91},{day:"Sat",uptime:99.99},{day:"Sun",uptime:99.98},
];

const INCIDENTS = [
  {id:"INC-042",service:"Push Notifications",severity:"medium",started:"Jun 7 14:23",duration:"2h 14m",status:"Monitoring",desc:"Elevated delivery latency causing some push notifications to arrive delayed by 5-15 minutes."},
  {id:"INC-041",service:"AI Inference",       severity:"low",   started:"Jun 5 09:00",duration:"45m",   status:"Resolved",  desc:"Increased response times on recipe recommendation endpoint. Root cause: cold start after deployment. Resolved by pre-warming instances."},
  {id:"INC-040",service:"API Server",         severity:"low",   started:"Jun 2 22:10",duration:"12m",   status:"Resolved",  desc:"Brief spike in error rate (0.9%) above SLA threshold of 0.8%. Self-recovered."},
];

export default function SystemHealthScreen({ theme, reduced, toast }) {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date().toLocaleTimeString());
  const operationalCount = SERVICES.filter(s => s.status==="operational").length;
  const degradedCount    = SERVICES.filter(s => s.status==="degraded").length;
  const overallStatus    = degradedCount > 0 ? "degraded" : "operational";

  useEffect(() => {
    if (!autoRefresh) return;
    const t = setInterval(() => setLastRefresh(new Date().toLocaleTimeString()), 15000);
    return () => clearInterval(t);
  }, [autoRefresh]);

  const statusColor = s => s==="operational"?C.success:s==="degraded"?C.warning:C.error;
  const statusBg    = s => s==="operational"?C.successSoft:s==="degraded"?C.warningSoft:C.errorSoft;
  const statusLabel = s => s==="operational"?"● Operational":s==="degraded"?"▲ Degraded":"✕ Down";

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      <Breadcrumb items={["Admin","System Health"]} theme={theme} />
      <PageHeader icon="🖥" title="System Health" subtitle="Real-time service status, uptime metrics, and incident tracking" theme={theme}
        action={
          <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ fontSize:12, color:theme.textSub }}>Auto-refresh</span>
              <div onClick={() => setAutoRefresh(a => !a)} role="switch" aria-checked={autoRefresh}
                style={{ width:40, height:22, borderRadius:99, background:autoRefresh?C.primary:theme.border, cursor:"pointer", position:"relative", transition:DT.animation.transition.fast }}>
                <div style={{ position:"absolute", top:3, left:autoRefresh?20:3, width:16, height:16, borderRadius:"50%", background:"white", transition:DT.animation.transition.fast }} />
              </div>
            </div>
            <span style={{ fontSize:11, color:theme.textSub }}>Last: {lastRefresh}</span>
            <Btn variant="secondary" size="sm" onClick={() => { setLastRefresh(new Date().toLocaleTimeString()); toast("Refreshed!"); }}>↻ Refresh</Btn>
          </div>
        } />

      {/* Overall status banner */}
      <FadeIn delay={0} reduced={reduced}>
        <div style={{ background: overallStatus==="operational" ? "linear-gradient(135deg,#059669,#0D9488)" : "linear-gradient(135deg,#D97706,#F59E0B)", borderRadius:DT.radius.card, padding:"20px 28px", display:"flex", alignItems:"center", gap:20 }}>
          <div style={{ fontSize:48 }}>{overallStatus==="operational"?"✅":"⚠️"}</div>
          <div>
            <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:22, fontWeight:700, color:"white", marginBottom:4 }}>
              {overallStatus==="operational" ? "All Systems Operational" : `${degradedCount} Service${degradedCount>1?"s":""} Degraded`}
            </div>
            <div style={{ fontSize:14, color:"rgba(255,255,255,0.82)" }}>
              {operationalCount}/{SERVICES.length} services healthy · {degradedCount} degraded · 0 down
            </div>
          </div>
          <div style={{ marginLeft:"auto", textAlign:"right" }}>
            <div style={{ fontSize:32, fontWeight:800, color:"white" }}>99.94%</div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.75)" }}>30-day uptime</div>
          </div>
        </div>
      </FadeIn>

      {/* KPI Cards */}
      <div className="admin-kpi-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:14 }}>
        <StatCard icon="⏱" title="Avg Response"    value="124ms"  trend="P99: 450ms"          trendUp color={C.success}  delay={0}   reduced={reduced} theme={theme} tooltip="Average API response time across all endpoints" />
        <StatCard icon="🚨" title="Error Rate"      value="0.06%"  trend="SLA: <0.8%"          trendUp color={C.teal}    delay={70}  reduced={reduced} theme={theme} tooltip="Percentage of requests returning 5xx errors" />
        <StatCard icon="📡" title="Requests/min"    value={4820}   trend="+3% vs yesterday"     trendUp color={C.primary} delay={140} reduced={reduced} theme={theme} tooltip="Current request throughput across all services" />
        <StatCard icon="🖥" title="Active Servers"  value={8}      trend="0 in maintenance"     trendUp color={C.warning} delay={210} reduced={reduced} theme={theme} tooltip="Healthy server instances currently serving traffic" />
      </div>

      {/* Service status grid */}
      <ChartCard title="🔌 Service Status" theme={theme} delay={280} reduced={reduced}
        action={<Badge color={overallStatus==="operational"?C.success:C.warning} bg={overallStatus==="operational"?C.successSoft:C.warningSoft}>{overallStatus==="operational"?"All Operational":"Partial Degradation"}</Badge>}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:12 }}>
          {SERVICES.map((svc,i) => (
            <FadeIn key={svc.name} delay={i*45} reduced={reduced}>
              <div style={{ background:theme.hover, borderRadius:DT.radius.lg, padding:"14px 16px", border:`1.5px solid ${svc.status==="operational"?theme.border:statusColor(svc.status)+"40"}`, display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:statusColor(svc.status), flexShrink:0, boxShadow:`0 0 8px ${statusColor(svc.status)}80`, animation:svc.status==="operational"&&!reduced?"pulse 2.5s ease-in-out infinite":"none" }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:theme.text }}>{svc.name}</div>
                  <div style={{ fontSize:12, color:theme.textSub, marginTop:2 }}>Region: {svc.region}</div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <Badge color={statusColor(svc.status)} bg={statusBg(svc.status)}>{statusLabel(svc.status)}</Badge>
                  <div style={{ fontSize:11, color:theme.textSub, marginTop:4 }}>
                    <span style={{ fontWeight:700 }}>{svc.latency}</span> · {svc.uptime} up
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </ChartCard>

      {/* Uptime history chart */}
      <ChartCard title="📈 7-Day Uptime History" theme={theme} delay={380} reduced={reduced}>
        <div style={{ display:"flex", gap:8, alignItems:"flex-end", height:100, marginBottom:12 }}>
          {UPTIME_HISTORY.map((d,i) => {
            const pct  = Math.max(0, (d.uptime - 98) / (100 - 98) * 100);
            const color = d.uptime >= 99.9 ? C.success : d.uptime >= 99 ? C.warning : C.error;
            return (
              <div key={d.day} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
                <div style={{ fontSize:10, color, fontWeight:700 }}>{d.uptime}%</div>
                <div style={{ width:"100%", height:`${pct}%`, minHeight:8, background:color, borderRadius:"4px 4px 0 0", transition:"height 0.8s ease" }} />
                <div style={{ fontSize:11, color:theme.textSub, fontWeight:600 }}>{d.day}</div>
              </div>
            );
          })}
        </div>
        <div style={{ display:"flex", gap:16, fontSize:12, color:theme.textSub }}>
          {[["🟢","99.9–100%","Excellent"],["🟡","99–99.9%","Good"],["🔴","< 99%","Attention"]].map(([dot,range,label]) => (
            <div key={label} style={{ display:"flex", alignItems:"center", gap:5 }}>{dot}<span>{range} {label}</span></div>
          ))}
        </div>
      </ChartCard>

      {/* Incidents */}
      <ChartCard title="🚨 Incident Log" theme={theme} delay={460} reduced={reduced}
        action={<Btn variant="primary" size="sm" onClick={() => toast("New incident created","info")}>+ New Incident</Btn>}>
        {INCIDENTS.map((inc,i) => {
          const sc = inc.severity==="medium"?C.warning:inc.severity==="low"?C.info:C.error;
          const sb = inc.severity==="medium"?C.warningSoft:inc.severity==="low"?C.primarySoft:C.errorSoft;
          return (
            <div key={inc.id} style={{ padding:"16px 0", borderBottom:i<INCIDENTS.length-1?`1px solid ${theme.border}`:"none" }}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
                <div style={{ width:42, height:42, borderRadius:DT.radius.lg, background:sb, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>
                  {inc.severity==="medium"?"⚠️":inc.severity==="low"?"ℹ️":"🚨"}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:4 }}>
                    <span style={{ fontSize:13, fontWeight:700, color:theme.text }}>{inc.id}</span>
                    <Badge color={sc} bg={sb}>{inc.severity.toUpperCase()}</Badge>
                    <Badge color={inc.status==="Resolved"?C.success:C.warning} bg={inc.status==="Resolved"?C.successSoft:C.warningSoft}>{inc.status}</Badge>
                    <span style={{ fontSize:12, color:theme.textSub }}>{inc.service}</span>
                  </div>
                  <div style={{ fontSize:13, color:theme.text, marginBottom:4, lineHeight:1.5 }}>{inc.desc}</div>
                  <div style={{ fontSize:11, color:theme.textSub }}>Started: {inc.started} · Duration: {inc.duration}</div>
                </div>
                <Btn variant="secondary" size="sm" onClick={() => toast(`${inc.id} details opened`)} style={{ flexShrink:0 }}>View</Btn>
              </div>
            </div>
          );
        })}
      </ChartCard>

      {/* Server metrics grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16 }}>
        <ChartCard title="💻 Server Resources" theme={theme} delay={540} reduced={reduced}>
          {[
            {label:"CPU Usage",       value:34,  color:C.success, unit:"%"},
            {label:"Memory Usage",    value:62,  color:C.warning, unit:"%"},
            {label:"Disk Usage",      value:48,  color:C.primary, unit:"%"},
            {label:"Network I/O",     value:21,  color:C.teal,    unit:"% capacity"},
          ].map((m,i) => (
            <div key={m.label} style={{ marginBottom:i<3?14:0 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5, fontSize:13 }}>
                <span style={{ color:theme.text, fontWeight:600 }}>{m.label}</span>
                <span style={{ color:m.color, fontWeight:800 }}>{m.value}{m.unit}</span>
              </div>
              <div style={{ background:theme.border, borderRadius:99, height:8 }}>
                <div style={{ width:`${m.value}%`, height:"100%", background:m.color, borderRadius:99, transition:"width 0.8s ease" }} />
              </div>
            </div>
          ))}
        </ChartCard>

        <ChartCard title="📊 Request Distribution" theme={theme} delay={580} reduced={reduced}>
          {[
            {endpoint:"/api/v1/items",    pct:38, count:"183K/min"},
            {endpoint:"/api/v1/scan",     pct:24, count:"116K/min"},
            {endpoint:"/api/v1/ai/chat",  pct:14, count:"67K/min"},
            {endpoint:"/api/v1/recipes",  pct:12, count:"58K/min"},
            {endpoint:"Other endpoints",  pct:12, count:"58K/min"},
          ].map((r,i) => (
            <div key={r.endpoint} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:i<4?`1px solid ${theme.border}`:"none" }}>
              <code style={{ fontSize:11, color:C.teal, background:theme.hover, padding:"2px 7px", borderRadius:5, flexShrink:0 }}>{r.endpoint}</code>
              <div style={{ flex:1, height:6, background:theme.border, borderRadius:99 }}>
                <div style={{ width:`${r.pct}%`, height:"100%", background:C.primary, borderRadius:99 }} />
              </div>
              <span style={{ fontSize:11, color:theme.textSub, whiteSpace:"nowrap", flexShrink:0 }}>{r.count}</span>
            </div>
          ))}
        </ChartCard>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// RETAILER INTEGRATION SCREEN — Partner management, store sync status,
// inventory sync, featured partnerships, price feed management
// ══════════════════════════════════════════════════════════════════════════════
const RETAILER_PARTNERS = [
  { name:"Walmart",      logo:"🛒", status:"connected", items:8420,  lastSync:"2 min ago",  deals:24, tier:"Premium",  color:"#0071CE" },
  { name:"Kroger",       logo:"🏪", status:"connected", items:6830,  lastSync:"8 min ago",  deals:18, tier:"Standard", color:"#003087" },
  { name:"Aldi",         logo:"🛍", status:"connected", items:3210,  lastSync:"15 min ago", deals:31, tier:"Standard", color:"#E31837" },
  { name:"Trader Joe's", logo:"🎯", status:"connected", items:2980,  lastSync:"5 min ago",  deals:15, tier:"Premium",  color:"#c0392b" },
  { name:"Whole Foods",  logo:"🌿", status:"pending",   items:0,     lastSync:"N/A",        deals:0,  tier:"—",        color:"#1B7A3E" },
  { name:"Costco",       logo:"📦", status:"inactive",  items:0,     lastSync:"N/A",        deals:0,  tier:"—",        color:"#005DAA" },
];

