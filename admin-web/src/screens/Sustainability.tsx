import React, { useState, useEffect, useRef, useCallback } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { C, DT } from "../tokens";
import { AnimatedCounter, FadeIn, Badge, Btn, StatCard, ChartCard, Breadcrumb, PageHeader, Modal, AllergenPieChart, DataTable, Pagination, Toggle, Input, Select, AlertBanner, Spinner, AdminProgressBar, AdminTooltip, CheckboxInput, RadioGroup, AdminTextarea } from "../components/Shared";
import { exportToCSV } from "../utils";
import { userGrowthData, topProducts, allergenData, expirationTimeline, categoryData, alertsData, USERS, REPORTS, LIVE_EVENTS } from "../data";
import { useLiveFeed } from "../hooks";

const sustainabilityTimeline = [
  {week:"Wk 1",waste:3.2,co2:2.1},{week:"Wk 2",waste:2.8,co2:1.9},{week:"Wk 3",waste:2.4,co2:1.7},
  {week:"Wk 4",waste:1.9,co2:1.4},{week:"Wk 5",waste:1.4,co2:1.0},{week:"Wk 6",waste:1.1,co2:0.8},
];

export default function SustainabilityScreen({ theme, reduced, toast }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      <Breadcrumb items={["Admin","Sustainability"]} theme={theme} />
      <PageHeader icon="🌱" title="Sustainability Metrics" subtitle="Track environmental impact and waste reduction across all users" theme={theme}
        action={<Btn variant="secondary" size="sm" onClick={() => { exportToCSV(sustainabilityTimeline,[{key:"week",label:"Week"},{key:"waste",label:"Waste (kg)"},{key:"co2",label:"CO2 (kg)"}],"sustainability"); toast("Report downloaded!"); }}>⬇ Export</Btn>} />

      <div className="admin-kpi-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:14 }}>
        <StatCard icon="♻️" title="Food Waste Saved"   value={2847}  suffix="kg" trend="+340 this week" trendUp color={C.success}  delay={0}   reduced={reduced} theme={theme} />
        <StatCard icon="🌿" title="CO₂ Reduced"        value={1923}  suffix="kg" trend="+210 this week" trendUp color={C.teal}     delay={80}  reduced={reduced} theme={theme} />
        <StatCard icon="💧" title="Water Saved"        value={45600} suffix="L"  trend="+5.2k this wk"  trendUp color={C.info}     delay={160} reduced={reduced} theme={theme} />
        <StatCard icon="💰" title="Money Saved"        value={12340} prefix="$"               trend="+$1.2k this wk" trendUp color={C.warning} delay={240} reduced={reduced} theme={theme} />
      </div>

      {/* Waste Reduction Timeline */}
      <ChartCard title="📉 Waste Reduction Over Time" theme={theme} delay={300} reduced={reduced}>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={sustainabilityTimeline}>
            <defs>
              <linearGradient id="wasteG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.success} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={C.success} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="co2G" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.teal} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={C.teal} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
            <XAxis dataKey="week" tick={{ fontSize:12, fill:theme.textSub }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize:12, fill:theme.textSub }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius:10, border:`1px solid ${theme.border}`, background:theme.card, color:theme.text, fontSize:12 }} />
            <Legend wrapperStyle={{ fontSize:12, color:theme.textSub }} />
            <Area type="monotone" dataKey="waste" stroke={C.success} strokeWidth={2.5} fill="url(#wasteG)" name="Waste (kg)" animationDuration={reduced?0:1000} />
            <Area type="monotone" dataKey="co2"   stroke={C.teal}    strokeWidth={2.5} fill="url(#co2G)"   name="CO₂ (kg)"   animationDuration={reduced?0:1200} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Leaderboard + Goals */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:16 }}>
        <ChartCard title="🏆 Top Sustainable Users" theme={theme} delay={380} reduced={reduced}>
          {[
            {rank:1,name:"Alice Johnson",score:98,medal:"🥇",kg:"8.4kg"},
            {rank:2,name:"Eve Martinez", score:94,medal:"🥈",kg:"7.9kg"},
            {rank:3,name:"Bob Smith",    score:89,medal:"🥉",kg:"7.1kg"},
            {rank:4,name:"Carol Davis",  score:82,medal:"",  kg:"6.3kg"},
            {rank:5,name:"David Lee",    score:78,medal:"",  kg:"5.8kg"},
          ].map((u,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 0", borderBottom:i<4?`1px solid ${theme.border}`:"none" }}>
              <div style={{ width:28, textAlign:"center", fontSize:16, flexShrink:0 }}>{u.medal || `#${u.rank}`}</div>
              <div style={{ flex:1, fontSize:14, fontWeight:600, color:theme.text }}>{u.name}</div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:80, height:7, background:theme.border, borderRadius:99 }}>
                  <div style={{ width:`${u.score}%`, height:"100%", background:`linear-gradient(90deg,${C.success},${C.teal})`, borderRadius:99 }} />
                </div>
                <span style={{ fontSize:12, fontWeight:700, color:C.success }}>{u.kg}</span>
              </div>
            </div>
          ))}
        </ChartCard>

        <ChartCard title="🎯 Sustainability Goals" theme={theme} delay={460} reduced={reduced}>
          {[
            {goal:"Reduce food waste",target:"5kg/mo",current:2.8,max:5,color:C.success},
            {goal:"Lower CO₂ footprint",target:"3kg/mo",current:1.9,max:3,color:C.teal},
            {goal:"Save water",target:"50L/mo",current:24,max:50,color:C.info},
            {goal:"Save money",target:"$50/mo",current:34.5,max:50,color:C.warning},
          ].map((g,i) => (
            <div key={i} style={{ marginBottom:i<3?16:0 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ fontSize:13, fontWeight:600, color:theme.text }}>{g.goal}</span>
                <span style={{ fontSize:12, color:theme.textSub }}>{g.current}/{g.target}</span>
              </div>
              <div style={{ background:theme.border, borderRadius:99, height:8 }}>
                <div style={{ width:`${Math.min(g.current/g.max*100,100)}%`, height:"100%", background:g.color, borderRadius:99, transition:"width 0.8s ease" }} />
              </div>
            </div>
          ))}
          <Btn variant="primary" size="md" full style={{ marginTop:20 }} onClick={() => toast("Goals updated!")}>Update Goals</Btn>
          {/* Blockchain verification */}
          <div style={{ marginTop:16, padding:"14px 16px", background:C.primarySoft, borderRadius:10, border:`1.5px solid ${C.primary}30` }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
              <span style={{ fontSize:18 }}>⛓</span>
              <span style={{ fontSize:13, fontWeight:800, color:C.primary }}>Blockchain Verified Impact</span>
              <Badge color={C.success} bg={C.successSoft}>Polygon Network</Badge>
            </div>
            <div style={{ fontSize:12, color:theme.textSub, lineHeight:1.6 }}>All sustainability metrics are cryptographically recorded on the Polygon blockchain. Users earn verified NFT achievements for reaching sustainability milestones.</div>
            <div style={{ marginTop:10, display:"flex", gap:8, flexWrap:"wrap" }}>
              {[{icon:"🏆",label:"2.4kg Waste Saved — Verified",tx:"0x4f3a...9c2e"},{icon:"🥈",label:"Top 15% Community — Minted NFT",tx:"0x7b2c...4d1f"}].map((b,i) => (
                <div key={i} style={{ background:"rgba(99,102,241,0.08)", borderRadius:8, padding:"6px 12px", border:`1px solid ${C.primary}20` }}>
                  <div style={{ fontSize:12, fontWeight:700, color:C.primary }}>{b.icon} {b.label}</div>
                  <div style={{ fontSize:10, color:theme.textSub, marginTop:2 }}>Tx: {b.tx}</div>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Tips */}
      <ChartCard title="💡 Sustainability Recommendations" theme={theme} delay={540} reduced={reduced}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:12 }}>
          {[
            {icon:"🥗",tip:"Suggest recipes using expiring items",impact:"High impact"},
            {icon:"📊",tip:"Send weekly waste reports to users",impact:"Medium impact"},
            {icon:"🛒",tip:"Optimize shopping lists to reduce over-buying",impact:"High impact"},
            {icon:"♻️",tip:"Enable composting tips for expired items",impact:"Low impact"},
          ].map((t,i) => (
            <div key={i} style={{ background:theme.hover, borderRadius:10, padding:"14px 16px", border:`1px solid ${theme.border}` }}>
              <div style={{ fontSize:28, marginBottom:8 }}>{t.icon}</div>
              <div style={{ fontSize:13, fontWeight:600, color:theme.text, marginBottom:5, lineHeight:1.4 }}>{t.tip}</div>
              <Badge color={C.success} bg={C.successSoft}>{t.impact}</Badge>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// RECEIPT MANAGEMENT SCREEN — doc: WEB Section "Receipt Management"
// ══════════════════════════════════════════════════════════════════════════════
const RECEIPTS_DATA = [
  {id:1,store:"Walmart",   date:"Jun 6, 2026",total:"$47.23",items:12,status:"Processed", emoji:"🛒"},
  {id:2,store:"Kroger",    date:"Jun 3, 2026",total:"$31.89",items:8, status:"Processed", emoji:"🏪"},
  {id:3,store:"Whole Foods",date:"May 31, 2026",total:"$62.40",items:15,status:"Processing",emoji:"🌿"},
  {id:4,store:"Trader Joe's",date:"May 28, 2026",total:"$28.15",items:7,status:"Processed",emoji:"🎯"},
];

