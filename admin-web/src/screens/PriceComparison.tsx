import React, { useState, useEffect, useRef, useCallback } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { C, DT } from "../tokens";
import { AnimatedCounter, FadeIn, Badge, Btn, StatCard, ChartCard, Breadcrumb, PageHeader, Modal, AllergenPieChart, DataTable, Pagination, Toggle, Input, Select, AlertBanner, Spinner, AdminProgressBar, AdminTooltip, CheckboxInput, RadioGroup, AdminTextarea } from "../components/Shared";
import { exportToCSV } from "../utils";
import { userGrowthData, topProducts, allergenData, expirationTimeline, categoryData, alertsData, USERS, REPORTS, LIVE_EVENTS } from "../data";
import { useLiveFeed } from "../hooks";

const PRICE_DATA = [
  { item:"Whole Milk",    emoji:"🥛", walmart:2.89, kroger:3.19, aldi:2.49, traderjoes:3.49, history:[3.29,3.19,3.09,2.99,2.89] },
  { item:"Chicken Breast",emoji:"🍗", walmart:4.49, kroger:3.99, aldi:3.79, traderjoes:5.99, history:[5.49,5.29,4.99,4.49,3.99] },
  { item:"Brown Eggs",    emoji:"🥚", walmart:3.29, kroger:3.49, aldi:2.19, traderjoes:3.99, history:[3.99,3.79,3.49,3.29,2.99] },
  { item:"Baby Spinach",  emoji:"🥬", walmart:2.99, kroger:3.29, aldi:1.99, traderjoes:2.49, history:[3.49,3.29,3.09,2.99,2.79] },
  { item:"Greek Yogurt",  emoji:"🫙", walmart:1.29, kroger:1.49, aldi:0.99, traderjoes:1.79, history:[1.79,1.69,1.59,1.49,1.29] },
];
const STORES = ["walmart","kroger","aldi","traderjoes"];
const STORE_NAMES = {walmart:"Walmart",kroger:"Kroger",aldi:"Aldi",traderjoes:"Trader Joe's"};
const STORE_COLORS = {walmart:"#0071CE",kroger:"#003087",aldi:"#E31837",traderjoes:"#c0392b"};

export default function PriceComparisonScreen({ theme, reduced, toast }) {
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const filtered = PRICE_DATA.filter(p => p.item.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      <Breadcrumb items={["Admin","Price Comparison"]} theme={theme} />
      <PageHeader icon="💰" title="Price Comparison Tool" subtitle="Compare prices across stores and track savings" theme={theme}
        action={<Btn variant="secondary" size="sm" onClick={() => toast("Price alert set!","success")}>🔔 Set Alerts</Btn>} />

      {/* Search */}
      <FadeIn delay={0} reduced={reduced}>
        <div style={{ position:"relative" }}>
          <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items to compare prices…"
            style={{ width:"100%", height:42, padding:"0 14px 0 36px", border:`1.5px solid ${theme.border}`, borderRadius:10, fontSize:14, background:theme.inputBg, color:theme.text, fontFamily:"'Plus Jakarta Sans',sans-serif", outline:"none" }} />
        </div>
      </FadeIn>

      {/* Summary Cards */}
      <FadeIn delay={80} reduced={reduced}>
        <div className="admin-kpi-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:14 }}>
          <StatCard icon="💰" title="Total Savings"   value={34}   prefix="$"  suffix=".50" trend="This month"    trendUp color={C.success}  delay={0}  reduced={reduced} theme={theme} />
          <StatCard icon="🏪" title="Stores Tracked"  value={4}                              trend="4 stores live" trendUp color={C.primary}  delay={60} reduced={reduced} theme={theme} />
          <StatCard icon="📉" title="Price Drops"     value={12}                             trend="This week"     trendUp color={C.teal}    delay={120} reduced={reduced} theme={theme} />
          <StatCard icon="🎯" title="Active Alerts"   value={6}                              trend="4 triggered"   trendUp color={C.warning} delay={180} reduced={reduced} theme={theme} />
        </div>
      </FadeIn>

      {/* Price Comparison Table */}
      <ChartCard title="🏪 Price Comparison by Store" theme={theme} delay={160} reduced={reduced}
        action={<Btn variant="secondary" size="sm" onClick={() => { exportToCSV(PRICE_DATA.map(p => ({item:p.item,...Object.fromEntries(STORES.map(s => [STORE_NAMES[s],`$${p[s]}`]))})), [{key:"item",label:"Item"},...STORES.map(s => ({key:STORE_NAMES[s],label:STORE_NAMES[s]}))], "price_comparison"); toast("CSV downloaded!"); }}>⬇ Export</Btn>}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", minWidth:500 }}>
            <thead>
              <tr style={{ background:theme.hover }}>
                <th style={{ padding:"12px 16px", textAlign:"left", fontSize:12, fontWeight:700, color:theme.textSub, borderBottom:`1.5px solid ${theme.border}` }}>Item</th>
                {STORES.map(s => (
                  <th key={s} style={{ padding:"12px 12px", textAlign:"center", fontSize:12, fontWeight:700, color:STORE_COLORS[s], borderBottom:`1.5px solid ${theme.border}` }}>{STORE_NAMES[s]}</th>
                ))}
                <th style={{ padding:"12px 12px", textAlign:"center", fontSize:12, fontWeight:700, color:theme.textSub, borderBottom:`1.5px solid ${theme.border}` }}>Best Deal</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p,i) => {
                const prices = STORES.map(s => p[s]);
                const minPrice = Math.min(...prices);
                const bestStore = STORES[prices.indexOf(minPrice)];
                return (
                  <tr key={i} style={{ borderTop:`1px solid ${theme.border}`, cursor:"pointer", transition:"background 0.12s" }}
                    onClick={() => setSelectedItem(selectedItem?.item === p.item ? null : p)}
                    onMouseEnter={e => e.currentTarget.style.background=theme.hover}
                    onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                    <td style={{ padding:"13px 16px" }}><span style={{ marginRight:8, fontSize:18 }}>{p.emoji}</span><span style={{ fontSize:14, fontWeight:600, color:theme.text }}>{p.item}</span></td>
                    {STORES.map(s => {
                      const isBest = p[s] === minPrice;
                      return (
                        <td key={s} style={{ padding:"13px 12px", textAlign:"center" }}>
                          <span style={{ fontSize:14, fontWeight:isBest?800:400, color:isBest?C.success:theme.text }}>${p[s].toFixed(2)}</span>
                          {isBest && <span style={{ marginLeft:4, fontSize:12 }}>✅</span>}
                        </td>
                      );
                    })}
                    <td style={{ padding:"13px 12px", textAlign:"center" }}>
                      <Badge color={C.success} bg={C.successSoft}>{STORE_NAMES[bestStore]} ${minPrice.toFixed(2)}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Price History for selected item */}
        {selectedItem && (
          <div style={{ marginTop:20, padding:"16px", background:theme.hover, borderRadius:10 }}>
            <div style={{ fontSize:14, fontWeight:700, color:theme.text, marginBottom:12 }}>{selectedItem.emoji} {selectedItem.item} — Price History (last 5 weeks)</div>
            <div style={{ display:"flex", gap:8, alignItems:"flex-end", height:80 }}>
              {selectedItem.history.map((price, i) => {
                const max = Math.max(...selectedItem.history);
                const pct = (price / max) * 100;
                return (
                  <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                    <div style={{ fontSize:10, color:theme.textSub }}>${price.toFixed(2)}</div>
                    <div style={{ width:"100%", height:`${pct}%`, background:`linear-gradient(180deg,${C.primary},${C.primaryDark})`, borderRadius:"4px 4px 0 0", minHeight:8 }} />
                    <div style={{ fontSize:10, color:theme.textSub }}>W{i+1}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </ChartCard>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SUSTAINABILITY SCREEN — doc: WEB Section "Sustainability Metrics"
// ══════════════════════════════════════════════════════════════════════════════
const sustainabilityTimeline = [
  {week:"Wk 1",waste:3.2,co2:2.1},{week:"Wk 2",waste:2.8,co2:1.9},{week:"Wk 3",waste:2.4,co2:1.7},
  {week:"Wk 4",waste:1.9,co2:1.4},{week:"Wk 5",waste:1.4,co2:1.0},{week:"Wk 6",waste:1.1,co2:0.8},
];

