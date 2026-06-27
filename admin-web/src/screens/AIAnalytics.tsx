import React, { useState, useEffect, useRef, useCallback } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { C, DT } from "../tokens";
import { AnimatedCounter, FadeIn, Badge, Btn, StatCard, ChartCard, Breadcrumb, PageHeader, Modal, AllergenPieChart, DataTable, Pagination, Toggle, Input, Select, AlertBanner, Spinner, AdminProgressBar, AdminTooltip, CheckboxInput, RadioGroup, AdminTextarea } from "../components/Shared";
import { exportToCSV } from "../utils";
import { userGrowthData, topProducts, allergenData, expirationTimeline, categoryData, alertsData, USERS, REPORTS, LIVE_EVENTS } from "../data";
import { useLiveFeed } from "../hooks";

const predictionData = [
  {week:"Wk 1",actual:45,predicted:48},{week:"Wk 2",actual:52,predicted:50},{week:"Wk 3",actual:38,predicted:42},
  {week:"Wk 4",actual:61,predicted:58},{week:"Wk 5",actual:null,predicted:55},{week:"Wk 6",actual:null,predicted:49},
];
const anomalies = [
  {time:"Jun 4 14:23",metric:"Scan Rate",value:"+340%",severity:"high",   desc:"Unusual spike — 340% above avg. Possible promotional event."},
  {time:"Jun 3 09:11",metric:"New Users", value:"+89",  severity:"medium", desc:"89 new sign-ups in 2h. Check referral source."},
  {time:"Jun 2 22:45",metric:"Errors",    value:"0.9%", severity:"low",    desc:"Error rate briefly exceeded 0.8% SLA threshold."},
  {time:"Jun 1 18:00",metric:"Waste",     value:"-22%", severity:"info",   desc:"Positive anomaly: waste reduced by 22% vs forecast."},
];

export default function AIAnalyticsScreen({ theme, reduced, toast }) {
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const sevColor = s => s==="high"?C.error:s==="medium"?C.warning:s==="low"?C.info:C.success;
  const sevBg    = s => s==="high"?C.errorSoft:s==="medium"?C.warningSoft:s==="low"?C.primarySoft:C.successSoft;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      <Breadcrumb items={["Admin","AI Analytics"]} theme={theme} />
      <PageHeader icon="🧠" title="AI Analytics Dashboard" subtitle="Predictive analytics, trend analysis, and anomaly detection" theme={theme}
        action={
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, background:C.primarySoft, border:`1px solid ${C.primary}30`, borderRadius:99, padding:"5px 12px" }}>
              <div style={{ width:7,height:7,borderRadius:"50%",background:C.primary, animation:reduced?"none":"pulse 2s ease-in-out infinite" }} />
              <span style={{ fontSize:12, fontWeight:700, color:C.primary }}>AI Active</span>
            </div>
            <select value={dateRange} onChange={e => setDateRange(e.target.value)}
              style={{ height:38, padding:"0 10px", border:`1.5px solid ${theme.border}`, borderRadius:8, fontSize:13, background:theme.inputBg, color:theme.text, fontFamily:"'Plus Jakarta Sans',sans-serif", outline:"none" }}>
              {["Today","Last 7 Days","Last 30 Days","Last Quarter"].map(r => <option key={r}>{r}</option>)}
            </select>
            <Btn variant="secondary" size="sm" onClick={() => { exportToCSV(predictionData,[{key:"week",label:"Week"},{key:"actual",label:"Actual"},{key:"predicted",label:"Predicted"}],"ai_analytics"); toast("Report exported!"); }}>⬇ Export</Btn>
          </div>
        } />

      {/* KPI Cards */}
      <div className="admin-kpi-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:14 }}>
        <StatCard icon="🎯" title="Prediction Accuracy" value="94.3%"  trend="+1.2% this week"    trendUp color={C.success}  delay={0}   reduced={reduced} theme={theme} />
        <StatCard icon="⚠️" title="Anomalies Detected"  value={4}      trend="3 resolved"          trendUp color={C.warning}  delay={70}  reduced={reduced} theme={theme} />
        <StatCard icon="📉" title="Waste Reduction AI"  value="28%"    trend="+5% vs last month"   trendUp color={C.teal}     delay={140} reduced={reduced} theme={theme} />
        <StatCard icon="🤖" title="AI Recommendations"  value={127}    trend="89 accepted (70%)"   trendUp color={C.primary}  delay={210} reduced={reduced} theme={theme} />
      </div>

      {/* Predictive Waste Chart */}
      <ChartCard title="📊 Waste Prediction vs Actual" theme={theme} delay={280} reduced={reduced}
        action={<Badge color={C.primary}>AI Forecast ±5%</Badge>}>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={predictionData}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
            <XAxis dataKey="week" tick={{ fontSize:12, fill:theme.textSub }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize:12, fill:theme.textSub }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius:10, border:`1px solid ${theme.border}`, background:theme.card, color:theme.text, fontSize:12 }} />
            <Legend wrapperStyle={{ fontSize:12 }} />
            <Line type="monotone" dataKey="actual"    stroke={C.primary} strokeWidth={2.5} dot={{ r:4 }} name="Actual (kg)" animationDuration={reduced?0:1000} connectNulls={false} />
            <Line type="monotone" dataKey="predicted" stroke={C.warning} strokeWidth={2.5} dot={false} strokeDasharray="6 4" name="AI Forecast" animationDuration={reduced?0:1200} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Anomaly Detection Table */}
      <ChartCard title="🔍 Anomaly Detection" theme={theme} delay={360} reduced={reduced}>
        <div>
          {anomalies.map((a,i) => (
            <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:14, padding:"14px 0", borderBottom:i<anomalies.length-1?`1px solid ${theme.border}`:"none" }}>
              <div style={{ width:42, height:42, borderRadius:10, background:sevBg(a.severity), display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <span style={{ fontSize:20 }}>{a.severity==="high"?"🚨":a.severity==="medium"?"⚠️":a.severity==="low"?"ℹ️":"✅"}</span>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:3 }}>
                  <span style={{ fontSize:14, fontWeight:700, color:theme.text }}>{a.metric}</span>
                  <Badge color={sevColor(a.severity)} bg={sevBg(a.severity)}>{a.severity.toUpperCase()}</Badge>
                  <span style={{ fontSize:13, fontWeight:800, color:sevColor(a.severity) }}>{a.value}</span>
                </div>
                <div style={{ fontSize:13, color:theme.textSub, lineHeight:1.5 }}>{a.desc}</div>
                <div style={{ fontSize:11, color:theme.textSub, marginTop:4 }}>🕐 {a.time}</div>
              </div>
              <button onClick={() => toast(`Anomaly ${a.metric} acknowledged`,"info")}
                style={{ height:32, padding:"0 12px", borderRadius:7, border:`1px solid ${theme.border}`, background:theme.card, cursor:"pointer", fontSize:12, fontWeight:600, color:theme.text, whiteSpace:"nowrap", flexShrink:0 }}>Resolve</button>
            </div>
          ))}
        </div>
      </ChartCard>

      {/* User Behaviour Analysis */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16 }}>
        <ChartCard title="👤 User Behaviour Patterns" theme={theme} delay={440} reduced={reduced}>
          {[
            {label:"Avg session length",value:"4m 32s",icon:"⏱",color:C.primary},
            {label:"Most active time",value:"7–9 AM",icon:"📅",color:C.warning},
            {label:"Top feature used",value:"Barcode Scan",icon:"📷",color:C.success},
            {label:"Churn risk users",value:"23 users",icon:"⚠️",color:C.error},
            {label:"Feature adoption",value:"68%",icon:"🎯",color:C.teal},
          ].map((m,i) => (
            <div key={m.label} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:i<4?`1px solid ${theme.border}`:"none" }}>
              <div style={{ width:36, height:36, borderRadius:9, background:`${m.color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{m.icon}</div>
              <span style={{ flex:1, fontSize:13, color:theme.textSub }}>{m.label}</span>
              <span style={{ fontSize:14, fontWeight:800, color:m.color }}>{m.value}</span>
            </div>
          ))}
        </ChartCard>

        <ChartCard title="💡 AI Insights Panel" theme={theme} delay={520} reduced={reduced}>
          {[
            {emoji:"📈",insight:"User engagement peaks on Sundays — schedule push notifications at 6 PM Sunday.",priority:"High"},
            {emoji:"♻️",insight:"Users who enable allergen alerts have 34% lower churn rate.",priority:"Medium"},
            {emoji:"🛒",insight:"Shopping list feature increases retention by 28% when used weekly.",priority:"High"},
            {emoji:"⚡",insight:"Reducing app load time by 500ms would improve Day-7 retention by ~12%.",priority:"Low"},
          ].map((ins,i) => (
            <div key={i} style={{ display:"flex", gap:10, padding:"11px 0", borderBottom:i<3?`1px solid ${theme.border}`:"none" }}>
              <span style={{ fontSize:20, flexShrink:0 }}>{ins.emoji}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, color:theme.text, lineHeight:1.5, marginBottom:5 }}>{ins.insight}</div>
                <Badge color={ins.priority==="High"?C.error:ins.priority==="Medium"?C.warning:C.info}>{ins.priority} Priority</Badge>
              </div>
            </div>
          ))}
          <Btn variant="primary" size="md" full style={{ marginTop:16 }} onClick={() => toast("Insights report generated!")}>📊 Generate Full Report</Btn>
        </ChartCard>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// INVENTORY OPTIMIZATION SCREEN — doc: WEB Section 6 (AI recommendations,
//   storage optimization, organization tips, temperature zones, expiry timeline)
// ══════════════════════════════════════════════════════════════════════════════
const STORAGE_ZONES = [
  {zone:"Top Shelf",temp:"35–38°F",items:["Leftovers","Ready-to-eat foods","Herbs"],emoji:"🥗"},
  {zone:"Middle Shelf",temp:"38–40°F",items:["Dairy","Eggs","Beverages"],emoji:"🧀"},
  {zone:"Bottom Shelf",temp:"40°F",items:["Raw meat","Poultry","Fish"],emoji:"🍗"},
  {zone:"Crisper Drawer",temp:"34–36°F",items:["Vegetables","Fruits"],emoji:"🥬"},
  {zone:"Door Shelves",temp:"45°F",items:["Condiments","Juice","Butter"],emoji:"🧴"},
];

