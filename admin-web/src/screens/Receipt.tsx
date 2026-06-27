import React, { useState, useEffect, useRef, useCallback } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { C, DT } from "../tokens";
import { AnimatedCounter, FadeIn, Badge, Btn, StatCard, ChartCard, Breadcrumb, PageHeader, Modal, AllergenPieChart, DataTable, Pagination, Toggle, Input, Select, AlertBanner, Spinner, AdminProgressBar, AdminTooltip, CheckboxInput, RadioGroup, AdminTextarea } from "../components/Shared";
import { exportToCSV } from "../utils";
import { userGrowthData, topProducts, allergenData, expirationTimeline, categoryData, alertsData, USERS, REPORTS, LIVE_EVENTS } from "../data";
import { useLiveFeed } from "../hooks";

const RECEIPTS_DATA = [
  {id:1,store:"Walmart",   date:"Jun 6, 2026",total:"$47.23",items:12,status:"Processed", emoji:"🛒"},
  {id:2,store:"Kroger",    date:"Jun 3, 2026",total:"$31.89",items:8, status:"Processed", emoji:"🏪"},
  {id:3,store:"Whole Foods",date:"May 31, 2026",total:"$62.40",items:15,status:"Processing",emoji:"🌿"},
  {id:4,store:"Trader Joe's",date:"May 28, 2026",total:"$28.15",items:7,status:"Processed",emoji:"🎯"},
];

export default function ReceiptScreen({ theme, reduced, toast }) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);

  const simulateUpload = () => {
    setUploading(true);
    setTimeout(() => { setUploading(false); setUploadDone(true); toast("Receipt processed successfully!"); setTimeout(() => setUploadDone(false), 3000); }, 2200);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      <Breadcrumb items={["Admin","Receipt Management"]} theme={theme} />
      <PageHeader icon="🧾" title="Receipt Management" subtitle="Upload receipts for AI extraction and expense tracking" theme={theme} />

      {/* KPIs */}
      <div className="admin-kpi-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:14 }}>
        <StatCard icon="🧾" title="Total Receipts"   value={47}     trend="+8 this month"   trendUp color={C.primary}  delay={0}  reduced={reduced} theme={theme} />
        <StatCard icon="💰" title="Total Tracked"    value={1847}   prefix="$" trend="+$340 this wk" trendUp color={C.success} delay={80} reduced={reduced} theme={theme} />
        <StatCard icon="🤖" title="AI Accuracy"      value="98.4%"             trend="+0.3% this mo" trendUp color={C.teal}    delay={160} reduced={reduced} theme={theme} />
        <StatCard icon="⏱"  title="Avg Process Time" value="2.3s"               trend="vs 4.1s last mo" trendUp color={C.info} delay={240} reduced={reduced} theme={theme} />
      </div>

      {/* Upload Area */}
      <FadeIn delay={280} reduced={reduced}>
        <div onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); simulateUpload(); }}
          style={{ border:`2.5px dashed ${dragOver ? C.primary : theme.border}`, borderRadius:16, padding:"36px 24px", textAlign:"center", background: dragOver ? C.primarySoft : theme.card, transition:"all 0.2s", cursor:"pointer" }}
          onClick={simulateUpload}>
          {uploading ? (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
              <div style={{ fontSize:48 }}>⏳</div>
              <div style={{ fontSize:16, fontWeight:700, color:theme.text }}>Processing Receipt…</div>
              <div style={{ fontSize:13, color:theme.textSub }}>AI is extracting items and prices</div>
              <div style={{ width:200, height:6, background:theme.border, borderRadius:99, overflow:"hidden" }}>
                <div style={{ height:"100%", background:C.primary, borderRadius:99, animation:"loadBar 2.2s ease-in-out forwards" }} />
              </div>
            </div>
          ) : uploadDone ? (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
              <div style={{ fontSize:48 }}>✅</div>
              <div style={{ fontSize:16, fontWeight:700, color:C.success }}>Receipt Processed!</div>
              <div style={{ fontSize:13, color:theme.textSub }}>12 items extracted with 98% confidence</div>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
              <div style={{ fontSize:48 }}>📸</div>
              <div style={{ fontSize:16, fontWeight:700, color:theme.text }}>Upload Receipt</div>
              <div style={{ fontSize:13, color:theme.textSub }}>Drag & drop or click to upload · JPG, PNG, PDF</div>
              <Btn variant="primary" size="md" onClick={e => { e.stopPropagation(); simulateUpload(); }}>Choose File</Btn>
            </div>
          )}
        </div>
      </FadeIn>

      {/* Recent Receipts Table */}
      <ChartCard title="📋 Recent Receipts" theme={theme} delay={360} reduced={reduced}
        action={<Btn variant="secondary" size="sm" onClick={() => { exportToCSV(RECEIPTS_DATA,[{key:"store",label:"Store"},{key:"date",label:"Date"},{key:"total",label:"Total"},{key:"items",label:"Items"},{key:"status",label:"Status"}],"receipts"); toast("CSV downloaded!"); }}>⬇ Export</Btn>}>
        <DataTable theme={theme}
          columns={[
            {key:"emoji", label:"",     render:v => <span style={{ fontSize:22 }}>{v}</span>},
            {key:"store", label:"Store",  render:v => <span style={{ fontWeight:700, color:theme.text }}>{v}</span>},
            {key:"date",  label:"Date"},
            {key:"items", label:"Items",  render:v => <span style={{ fontWeight:600 }}>{v} items</span>},
            {key:"total", label:"Total",  render:v => <span style={{ fontWeight:800, color:C.success }}>{v}</span>},
            {key:"status",label:"Status", render:v => <Badge color={v==="Processed"?C.success:C.warning} bg={v==="Processed"?C.successSoft:C.warningSoft}>{v}</Badge>},
            {key:"actions",label:"Actions",render:(_,row) => (
              <div style={{ display:"flex", gap:6 }}>
                <Btn variant="secondary" size="sm" onClick={() => toast(`Viewing ${row.store} receipt`)}>👁 View</Btn>
                <Btn variant="secondary" size="sm" onClick={() => toast(`Re-processing ${row.store}`)}>🔄</Btn>
              </div>
            )},
          ]}
          rows={RECEIPTS_DATA.map(r => ({...r, actions:null}))} />
      </ChartCard>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// AI SUPPORT CHAT SCREEN — doc: WEB Section "AI Support Chat"
// ══════════════════════════════════════════════════════════════════════════════
const SUGGESTED_QUESTIONS = [
  "How do I set up health profile?","How does barcode scanning work?",
  "Can I export my inventory data?","How are expiry alerts calculated?",
  "What allergens are tracked?","How to compare prices?",
];

const CANNED_ANSWERS = {
  "How do I set up health profile?": "To set up your health profile: go to **Profile → Health Profile**, then add your allergens, dietary restrictions, and health conditions. This enables personalized alerts and recommendations.",
  "How does barcode scanning work?": "The barcode scanner uses your device camera to read product barcodes. Simply tap **Scan Item**, point at the barcode, and the app auto-detects the product, nutritional info, and allergens from our database.",
  "Can I export my inventory data?": "Yes! Go to **Analytics → Export** or **Reports** to download your inventory as CSV or Excel. You can also export individual reports from the Analytics and Inventory screens.",
  "How are expiry alerts calculated?": "Expiry alerts are based on the expiration date you set when adding items. Items are flagged as **Critical** (≤2 days), **Warning** (3-5 days), and **Fresh** (6+ days).",
  "What allergens are tracked?": "We track 10 major allergens: Peanuts, Tree Nuts, Milk, Eggs, Soy, Wheat, Gluten, Fish, Shellfish, and Sesame. Set your profile to get instant alerts when adding items.",
  "How to compare prices?": "Go to **Price Comparison** in the sidebar. You can search for any item to see prices across Walmart, Kroger, Aldi, and Trader Joe's, plus view price history charts.",
};

