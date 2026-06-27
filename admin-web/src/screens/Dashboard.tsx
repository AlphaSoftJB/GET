import React, { useState, useEffect, useRef, useCallback } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { C, DT } from "../tokens";
import { AnimatedCounter, FadeIn, Badge, Btn, StatCard, ChartCard, Breadcrumb, PageHeader, Modal, AllergenPieChart, DataTable, Pagination, Toggle, Input, Select, AlertBanner, Spinner, AdminProgressBar, AdminTooltip, CheckboxInput, RadioGroup, AdminTextarea } from "../components/Shared";
import { exportToCSV } from "../utils";
import { userGrowthData, topProducts, allergenData, expirationTimeline, categoryData, alertsData, USERS, REPORTS, LIVE_EVENTS } from "../data";
import { useLiveFeed } from "../hooks";

export default function DashboardScreen({ theme, reduced, toast }) {
  const { feed, liveCount } = useLiveFeed(true);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      <div>
        <Breadcrumb items={["Admin","Dashboard"]} theme={theme} />
        <PageHeader icon="📊" title="Dashboard Overview" subtitle="Welcome back! Here's your system at a glance today." theme={theme}
          action={
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              {/* Live indicator */}
              <div style={{ display:"flex", alignItems:"center", gap:6, background:C.successSoft, border:`1px solid ${C.success}30`, borderRadius:99, padding:"5px 12px" }}>
                <div style={{ width:7, height:7, borderRadius:"50%", background:C.success, animation:reduced?"none":"pulse 2s ease-in-out infinite" }} />
                <span style={{ fontSize:12, fontWeight:700, color:C.success }}>Live</span>
              </div>
              <Btn variant="secondary" size="sm" onClick={() => {
                exportToCSV([
                  {metric:"Total Users",value:1234},{metric:"Active Users",value:456},
                  {metric:"New Users",value:23},{metric:"Scans Today",value:liveCount},
                ],[{key:"metric",label:"Metric"},{key:"value",label:"Value"}],"dashboard_summary");
                toast("Dashboard CSV downloaded!","success");
              }}>⬇ Export CSV</Btn>
            </div>
          } />
      </div>

      {/* KPI Cards with live scan count */}
      <div className="admin-kpi-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:14 }}>
        <StatCard icon="👥" title="Total Users"  value={1234}      trend="12% this month" trendUp color={C.primary}  delay={0}   reduced={reduced} theme={theme} tooltip="Total registered users across all platforms" />
        <StatCard icon="✅" title="Active Users" value={456}       trend="8% this week"   trendUp color={C.success}  delay={80}  reduced={reduced} theme={theme} tooltip="Users active in the last 7 days" />
        <StatCard icon="🆕" title="New Users"    value={23}        trend="5% yesterday"   trendUp color={C.info}     delay={160} reduced={reduced} theme={theme} tooltip="New sign-ups in the last 24 hours" />
        <StatCard icon="📷" title="Scans Today"  value={liveCount} trend="Live updating"   trendUp color={C.warning}  delay={240} reduced={reduced} theme={theme} tooltip="Barcode scans performed today — updates every 8s" />
      </div>

      {/* User Growth Chart */}
      <ChartCard title="📈 User Growth & Scan Activity" theme={theme} delay={300} reduced={reduced}
        action={
          <div style={{ display:"flex", gap:8 }}>
            {["7d","30d","90d"].map(r => <button key={r} style={{ height:30, padding:"0 12px", borderRadius:6, border:`1px solid ${theme.border}`, background: r==="7d" ? C.primary : theme.card, color: r==="7d" ? "white" : theme.textSub, fontSize:12, fontWeight:700, cursor:"pointer" }}>{r}</button>)}
          </div>
        }>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={userGrowthData}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
            <XAxis dataKey="date" tick={{ fontSize:12, fill:theme.textSub }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize:12, fill:theme.textSub }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius:10, border:`1px solid ${theme.border}`, background: theme.card, color: theme.text, fontSize:13 }} />
            <Legend wrapperStyle={{ fontSize:12 }} />
            <Line type="monotone" dataKey="users" stroke={C.primary} strokeWidth={2.5} dot={false} name="Users" animationDuration={reduced?0:1200} />
            <Line type="monotone" dataKey="scans" stroke={C.success} strokeWidth={2.5} dot={false} name="Scans" animationDuration={reduced?0:1400} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Two-col charts */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:16 }}>
        <ChartCard title="🏆 Top Scanned Products" theme={theme} delay={350} reduced={reduced}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={topProducts.slice(0,5)} layout="vertical" margin={{ left:10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} horizontal={false} />
              <XAxis type="number" tick={{ fontSize:11, fill:theme.textSub }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize:11, fill:theme.textSub }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={{ borderRadius:8, border:`1px solid ${theme.border}`, background: theme.card, color: theme.text, fontSize:12 }} />
              <Bar dataKey="scans" fill={C.success} radius={[0,6,6,0]} name="Scans" animationDuration={reduced?0:1000} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="🥜 Allergen Distribution" theme={theme} delay={420} reduced={reduced}>
          <AllergenPieChart data={allergenData} innerRadius={60} outerRadius={90} height={240} reduced={reduced} theme={theme} />
        </ChartCard>
      </div>

      {/* Live Activity Feed */}
      <ChartCard title="🔴 Live Activity Feed" theme={theme} delay={500} reduced={reduced}
        action={<div style={{ display:"flex", alignItems:"center", gap:6 }}><div style={{ width:7,height:7,borderRadius:"50%",background:C.error, animation:reduced?"none":"pulse 2s ease-in-out infinite" }} /><span style={{ fontSize:12, fontWeight:700, color:C.error }}>Live</span></div>}>
        <div>
          {feed.map((ev,i) => (
            <div key={ev.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 0", borderBottom: i < feed.length-1 ? `1px solid ${theme.border}` : "none", animation: i===0 && !reduced ? "fadeIn 0.4s ease" : "none" }}>
              <div style={{ width:36, height:36, borderRadius:10, background:`${ev.color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{ev.icon}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <span style={{ fontSize:13, fontWeight:700, color: theme.text }}>{ev.user}</span>
                <span style={{ fontSize:13, color: theme.textSub }}> — {ev.action}</span>
              </div>
              <span style={{ fontSize:11, color: theme.textSub, whiteSpace:"nowrap", flexShrink:0 }}>{ev.time}</span>
            </div>
          ))}
        </div>
      </ChartCard>

      {/* System Health Grid */}
      <ChartCard title="⚙️ System Health" theme={theme} delay={580} reduced={reduced}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:12 }}>
          {[
            {label:"API Response",  value:"124ms",  ok:true },
            {label:"Database",      value:"Healthy", ok:true },
            {label:"Cache Rate",    value:"94.2%",  ok:true },
            {label:"Error Rate",    value:"0.12%",  ok:true },
            {label:"Uptime",        value:"99.97%", ok:true },
            {label:"Sessions",      value:"3,421",  ok:null },
          ].map(m => (
            <div key={m.label} style={{ background: theme.hover, borderRadius:10, padding:"14px 16px", border:`1px solid ${theme.border}` }}>
              <div style={{ fontSize:11, color: theme.textSub, fontWeight:700, marginBottom:7, textTransform:"uppercase", letterSpacing:0.5 }}>{m.label}</div>
              <div style={{ fontSize:18, fontWeight:800, color: m.ok===true ? C.success : m.ok===false ? C.error : C.info }}>{m.value}</div>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// USER MANAGEMENT SCREEN
// ══════════════════════════════════════════════════════════════════════════════
