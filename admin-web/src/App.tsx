import React, { useState, useEffect, useCallback } from "react";
import { C, DT, buildTheme } from "./tokens";
import { useBreakpoint, useOrientation, usePrefersReducedMotion } from "./hooks";
import { AdminToastStack } from "./components/Shared";
import GlobalSearch from "./screens/GlobalSearch";
import DashboardScreen from "./screens/Dashboard";
import UsersScreen from "./screens/Users";
import AIAnalyticsScreen from "./screens/AIAnalytics";
import AnalyticsScreen from "./screens/Analytics";
import InventoryScreen from "./screens/Inventory";
import InventoryOptimizationScreen from "./screens/InventoryOptimization";
import HealthScreen from "./screens/Health";
import PriceComparisonScreen from "./screens/PriceComparison";
import RetailerIntegrationScreen from "./screens/RetailerIntegration";
import SustainabilityScreen from "./screens/Sustainability";
import BlockchainAuditScreen from "./screens/BlockchainAudit";
import ReceiptScreen from "./screens/Receipt";
import AIChatScreen from "./screens/AIChat";
import SupportScreen from "./screens/Support";
import ApiDocsScreen from "./screens/ApiDocs";
import SystemHealthScreen from "./screens/SystemHealth";
import SettingsScreen from "./screens/Settings";
import ReportsScreen from "./screens/Reports";

const NAV = [
  { id:"dashboard",        label:"Dashboard",            icon:"📊" },
  { id:"users",            label:"Users",                icon:"👥" },
  { id:"ai-analytics",     label:"AI Analytics",         icon:"🧠" },
  { id:"analytics",        label:"Analytics",            icon:"📈" },
  { id:"inventory",        label:"Inventory",            icon:"📦" },
  { id:"inv-optimize",     label:"Inv. Optimize",        icon:"⚡" },
  { id:"health",           label:"Health",               icon:"💚" },
  { id:"price",            label:"Price Comparison",     icon:"💰" },
  { id:"retailer",         label:"Retailer Integration", icon:"🏪" },
  { id:"sustainability",   label:"Sustainability",        icon:"🌱" },
  { id:"blockchain-audit", label:"Blockchain Audit",     icon:"⛓" },
  { id:"receipts",         label:"Receipts",             icon:"🧾" },
  { id:"aichat",           label:"AI Support",           icon:"🤖" },
  { id:"support",          label:"Support & Feedback",   icon:"🎫" },
  { id:"apidocs",          label:"API Docs",             icon:"📖" },
  { id:"system-health",    label:"System Health",        icon:"🖥" },
  { id:"settings",         label:"Settings",             icon:"⚙️" },
  { id:"reports",          label:"Reports",              icon:"📋" },
];

export default function WebAdmin() {
  const [screen,        setScreen]       = useState("dashboard");
  const [toasts,        setToasts]       = useState<any[]>([]);
  const [collapsed,     setCollapsed]    = useState(false);
  const [mobileNavOpen, setMobileNavOpen]= useState(false);
  const [isDark,        setDark]         = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme:dark)").matches);
  const [highContrast,  setHighContrast] = useState(false);
  const bp          = useBreakpoint();
  const isLandscape = useOrientation();
  const reduced     = usePrefersReducedMotion();
  const theme       = buildTheme(isDark, highContrast);

  useEffect(() => {
    if (bp === "mobile" || bp === "tablet") setCollapsed(true);
    else setCollapsed(false);
  }, [bp, isLandscape]);

  const isMobile  = bp === "mobile" || (bp === "tablet" && !isLandscape);
  const sidebarW  = isMobile ? 0 : collapsed ? 64 : 280;
  const current   = NAV.find(n => n.id === screen);

  const toast = useCallback((msg: string, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);

  function NavItem({ item }: { item: typeof NAV[0] }) {
    const active = screen === item.id;
    return (
      <button onClick={() => { setScreen(item.id); if (isMobile) setMobileNavOpen(false); }}
        aria-current={active ? "page" : undefined}
        title={collapsed ? item.label : ""}
        style={{ display:"flex", alignItems:"center", gap:12, padding: collapsed ? "11px 16px" : "11px 14px", borderRadius:9, border:"none", cursor:"pointer", width:"100%", textAlign:"left", background: active ? C.primarySoft : "transparent", color: active ? C.primary : theme.textSub, fontWeight: active ? 700 : 500, fontSize:14, borderLeft:`3px solid ${active ? C.primary : "transparent"}`, transition:"all 0.16s ease", fontFamily:"'Plus Jakarta Sans',sans-serif", whiteSpace:"nowrap", overflow:"hidden" }}
        onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background=theme.hover; }}
        onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background="transparent"; }}>
        <span style={{ fontSize:20, flexShrink:0 }}>{item.icon}</span>
        {!collapsed && <span style={{ overflow:"hidden", textOverflow:"ellipsis" }}>{item.label}</span>}
      </button>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Serif+Display&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:${theme.bg};font-family:'Plus Jakarta Sans',sans-serif;-webkit-font-smoothing:antialiased;color:${theme.text};}
        button,input,select,textarea{font-family:'Plus Jakarta Sans',sans-serif;}
        @keyframes modalIn{from{opacity:0;transform:scale(0.94) translateY(-12px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes toastIn{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes sidebarIn{from{transform:translateX(-100%)}to{transform:translateX(0)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes shimmerWave{0%{background-position:-1000px 0}100%{background-position:1000px 0}}
        @keyframes scaleIn{from{transform:scale(0.95);opacity:0}to{transform:scale(1);opacity:1}}
        @keyframes slideInUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
        input:focus,select:focus,textarea:focus{border-color:${C.primary} !important;box-shadow:0 0 0 3px rgba(99,102,241,0.15) !important;}
        *:focus-visible{outline:3px solid ${C.primary};outline-offset:2px;border-radius:6px;}
        button:active{transform:scale(0.97);}
        ::-webkit-scrollbar{width:6px;height:6px;}
        ::-webkit-scrollbar-thumb{background:${theme.border};border-radius:99px;}
        ::-webkit-scrollbar-track{background:transparent;}
        html,body{width:100%;overflow-x:hidden;}
        @media screen and (max-width:767px){
          .admin-kpi-grid{grid-template-columns:repeat(2,1fr) !important;}
          .admin-chart-grid{grid-template-columns:1fr !important;}
          .admin-main-pad{padding:14px 12px !important;}
        }
        @media screen and (min-width:768px) and (max-width:1023px) and (orientation:portrait){
          .admin-kpi-grid{grid-template-columns:repeat(2,1fr) !important;}
          .admin-main-pad{padding:18px 16px !important;}
        }
      `}</style>

      {/* Skip link */}
      <a href="#admin-main" style={{ position:"absolute", top:-99, left:0, zIndex:9999, background:C.primary, color:"white", padding:"10px 18px", borderRadius:"0 0 10px 0", fontWeight:700, textDecoration:"none", fontSize:14 }}
        onFocus={e => (e.target as HTMLElement).style.top="0"} onBlur={e => (e.target as HTMLElement).style.top="-99px"}>
        Skip to main content
      </a>

      <div style={{ display:"flex", minHeight:"100vh", background: theme.bg }}>

        {/* Mobile overlay nav */}
        {isMobile && mobileNavOpen && (
          <div style={{ position:"fixed", inset:0, zIndex:500, background:"rgba(0,0,0,0.55)", backdropFilter:"blur(3px)" }} onClick={() => setMobileNavOpen(false)}>
            <aside onClick={e => e.stopPropagation()}
              style={{ width:"min(85%,320px)", height:"100%", background:theme.surface, borderRight:`1.5px solid ${theme.border}`, display:"flex", flexDirection:"column", animation:reduced?"none":"sidebarIn 0.28s ease", overflowY:"auto" }}>
              <div style={{ padding:"18px 16px 14px", background:"linear-gradient(145deg,#4F46E5,#7C3AED,#EC4899)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:38, height:38, borderRadius:10, background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, border:"2px solid rgba(255,255,255,0.3)" }}>🥗</div>
                  <div>
                    <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:16, fontWeight:700, color:"white" }}>GET Admin</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.75)" }}>v1.1 · Production</div>
                  </div>
                </div>
                <button onClick={() => setMobileNavOpen(false)} style={{ width:32, height:32, borderRadius:9, border:"none", background:"rgba(255,255,255,0.2)", color:"white", cursor:"pointer", fontSize:15, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
              </div>
              <nav aria-label="Admin navigation" style={{ flex:1, padding:"10px 8px", display:"flex", flexDirection:"column", gap:2 }}>
                {NAV.map(item => {
                  const active = screen === item.id;
                  return (
                    <button key={item.id} onClick={() => { setScreen(item.id); setMobileNavOpen(false); }}
                      aria-current={active ? "page" : undefined}
                      style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 14px", borderRadius:9, border:"none", cursor:"pointer", width:"100%", textAlign:"left", background:active?C.primarySoft:"transparent", color:active?C.primary:theme.textSub, fontWeight:active?700:500, fontSize:14, borderLeft:`3px solid ${active?C.primary:"transparent"}`, transition:"all 0.15s", fontFamily:"'Plus Jakarta Sans',sans-serif", minHeight:48 }}
                      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background=theme.hover; }}
                      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background="transparent"; }}>
                      <span style={{ fontSize:20, flexShrink:0, width:24, textAlign:"center" }}>{item.icon}</span>
                      <span>{item.label}</span>
                      {active && <span style={{ marginLeft:"auto", width:8, height:8, borderRadius:"50%", background:C.primary, flexShrink:0 }} />}
                    </button>
                  );
                })}
              </nav>
              <div style={{ padding:"12px 16px 20px", borderTop:`1px solid ${theme.border}`, fontSize:12, color:theme.textSub, textAlign:"center" }}>
                GET Admin v1.1 · All rights reserved
              </div>
            </aside>
          </div>
        )}

        {/* Persistent Sidebar */}
        {!isMobile && (
          <aside style={{ width:sidebarW, background: theme.surface, borderRight:`1.5px solid ${theme.border}`, display:"flex", flexDirection:"column", flexShrink:0, position:"sticky", top:0, height:"100vh", transition:"width 0.25s ease", overflowX:"hidden", overflowY:"auto" }}>
            <div style={{ padding: collapsed ? "18px 12px" : "18px 16px", borderBottom:`1px solid ${theme.border}`, display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#1E3A8A,#7C3AED)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>🥗</div>
              {!collapsed && (
                <div style={{ overflow:"hidden" }}>
                  <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:15, fontWeight:700, color: theme.text, lineHeight:1.25, whiteSpace:"nowrap" }}>GET Admin</div>
                  <div style={{ fontSize:11, color: theme.textSub, whiteSpace:"nowrap" }}>v1.1 · Production</div>
                </div>
              )}
            </div>
            <nav aria-label="Admin navigation" style={{ flex:1, padding:"10px 8px", display:"flex", flexDirection:"column", gap:2 }}>
              {NAV.map(item => <NavItem key={item.id} item={item} />)}
            </nav>
            <div style={{ padding:"10px 8px", borderTop:`1px solid ${theme.border}` }}>
              <button onClick={() => setCollapsed(c => !c)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", borderRadius:9, border:"none", cursor:"pointer", width:"100%", background:"transparent", color: theme.textSub, fontSize:14, fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:500, transition:"all 0.15s" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background=theme.hover}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background="transparent"}>
                <span style={{ fontSize:18, flexShrink:0 }}>{collapsed ? "→" : "←"}</span>
                {!collapsed && "Collapse"}
              </button>
            </div>
          </aside>
        )}

        {/* Main area */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, overflowX:"hidden" }}>

          {/* Header */}
          <header style={{ height:64, background: theme.surface, borderBottom:`1.5px solid ${theme.border}`, boxShadow:"0 1px 4px rgba(0,0,0,0.06)", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 20px", position:"sticky", top:0, zIndex:200, gap:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              {isMobile && (
                <button onClick={() => setMobileNavOpen(true)} aria-label="Open navigation menu" aria-expanded={mobileNavOpen}
                  style={{ background:theme.hover, border:"none", borderRadius:9, width:42, height:42, cursor:"pointer", fontSize:20, display:"flex", alignItems:"center", justifyContent:"center" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background=theme.border}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background=theme.hover}>
                  ☰
                </button>
              )}
              <div style={{ fontSize:15, fontWeight:700, color: theme.text, display:"flex", alignItems:"center", gap:8, whiteSpace:"nowrap" }}>
                <span>{current?.icon}</span> {!isMobile && current?.label}
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              {!isMobile && <GlobalSearch theme={theme} bp={bp} onNavigate={setScreen} toast={toast} />}
              <button onClick={() => setDark(d => !d)} aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                style={{ width:40, height:40, borderRadius:9, background: theme.hover, border:"none", cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>
                {isDark ? "☀️" : "🌙"}
              </button>
              <button style={{ width:40, height:40, borderRadius:9, background: theme.hover, border:"none", cursor:"pointer", fontSize:18, position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }} aria-label="Notifications (3 unread)">
                🔔
                <div style={{ position:"absolute", top:8, right:8, width:9, height:9, borderRadius:"50%", background:C.error, border:`2px solid ${theme.surface}` }} />
              </button>
              <div style={{ width:38, height:38, borderRadius:"50%", background:"linear-gradient(135deg,#1E3A8A,#7C3AED)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, cursor:"pointer", flexShrink:0 }} title="Alice Johnson — Admin" role="button" tabIndex={0} aria-label="User menu">
                👤
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main id="admin-main" className="admin-main-pad" style={{ flex:1, overflowY:"auto", padding: isMobile ? 16 : bp==="tablet" ? 20 : 28 }}>
            {screen === "dashboard"        && <DashboardScreen           theme={theme} reduced={reduced} toast={toast} />}
            {screen === "users"            && <UsersScreen               theme={theme} reduced={reduced} toast={toast} />}
            {screen === "ai-analytics"     && <AIAnalyticsScreen         theme={theme} reduced={reduced} toast={toast} />}
            {screen === "analytics"        && <AnalyticsScreen           theme={theme} reduced={reduced} toast={toast} />}
            {screen === "inventory"        && <InventoryScreen           theme={theme} reduced={reduced} />}
            {screen === "inv-optimize"     && <InventoryOptimizationScreen theme={theme} reduced={reduced} toast={toast} />}
            {screen === "health"           && <HealthScreen              theme={theme} reduced={reduced} />}
            {screen === "price"            && <PriceComparisonScreen     theme={theme} reduced={reduced} toast={toast} />}
            {screen === "retailer"         && <RetailerIntegrationScreen  theme={theme} reduced={reduced} toast={toast} />}
            {screen === "sustainability"   && <SustainabilityScreen      theme={theme} reduced={reduced} toast={toast} />}
            {screen === "blockchain-audit" && <BlockchainAuditScreen     theme={theme} reduced={reduced} toast={toast} />}
            {screen === "receipts"         && <ReceiptScreen             theme={theme} reduced={reduced} toast={toast} />}
            {screen === "aichat"           && <AIChatScreen              theme={theme} reduced={reduced} />}
            {screen === "support"          && <SupportScreen             theme={theme} reduced={reduced} toast={toast} />}
            {screen === "apidocs"          && <ApiDocsScreen             theme={theme} reduced={reduced} toast={toast} />}
            {screen === "system-health"    && <SystemHealthScreen         theme={theme} reduced={reduced} toast={toast} />}
            {screen === "settings"         && <SettingsScreen             theme={theme} reduced={reduced} toast={toast} isDark={isDark} setDark={setDark} highContrast={highContrast} setHighContrast={setHighContrast} />}
            {screen === "reports"          && <ReportsScreen             theme={theme} reduced={reduced} toast={toast} />}
          </main>
        </div>
      </div>

      <AdminToastStack toasts={toasts} theme={theme} />
    </>
  );
}
