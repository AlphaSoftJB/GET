import React, { useState, useEffect, useRef, useCallback } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { C, DT } from "../tokens";
import { AnimatedCounter, FadeIn, Badge, Btn, StatCard, ChartCard, Breadcrumb, PageHeader, Modal, AllergenPieChart, DataTable, Pagination, Toggle, Input, Select, AlertBanner, Spinner, AdminProgressBar, AdminTooltip, CheckboxInput, RadioGroup, AdminTextarea } from "../components/Shared";
import { exportToCSV } from "../utils";
import { userGrowthData, topProducts, allergenData, expirationTimeline, categoryData, alertsData, USERS, REPORTS, LIVE_EVENTS } from "../data";
import { useLiveFeed } from "../hooks";

const API_ENDPOINTS = [
  {method:"GET",  path:"/api/v1/items",       desc:"List all inventory items",       auth:true, rateLimit:"100/min"},
  {method:"POST", path:"/api/v1/items",       desc:"Add a new inventory item",       auth:true, rateLimit:"50/min"},
  {method:"GET",  path:"/api/v1/items/:id",   desc:"Get item by ID",                 auth:true, rateLimit:"200/min"},
  {method:"PUT",  path:"/api/v1/items/:id",   desc:"Update item",                    auth:true, rateLimit:"50/min"},
  {method:"DELETE",path:"/api/v1/items/:id",  desc:"Delete item",                    auth:true, rateLimit:"30/min"},
  {method:"POST", path:"/api/v1/scan",        desc:"Process barcode scan",           auth:true, rateLimit:"100/min"},
  {method:"GET",  path:"/api/v1/nutrition/:id",desc:"Get nutritional data for item", auth:true, rateLimit:"200/min"},
  {method:"GET",  path:"/api/v1/recipes",     desc:"Get AI recipe suggestions",      auth:true, rateLimit:"50/min"},
  {method:"GET",  path:"/api/v1/analytics",   desc:"Get user analytics data",        auth:true, rateLimit:"20/min"},
  {method:"POST", path:"/api/v1/ai/chat",     desc:"Send message to AI assistant",   auth:true, rateLimit:"30/min"},
];

const GRAPHQL_SCHEMA = `type Query {
  items(userId: ID!, filter: ItemFilter): [Item!]!
  item(id: ID!): Item
  recipes(userId: ID!): [Recipe!]!
  nutrition(itemId: ID!): Nutrition
  sustainability(userId: ID!): SustainabilityImpact!
  aiInsights(userId: ID!): [AIInsight!]!
  priceComparison(productId: ID!): PriceComparison!
}

type Mutation {
  addItem(input: AddItemInput!): Item!
  scanBarcode(barcode: String!): Item!
  updateHealthProfile(input: HealthInput!): HealthProfile!
  mintAchievementNFT(type: String!): NFTAchievement!
}

type Subscription {
  onExpirationAlert(userId: ID!): ExpirationAlert!
  onPriceAlert(userId: ID!): PriceAlert!
  onARFrameUpdate(userId: ID!): ARFrame!
}`;

export default function ApiDocsScreen({ theme, reduced, toast }) {
  const [activeSection, setSection] = useState("rest");
  const [copiedIdx, setCopied]       = useState(null);

  const copyCode = (code, idx) => {
    navigator.clipboard?.writeText(code);
    setCopied(idx);
    toast("Code copied!","success");
    setTimeout(() => setCopied(null), 2000);
  };

  const methodColor = m => m==="GET"?C.success:m==="POST"?C.primary:m==="PUT"?C.warning:m==="DELETE"?C.error:"#8B5CF6";
  const methodBg    = m => m==="GET"?C.successSoft:m==="POST"?C.primarySoft:m==="PUT"?C.warningSoft:m==="DELETE"?C.errorSoft:"#EDE9FE";

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      <Breadcrumb items={["Admin","API Documentation"]} theme={theme} />
      <PageHeader icon="📖" title="API Documentation" subtitle="REST API, GraphQL schema, rate limits, and SDK downloads" theme={theme}
        action={<Btn variant="secondary" size="sm" onClick={() => toast("SDK package downloading…","info")}>⬇ Download SDK</Btn>} />

      {/* Quick stats */}
      <FadeIn delay={0} reduced={reduced}>
        <div className="admin-kpi-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:14 }}>
          <StatCard icon="🔗" title="REST Endpoints"  value={10}    trend="v1 stable"         trendUp color={C.success} delay={0}   reduced={reduced} theme={theme} />
          <StatCard icon="⚡" title="GraphQL Types"   value={24}    trend="Schema v2.1"        trendUp color={C.primary} delay={70}  reduced={reduced} theme={theme} />
          <StatCard icon="⏱" title="Avg Response"    value="124ms" trend="P99: 450ms"         trendUp color={C.teal}    delay={140} reduced={reduced} theme={theme} />
          <StatCard icon="🚦" title="Uptime"          value="99.97%"trend="Last 30 days"       trendUp color={C.success} delay={210} reduced={reduced} theme={theme} />
        </div>
      </FadeIn>

      {/* Section tabs */}
      <FadeIn delay={280} reduced={reduced}>
        <div style={{ display:"flex", background:theme.card, border:`1.5px solid ${theme.border}`, borderRadius:10, overflow:"hidden", width:"fit-content" }}>
          {[{id:"rest",label:"🔗 REST API"},{id:"graphql",label:"⚡ GraphQL"},{id:"examples",label:"💻 Examples"},{id:"sdk",label:"📦 SDK"}].map(s => (
            <button key={s.id} onClick={() => setSection(s.id)}
              style={{ height:38, padding:"0 16px", border:"none", cursor:"pointer", fontSize:13, fontWeight:700, background:activeSection===s.id?C.primary:"transparent", color:activeSection===s.id?"white":theme.textSub, fontFamily:"'Plus Jakarta Sans',sans-serif", transition:"all 0.18s", whiteSpace:"nowrap" }}>
              {s.label}
            </button>
          ))}
        </div>
      </FadeIn>

      {activeSection === "rest" && (
        <FadeIn delay={0} reduced={reduced}>
          <div style={{ background:theme.card, border:`1.5px solid ${theme.border}`, borderRadius:12, overflow:"hidden" }}>
            {/* Auth info banner */}
            <div style={{ padding:"14px 20px", background:C.primarySoft, borderBottom:`1px solid ${theme.border}`, display:"flex", gap:12, alignItems:"center" }}>
              <span style={{ fontSize:18 }}>🔑</span>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:C.primary }}>Authentication Required</div>
                <div style={{ fontSize:12, color:theme.textSub }}>Include <code style={{ background:C.primarySoft, padding:"1px 6px", borderRadius:4, color:C.primary }}>Authorization: Bearer &lt;token&gt;</code> in all request headers</div>
              </div>
            </div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", minWidth:500 }}>
                <thead>
                  <tr style={{ background:theme.hover }}>
                    {["Method","Endpoint","Description","Rate Limit","Auth"].map(h => (
                      <th key={h} style={{ padding:"11px 16px", textAlign:"left", fontSize:12, fontWeight:700, color:theme.textSub, borderBottom:`1.5px solid ${theme.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {API_ENDPOINTS.map((ep,i) => (
                    <tr key={i} style={{ borderTop:`1px solid ${theme.border}` }}
                      onMouseEnter={e => e.currentTarget.style.background=theme.hover}
                      onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                      <td style={{ padding:"12px 16px" }}><Badge color={methodColor(ep.method)} bg={methodBg(ep.method)}>{ep.method}</Badge></td>
                      <td style={{ padding:"12px 16px" }}><code style={{ fontSize:12, color:C.teal, background:theme.hover, padding:"3px 8px", borderRadius:5 }}>{ep.path}</code></td>
                      <td style={{ padding:"12px 16px", fontSize:13, color:theme.text }}>{ep.desc}</td>
                      <td style={{ padding:"12px 16px", fontSize:12, color:theme.textSub }}>{ep.rateLimit}</td>
                      <td style={{ padding:"12px 16px" }}>{ep.auth && <Badge color={C.success} bg={C.successSoft}>🔒 JWT</Badge>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeIn>
      )}

      {activeSection === "graphql" && (
        <FadeIn delay={0} reduced={reduced}>
          <ChartCard title="⚡ GraphQL Schema" theme={theme} delay={0} reduced={reduced}
            action={<Btn variant="secondary" size="sm" onClick={() => copyCode(GRAPHQL_SCHEMA, "gql")}>📋 Copy</Btn>}>
            <pre style={{ background:theme.hover, borderRadius:10, padding:16, fontSize:12, color:C.teal, overflowX:"auto", lineHeight:1.7, fontFamily:"monospace", whiteSpace:"pre-wrap", wordBreak:"break-all" }}>
              {GRAPHQL_SCHEMA}
            </pre>
          </ChartCard>
          <ChartCard title="📡 Subscriptions" theme={theme} delay={80} reduced={reduced}>
            {[
              {name:"onExpirationAlert",desc:"Real-time expiration alerts for user's items",payload:"ExpirationAlert { itemId, daysLeft, severity }"},
              {name:"onPriceAlert",     desc:"Price drop notifications from monitored stores", payload:"PriceAlert { productId, store, oldPrice, newPrice }"},
              {name:"onARFrameUpdate",  desc:"Live AR frame updates with detected items",      payload:"ARFrame { detectedItems, temperature, humidity }"},
            ].map((sub,i) => (
              <div key={sub.name} style={{ padding:"14px 0", borderBottom:i<2?`1px solid ${theme.border}`:"none" }}>
                <div style={{ fontSize:14, fontWeight:700, color:C.primary, marginBottom:4 }}>{sub.name}</div>
                <div style={{ fontSize:13, color:theme.textSub, marginBottom:6 }}>{sub.desc}</div>
                <code style={{ fontSize:11, color:C.teal, background:theme.hover, padding:"4px 10px", borderRadius:6, display:"block" }}>{sub.payload}</code>
              </div>
            ))}
          </ChartCard>
        </FadeIn>
      )}

      {activeSection === "examples" && (
        <FadeIn delay={0} reduced={reduced}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))", gap:16 }}>
            {[
              {lang:"JavaScript",icon:"🟨",color:"#F59E0B",code:`// Fetch inventory items
const response = await fetch(
  'https://api.get-app.com/v1/items',
  {
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN',
      'Content-Type': 'application/json'
    }
  }
);
const { items } = await response.json();`},
              {lang:"Python",icon:"🐍",color:"#3B82F6",code:`import requests

headers = {
  "Authorization": "Bearer YOUR_TOKEN",
  "Content-Type": "application/json"
}

response = requests.get(
  "https://api.get-app.com/v1/items",
  headers=headers
)
items = response.json()["items"]`},
              {lang:"Java",icon:"☕",color:"#EF4444",code:`// Spring Boot REST client
RestTemplate client = new RestTemplate();
HttpHeaders headers = new HttpHeaders();
headers.set("Authorization", "Bearer " + token);

ResponseEntity<ItemsResponse> resp =
  client.exchange(
    API_URL + "/v1/items",
    HttpMethod.GET,
    new HttpEntity<>(headers),
    ItemsResponse.class
  );`},
              {lang:"GraphQL",icon:"⚡",color:"#8B5CF6",code:`query GetUserItems {
  items(userId: "user123") {
    id
    name
    expiryDate
    nutrition {
      calories
      protein
    }
  }
  aiInsights(userId: "user123") {
    title
    priority
    actionable
  }
}`},
            ].map((ex,i) => (
              <div key={ex.lang} style={{ background:theme.card, border:`1.5px solid ${theme.border}`, borderRadius:12, overflow:"hidden" }}>
                <div style={{ padding:"12px 16px", background:theme.hover, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:18 }}>{ex.icon}</span>
                    <span style={{ fontSize:14, fontWeight:700, color:theme.text }}>{ex.lang}</span>
                  </div>
                  <button onClick={() => copyCode(ex.code, i)}
                    style={{ height:28, padding:"0 10px", borderRadius:6, border:`1px solid ${theme.border}`, background: copiedIdx===i?C.successSoft:theme.card, cursor:"pointer", fontSize:11, fontWeight:700, color:copiedIdx===i?C.success:theme.textSub }}>
                    {copiedIdx===i?"✓ Copied":"📋 Copy"}
                  </button>
                </div>
                <pre style={{ padding:16, fontSize:11, color:C.teal, overflowX:"auto", lineHeight:1.7, fontFamily:"monospace", margin:0, background:theme.card, whiteSpace:"pre-wrap", wordBreak:"break-word" }}>{ex.code}</pre>
              </div>
            ))}
          </div>
        </FadeIn>
      )}

      {activeSection === "sdk" && (
        <FadeIn delay={0} reduced={reduced}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:14 }}>
            {[
              {lang:"JavaScript/Node.js", icon:"🟨", version:"2.1.0", install:"npm install @get-app/sdk"},
              {lang:"Python",             icon:"🐍", version:"2.1.0", install:"pip install get-app-sdk"},
              {lang:"Java/Spring",        icon:"☕", version:"2.1.0", install:"<dependency>get-app-sdk</dependency>"},
              {lang:"Swift/iOS",          icon:"🍎", version:"2.0.1", install:"pod 'GETAppSDK', '~> 2.0'"},
              {lang:"Kotlin/Android",     icon:"🤖", version:"2.0.1", install:"implementation 'com.get-app:sdk:2.0.1'"},
              {lang:"React Native",       icon:"⚛",  version:"2.1.0", install:"npm install @get-app/react-native-sdk"},
            ].map((sdk,i) => (
              <div key={sdk.lang} style={{ background:theme.card, border:`1.5px solid ${theme.border}`, borderRadius:12, padding:20 }}>
                <div style={{ fontSize:32, marginBottom:12 }}>{sdk.icon}</div>
                <div style={{ fontSize:14, fontWeight:700, color:theme.text, marginBottom:4 }}>{sdk.lang}</div>
                <div style={{ fontSize:12, color:theme.textSub, marginBottom:10 }}>v{sdk.version} · MIT License</div>
                <code style={{ fontSize:11, color:C.teal, background:theme.hover, padding:"6px 10px", borderRadius:6, display:"block", marginBottom:12, wordBreak:"break-all" }}>{sdk.install}</code>
                <Btn variant="secondary" size="sm" onClick={() => toast(`${sdk.lang} SDK downloading…`,"info")}>⬇ Download</Btn>
              </div>
            ))}
          </div>
        </FadeIn>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SYSTEM HEALTH SCREEN — doc: Web Admin Page 10 (system health, uptime,
//   service status, error rates, latency, server metrics)
// ══════════════════════════════════════════════════════════════════════════════
const SERVICES = [
  {name:"API Server",         status:"operational", uptime:"99.98%", latency:"124ms",  region:"us-east-1"},
  {name:"Database (MySQL)",   status:"operational", uptime:"99.99%", latency:"8ms",    region:"us-east-1"},
  {name:"AI Inference",       status:"operational", uptime:"99.92%", latency:"340ms",  region:"us-west-2"},
  {name:"Push Notifications", status:"degraded",    uptime:"98.70%", latency:"890ms",  region:"global"},
  {name:"Image Processing",   status:"operational", uptime:"99.88%", latency:"210ms",  region:"us-east-1"},
  {name:"Blockchain Node",    status:"operational", uptime:"99.95%", latency:"1.2s",   region:"global"},
  {name:"CDN",                status:"operational", uptime:"100%",   latency:"18ms",   region:"global"},
  {name:"Barcode Service",    status:"operational", uptime:"99.97%", latency:"56ms",   region:"us-east-1"},
];

const UPTIME_HISTORY = [
  {day:"Mon",uptime:99.98},{day:"Tue",uptime:99.99},{day:"Wed",uptime:99.94},
  {day:"Thu",uptime:98.70},{day:"Fri",uptime:99.91},{day:"Sat",uptime:99.99},{day:"Sun",uptime:99.98},
];

const INCIDENTS = [
  {id:"INC-042",service:"Push Notifications",severity:"medium",started:"Jun 7 14:23",duration:"2h 14m",status:"Monitoring",desc:"Elevated delivery latency causing some push notifications to arrive delayed by 5-15 minutes."},
  {id:"INC-041",service:"AI Inference",       severity:"low",   started:"Jun 5 09:00",duration:"45m",   status:"Resolved",  desc:"Increased response times on recipe recommendation endpoint. Root cause: cold start after deployment. Resolved by pre-warming instances."},
  {id:"INC-040",service:"API Server",         severity:"low",   started:"Jun 2 22:10",duration:"12m",   status:"Resolved",  desc:"Brief spike in error rate (0.9%) above SLA threshold of 0.8%. Self-recovered."},
];

