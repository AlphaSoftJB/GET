import React, { useState, useEffect, useRef, useCallback } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { C, DT } from "../tokens";
import { AnimatedCounter, FadeIn, Badge, Btn, StatCard, ChartCard, Breadcrumb, PageHeader, Modal, AllergenPieChart, DataTable, Pagination, Toggle, Input, Select, AlertBanner, Spinner, AdminProgressBar, AdminTooltip, CheckboxInput, RadioGroup, AdminTextarea } from "../components/Shared";
import { exportToCSV } from "../utils";
import { userGrowthData, topProducts, allergenData, expirationTimeline, categoryData, alertsData, USERS, REPORTS, LIVE_EVENTS } from "../data";
import { useLiveFeed } from "../hooks";

const STORAGE_ZONES = [
  {zone:"Top Shelf",temp:"35–38°F",items:["Leftovers","Ready-to-eat foods","Herbs"],emoji:"🥗"},
  {zone:"Middle Shelf",temp:"38–40°F",items:["Dairy","Eggs","Beverages"],emoji:"🧀"},
  {zone:"Bottom Shelf",temp:"40°F",items:["Raw meat","Poultry","Fish"],emoji:"🍗"},
  {zone:"Crisper Drawer",temp:"34–36°F",items:["Vegetables","Fruits"],emoji:"🥬"},
  {zone:"Door Shelves",temp:"45°F",items:["Condiments","Juice","Butter"],emoji:"🧴"},
];

export default function InventoryOptimizationScreen({ theme, reduced, toast }) {
  const [appliedTip, setAppliedTip] = useState(null);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      <Breadcrumb items={["Admin","Inventory Optimization"]} theme={theme} />
      <PageHeader icon="⚡" title="Inventory Optimization" subtitle="AI-powered storage recommendations, organization tips, and expiry timeline" theme={theme} />

      {/* KPIs */}
      <div className="admin-kpi-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:14 }}>
        <StatCard icon="⚡" title="Optimization Score" value="78%"   trend="+6% this week"   trendUp color={C.primary}  delay={0}   reduced={reduced} theme={theme} />
        <StatCard icon="💡" title="AI Suggestions"     value={12}    trend="5 critical"      trendUp={false} color={C.warning}  delay={70}  reduced={reduced} theme={theme} />
        <StatCard icon="❄️" title="Temp Violations"    value={2}     trend="Down from 5"     trendUp color={C.info}     delay={140} reduced={reduced} theme={theme} />
        <StatCard icon="📦" title="Space Utilization"  value="82%"   trend="+4% optimized"   trendUp color={C.success}  delay={210} reduced={reduced} theme={theme} />
      </div>

      {/* AI Recommendations */}
      <ChartCard title="🤖 AI Optimization Recommendations" theme={theme} delay={280} reduced={reduced}>
        <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
          {[
            {emoji:"🥛",title:"Move Milk to Middle Shelf",desc:"Whole Milk is currently on door shelf (45°F) — should be at 38°F on middle shelf to extend life by 2 days.",impact:"High",action:"Apply"},
            {emoji:"🍗",title:"Separate Raw Chicken",desc:"Chicken Breast is stored near ready-to-eat foods. Move to bottom shelf to prevent cross-contamination.",impact:"Critical",action:"Apply"},
            {emoji:"🥬",title:"Spinach in Crisper Drawer",desc:"Baby Spinach stored in open area — move to crisper drawer to maintain humidity and extend freshness by 3 days.",impact:"Medium",action:"Apply"},
            {emoji:"📅",title:"FIFO: Rotate New Stock",desc:"New dairy items should go behind existing ones. First-In-First-Out reduces waste by up to 15%.",impact:"Medium",action:"Learn More"},
            {emoji:"🌡️",title:"Fridge Temperature Alert",desc:"Your fridge is running at 43°F — 3°F above optimal. Check thermostat or compressor.",impact:"Critical",action:"Alert Set"},
          ].map((tip,i) => {
            const ic = tip.impact==="Critical"?C.error:tip.impact==="High"?C.warning:C.info;
            const ib = tip.impact==="Critical"?C.errorSoft:tip.impact==="High"?C.warningSoft:C.primarySoft;
            return (
              <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:14, padding:"15px 0", borderBottom:i<4?`1px solid ${theme.border}`:"none" }}>
                <div style={{ width:42, height:42, borderRadius:10, background:ib, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{tip.emoji}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:4 }}>
                    <span style={{ fontSize:14, fontWeight:700, color:theme.text }}>{tip.title}</span>
                    <Badge color={ic} bg={ib}>{tip.impact}</Badge>
                  </div>
                  <div style={{ fontSize:13, color:theme.textSub, lineHeight:1.5 }}>{tip.desc}</div>
                </div>
                <button onClick={() => { setAppliedTip(i); toast(`✅ ${tip.title} applied!`); }}
                  style={{ height:34, padding:"0 14px", borderRadius:8, border:`1.5px solid ${appliedTip===i?C.success:theme.border}`, background:appliedTip===i?C.successSoft:theme.card, cursor:"pointer", fontSize:13, fontWeight:700, color:appliedTip===i?C.success:theme.text, whiteSpace:"nowrap", flexShrink:0, transition:"all 0.2s" }}>
                  {appliedTip===i?"✓ Applied":tip.action}
                </button>
              </div>
            );
          })}
        </div>
      </ChartCard>

      {/* Temperature Zones */}
      <ChartCard title="❄️ Fridge Temperature Zones" theme={theme} delay={360} reduced={reduced}>
        <div className="admin-kpi-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:14 }}>
          {STORAGE_ZONES.map((z,i) => (
            <div key={i} style={{ background:theme.hover, borderRadius:10, padding:"14px 16px", border:`1px solid ${theme.border}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <span style={{ fontSize:24 }}>{z.emoji}</span>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:theme.text }}>{z.zone}</div>
                  <div style={{ fontSize:11, color:C.info, fontWeight:600 }}>❄️ {z.temp}</div>
                </div>
              </div>
              <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                {z.items.map(item => <Badge key={item} color={theme.textSub} bg={theme.border+"50"}>{item}</Badge>)}
              </div>
            </div>
          ))}
        </div>
      </ChartCard>

      {/* Expiration Timeline */}
      <ChartCard title="📅 Expiration Timeline — Next 7 Days" theme={theme} delay={440} reduced={reduced}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", minWidth:400 }}>
            <thead>
              <tr style={{ background:theme.hover }}>
                {["Day","Items Expiring","Action Required","Priority"].map(h => (
                  <th key={h} scope="col" style={{ padding:"10px 14px", textAlign:"left", fontSize:12, fontWeight:700, color:theme.textSub, borderBottom:`1.5px solid ${theme.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {day:"Today",items:"Whole Milk, Chicken Breast",action:"Use immediately or freeze",priority:"critical"},
                {day:"Tomorrow",items:"Sourdough Bread",action:"Make French Toast or freeze",priority:"high"},
                {day:"Day 3",items:"Greek Yogurt",action:"Plan breakfast recipe",priority:"medium"},
                {day:"Day 4",items:"Strawberries",action:"Make smoothie or jam",priority:"medium"},
                {day:"Day 5",items:"Baby Spinach",action:"Add to salad or stir-fry",priority:"low"},
                {day:"Day 7",items:"Orange Juice",action:"Check seal; use soon",priority:"low"},
                {day:"Day 9",items:"Almond Milk",action:"Plan ahead",priority:"info"},
              ].map((row,i) => {
                const pc = row.priority==="critical"?C.error:row.priority==="high"?C.warning:row.priority==="medium"?C.info:C.success;
                const pb = row.priority==="critical"?C.errorSoft:row.priority==="high"?C.warningSoft:row.priority==="medium"?C.primarySoft:C.successSoft;
                return (
                  <tr key={i} style={{ borderTop:`1px solid ${theme.border}` }}>
                    <td style={{ padding:"12px 14px", fontSize:13, fontWeight:700, color:theme.text }}>{row.day}</td>
                    <td style={{ padding:"12px 14px", fontSize:13, color:theme.text }}>{row.items}</td>
                    <td style={{ padding:"12px 14px", fontSize:13, color:theme.textSub }}>{row.action}</td>
                    <td style={{ padding:"12px 14px" }}><Badge color={pc} bg={pb}>{row.priority}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// GLOBAL SEARCH — spec: ENHANCED doc Recommendation #4 (Users / Items / Reports)
// ══════════════════════════════════════════════════════════════════════════════
const SEARCH_ITEMS = [
  {emoji:"🥛",name:"Whole Milk",sub:"Item · Dairy"},{emoji:"🫙",name:"Greek Yogurt",sub:"Item · Dairy"},
  {emoji:"🍞",name:"Sourdough Bread",sub:"Item · Bakery"},{emoji:"🍗",name:"Chicken Breast",sub:"Item · Meat"},
];

