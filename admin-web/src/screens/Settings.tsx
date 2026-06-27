import React, { useState, useEffect, useRef, useCallback } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { C, DT } from "../tokens";
import { AnimatedCounter, FadeIn, Badge, Btn, StatCard, ChartCard, Breadcrumb, PageHeader, Modal, AllergenPieChart, DataTable, Pagination, Toggle, Input, Select, AlertBanner, Spinner, AdminProgressBar, AdminTooltip, CheckboxInput, RadioGroup, AdminTextarea } from "../components/Shared";
import { exportToCSV } from "../utils";
import { userGrowthData, topProducts, allergenData, expirationTimeline, categoryData, alertsData, USERS, REPORTS, LIVE_EVENTS } from "../data";
import { useLiveFeed, useBreakpoint } from "../hooks";

export default function SettingsScreen({ theme, toast, reduced, isDark, setDark, highContrast, setHighContrast }) {
  const [section, setSection] = useState("General");
  const [toggles, setToggles] = useState({ emailNotif:true, pushNotif:true, smsNotif:false, maintenance:false, ssl:true, rateLimit:true });
  const [featureFlags, setFlags] = useState({ arFridge:true, aiHub:true, blockchain:false, advancedAnalytics:true, voiceSearch:false, familySharing:false });
  const t = k => setToggles(p => ({...p,[k]:!p[k]}));
  const ff = k => setFlags(p => ({...p,[k]:!p[k]}));
  const bp = useBreakpoint();
  const isNarrow = bp === "mobile" || bp === "tablet";

  const SECTIONS = ["General","Email","Notifications","API Keys","Security","Backup"];
  const SECTION_ICONS = { General:"⚙️", Email:"📧", Notifications:"🔔", "API Keys":"🔑", Security:"🔒", Backup:"💾" };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      <Breadcrumb items={["Admin","Settings"]} theme={theme} />
      <PageHeader icon="⚙️" title="Settings & Configuration" subtitle="Configure system settings, API keys, and preferences" theme={theme} />

      <FadeIn delay={0} reduced={reduced}>
        {/* ── Responsive layout: row on desktop, column on mobile/tablet ── */}
        <div style={{ display:"flex", flexDirection: isNarrow ? "column" : "row", gap:20, alignItems:"flex-start", width:"100%" }}>

          {/* Settings nav — horizontal scrollable chips on narrow, vertical sidebar on wide */}
          {isNarrow ? (
            <div style={{ display:"flex", gap:8, overflowX:"auto", padding:"2px 0 8px", WebkitOverflowScrolling:"touch", width:"100%", flexShrink:0 }}>
              {SECTIONS.map(s => (
                <button key={s} onClick={() => setSection(s)}
                  style={{ display:"flex", alignItems:"center", gap:7, height:38, padding:"0 14px", borderRadius:99, border:`1.5px solid ${section===s ? C.primary : theme.border}`, cursor:"pointer", whiteSpace:"nowrap", flexShrink:0, background: section===s ? C.primarySoft : theme.card, color: section===s ? C.primary : theme.textSub, fontWeight: section===s ? 700 : 500, fontSize:13, fontFamily:"'Plus Jakarta Sans',sans-serif", transition:"all 0.15s" }}>
                  {SECTION_ICONS[s]} {s}
                </button>
              ))}
            </div>
          ) : (
            <div style={{ width:220, flexShrink:0, background:theme.card, border:`1.5px solid ${theme.border}`, borderRadius:12, padding:8 }}>
              {SECTIONS.map(s => (
                <button key={s} onClick={() => setSection(s)}
                  style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"11px 12px", borderRadius:8, border:"none", cursor:"pointer", textAlign:"left", background: section===s ? C.primarySoft : "transparent", color: section===s ? C.primary : theme.textSub, fontWeight: section===s ? 700 : 500, fontSize:14, borderLeft:`3px solid ${section===s ? C.primary : "transparent"}`, transition:"all 0.15s", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                  {SECTION_ICONS[s]} {s}
                </button>
              ))}
            </div>
          )}

          {/* Settings content panel — full width on narrow, flex-fill on wide */}
          <div style={{ flex:1, minWidth:0, width: isNarrow ? "100%" : undefined, boxSizing:"border-box", background:theme.card, border:`1.5px solid ${theme.border}`, borderRadius:12, padding: isNarrow ? 16 : 24, overflow:"hidden" }}>

            {section === "General" && (
              <div style={{ display:"flex", flexDirection:"column", gap:DT.spacing.base }}>
                <div style={{ fontSize:16, fontWeight:700, color:theme.text, paddingBottom:12, borderBottom:`1px solid ${theme.border}` }}>General Settings</div>
                <Input key="g-name"  label="App Name"      id="g-name"  type="text"  defaultValue="GET — Groceries Expiration Tracker" required hint="The app name shown to users and in notifications" theme={theme} />
                <Input key="g-desc"  label="Description"   id="g-desc"  type="text"  defaultValue="Smart grocery tracking with AI health insights" hint="Brief description of the application" theme={theme} />
                <Input key="g-email" label="Support Email" id="g-email" type="email" defaultValue="support@get-app.com" required hint="Users will see this for support contact" icon="📧" theme={theme} />
                <Input key="g-logo"  label="Logo URL"      id="g-logo"  type="url"   defaultValue="https://get-app.com/logo.png" hint="Must be HTTPS. Recommended: 256×256 PNG" icon="🖼" theme={theme} />
                <AdminTextarea
                  label="App Footer Text" id="g-footer"
                  defaultValue="© 2026 GET App. All rights reserved."
                  hint="Shown in email footers and legal pages" rows={2} theme={theme} />
                <RadioGroup
                  label="Default Language"
                  options={[{value:"en",label:"English (US)"},{value:"es",label:"Español"},{value:"fr",label:"Français"},{value:"de",label:"Deutsch"}]}
                  value="en" onChange={() => {}} theme={theme} />
                <CheckboxInput label="Enable analytics tracking" checked={true} onChange={() => {}} theme={theme} />
                <CheckboxInput label="Allow feature request submissions" checked={true} onChange={() => {}} theme={theme} />
                <div style={{ display:"flex", gap:10, marginTop:4, flexWrap:"wrap" }}>
                  <Btn variant="primary"   size="md" onClick={() => toast("General settings saved!")}>Save Changes</Btn>
                  <Btn variant="secondary" size="md">Cancel</Btn>
                </div>
              </div>
            )}

            {section === "Notifications" && (
              <div>
                <div style={{ fontSize:16, fontWeight:700, color:theme.text, paddingBottom:12, borderBottom:`1px solid ${theme.border}`, marginBottom:4 }}>Notification Settings</div>
                {[
                  {key:"emailNotif", label:"Email Notifications", desc:"Send email alerts for expiring items and health alerts"},
                  {key:"pushNotif",  label:"Push Notifications",  desc:"Send push notifications to registered mobile devices"},
                  {key:"smsNotif",   label:"SMS Notifications",   desc:"Send SMS text alerts for critical expiry alerts"},
                ].map(item => (
                  <div key={item.key} style={{ borderBottom:`1px solid ${theme.border}` }}>
                    <Toggle on={toggles[item.key]} onToggle={() => t(item.key)} label={item.label} desc={item.desc} theme={theme} />
                  </div>
                ))}
                <div style={{ marginTop:20 }}>
                  <Btn variant="primary" size="md" onClick={() => toast("Notification settings saved!")}>Save Changes</Btn>
                </div>
              </div>
            )}

            {section === "Security" && (
              <div>
                <div style={{ fontSize:16, fontWeight:700, color:theme.text, paddingBottom:12, borderBottom:`1px solid ${theme.border}`, marginBottom:4 }}>Security Settings</div>
                {[
                  {key:"ssl",         label:"SSL/TLS Encryption",   desc:"Force HTTPS on all connections"},
                  {key:"rateLimit",   label:"Rate Limiting",         desc:"Limit API requests per user per hour"},
                  {key:"maintenance", label:"Maintenance Mode",      desc:"Take the app offline for scheduled maintenance"},
                ].map(item => (
                  <div key={item.key} style={{ borderBottom:`1px solid ${theme.border}` }}>
                    <Toggle on={toggles[item.key]} onToggle={() => t(item.key)} label={item.label} desc={item.desc} theme={theme} />
                  </div>
                ))}

                {/* Display Preferences */}
                <div style={{ marginTop:20, padding:"16px 0", borderTop:`1px solid ${theme.border}` }}>
                  <div style={{ fontSize:14, fontWeight:700, color:theme.text, marginBottom:12 }}>Display Preferences</div>
                  <Toggle on={isDark}        onToggle={() => setDark(d => !d)}        label="🌙 Dark Mode"     desc="Enable dark theme for reduced eye strain"  theme={theme} />
                  <div style={{ borderTop:`1px solid ${theme.border}` }}>
                    <Toggle on={highContrast} onToggle={() => setHighContrast(h => !h)} label="🎨 High Contrast" desc="Increase color contrast for accessibility" theme={theme} />
                  </div>
                </div>

                {/* Feature Flags */}
                <div style={{ marginTop:20, padding:"16px 0", borderTop:`1px solid ${theme.border}` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:theme.text }}>🚩 Feature Flags</div>
                    <AdminTooltip content="Feature flags control which app features are active. Changes apply immediately to all users." position="right">
                      <span style={{ fontSize:13, color:theme.textSub, cursor:"help" }}>ⓘ</span>
                    </AdminTooltip>
                  </div>
                  <AlertBanner type="warning" title="Production Warning" message="Feature flags affect all active users in real time. Test in staging first." dismissible />
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:10 }}>
                    {[
                      {key:"arFridge",         label:"AR Fridge View",         desc:"3D augmented reality fridge visualization"},
                      {key:"aiHub",            label:"AI Hub",                 desc:"All 6 AI-powered feature cards"},
                      {key:"blockchain",       label:"Blockchain Tracking",    desc:"Polygon-based sustainability verification"},
                      {key:"advancedAnalytics",label:"Advanced Analytics",    desc:"AI predictions and anomaly detection"},
                      {key:"voiceSearch",      label:"Voice Search",          desc:"🎤 Mic-based inventory search"},
                      {key:"familySharing",    label:"Family Sharing",        desc:"Multi-user household management"},
                    ].map(flag => (
                      <div key={flag.key} style={{ padding:"12px 14px", background:theme.hover, borderRadius:DT.radius.lg, border:`1.5px solid ${featureFlags[flag.key]?C.primary+"40":theme.border}` }}>
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
                          <span style={{ fontSize:13, fontWeight:700, color:theme.text }}>{flag.label}</span>
                          <Toggle on={featureFlags[flag.key]} onToggle={() => ff(flag.key)} label="" theme={theme} />
                        </div>
                        <div style={{ fontSize:11, color:theme.textSub }}>{flag.desc}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop:14 }}>
                    <Btn variant="primary" size="md" onClick={() => toast("Feature flags saved!")}>Save Feature Flags</Btn>
                  </div>
                </div>
              </div>
            )}

            {section === "API Keys" && (
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                <div style={{ fontSize:16, fontWeight:700, color:theme.text, paddingBottom:12, borderBottom:`1px solid ${theme.border}` }}>API Keys</div>
                {[
                  {name:"Production API Key",  key:"sk-prod-••••••••••••••••••••••••••••••••", created:"Jan 15, 2026"},
                  {name:"Development API Key", key:"sk-dev-••••••••••••••••••••••••••••••••",  created:"Feb 3, 2026"},
                  {name:"Analytics Key",       key:"sk-anl-••••••••••••••••••••••••••••••••",  created:"Mar 11, 2026"},
                ].map((ak,i) => (
                  <div key={i} style={{ background:theme.hover, border:`1px solid ${theme.border}`, borderRadius:10, padding:16 }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10, flexWrap:"wrap", gap:8 }}>
                      <div style={{ fontSize:14, fontWeight:700, color:theme.text }}>{ak.name}</div>
                      <div style={{ display:"flex", gap:8 }}>
                        <Btn variant="secondary" size="sm" onClick={() => toast("API key copied!","success")}>📋 Copy</Btn>
                        <Btn variant="danger"    size="sm" onClick={() => toast("API key revoked","warning")}>Revoke</Btn>
                      </div>
                    </div>
                    <code style={{ fontSize:12, color:theme.textSub, background:theme.border+"50", padding:"5px 10px", borderRadius:6, display:"block", wordBreak:"break-all", overflowWrap:"break-word" }}>{ak.key}</code>
                    <div style={{ fontSize:12, color:theme.textSub, marginTop:7 }}>Created {ak.created}</div>
                  </div>
                ))}
                <Btn variant="primary" size="md" onClick={() => toast("New API key generated!","success")} style={{ alignSelf:"flex-start" }}>+ Generate New Key</Btn>
              </div>
            )}

            {section === "Email" && (
              <div style={{ display:"flex", flexDirection:"column", gap:DT.spacing.md }}>
                <div style={{ fontSize:16, fontWeight:700, color:theme.text, paddingBottom:12, borderBottom:`1px solid ${theme.border}` }}>Email Settings</div>
                <AlertBanner type="info" title="SMTP Configuration" message="Changes take effect immediately. Send a test email to verify before saving." dismissible />
                <Input label="SMTP Host"     id="smtp-host" type="text"   defaultValue="smtp.gmail.com"        hint="Your mail server hostname" icon="🌐" theme={theme} />
                <Input label="SMTP Port"     id="smtp-port" type="number" defaultValue="587"                  hint="Common: 587 (TLS), 465 (SSL), 25 (plain)" icon="🔌" theme={theme} />
                <Input label="From Address"  id="smtp-from" type="email"  defaultValue="noreply@get-app.com"  hint="Users will see this as the sender address" icon="📧" theme={theme} required />
                <Input label="From Name"     id="smtp-name" type="text"   defaultValue="GET Groceries Tracker" hint="Friendly name displayed in inbox" icon="✏️" theme={theme} />
                <Select label="Email Template" id="email-tpl"
                  options={[{value:"expiry",label:"Expiry Alert"},{value:"weekly",label:"Weekly Summary"},{value:"welcome",label:"Welcome Email"},{value:"report",label:"Monthly Report"}]}
                  hint="Select a template to preview or edit" theme={theme} />
                <AdminTextarea
                  label="Email Signature" id="email-sig"
                  defaultValue="— The GET Team\nhttps://get-app.com"
                  hint="Appended to every outgoing email" rows={3} theme={theme} />
                <CheckboxInput label="Enable HTML email (recommended)" checked={true} onChange={() => {}} theme={theme} />
                <CheckboxInput label="Include unsubscribe link in all emails" checked={true} onChange={() => {}} theme={theme} />
                <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                  <Btn variant="primary"   size="md" onClick={() => toast("Email settings saved!")}>Save Changes</Btn>
                  <Btn variant="secondary" size="md" onClick={() => toast("Test email sent!","info")}>📧 Send Test Email</Btn>
                </div>
              </div>
            )}

            {section === "Backup" && (
              <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
                <div style={{ fontSize:16, fontWeight:700, color:theme.text, paddingBottom:12, borderBottom:`1px solid ${theme.border}` }}>Backup & Restore</div>
                {[
                  {icon:"💾", title:"Manual Backup",    desc:"Create a full system backup right now",              action:"Create Backup",    type:"primary"  },
                  {icon:"📥", title:"Restore from File", desc:"Upload a previous backup file to restore data",      action:"Upload Backup",    type:"secondary"},
                  {icon:"☁️", title:"Cloud Backup",      desc:"Last cloud backup: Jun 7, 2026 at 3:00 AM",          action:"Configure Cloud",  type:"secondary"},
                  {icon:"🗑", title:"Clear All Data",    desc:"Permanently delete all data — this cannot be undone", action:"Clear Data",       type:"danger"   },
                ].map((item,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px", background:theme.hover, borderRadius:10, border:`1px solid ${theme.border}`, gap:16, flexWrap:"wrap" }}>
                    <div style={{ display:"flex", gap:12, alignItems:"flex-start", flex:1, minWidth:180 }}>
                      <span style={{ fontSize:24 }}>{item.icon}</span>
                      <div>
                        <div style={{ fontSize:14, fontWeight:700, color:theme.text }}>{item.title}</div>
                        <div style={{ fontSize:12, color:theme.textSub, marginTop:2, lineHeight:1.5 }}>{item.desc}</div>
                      </div>
                    </div>
                    <Btn variant={item.type} size="sm" onClick={() => toast(`${item.title} initiated…`, item.type==="danger"?"warning":"info")}>{item.action}</Btn>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// REPORTS SCREEN — spec: WEB_ADMIN Screen 7
// ══════════════════════════════════════════════════════════════════════════════
