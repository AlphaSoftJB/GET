import React, { useState, useEffect, useRef, useCallback } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { C, DT } from "../tokens";
import { AnimatedCounter, FadeIn, Badge, Btn, StatCard, ChartCard, Breadcrumb, PageHeader, Modal, AllergenPieChart, DataTable, Pagination, Toggle, Input, Select, AlertBanner, Spinner, AdminProgressBar, AdminTooltip, CheckboxInput, RadioGroup, AdminTextarea } from "../components/Shared";
import { exportToCSV } from "../utils";
import { userGrowthData, topProducts, allergenData, expirationTimeline, categoryData, alertsData, USERS, REPORTS, LIVE_EVENTS } from "../data";
import { useLiveFeed } from "../hooks";

export default function AnalyticsScreen({ theme, toast, reduced }) {
  const [dateRange, setDateRange] = useState("Last 30 Days");
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      <Breadcrumb items={["Admin","Analytics"]} theme={theme} />
      <PageHeader icon="📈" title="Analytics Dashboard" subtitle="Detailed reporting and data insights across the platform" theme={theme}
        action={
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            <Select id="date-range" options={["Today","This Week","This Month","Last 30 Days","Custom"]} theme={theme} value={dateRange} onChange={e => setDateRange(e.target.value)} />
            <Btn variant="secondary" size="md" onClick={() => toast("Exporting report…","info")}>⬇ Export</Btn>
          </div>
        } />

      <ChartCard title="📊 Scans Over Time" theme={theme} delay={0} reduced={reduced} action={<Badge color={C.primary}>{dateRange}</Badge>}>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={userGrowthData}>
            <defs>
              <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.primary} stopOpacity={0.15}/>
                <stop offset="95%" stopColor={C.primary} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
            <XAxis dataKey="date" tick={{ fontSize:12, fill:theme.textSub }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize:12, fill:theme.textSub }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius:10, border:`1px solid ${theme.border}`, background: theme.card, color: theme.text, fontSize:12 }} />
            <Area type="monotone" dataKey="scans" stroke={C.primary} strokeWidth={2.5} fill="url(#scanGrad)" name="Scans" animationDuration={reduced?0:1200} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:16 }}>
        <ChartCard title="📦 Top Products Scanned" theme={theme} delay={100} reduced={reduced}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
              <XAxis dataKey="name" tick={{ fontSize:10, fill:theme.textSub }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:theme.textSub }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius:8, border:`1px solid ${theme.border}`, background: theme.card, color: theme.text, fontSize:12 }} />
              <Bar dataKey="scans" fill={C.success} radius={[5,5,0,0]} name="Scans" animationDuration={reduced?0:800} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="🥜 Allergen Trends" theme={theme} delay={180} reduced={reduced}>
          <AllergenPieChart data={allergenData} outerRadius={90} height={260} reduced={reduced} theme={theme} />
        </ChartCard>
      </div>

      {/* Activity Timeline */}
      <ChartCard title="🕐 Recent User Activity" theme={theme} delay={260} reduced={reduced}>
        <div>
          {[
            {time:"10m ago", user:"Alice Johnson",  action:"Added 3 items to inventory",         icon:"📦", color:C.primary},
            {time:"25m ago", user:"Bob Smith",      action:"Scanned 5 products via barcode",      icon:"📷", color:C.success},
            {time:"1h ago",  user:"Eve Martinez",   action:"Updated health & allergen profile",   icon:"💚", color:C.success},
            {time:"2h ago",  user:"David Lee",      action:"Browsed recipe recommendations",      icon:"🍳", color:C.warning},
            {time:"3h ago",  user:"Carol Davis",    action:"Reported 2 expired items",            icon:"⚠️", color:C.error},
          ].map((a,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 0", borderBottom: i < 4 ? `1px solid ${theme.border}` : "none" }}>
              <div style={{ width:38, height:38, borderRadius:10, background:`${a.color}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:19, flexShrink:0 }}>{a.icon}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <span style={{ fontSize:14, fontWeight:700, color: theme.text }}>{a.user}</span>
                <span style={{ fontSize:14, color: theme.textSub }}> — {a.action}</span>
              </div>
              <span style={{ fontSize:12, color: theme.textSub, whiteSpace:"nowrap", flexShrink:0 }}>{a.time}</span>
            </div>
          ))}
        </div>
      </ChartCard>

      {/* Export buttons */}
      <FadeIn delay={360} reduced={reduced}>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <Btn variant="secondary" size="md" onClick={() => {
            exportToCSV(userGrowthData, [{key:"date",label:"Date"},{key:"users",label:"Users"},{key:"scans",label:"Scans"}], "user_growth");
            toast("User Growth CSV downloaded!","success");
          }}>📄 Export CSV</Btn>
          <Btn variant="secondary" size="md" onClick={() => {
            exportToCSV(topProducts, [{key:"name",label:"Product"},{key:"scans",label:"Scans"}], "top_products");
            toast("Top Products CSV downloaded!","success");
          }}>📈 Products CSV</Btn>
          <Btn variant="secondary" size="md" onClick={() => {
            exportToCSV(allergenData, [{key:"name",label:"Allergen"},{key:"value",label:"Percentage"}], "allergen_data");
            toast("Allergen Data CSV downloaded!","success");
          }}>🥜 Allergens CSV</Btn>
        </div>
      </FadeIn>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// INVENTORY ANALYTICS SCREEN
// ══════════════════════════════════════════════════════════════════════════════
