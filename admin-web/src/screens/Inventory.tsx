import React, { useState, useEffect, useRef, useCallback } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { C, DT } from "../tokens";
import { AnimatedCounter, FadeIn, Badge, Btn, StatCard, ChartCard, Breadcrumb, PageHeader, Modal, AllergenPieChart, DataTable, Pagination, Toggle, Input, Select, AlertBanner, Spinner, AdminProgressBar, AdminTooltip, CheckboxInput, RadioGroup, AdminTextarea } from "../components/Shared";
import { exportToCSV } from "../utils";
import { userGrowthData, topProducts, allergenData, expirationTimeline, categoryData, alertsData, USERS, REPORTS, LIVE_EVENTS } from "../data";
import { useLiveFeed } from "../hooks";

export default function InventoryScreen({ theme, reduced }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      <Breadcrumb items={["Admin","Inventory Analytics"]} theme={theme} />
      <PageHeader icon="📦" title="Inventory Analytics" subtitle="Waste reduction metrics and expiration tracking" theme={theme} />

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:16 }}>
        <StatCard icon="📦" title="Total Items"     value={12345} trend="+234 this week"     trendUp color={C.primary}  delay={0}   reduced={reduced} theme={theme} />
        <StatCard icon="⏰" title="Expiring Soon"   value={234}   trend="+45 from last week" trendUp={false} color={C.warning}  delay={80}  reduced={reduced} theme={theme} />
        <StatCard icon="🗑" title="Expired (Waste)" value={45}    trend="-12 this week"      trendUp color={C.error}    delay={160} reduced={reduced} theme={theme} />
        <StatCard icon="♻️" title="Waste Reduction"  value="23%"  trend="+5% this month"     trendUp color={C.success}  delay={240} reduced={reduced} theme={theme} />
      </div>

      <ChartCard title="📅 Expiration Timeline" theme={theme} delay={300} reduced={reduced}>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={expirationTimeline}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
            <XAxis dataKey="date" tick={{ fontSize:12, fill:theme.textSub }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize:12, fill:theme.textSub }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius:8, border:`1px solid ${theme.border}`, background: theme.card, color: theme.text, fontSize:12 }} />
            <Legend wrapperStyle={{ fontSize:12, color: theme.textSub }} />
            <Line type="monotone" dataKey="items"   stroke={C.primary} strokeWidth={2.5} dot={false} name="Items Tracked" animationDuration={reduced?0:1000} />
            <Line type="monotone" dataKey="expired" stroke={C.error}   strokeWidth={2.5} dot={false} name="Expired"       animationDuration={reduced?0:1200} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:16 }}>
        <ChartCard title="🗂 Items by Category" theme={theme} delay={380} reduced={reduced}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
              <XAxis dataKey="cat" tick={{ fontSize:11, fill:theme.textSub }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:theme.textSub }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius:8, border:`1px solid ${theme.border}`, background: theme.card, color: theme.text, fontSize:12 }} />
              <Bar dataKey="count" fill={C.primary} radius={[5,5,0,0]} name="Items" animationDuration={reduced?0:800} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="📉 Waste Trends" theme={theme} delay={460} reduced={reduced}>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={expirationTimeline}>
              <defs>
                <linearGradient id="wasteGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.error} stopOpacity={0.25}/>
                  <stop offset="95%" stopColor={C.error} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
              <XAxis dataKey="date" tick={{ fontSize:11, fill:theme.textSub }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:theme.textSub }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius:8, border:`1px solid ${theme.border}`, background: theme.card, color: theme.text, fontSize:12 }} />
              <Area type="monotone" dataKey="expired" stroke={C.error} strokeWidth={2} fill="url(#wasteGrad)" name="Expired" animationDuration={reduced?0:800} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// HEALTH ANALYTICS SCREEN
// ══════════════════════════════════════════════════════════════════════════════
