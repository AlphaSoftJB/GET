import React, { useState, useEffect, useRef, useCallback } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { C, DT } from "../tokens";
import { AnimatedCounter, FadeIn, Badge, Btn, StatCard, ChartCard, Breadcrumb, PageHeader, Modal, AllergenPieChart, DataTable, Pagination, Toggle, Input, Select, AlertBanner, Spinner, AdminProgressBar, AdminTooltip, CheckboxInput, RadioGroup, AdminTextarea } from "../components/Shared";
import { exportToCSV } from "../utils";
import { userGrowthData, topProducts, allergenData, expirationTimeline, categoryData, alertsData, USERS, REPORTS, LIVE_EVENTS } from "../data";
import { useLiveFeed } from "../hooks";

export default function ReportsScreen({ theme, toast, reduced }) {
  const [genModal,    setGenModal]    = useState(false);
  const [reportType,  setReportType]  = useState("User");
  const TYPES = [
    {type:"User",      icon:"👥", desc:"User registrations, activity, and engagement reports"},
    {type:"Inventory", icon:"📦", desc:"Inventory summaries and expiration detail reports"},
    {type:"Health",    icon:"💚", desc:"Allergen alert trends and health condition reports"},
    {type:"Analytics", icon:"📈", desc:"Comprehensive analytics and performance summaries"},
  ];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      <Breadcrumb items={["Admin","Reports"]} theme={theme} />
      <PageHeader icon="📋" title="Reports & Export" subtitle="Generate, download, and share system reports" theme={theme}
        action={<Btn variant="primary" size="md" onClick={() => setGenModal(true)}>+ Generate Report</Btn>} />

      {/* Report Type Cards */}
      <FadeIn delay={0} reduced={reduced}>
        <div className="admin-kpi-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:14 }}>
          {TYPES.map((rt,i) => (
            <button key={rt.type} onClick={() => { setReportType(rt.type); setGenModal(true); }}
              style={{ background: theme.card, border:`1.5px solid ${theme.border}`, borderRadius:12, padding:20, cursor:"pointer", textAlign:"left", transition:"all 0.22s ease", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow=`0 8px 28px ${C.primary}18`; e.currentTarget.style.borderColor=C.primary; e.currentTarget.style.transform="translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.06)"; e.currentTarget.style.borderColor=theme.border; e.currentTarget.style.transform=""; }}>
              <div style={{ fontSize:38, marginBottom:14 }}>{rt.icon}</div>
              <div style={{ fontSize:15, fontWeight:700, color: theme.text, marginBottom:7 }}>{rt.type} Report</div>
              <div style={{ fontSize:13, color: theme.textSub, lineHeight:1.55 }}>{rt.desc}</div>
            </button>
          ))}
        </div>
      </FadeIn>

      {/* Generated Reports Table */}
      <ChartCard title="📋 Generated Reports" theme={theme} delay={200} reduced={reduced}>
        <DataTable theme={theme}
          columns={[
            {key:"name",   label:"Report Name",  render:v => <span style={{ fontWeight:700, color: theme.text }}>{v}</span>},
            {key:"type",   label:"Type",          render:v => <Badge color={C.primary} bg={C.primarySoft}>{v}</Badge>},
            {key:"date",   label:"Date"},
            {key:"format", label:"Format",        render:v => <Badge color={theme.textSub} bg={theme.border+"50"}>{v}</Badge>},
            {key:"size",   label:"Size"},
            {key:"actions",label:"Actions",       render:(_,row) => (
              <div style={{ display:"flex", gap:7 }}>
                <Btn variant="primary" size="sm" onClick={() => toast(`Downloading ${row.name}…`)}>⬇</Btn>
                <Btn variant="secondary" size="sm">Share</Btn>
                <button aria-label="Delete" onClick={() => toast("Report deleted","warning")} style={{ width:32, height:32, borderRadius:7, background: C.errorSoft, border:"none", cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>🗑</button>
              </div>
            )},
          ]}
          rows={REPORTS.map(r => ({...r, actions:null}))} />
      </ChartCard>

      {/* Generate Modal */}
      <Modal open={genModal} onClose={() => setGenModal(false)} title="Generate New Report" theme={theme} reduced={reduced}>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <Select label="Report Type" id="gen-type" options={TYPES.map(t => t.type)} theme={theme} value={reportType} onChange={e => setReportType(e.target.value)} />
          <Select label="Date Range"  id="gen-range" options={["Last 7 Days","Last 30 Days","Last Quarter","Custom Range"]} theme={theme} />
          <div>
            <label style={{ fontSize:13, fontWeight:700, color: theme.textSub, display:"block", marginBottom:8 }}>Export Format</label>
            <div style={{ display:"flex", gap:10 }}>
              {["PDF","CSV","Excel"].map(f => (
                <button key={f}
                  style={{ flex:1, height:40, borderRadius:8, border:`1.5px solid ${theme.border}`, background: theme.card, cursor:"pointer", fontSize:14, fontWeight:700, color: theme.text, fontFamily:"'Plus Jakarta Sans',sans-serif", transition:"all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor=C.primary; e.currentTarget.style.color=C.primary; e.currentTarget.style.background=C.primarySoft; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor=theme.border; e.currentTarget.style.color=theme.text; e.currentTarget.style.background=theme.card; }}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:6 }}>
            <Btn variant="secondary" size="md" onClick={() => setGenModal(false)}>Cancel</Btn>
            <Btn variant="primary"   size="md" onClick={() => { setGenModal(false); toast(`${reportType} report generation started!`); }}>Generate Report</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// AI ANALYTICS DASHBOARD — doc: WEB Section 1 (predictive analytics,
//   trend analysis, anomaly detection, user behaviour, waste prediction)
// ══════════════════════════════════════════════════════════════════════════════
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

