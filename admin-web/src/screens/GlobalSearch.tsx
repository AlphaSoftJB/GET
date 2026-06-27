import React, { useState, useEffect, useRef, useCallback } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { C, DT } from "../tokens";
import { AnimatedCounter, FadeIn, Badge, Btn, StatCard, ChartCard, Breadcrumb, PageHeader, Modal, AllergenPieChart, DataTable, Pagination, Toggle, Input, Select, AlertBanner, Spinner, AdminProgressBar, AdminTooltip, CheckboxInput, RadioGroup, AdminTextarea } from "../components/Shared";
import { exportToCSV } from "../utils";
import { userGrowthData, topProducts, allergenData, expirationTimeline, categoryData, alertsData, USERS, REPORTS, LIVE_EVENTS } from "../data";
import { useLiveFeed } from "../hooks";

const SEARCH_ITEMS = [
  {emoji:"🥛",name:"Whole Milk",sub:"Item · Dairy"},{emoji:"🫙",name:"Greek Yogurt",sub:"Item · Dairy"},
  {emoji:"🍞",name:"Sourdough Bread",sub:"Item · Bakery"},{emoji:"🍗",name:"Chicken Breast",sub:"Item · Meat"},
];

export default function GlobalSearch({ theme, bp, onNavigate, toast }) {
  const [q, setQ]       = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const ql = q.toLowerCase();
  const results = q.trim() === "" ? [] : [
    ...USERS.filter(u => u.name.toLowerCase().includes(ql) || u.email.toLowerCase().includes(ql))
      .slice(0,3).map(u => ({ icon:u.avatar, name:u.name, sub:`User · ${u.role}`, target:"users" })),
    ...SEARCH_ITEMS.filter(i => i.name.toLowerCase().includes(ql))
      .slice(0,3).map(i => ({ icon:i.emoji, name:i.name, sub:i.sub, target:"inventory" })),
    ...REPORTS.filter(r => r.name.toLowerCase().includes(ql) || r.type.toLowerCase().includes(ql))
      .slice(0,3).map(r => ({ icon:"📄", name:r.name, sub:`Report · ${r.type}`, target:"reports" })),
  ];

  return (
    <div ref={ref} style={{ position:"relative" }}>
      <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:15, pointerEvents:"none" }}>🔍</span>
      <input value={q} onChange={e => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)}
        placeholder="Search users, items, reports…" aria-label="Global search" role="combobox" aria-expanded={open && results.length > 0}
        style={{ width: bp==="laptop"||bp==="desktop" ? 300 : 200, height:38, padding:`0 ${q?36:12}px 0 36px`, border:`1.5px solid ${open?C.primary:theme.border}`, borderRadius:9, fontSize:14, fontFamily:"'Plus Jakarta Sans',sans-serif", background: theme.hover, color: theme.text, outline:"none", transition:"border-color 0.2s" }} />
      {q && (
        <button onClick={() => { setQ(""); setOpen(false); }} aria-label="Clear search"
          style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", width:24, height:24, borderRadius:"50%", border:"none", background:theme.border, color:theme.textSub, cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 }}>✕</button>
      )}
      {/* Results dropdown */}
      {open && q.trim() !== "" && (
        <div role="listbox" style={{ position:"absolute", top:46, right:0, width:"min(340px,90vw)", background:theme.card, border:`1.5px solid ${theme.border}`, borderRadius:12, boxShadow:"0 12px 40px rgba(0,0,0,0.18)", overflow:"hidden", zIndex:500, animation:"fadeIn 0.18s ease" }}>
          {results.length === 0 ? (
            <div style={{ padding:"20px 16px", textAlign:"center", color:theme.textSub, fontSize:13 }}>No results for "{q}"</div>
          ) : (
            <>
              <div style={{ padding:"10px 14px 6px", fontSize:11, fontWeight:800, color:theme.textSub, textTransform:"uppercase", letterSpacing:1 }}>Search Results</div>
              {results.map((r,i) => (
                <button key={i} role="option" onClick={() => { onNavigate(r.target); setOpen(false); setQ(""); toast(`Opening ${r.name}`,"info"); }}
                  style={{ display:"flex", alignItems:"center", gap:12, width:"100%", padding:"11px 14px", border:"none", borderTop: i>0?`1px solid ${theme.border}40`:"none", background:"transparent", cursor:"pointer", textAlign:"left", transition:"background 0.12s" }}
                  onMouseEnter={e => e.currentTarget.style.background=theme.hover}
                  onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                  <div style={{ width:34, height:34, borderRadius:9, background:theme.hover, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>{r.icon}</div>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:theme.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{r.name}</div>
                    <div style={{ fontSize:12, color:theme.textSub }}>{r.sub}</div>
                  </div>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PRICE COMPARISON SCREEN — doc: WEB Section "Price Comparison Tool"
// ══════════════════════════════════════════════════════════════════════════════
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

