import { useAppState } from "@/lib/state/app-state";
/**
 * AISheets.tsx — NLPChat, History, Share, IoT, BlockchainLedger,
 * Gamification, and Challenges sheets translated from the GET design template.
 */
import React, { useState, useRef, useEffect } from "react";
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  FlatList, Pressable, StyleSheet, Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Sheet } from "../sheet";
import { Badge, Btn, Spinner, ProgressBar } from "../ui";
import { useTheme } from "../../../lib/design/theme-context";
import { C, DT } from "../../../lib/design/tokens";
import { Item } from "../../../lib/design/data";

// ─── NLP helpers (mirrored from template) ────────────────────────────────────
const detectIntent = (text: string): string => {
  const t = text.toLowerCase();
  if (/expir|expire|expiry|old|stale/.test(t)) return "check_expiry";
  if (/recipe|cook|make|dinner|lunch|breakfast/.test(t)) return "find_recipe";
  if (/price|cheap|deal|discount|save|cost/.test(t)) return "price_check";
  if (/nutri|calori|protein|fat|carb|health/.test(t)) return "nutrition";
  if (/allerg|gluten|dairy|nut|soy/.test(t)) return "allergen_check";
  if (/waste|impact|co2|carbon|sustain/.test(t)) return "sustainability";
  if (/shop|list|buy|need|grocery/.test(t)) return "shopping";
  return "general";
};

const extractEntities = (text: string) => {
  const items  = ["milk","eggs","chicken","spinach","bread","cheese","yogurt","apples","carrots"].filter(i => text.toLowerCase().includes(i));
  const stores = ["walmart","target","whole foods","kroger","costco"].filter(s => text.toLowerCase().includes(s));
  return { items: items.length ? items : undefined, stores: stores.length ? stores : undefined };
};

const INTENT_RESPONSES: Record<string, (e: any) => string> = {
  check_expiry: (e) => `Based on your pantry, ${e.items?.length ? e.items.join(", ") + " are" : "Chicken Breast and Milk are"} expiring within 2 days. Use them first! I recommend the Chicken Veggie Stir Fry recipe.`,
  find_recipe:  (e) => `With your current pantry, I suggest: 🍳 Spinach Omelette (15 min), 🥗 Veggie Stir Fry (30 min), 🥘 Chicken Soup (45 min). All use items expiring soon!`,
  price_check:  (e) => `${e.items?.length ? e.items[0] : "Milk"} is cheapest at Walmart ($2.49). Whole Foods has it for $3.99. Save $1.50 by switching stores this week!`,
  nutrition:    (e) => `Today you've consumed ~1,240 kcal (62% of goal), 68g protein (136%), 45g fat. You're doing great on protein! Consider adding more complex carbs.`,
  allergen_check:(e) => `⚠️ Allergen alert: 3 items in your pantry contain gluten, 2 contain dairy. Your profile shows dairy sensitivity — Cheese and Yogurt are flagged.`,
  sustainability:(e) => `This week you've saved 2.4kg of food waste, equivalent to 6.2kg CO₂ reduction 🌱. You're in the top 15% of GET users for sustainability!`,
  shopping:     (e) => `Your smart shopping list has 8 items. Based on prices, Walmart saves you $4.20 vs Whole Foods this week. Ready to optimize your route?`,
  general:      (e) => `I can help with expiry tracking, recipes, price comparison, nutrition coaching, allergen alerts, and sustainability insights. What would you like to know?`,
};

// ─── Seed data ────────────────────────────────────────────────────────────────
const USED_ITEMS_HISTORY = [
  { name:"Organic Spinach",  brand:"Earthbound Farm", category:"Produce",   emoji:"🥬", usedOn:"Jun 7",  daysBeforeExpiry:1, savedVal:"$3.49" },
  { name:"Chicken Breast",   brand:"Perdue",          category:"Meat",      emoji:"🍗", usedOn:"Jun 6",  daysBeforeExpiry:0, savedVal:"$8.99" },
  { name:"Greek Yogurt",     brand:"Chobani",         category:"Dairy",     emoji:"🥛", usedOn:"Jun 6",  daysBeforeExpiry:2, savedVal:"$4.29" },
  { name:"Sourdough Bread",  brand:"Pepperidge Farm", category:"Bakery",    emoji:"🍞", usedOn:"Jun 5",  daysBeforeExpiry:1, savedVal:"$5.49" },
  { name:"Whole Milk",       brand:"Organic Valley",  category:"Dairy",     emoji:"🥛", usedOn:"Jun 4",  daysBeforeExpiry:3, savedVal:"$4.99" },
  { name:"Baby Carrots",     brand:"Grimmway Farms",  category:"Produce",   emoji:"🥕", usedOn:"Jun 4",  daysBeforeExpiry:4, savedVal:"$2.99" },
  { name:"Orange Juice",     brand:"Tropicana",       category:"Beverages", emoji:"🍊", usedOn:"Jun 3",  daysBeforeExpiry:2, savedVal:"$3.79" },
  { name:"Cheddar Cheese",   brand:"Tillamook",       category:"Dairy",     emoji:"🧀", usedOn:"Jun 2",  daysBeforeExpiry:5, savedVal:"$6.49" },
];

const IOT_DEVICES = [
  { id:"fridge-1", name:"Kitchen Fridge",  type:"Samsung SmartFridge RF28", status:"online",  temp:38, humidity:65, battery:null, signal:4, ip:"192.168.1.42", lastSync:"2 min ago" },
  { id:"fridge-2", name:"Garage Freezer",  type:"LG InstaView LRMVS3006S",  status:"online",  temp:-4, humidity:40, battery:null, signal:3, ip:"192.168.1.43", lastSync:"5 min ago" },
  { id:"sensor-1", name:"Pantry Sensor",   type:"Xiaomi Temperature Sensor", status:"online", temp:68, humidity:55, battery:82,   signal:4, ip:"192.168.1.51", lastSync:"1 min ago" },
  { id:"sensor-2", name:"Counter Sensor",  type:"Govee H5075",               status:"offline", temp:72, humidity:58, battery:12,  signal:1, ip:"N/A",           lastSync:"3h ago"    },
];

const LEDGER_TXS = [
  { hash:"0x4f3a…9c2e", block:45231847, type:"Impact Record",  action:"2.4kg waste saved",         time:"Jun 7 14:23", gas:"0.0012 MATIC", status:"confirmed", icon:"♻️" },
  { hash:"0x7b2c…4d1f", block:45228391, type:"NFT Mint",       action:"Top 15% badge minted",       time:"Jun 6 09:10", gas:"0.0034 MATIC", status:"confirmed", icon:"🏆" },
  { hash:"0xa9e1…c7b3", block:45220104, type:"Item Record",    action:"Chicken Breast used",        time:"Jun 5 18:45", gas:"0.0008 MATIC", status:"confirmed", icon:"🍗" },
  { hash:"0xd5f2…8e1a", block:45211872, type:"Goal Milestone", action:"Monthly waste goal met",     time:"Jun 5 12:00", gas:"0.0015 MATIC", status:"confirmed", icon:"🎯" },
  { hash:"0x2c8b…3f6d", block:45198543, type:"Item Record",    action:"Spinach used before expiry", time:"Jun 4 20:30", gas:"0.0008 MATIC", status:"confirmed", icon:"🥬" },
  { hash:"0xf1a7…2b9c", block:45185020, type:"Impact Record",  action:"CO₂ reduction verified",    time:"Jun 3 15:15", gas:"0.0012 MATIC", status:"confirmed", icon:"🌿" },
  { hash:"0x8d4e…7a3f", block:45172401, type:"NFT Mint",       action:"Sustainability Hero badge",  time:"Jun 2 08:55", gas:"0.0034 MATIC", status:"confirmed", icon:"🌱" },
  { hash:"0x3c9f…5e1b", block:45160192, type:"Smart Contract", action:"Monthly challenge completed",time:"Jun 1 23:59", gas:"0.0021 MATIC", status:"confirmed", icon:"⚡" },
];

const LEVEL_THRESHOLDS = [0, 500, 1200, 2500, 4500, 7500, 12000, 20000, 30000, 50000];
const ALL_BADGES = [
  { icon:"🌱", name:"Eco Pioneer",      desc:"Save first 1kg of food waste",     pts:100, earned:true  },
  { icon:"♻️", name:"Waste Warrior",    desc:"Reduce waste 5 weeks in a row",    pts:200, earned:true  },
  { icon:"📷", name:"Scanner Pro",      desc:"Scan 50 barcodes",                 pts:150, earned:true  },
  { icon:"🥗", name:"Recipe Master",    desc:"Cook 10 AI-suggested recipes",     pts:300, earned:false },
  { icon:"🌿", name:"CO₂ Saver",        desc:"Reduce 10kg CO₂ total",            pts:400, earned:false },
  { icon:"🏆", name:"Top 15%",          desc:"Rank in top 15% of users",         pts:500, earned:false },
  { icon:"🔥", name:"Streak Legend",    desc:"30-day login streak",              pts:600, earned:false },
  { icon:"💰", name:"Deal Hunter",      desc:"Save $50 via price comparison",    pts:250, earned:false },
  { icon:"🤝", name:"Team Player",      desc:"Share pantry with 3 members",      pts:200, earned:false },
];

const REWARDS_CATALOG = [
  { icon:"☕", name:"Free Coffee",          pts:500,  available:true  },
  { icon:"🛒", name:"$5 Grocery Credit",    pts:800,  available:true  },
  { icon:"🎁", name:"Mystery Box",          pts:1200, available:true  },
  { icon:"🌱", name:"Plant a Tree",         pts:300,  available:true  },
  { icon:"🎫", name:"Premium Month Free",   pts:2000, available:false },
];

const CHALLENGES_DATA = [
  { id:1, status:"active",    icon:"♻️", title:"Zero Waste Week",      desc:"Use all perishables before they expire",    goal:7,  progress:5, unit:"items",   reward:300, deadline:"2d 14h",     difficulty:"Medium" },
  { id:2, status:"active",    icon:"🥗", title:"Greens Champion",       desc:"Add leafy greens to your pantry 5 times",  goal:5,  progress:3, unit:"times",   reward:150, deadline:"4d 2h",      difficulty:"Easy"   },
  { id:3, status:"active",    icon:"💰", title:"Deal Hunter",           desc:"Save $15 using price comparison this week", goal:15, progress:8, unit:"dollars", reward:200, deadline:"1d 6h",      difficulty:"Medium" },
  { id:4, status:"completed", icon:"📷", title:"Scanner Sprint",        desc:"Scan 10 barcodes in one day",              goal:10, progress:10,unit:"scans",   reward:100, deadline:"Ended",       difficulty:"Easy"   },
  { id:5, status:"completed", icon:"🌿", title:"Eco Warrior",           desc:"Reduce CO₂ by 1kg this week",              goal:1,  progress:1, unit:"kg CO₂",  reward:250, deadline:"Ended",       difficulty:"Hard"   },
  { id:6, status:"upcoming",  icon:"🍳", title:"Master Chef Challenge", desc:"Cook 5 recipes using expiring ingredients", goal:5,  progress:0, unit:"recipes", reward:400, deadline:"Starts in 3d",difficulty:"Hard"   },
  { id:7, status:"upcoming",  icon:"🤝", title:"Family Share Blitz",    desc:"Collaborate on grocery list with 2 members",goal:2, progress:0, unit:"members", reward:200, deadline:"Starts in 5d",difficulty:"Medium" },
];

const SHARED_MEMBERS = [
  { name:"Sarah Johnson", email:"sarah@example.com", avatar:"👩‍🦱", role:"Editor", since:"May 2026", active:true  },
  { name:"Mike Chen",     email:"mike@example.com",  avatar:"👨",   role:"Viewer", since:"Apr 2026", active:true  },
  { name:"Mom",           email:"mom@family.com",    avatar:"👩",   role:"Editor", since:"Mar 2026", active:false },
];

// ─── NLPChatSheet ─────────────────────────────────────────────────────────────
interface ChatMsg { role:"ai"|"user"; text:string; intent?:string; tags?:string[]|null; time:string; }

export function NLPChatSheet({ open, onClose, toast }: { open:boolean; onClose:()=>void; toast?:(m:string)=>void }) {
  const { items } = useAppState();
  const theme = useTheme();
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role:"ai", text:"👋 Hi! I'm your GET AI Assistant. Ask me anything about your pantry, nutrition, prices, recipes, or sustainability!", intent:"general", time:"Just now" }
  ]);
  const [input, setInput]   = useState("");
  const [typing, setTyping] = useState(false);
  const [context, setContext] = useState<any[]>([]);
  const scrollRef = useRef<ScrollView>(null);

  const SUGGESTIONS = ["What can I cook tonight?","What's expiring soon?","Check my allergens","Best price for milk","How's my nutrition today?","Show my waste impact"];

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const intent   = detectIntent(text);
    const entities = extractEntities(text);
    const userMsg: ChatMsg = { role:"user", text, intent, time:"Just now" };
    setMessages(m => [...m, userMsg]);
    setContext(c => [...c.slice(-4), { role:"user", text, intent, entities }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const prevIntent = context[context.length-1]?.intent;
      let response = INTENT_RESPONSES[intent]?.(entities) || INTENT_RESPONSES.general(entities);
      if (prevIntent === "find_recipe" && intent === "nutrition") {
        response = "Based on the recipe I suggested (Spinach Omelette): ~320 kcal, 28g protein, 18g fat. That fits perfectly in your daily goals!";
      } else if (prevIntent === "check_expiry" && intent === "find_recipe") {
        response = "Since your Chicken Breast expires today, I'd suggest the Chicken Veggie Stir Fry — it's your fastest option (30 min) and uses your expiring carrots too!";
      }
      const tags = [
        ...((entities.items||[]).map((i:string) => `🥗 ${i}`)),
        ...((entities.stores||[]).map((s:string) => `🏪 ${s}`)),
        intent !== "general" ? `🎯 ${intent.replace("_"," ")}` : null,
      ].filter(Boolean) as string[];
      const aiMsg: ChatMsg = { role:"ai", text:response, intent, tags: tags.length ? tags : null, time:"Just now" };
      setMessages(m => [...m, aiMsg]);
      setContext(c => [...c.slice(-4), { role:"ai", text:response, intent }]);
      setTyping(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated:true }), 100);
    }, 800 + Math.random()*600);
  };

  return (
    <Sheet open={open} onClose={onClose} title="🤖 AI Chat Assistant">
      <View style={{ flex:1, minHeight:350 }}>
        {/* Status badges */}
        <View style={{ flexDirection:"row", flexWrap:"wrap", gap:6, marginBottom:12 }}>
          <Badge color={C.success} bg={C.successSoft}>🧠 NLP Active</Badge>
          <Badge color={C.primary} bg={C.primarySoft}>🎯 Intent Recognition</Badge>
          <Badge color={C.teal}    bg={C.tealSoft}>⛓ Context-Aware</Badge>
        </View>

        {/* Messages */}
        <ScrollView ref={scrollRef} style={{ flex:1 }} contentContainerStyle={{ gap:10, paddingBottom:8 }} showsVerticalScrollIndicator={false}>
          {messages.map((msg, i) => (
            <View key={i} style={{ flexDirection:"row", justifyContent:msg.role==="user"?"flex-end":"flex-start", gap:8 }}>
              {msg.role==="ai" && (
                <LinearGradient colors={["#4F46E5","#7C3AED"]} style={s.chatAvatar}>
                  <Text style={{ fontSize:16 }}>🤖</Text>
                </LinearGradient>
              )}
              <View style={{ maxWidth:"78%" }}>
                {msg.role==="user" ? (
                  <LinearGradient colors={[C.primary, C.primaryDark]} style={[s.bubble, s.bubbleUser]}>
                    <Text style={{ color:"white", fontSize:14, lineHeight:22 }}>{msg.text}</Text>
                  </LinearGradient>
                ) : (
                  <View style={[s.bubble, s.bubbleAI, { backgroundColor:theme.card, borderColor:theme.border }]}>
                    <Text style={{ color:theme.text, fontSize:14, lineHeight:22 }}>{msg.text}</Text>
                  </View>
                )}
                {msg.tags && msg.tags.length > 0 && (
                  <View style={{ flexDirection:"row", flexWrap:"wrap", gap:4, marginTop:4 }}>
                    {msg.tags.map((tag,j) => <Badge key={j} color={C.primary} bg={C.primarySoft}>{tag}</Badge>)}
                  </View>
                )}
                {msg.intent && msg.intent !== "general" && (
                  <Text style={{ fontSize:10, color:theme.textSub, marginTop:3, textAlign:msg.role==="user"?"right":"left" }}>
                    🎯 {msg.intent.replace("_"," ")} · {msg.time}
                  </Text>
                )}
              </View>
              {msg.role==="user" && (
                <View style={[s.chatAvatar, { backgroundColor:theme.border }]}>
                  <Text style={{ fontSize:16 }}>👤</Text>
                </View>
              )}
            </View>
          ))}
          {typing && (
            <View style={{ flexDirection:"row", gap:8, alignItems:"center" }}>
              <LinearGradient colors={["#4F46E5","#7C3AED"]} style={s.chatAvatar}>
                <Text style={{ fontSize:16 }}>🤖</Text>
              </LinearGradient>
              <View style={[s.bubble, s.bubbleAI, { backgroundColor:theme.card, borderColor:theme.border }]}>
                <View style={{ flexDirection:"row", gap:5 }}>
                  {[0,1,2].map(i => <View key={i} style={{ width:7, height:7, borderRadius:4, backgroundColor:theme.textSub }} />)}
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Suggestions */}
        {messages.length <= 2 && (
          <View style={{ paddingVertical:8 }}>
            <Text style={{ fontSize:11, fontWeight:"700", color:theme.textSub, marginBottom:6 }}>Try asking:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap:6 }}>
              {SUGGESTIONS.map(sug => (
                <TouchableOpacity key={sug} onPress={() => sendMessage(sug)}
                  style={[s.suggestionChip, { borderColor:theme.border, backgroundColor:theme.card }]}>
                  <Text style={{ fontSize:11, fontWeight:"600", color:C.primary }}>{sug}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Input row */}
        <View style={[s.inputRow, { borderTopColor:theme.border }]}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask anything… prices, recipes, allergens…"
            placeholderTextColor={theme.textSub}
            returnKeyType="send"
            onSubmitEditing={() => !typing && sendMessage(input)}
            style={[s.chatInput, { borderColor:input?C.primary:theme.border, backgroundColor:theme.card, color:theme.text }]}
          />
          <Btn variant="primary" size="md" onClick={() => sendMessage(input)} disabled={!input.trim()||typing}>
            {typing ? <Spinner size="sm" color="white" /> : <Text style={{ color:"white", fontWeight:"700", fontSize:18 }}>↑</Text>}
          </Btn>
        </View>
      </View>
    </Sheet>
  );
}

// ─── HistorySheet ─────────────────────────────────────────────────────────────
export function HistorySheet({ open, onClose, toast }: { open:boolean; onClose:()=>void; toast?:(m:string)=>void }) {
  const theme = useTheme();
  const [filter, setFilter] = useState("All");
  const CATS = ["All","Dairy","Produce","Meat","Bakery","Beverages"];
  const filtered = filter==="All" ? USED_ITEMS_HISTORY : USED_ITEMS_HISTORY.filter(i => i.category===filter);
  const totalSaved = USED_ITEMS_HISTORY.reduce((s,i) => s+parseFloat(i.savedVal.replace("$","")), 0).toFixed(2);
  const wasteKg    = (USED_ITEMS_HISTORY.length * 0.3).toFixed(1);

  return (
    <Sheet open={open} onClose={onClose} title="📋 Item History">
      <View style={{ gap:16 }}>
        {/* Summary banner */}
        <LinearGradient colors={["#059669","#0D9488"]} style={s.banner}>
          <Text style={s.bannerSub}>All-time Usage Stats</Text>
          <View style={{ flexDirection:"row" }}>
            {[["✅",String(USED_ITEMS_HISTORY.length),"Items Used"],["💰","$"+totalSaved,"Total Saved"],["♻️",wasteKg+"kg","Waste Avoided"]].map(([icon,val,label],i) => (
              <View key={label} style={[s.bannerStat, i>0 && { borderLeftWidth:1, borderLeftColor:"rgba(255,255,255,0.25)" }]}>
                <Text style={{ fontSize:20, marginBottom:4 }}>{icon}</Text>
                <Text style={s.bannerVal}>{val}</Text>
                <Text style={s.bannerLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Category filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap:7 }}>
          {CATS.map(c => (
            <TouchableOpacity key={c} onPress={() => setFilter(c)}
              style={[s.filterChip, { borderColor:filter===c?C.success:theme.border, backgroundColor:filter===c?C.successSoft:"transparent" }]}>
              <Text style={{ fontSize:12, fontWeight:"700", color:filter===c?C.success:theme.textSub }}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* History list */}
        {filtered.map((item, i) => (
          <View key={i} style={[s.historyCard, { backgroundColor:theme.card, borderColor:theme.border }]}>
            <View style={[s.historyEmoji, { backgroundColor:C.successSoft }]}>
              <Text style={{ fontSize:24 }}>{item.emoji}</Text>
            </View>
            <View style={{ flex:1 }}>
              <Text style={{ fontSize:15, fontWeight:"700", color:theme.text }}>{item.name}</Text>
              <Text style={{ fontSize:11, color:theme.textSub, marginTop:2 }}>{item.brand} · {item.category}</Text>
              <Text style={{ fontSize:11, color:theme.textSub, marginTop:2 }}>
                Used {item.usedOn} · <Text style={{ color:item.daysBeforeExpiry<=1?C.error:C.success, fontWeight:"600" }}>
                  {item.daysBeforeExpiry===0?"on expiry day":`${item.daysBeforeExpiry}d before expiry`}
                </Text>
              </Text>
            </View>
            <View style={{ alignItems:"flex-end" }}>
              <Badge color={C.success} bg={C.successSoft}>Saved {item.savedVal}</Badge>
              <Text style={{ fontSize:11, color:theme.textSub, marginTop:4 }}>✅ Used</Text>
            </View>
          </View>
        ))}
        {filtered.length === 0 && (
          <View style={{ alignItems:"center", padding:40 }}>
            <Text style={{ fontSize:48, marginBottom:10 }}>📭</Text>
            <Text style={{ fontSize:16, fontWeight:"700", color:theme.text, marginBottom:6 }}>No history in this category</Text>
          </View>
        )}
      </View>
    </Sheet>
  );
}

// ─── ShareSheet ───────────────────────────────────────────────────────────────
export function ShareSheet({ open, onClose, toast }: { open:boolean; onClose:()=>void; toast:(msg:string,type?:string)=>void }) {
  const theme = useTheme();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole,  setInviteRole]  = useState("Editor");
  const [members,     setMembers]     = useState(SHARED_MEMBERS);
  const [sending,     setSending]     = useState(false);
  const [shareLink,   setShareLink]   = useState(false);
  const ROLES = ["Viewer","Editor","Admin"];

  const sendInvite = () => {
    if (!inviteEmail.trim() || !/\S+@\S+\.\S+/.test(inviteEmail)) { toast("Enter a valid email address","error"); return; }
    setSending(true);
    setTimeout(() => {
      setMembers(m => [{ name:inviteEmail.split("@")[0], email:inviteEmail, avatar:"👤", role:inviteRole, since:"Jun 2026", active:false }, ...m]);
      setInviteEmail(""); setSending(false);
      toast(`✉️ Invite sent to ${inviteEmail}!`);
    }, 1200);
  };

  const removeMember = (email: string) => { setMembers(m => m.filter(x => x.email!==email)); toast("Member removed","info"); };

  return (
    <Sheet open={open} onClose={onClose} title="🤝 Share & Collaborate">
      <View style={{ gap:18 }}>
        {/* Share link card */}
        <View style={[s.shareCard, { backgroundColor:theme.card, borderColor:C.primary+"30" }]}>
          <View style={{ flexDirection:"row", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
            <Text style={{ fontSize:15, fontWeight:"800", color:theme.text }}>🔗 Share Link</Text>
            <View style={{ flexDirection:"row", alignItems:"center", gap:8 }}>
              <Text style={{ fontSize:11, color:theme.textSub }}>Active</Text>
              <TouchableOpacity onPress={() => setShareLink(v => !v)}
                style={[s.toggle, { backgroundColor:shareLink?C.primary:theme.border }]}>
                <View style={[s.toggleThumb, { left:shareLink?20:3 }]} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={[s.linkBox, { backgroundColor:theme.hover, borderColor:theme.border }]}>
            <Text style={{ flex:1, fontSize:11, color:theme.textSub, fontFamily:"monospace" }} numberOfLines={1}>
              {shareLink ? "get-app.com/pantry/share/abc123xyz" : "Link sharing is disabled"}
            </Text>
            {shareLink && <Btn variant="primary" size="sm" onClick={() => toast("Link copied! 📋")}>Copy</Btn>}
          </View>
          {shareLink && <Text style={{ fontSize:11, color:theme.textSub, marginTop:8 }}>Anyone with this link can view your pantry (read-only)</Text>}
        </View>

        {/* Invite */}
        <View>
          <Text style={{ fontSize:15, fontWeight:"800", color:theme.text, marginBottom:12 }}>✉️ Invite by Email</Text>
          <TextInput
            value={inviteEmail}
            onChangeText={setInviteEmail}
            placeholder="friend@example.com"
            placeholderTextColor={theme.textSub}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="send"
            onSubmitEditing={sendInvite}
            style={[s.emailInput, { borderColor:theme.border, backgroundColor:theme.card, color:theme.text }]}
          />
          <View style={{ marginTop:10 }}>
            <Btn variant="primary" size="lg" onClick={sendInvite} disabled={sending} full>
              {sending ? <Spinner size="sm" color="white" /> : "📨 Send Invite"}
            </Btn>
          </View>
        </View>

        {/* Members */}
        <View>
          <Text style={{ fontSize:15, fontWeight:"800", color:theme.text, marginBottom:12 }}>👥 Shared With ({members.length})</Text>
          {members.map((m, i) => (
            <View key={m.email} style={[s.memberCard, { backgroundColor:theme.card, borderColor:theme.border }]}>
              <View style={[s.memberAvatar, { backgroundColor:C.primary+"18" }]}>
                <Text style={{ fontSize:22 }}>{m.avatar}</Text>
                <View style={[s.onlineDot, { backgroundColor:m.active?C.success:theme.border, borderColor:theme.card }]} />
              </View>
              <View style={{ flex:1 }}>
                <Text style={{ fontSize:14, fontWeight:"700", color:theme.text }}>{m.name}</Text>
                <Text style={{ fontSize:11, color:theme.textSub, marginTop:1 }}>{m.email}</Text>
                <Text style={{ fontSize:11, color:theme.textSub, marginTop:1 }}>Since {m.since} · {m.active?"Active":"Pending"}</Text>
              </View>
              <Badge color={m.role==="Admin"?C.error:m.role==="Editor"?C.primary:C.teal}>{m.role}</Badge>
              <TouchableOpacity onPress={() => removeMember(m.email)}
                style={[s.removeBtn, { backgroundColor:C.errorSoft }]}>
                <Text style={{ color:C.error, fontWeight:"700", fontSize:14 }}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Permission guide */}
        <View style={[s.permCard, { backgroundColor:theme.card, borderColor:theme.border }]}>
          <Text style={{ fontSize:13, fontWeight:"700", color:theme.text, marginBottom:8 }}>🔐 Permission Levels</Text>
          {[{role:"Viewer",desc:"Can view pantry and shopping list"},{role:"Editor",desc:"Can add, edit, and mark items"},{role:"Admin",desc:"Full access including settings and sharing"}].map((p,i) => (
            <View key={p.role} style={[s.permRow, i>0 && { borderTopWidth:1, borderTopColor:theme.border+"40" }]}>
              <Badge color={p.role==="Admin"?C.error:p.role==="Editor"?C.primary:C.teal}>{p.role}</Badge>
              <Text style={{ flex:1, fontSize:11, color:theme.textSub, lineHeight:18, marginLeft:8 }}>{p.desc}</Text>
            </View>
          ))}
        </View>
      </View>
    </Sheet>
  );
}

// ─── IoTDeviceSheet ───────────────────────────────────────────────────────────
export function IoTDeviceSheet({ open, onClose, toast }: { open:boolean; onClose:()=>void; toast:(msg:string,type?:string)=>void }) {
  const theme = useTheme();
  const [devices, setDevices]   = useState(IOT_DEVICES);
  const [scanning, setScanning] = useState(false);
  const [selected, setSelected] = useState<string|null>(null);

  const statusColor = (st: string) => st==="online"?C.success:st==="syncing"?C.warning:C.error;
  const tempColor   = (t: number)  => t < 0 ? "#93C5FD" : t < 40 ? C.success : C.error;

  const scanDevices = () => {
    setScanning(true);
    setTimeout(() => {
      setDevices(d => d.map(dev => dev.status==="offline" ? dev : {...dev, lastSync:"just now"}));
      setScanning(false);
      toast("✅ All devices synced!");
    }, 2000);
  };

  const toggleDevice = (id: string) => setDevices(d => d.map(dev => dev.id===id ? {...dev, status:dev.status==="online"?"offline":"online"} : dev));

  return (
    <Sheet open={open} onClose={onClose} title="🌡 Smart Fridge & IoT">
      <View style={{ gap:16 }}>
        {/* Status banner */}
        <LinearGradient colors={["#0891B2","#06B6D4"]} style={s.banner}>
          <Text style={s.bannerSub}>IoT Network Status</Text>
          <View style={{ flexDirection:"row" }}>
            {[["🟢", String(devices.filter(d=>d.status==="online").length), "Online"],
              ["🔴", String(devices.filter(d=>d.status==="offline").length), "Offline"],
              ["🌡", "38°F", "Kitchen"],
              ["💧", "65%", "Humidity"]].map(([icon,val,label],i) => (
              <View key={label} style={[s.bannerStat, i>0 && { borderLeftWidth:1, borderLeftColor:"rgba(255,255,255,0.25)" }]}>
                <Text style={{ fontSize:18, marginBottom:3 }}>{icon}</Text>
                <Text style={s.bannerVal}>{val}</Text>
                <Text style={s.bannerLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        <Btn variant="primary" size="lg" onClick={scanDevices} disabled={scanning} full>
          {scanning ? <Spinner size="sm" color="white" /> : "📡 Scan & Sync All Devices"}
        </Btn>

        {/* Device list */}
        {devices.map((dev, i) => (
          <TouchableOpacity key={dev.id} onPress={() => setSelected(selected===dev.id ? null : dev.id)}
            style={[s.deviceCard, { backgroundColor:theme.card, borderColor:dev.status==="online"?C.success+"30":C.error+"30" }]}>
            <View style={{ flexDirection:"row", alignItems:"center", gap:14 }}>
              <View style={[s.deviceIcon, { backgroundColor:dev.status==="online"?C.successSoft:C.errorSoft }]}>
                <Text style={{ fontSize:24 }}>{dev.type.includes("Fridge")||dev.type.includes("Freezer") ? "❄️" : "🌡"}</Text>
              </View>
              <View style={{ flex:1 }}>
                <Text style={{ fontSize:15, fontWeight:"700", color:theme.text }}>{dev.name}</Text>
                <Text style={{ fontSize:11, color:theme.textSub, marginTop:2 }}>{dev.type}</Text>
                <Text style={{ fontSize:11, color:theme.textSub, marginTop:1 }}>Last sync: {dev.lastSync}</Text>
              </View>
              <View style={{ alignItems:"flex-end", gap:4 }}>
                <Badge color={statusColor(dev.status)} bg={dev.status==="online"?C.successSoft:C.errorSoft}>● {dev.status}</Badge>
                <View style={{ flexDirection:"row", alignItems:"flex-end" }}>
                  {[1,2,3,4].map(b => (
                    <View key={b} style={{ width:4, height:4+b*3, borderRadius:1, backgroundColor:b<=dev.signal?C.success:theme.border+"60", marginLeft:1 }} />
                  ))}
                </View>
              </View>
            </View>

            {selected === dev.id && (
              <View style={[s.deviceDetail, { borderTopColor:theme.border+"40" }]}>
                <View style={{ flexDirection:"row", gap:10 }}>
                  {[
                    { icon:"🌡", label:"Temp",     value:`${dev.temp}°F`,     color:tempColor(dev.temp) },
                    { icon:"💧", label:"Humidity", value:`${dev.humidity}%`,  color:C.info },
                    { icon:dev.battery!==null?"🔋":"🔌", label:dev.battery!==null?"Battery":"Power", value:dev.battery!==null?`${dev.battery}%`:"AC", color:dev.battery!==null&&dev.battery<30?C.error:C.success },
                  ].map(m => (
                    <View key={m.label} style={[s.metricBox, { backgroundColor:theme.hover, flex:1 }]}>
                      <Text style={{ fontSize:18 }}>{m.icon}</Text>
                      <Text style={{ fontSize:14, fontWeight:"800", color:m.color, marginTop:4 }}>{m.value}</Text>
                      <Text style={{ fontSize:10, color:theme.textSub }}>{m.label}</Text>
                    </View>
                  ))}
                </View>
                {dev.ip !== "N/A" && <Text style={{ fontSize:11, color:theme.textSub, fontFamily:"monospace", marginTop:8 }}>IP: {dev.ip}</Text>}
                <View style={{ flexDirection:"row", gap:10, marginTop:10 }}>
                  <Btn variant="secondary" size="sm" onClick={() => toast(`${dev.name} refreshed`)}>↻ Refresh</Btn>
                  <Btn variant={dev.status==="online"?"danger":"success"} size="sm" onClick={() => { toggleDevice(dev.id); toast(`${dev.name} ${dev.status==="online"?"disconnected":"connected"}`); }}>
                    {dev.status==="online" ? "Disconnect" : "Connect"}
                  </Btn>
                </View>
              </View>
            )}
          </TouchableOpacity>
        ))}

        <Btn variant="secondary" size="lg" onClick={() => toast("📡 Device pairing mode activated","info")} full>
          ➕ Add New Device
        </Btn>
      </View>
    </Sheet>
  );
}

// ─── BlockchainLedgerSheet ────────────────────────────────────────────────────
export function BlockchainLedgerSheet({ open, onClose, toast }: { open:boolean; onClose:()=>void; toast?:(m:string)=>void }) {
  const theme = useTheme();
  const [filter, setFilter] = useState("All");
  const TX_TYPES = ["All","Impact Record","NFT Mint","Item Record","Goal Milestone","Smart Contract"];
  const filtered = filter==="All" ? LEDGER_TXS : LEDGER_TXS.filter(t => t.type===filter);
  const typeColor = (t: string) => t==="NFT Mint"?"#8B5CF6":t==="Impact Record"?C.teal:t==="Smart Contract"?C.primary:t==="Goal Milestone"?C.warning:C.success;

  return (
    <Sheet open={open} onClose={onClose} title="⛓ Blockchain Ledger">
      <View style={{ gap:16 }}>
        {/* Network banner */}
        <LinearGradient colors={["#4F46E5","#7C3AED"]} style={s.banner}>
          <View style={{ flexDirection:"row", alignItems:"center", gap:12, marginBottom:10 }}>
            <View style={{ width:10, height:10, borderRadius:5, backgroundColor:C.success }} />
            <Text style={{ fontSize:15, fontWeight:"800", color:"white" }}>Polygon Mainnet — Connected</Text>
            <Badge color={C.success} bg={C.successSoft}>Live</Badge>
          </View>
          <View style={{ flexDirection:"row" }}>
            {[["#","47","Transactions"],["⛓","45.2M","Block Height"],["💎","0.0248","MATIC Balance"],["🏆","3","NFTs Owned"]].map(([icon,val,label],i) => (
              <View key={label} style={[s.bannerStat, i>0 && { borderLeftWidth:1, borderLeftColor:"rgba(255,255,255,0.25)" }]}>
                <Text style={{ fontSize:13, opacity:0.7, marginBottom:2 }}>{icon}</Text>
                <Text style={s.bannerVal}>{val}</Text>
                <Text style={s.bannerLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap:6 }}>
          {TX_TYPES.map(t => (
            <TouchableOpacity key={t} onPress={() => setFilter(t)}
              style={[s.filterChip, { borderColor:filter===t?C.primary:theme.border, backgroundColor:filter===t?C.primarySoft:"transparent" }]}>
              <Text style={{ fontSize:11, fontWeight:"700", color:filter===t?C.primary:theme.textSub }}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Ledger list */}
        {filtered.map((tx, i) => (
          <View key={tx.hash} style={[s.txCard, { backgroundColor:theme.card, borderColor:theme.border }]}>
            <View style={{ flexDirection:"row", alignItems:"center", gap:12 }}>
              <View style={[s.txIcon, { backgroundColor:`${typeColor(tx.type)}18` }]}>
                <Text style={{ fontSize:20 }}>{tx.icon}</Text>
              </View>
              <View style={{ flex:1 }}>
                <View style={{ flexDirection:"row", alignItems:"center", gap:6, flexWrap:"wrap", marginBottom:3 }}>
                  <Badge color={typeColor(tx.type)}>{tx.type}</Badge>
                  <Text style={{ fontSize:11, color:C.success, fontWeight:"700" }}>✓ {tx.status}</Text>
                </View>
                <Text style={{ fontSize:13, fontWeight:"600", color:theme.text }}>{tx.action}</Text>
                <Text style={{ fontSize:11, color:theme.textSub, marginTop:2 }}>{tx.time} · Block #{tx.block.toLocaleString()}</Text>
              </View>
            </View>
            <View style={[s.txHash, { backgroundColor:theme.hover }]}>
              <Text style={{ fontSize:11, color:C.primary, fontFamily:"monospace" }}>{tx.hash}</Text>
              <Text style={{ fontSize:11, color:theme.textSub }}>{tx.gas}</Text>
            </View>
          </View>
        ))}

        {/* NFT Achievements */}
        <View style={[s.nftCard, { backgroundColor:theme.card, borderColor:"#8B5CF630" }]}>
          <Text style={{ fontSize:15, fontWeight:"800", color:theme.text, marginBottom:12 }}>🏆 NFT Achievements (3 owned)</Text>
          <View style={{ flexDirection:"row", gap:10 }}>
            {[{icon:"🌱",name:"Eco Pioneer",tx:"0x7b2c…4d1f",color:"#10B981"},{icon:"♻️",name:"Waste Warrior",tx:"0x4f3a…9c2e",color:"#06B6D4"},{icon:"🌿",name:"CO₂ Saver",tx:"0xf1a7…2b9c",color:"#8B5CF6"}].map((nft,i) => (
              <View key={i} style={[s.nftItem, { flex:1, backgroundColor:`${nft.color}12`, borderColor:`${nft.color}30` }]}>
                <Text style={{ fontSize:28, marginBottom:4 }}>{nft.icon}</Text>
                <Text style={{ fontSize:10, fontWeight:"700", color:nft.color, textAlign:"center" }}>{nft.name}</Text>
                <Text style={{ fontSize:9, color:theme.textSub, fontFamily:"monospace", marginTop:3, textAlign:"center" }}>{nft.tx}</Text>
              </View>
            ))}
          </View>
        </View>

        <Btn variant="secondary" size="md" onClick={() => Linking.openURL("https://polygonscan.com")} full>
          🔍 View on PolygonScan ↗
        </Btn>
      </View>
    </Sheet>
  );
}

// ─── GamificationSheet ────────────────────────────────────────────────────────
export function GamificationSheet({ open, onClose, toast }: { open:boolean; onClose:()=>void; toast:(msg:string,type?:string)=>void }) {
  const theme = useTheme();
  const userPoints   = 2840;
  const level        = LEVEL_THRESHOLDS.findIndex(t => t > userPoints) - 1;
  const nextLevel    = LEVEL_THRESHOLDS[level+1] || 50000;
  const levelPct     = Math.round((userPoints - LEVEL_THRESHOLDS[level]) / (nextLevel - LEVEL_THRESHOLDS[level]) * 100);
  const earnedBadges = ALL_BADGES.filter(b => b.earned);
  const [activeTab,  setTab] = useState("overview");

  return (
    <Sheet open={open} onClose={onClose} title="🏆 Achievements & Rewards">
      {/* Tab switcher */}
      <View style={[s.tabSwitcher, { backgroundColor:theme.card, borderColor:theme.border }]}>
        {[{id:"overview",label:"Overview"},{id:"badges",label:"Badges"},{id:"rewards",label:"Rewards"}].map(t => (
          <TouchableOpacity key={t.id} onPress={() => setTab(t.id)} style={[s.tabBtn, { backgroundColor:activeTab===t.id?C.warning:"transparent" }]}>
            <Text style={{ fontSize:13, fontWeight:"700", color:activeTab===t.id?"white":theme.textSub }}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === "overview" && (
        <View style={{ gap:14, marginTop:16 }}>
          {/* XP card */}
          <LinearGradient colors={["#F59E0B","#D97706"]} style={s.xpCard}>
            <View style={{ flexDirection:"row", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
              <View>
                <Text style={{ fontSize:12, color:"rgba(255,255,255,0.8)" }}>Level {level} — Sustainability Expert</Text>
                <Text style={{ fontSize:32, fontWeight:"800", color:"white" }}>{userPoints.toLocaleString()} XP</Text>
              </View>
              <View style={s.xpBadge}><Text style={{ fontSize:36 }}>🏅</Text></View>
            </View>
            <View style={s.xpBarBg}>
              <View style={[s.xpBarFill, { width:`${levelPct}%` as any }]} />
            </View>
            <View style={{ flexDirection:"row", justifyContent:"space-between", marginTop:6 }}>
              <Text style={{ fontSize:11, color:"rgba(255,255,255,0.85)" }}>Level {level}</Text>
              <Text style={{ fontSize:11, color:"rgba(255,255,255,0.85)" }}>{userPoints.toLocaleString()} / {nextLevel.toLocaleString()} XP to Level {level+1}</Text>
            </View>
          </LinearGradient>

          {/* Stats grid */}
          <View style={{ flexDirection:"row", flexWrap:"wrap", gap:10 }}>
            {[{icon:"🏅",label:"Level",val:String(level),color:"#F59E0B"},{icon:"🎖",label:"Badges Earned",val:`${earnedBadges.length}/${ALL_BADGES.length}`,color:C.primary},{icon:"🔥",label:"Day Streak",val:"7",color:C.error},{icon:"💰",label:"Points Available",val:"840",color:C.success}].map(st => (
              <View key={st.label} style={[s.statCard, { backgroundColor:theme.card, borderColor:theme.border, width:"47%" }]}>
                <Text style={{ fontSize:28, marginBottom:6 }}>{st.icon}</Text>
                <Text style={{ fontSize:22, fontWeight:"800", color:st.color }}>{st.val}</Text>
                <Text style={{ fontSize:11, color:theme.textSub, marginTop:3 }}>{st.label}</Text>
              </View>
            ))}
          </View>

          {/* Recent XP */}
          <View style={[s.recentXP, { backgroundColor:theme.card, borderColor:theme.border }]}>
            <Text style={{ fontSize:13, fontWeight:"800", color:theme.text, marginBottom:10 }}>Recent XP</Text>
            {[{icon:"📷",action:"Scanned 3 items",pts:"+30",time:"Today"},{icon:"✅",action:"Used item before expiry",pts:"+50",time:"Today"},{icon:"🥗",action:"Cooked Spinach Omelette",pts:"+80",time:"Yesterday"},{icon:"♻️",action:"Weekly waste goal met",pts:"+200",time:"Jun 5"},{icon:"🔥",action:"7-day login streak",pts:"+150",time:"Jun 5"}].map((r,i) => (
              <View key={i} style={[s.xpRow, i>0 && { borderTopWidth:1, borderTopColor:theme.border+"40" }]}>
                <Text style={{ fontSize:18, flexShrink:0 }}>{r.icon}</Text>
                <Text style={{ flex:1, fontSize:13, color:theme.text }}>{r.action}</Text>
                <Text style={{ fontSize:13, fontWeight:"800", color:C.success }}>{r.pts} XP</Text>
                <Text style={{ fontSize:11, color:theme.textSub }}>{r.time}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {activeTab === "badges" && (
        <View style={{ gap:14, marginTop:16 }}>
          <Text style={{ fontSize:13, fontWeight:"700", color:theme.textSub }}>{earnedBadges.length} of {ALL_BADGES.length} badges earned</Text>
          <ProgressBar value={earnedBadges.length} max={ALL_BADGES.length} label="Collection Progress" color={C.primary} />
          <View style={{ flexDirection:"row", flexWrap:"wrap", gap:10 }}>
            {ALL_BADGES.map((badge, i) => (
              <View key={badge.name} style={[s.badgeCard, { backgroundColor:badge.earned?`${C.primary}10`:theme.card, borderColor:badge.earned?C.primary+"40":theme.border, opacity:badge.earned?1:0.5, width:"30%" }]}>
                <Text style={{ fontSize:32, marginBottom:6, opacity:badge.earned?1:0.4 }}>{badge.icon}</Text>
                <Text style={{ fontSize:11, fontWeight:"800", color:badge.earned?theme.text:theme.textSub, lineHeight:16, marginBottom:4, textAlign:"center" }}>{badge.name}</Text>
                <Text style={{ fontSize:9, color:theme.textSub, lineHeight:14, textAlign:"center" }}>{badge.desc}</Text>
                <Text style={{ marginTop:6, fontSize:10, fontWeight:"700", color:badge.earned?C.success:theme.textSub }}>{badge.earned?"✅ Earned":`+${badge.pts} XP`}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {activeTab === "rewards" && (
        <View style={{ gap:12, marginTop:16 }}>
          <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center" }}>
            <Text style={{ fontSize:13, fontWeight:"700", color:theme.textSub }}>Your balance</Text>
            <Badge color={C.success} bg={C.successSoft}>💰 840 points available</Badge>
          </View>
          {REWARDS_CATALOG.map((reward, i) => (
            <View key={i} style={[s.rewardCard, { backgroundColor:theme.card, borderColor:theme.border }]}>
              <View style={[s.rewardIcon, { backgroundColor:C.warning+"18" }]}>
                <Text style={{ fontSize:28 }}>{reward.icon}</Text>
              </View>
              <View style={{ flex:1 }}>
                <Text style={{ fontSize:15, fontWeight:"700", color:theme.text }}>{reward.name}</Text>
                <Text style={{ fontSize:11, color:theme.textSub, marginTop:2 }}>{reward.pts} points required</Text>
              </View>
              <Btn variant={840>=reward.pts&&reward.available?"primary":"secondary"} size="sm"
                disabled={840<reward.pts||!reward.available}
                onClick={() => toast(`🎁 ${reward.name} redeemed!`)}>
                {840>=reward.pts&&reward.available?"Redeem":"Locked"}
              </Btn>
            </View>
          ))}
        </View>
      )}
    </Sheet>
  );
}

// ─── ChallengesSheet ──────────────────────────────────────────────────────────
export function ChallengesSheet({ open, onClose, toast }: { open:boolean; onClose:()=>void; toast:(msg:string,type?:string)=>void }) {
  const theme = useTheme();
  const [filter, setFilter] = useState("active");
  const filtered = CHALLENGES_DATA.filter(c => c.status===filter);
  const diffColor = (d: string) => d==="Easy"?C.success:d==="Medium"?C.warning:C.error;

  return (
    <Sheet open={open} onClose={onClose} title="⚡ Challenges">
      {/* Status tabs */}
      <View style={[s.tabSwitcher, { backgroundColor:theme.card, borderColor:theme.border, marginBottom:16 }]}>
        {[{id:"active",label:"🔥 Active",count:3},{id:"completed",label:"✅ Done",count:2},{id:"upcoming",label:"🔜 Coming",count:2}].map(t => (
          <TouchableOpacity key={t.id} onPress={() => setFilter(t.id)} style={[s.tabBtn, { backgroundColor:filter===t.id?C.error:"transparent" }]}>
            <Text style={{ fontSize:11, fontWeight:"700", color:filter===t.id?"white":theme.textSub }}>{t.label} ({t.count})</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ gap:12 }}>
        {filtered.map((ch, i) => {
          const pct = Math.min(Math.round(ch.progress/ch.goal*100),100);
          return (
            <View key={ch.id} style={[s.challengeCard, { backgroundColor:theme.card, borderColor:ch.status==="active"?C.error+"30":ch.status==="completed"?C.success+"30":theme.border }]}>
              {ch.status==="completed" && (
                <View style={[s.completedRibbon, { backgroundColor:C.successSoft, borderColor:C.success+"40" }]}>
                  <Text style={{ fontSize:10, fontWeight:"800", color:C.success }}>✓ COMPLETED</Text>
                </View>
              )}
              <View style={{ flexDirection:"row", gap:14, alignItems:"flex-start" }}>
                <View style={[s.challengeIcon, { backgroundColor:`${diffColor(ch.difficulty)}15` }]}>
                  <Text style={{ fontSize:28 }}>{ch.icon}</Text>
                </View>
                <View style={{ flex:1 }}>
                  <View style={{ flexDirection:"row", gap:7, alignItems:"center", flexWrap:"wrap", marginBottom:4 }}>
                    <Text style={{ fontSize:15, fontWeight:"800", color:theme.text }}>{ch.title}</Text>
                    <Badge color={diffColor(ch.difficulty)}>{ch.difficulty}</Badge>
                  </View>
                  <Text style={{ fontSize:11, color:theme.textSub, lineHeight:18, marginBottom:10 }}>{ch.desc}</Text>
                  {ch.status !== "upcoming" && (
                    <View style={{ marginBottom:8 }}>
                      <View style={{ flexDirection:"row", justifyContent:"space-between", marginBottom:5 }}>
                        <Text style={{ fontSize:11, fontWeight:"600", color:theme.text }}>{ch.progress} / {ch.goal} {ch.unit}</Text>
                        <Text style={{ fontSize:11, fontWeight:"800", color:pct>=100?C.success:C.primary }}>{pct}%</Text>
                      </View>
                      <View style={[s.progressBg, { backgroundColor:theme.border+"50" }]}>
                        <View style={[s.progressFill, { width:`${pct}%` as any, backgroundColor:pct>=100?C.success:C.primary }]} />
                      </View>
                    </View>
                  )}
                  <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:6 }}>
                    <View style={{ flexDirection:"row", gap:6 }}>
                      <Badge color={C.warning} bg={C.warningSoft}>+{ch.reward} XP</Badge>
                      {ch.status==="active" && <Badge color={C.error} bg={C.errorSoft}>⏰ {ch.deadline}</Badge>}
                      {ch.status==="upcoming" && <Badge color={theme.textSub}>{ch.deadline}</Badge>}
                    </View>
                    {ch.status==="active" && pct>=100 && (
                      <Btn variant="success" size="sm" onClick={() => toast(`🎉 ${ch.title} completed! +${ch.reward} XP`)}>Claim +{ch.reward} XP</Btn>
                    )}
                    {ch.status==="upcoming" && (
                      <Btn variant="secondary" size="sm" onClick={() => toast(`🔔 Reminder set for ${ch.title}`)}>🔔 Remind Me</Btn>
                    )}
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </Sheet>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  // Chat
  chatAvatar:   { width:32, height:32, borderRadius:16, alignItems:"center", justifyContent:"center", flexShrink:0, alignSelf:"flex-end" },
  bubble:       { borderRadius:18, paddingHorizontal:14, paddingVertical:11 },
  bubbleUser:   { borderBottomRightRadius:4 },
  bubbleAI:     { borderBottomLeftRadius:4, borderWidth:1.5 },
  suggestionChip:{ height:32, paddingHorizontal:12, borderRadius:99, borderWidth:1.5, justifyContent:"center" },
  inputRow:     { flexDirection:"row", gap:10, paddingTop:10, borderTopWidth:1, alignItems:"center" },
  chatInput:    { flex:1, height:44, paddingHorizontal:14, borderWidth:1.5, borderRadius:22, fontSize:14 },
  // History / IoT / Blockchain
  banner:       { borderRadius:20, padding:16, marginBottom:0 },
  bannerSub:    { fontSize:13, color:"rgba(255,255,255,0.8)", marginBottom:8 },
  bannerStat:   { flex:1, alignItems:"center" },
  bannerVal:    { fontSize:18, fontWeight:"800", color:"white" },
  bannerLabel:  { fontSize:10, color:"rgba(255,255,255,0.75)", marginTop:2 },
  filterChip:   { height:34, paddingHorizontal:14, borderRadius:99, borderWidth:1.5, justifyContent:"center" },
  historyCard:  { flexDirection:"row", alignItems:"center", gap:14, padding:14, borderRadius:18, borderWidth:1.5 },
  historyEmoji: { width:46, height:46, borderRadius:12, alignItems:"center", justifyContent:"center" },
  // Share
  shareCard:    { borderRadius:18, padding:16, borderWidth:1.5 },
  toggle:       { width:44, height:26, borderRadius:13, position:"relative" },
  toggleThumb:  { position:"absolute", top:3, width:20, height:20, borderRadius:10, backgroundColor:"white" },
  linkBox:      { borderRadius:12, padding:10, flexDirection:"row", alignItems:"center", gap:10, borderWidth:1 },
  emailInput:   { height:46, paddingHorizontal:14, borderWidth:1.5, borderRadius:22, fontSize:14, marginBottom:0 },
  memberCard:   { flexDirection:"row", alignItems:"center", gap:12, padding:14, borderRadius:18, borderWidth:1.5, marginBottom:10 },
  memberAvatar: { width:44, height:44, borderRadius:22, alignItems:"center", justifyContent:"center", position:"relative" },
  onlineDot:    { position:"absolute", bottom:0, right:0, width:13, height:13, borderRadius:7, borderWidth:2 },
  removeBtn:    { width:32, height:32, borderRadius:8, alignItems:"center", justifyContent:"center" },
  permCard:     { borderRadius:16, padding:14, borderWidth:1.5 },
  permRow:      { flexDirection:"row", alignItems:"center", paddingVertical:7 },
  // IoT
  deviceCard:   { borderRadius:18, padding:16, borderWidth:1.5 },
  deviceIcon:   { width:46, height:46, borderRadius:14, alignItems:"center", justifyContent:"center" },
  deviceDetail: { marginTop:14, paddingTop:14, borderTopWidth:1, gap:10 },
  metricBox:    { borderRadius:12, padding:10, alignItems:"center" },
  // Blockchain
  txCard:       { borderRadius:16, padding:14, borderWidth:1.5 },
  txIcon:       { width:40, height:40, borderRadius:12, alignItems:"center", justifyContent:"center" },
  txHash:       { marginTop:10, borderRadius:10, padding:8, flexDirection:"row", justifyContent:"space-between", alignItems:"center" },
  nftCard:      { borderRadius:18, padding:16, borderWidth:1.5 },
  nftItem:      { borderRadius:14, padding:12, alignItems:"center", borderWidth:1.5 },
  // Gamification
  tabSwitcher:  { flexDirection:"row", borderRadius:14, borderWidth:1.5, overflow:"hidden" },
  tabBtn:       { flex:1, height:38, alignItems:"center", justifyContent:"center" },
  xpCard:       { borderRadius:20, padding:18 },
  xpBadge:      { width:64, height:64, borderRadius:32, backgroundColor:"rgba(255,255,255,0.2)", alignItems:"center", justifyContent:"center", borderWidth:3, borderColor:"rgba(255,255,255,0.4)" },
  xpBarBg:      { backgroundColor:"rgba(255,255,255,0.25)", borderRadius:99, height:12, overflow:"hidden" },
  xpBarFill:    { height:"100%", backgroundColor:"white", borderRadius:99 },
  statCard:     { borderRadius:16, padding:14, alignItems:"center", borderWidth:1.5 },
  recentXP:     { borderRadius:16, padding:14, borderWidth:1.5 },
  xpRow:        { flexDirection:"row", alignItems:"center", gap:10, paddingVertical:8 },
  badgeCard:    { borderRadius:16, padding:14, alignItems:"center", borderWidth:1.5 },
  rewardCard:   { borderRadius:16, padding:14, flexDirection:"row", alignItems:"center", gap:14, borderWidth:1.5 },
  rewardIcon:   { width:52, height:52, borderRadius:14, alignItems:"center", justifyContent:"center" },
  // Challenges
  challengeCard:{ borderRadius:20, padding:16, borderWidth:1.5, position:"relative", overflow:"hidden" },
  completedRibbon:{ position:"absolute", top:12, right:12, borderRadius:8, paddingHorizontal:10, paddingVertical:3, borderWidth:1 },
  challengeIcon:{ width:52, height:52, borderRadius:16, alignItems:"center", justifyContent:"center" },
  progressBg:   { borderRadius:99, height:9, overflow:"hidden" },
  progressFill: { height:"100%", borderRadius:99 },
});
