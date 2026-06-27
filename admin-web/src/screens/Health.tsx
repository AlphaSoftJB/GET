import React, { useState, useEffect, useRef, useCallback } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { C, DT } from "../tokens";
import { AnimatedCounter, FadeIn, Badge, Btn, StatCard, ChartCard, Breadcrumb, PageHeader, Modal, AllergenPieChart, DataTable, Pagination, Toggle, Input, Select, AlertBanner, Spinner, AdminProgressBar, AdminTooltip, CheckboxInput, RadioGroup, AdminTextarea } from "../components/Shared";
import { exportToCSV } from "../utils";
import { userGrowthData, topProducts, allergenData, expirationTimeline, categoryData, alertsData, USERS, REPORTS, LIVE_EVENTS } from "../data";
import { useLiveFeed } from "../hooks";

export default function HealthScreen({ theme, reduced }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      <Breadcrumb items={["Admin","Health Analytics"]} theme={theme} />
      <PageHeader icon="💚" title="Health & Allergen Analytics" subtitle="Monitor health alerts and allergen distribution across all users" theme={theme} />

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:16 }}>
        <StatCard icon="⚠️" title="Total Alerts"   value={1234} trend="+89 this week"  trendUp color={C.error}   delay={0}   reduced={reduced} theme={theme} />
        <StatCard icon="🥛" title="Top Allergen"   value="Dairy" trend="38% of alerts" trendUp={false} color={C.warning}  delay={80}  reduced={reduced} theme={theme} />
        <StatCard icon="👥" title="Users w/ Alerts" value={456} trend="+23 this month" trendUp color={C.info}    delay={160} reduced={reduced} theme={theme} />
        <StatCard icon="✅" title="Ack. Rate"       value="87%" trend="+4% this week"  trendUp color={C.success} delay={240} reduced={reduced} theme={theme} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:16 }}>
        <ChartCard title="🥜 Allergen Distribution" theme={theme} delay={300} reduced={reduced}>
          <AllergenPieChart data={allergenData} outerRadius={95} height={260} reduced={reduced} theme={theme} />
        </ChartCard>

        <ChartCard title="📈 Alerts Over Time" theme={theme} delay={380} reduced={reduced}>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={alertsData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
              <XAxis dataKey="date" tick={{ fontSize:11, fill:theme.textSub }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:theme.textSub }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius:8, border:`1px solid ${theme.border}`, background: theme.card, color: theme.text, fontSize:12 }} />
              <Line type="monotone" dataKey="alerts" stroke={C.error} strokeWidth={2.5} dot={{ r:4, fill:C.error }} name="Alerts" animationDuration={reduced?0:900} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Top allergens detail table */}
      <ChartCard title="🔍 Top Allergens — Detail" theme={theme} delay={460} reduced={reduced}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", minWidth:460 }}>
            <thead>
              <tr style={{ background: theme.hover }}>
                {["Allergen","Users Affected","Alerts","% of Total","Trend"].map(h => (
                  <th key={h} scope="col" style={{ padding:"10px 14px", textAlign:"left", fontSize:12, fontWeight:700, color: theme.textSub, borderBottom:`1.5px solid ${theme.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allergenData.map((a,i) => (
                <tr key={i} style={{ borderTop:`1px solid ${theme.border}` }}>
                  <td style={{ padding:"12px 14px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:13, height:13, borderRadius:"50%", background: a.color }} />
                      <span style={{ fontSize:14, fontWeight:700, color: theme.text }}>{a.name}</span>
                    </div>
                  </td>
                  <td style={{ padding:"12px 14px", fontSize:14, color: theme.textSub }}>{Math.round(a.value*4.56)}</td>
                  <td style={{ padding:"12px 14px", fontSize:14, color: theme.textSub }}>{Math.round(a.value*12.3)}</td>
                  <td style={{ padding:"12px 14px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ flex:1, height:7, background: theme.border, borderRadius:99 }}>
                        <div style={{ width:`${a.value}%`, height:"100%", background: a.color, borderRadius:99 }} />
                      </div>
                      <span style={{ fontSize:13, fontWeight:700, color: theme.text, minWidth:32 }}>{a.value}%</span>
                    </div>
                  </td>
                  <td style={{ padding:"12px 14px" }}><Badge color={C.success} bg={C.successSoft}>↑ +2%</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SETTINGS SCREEN — spec: WEB_ADMIN Screen 6
// ══════════════════════════════════════════════════════════════════════════════
