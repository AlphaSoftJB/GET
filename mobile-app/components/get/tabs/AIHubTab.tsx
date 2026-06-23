import React, { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { C } from "@/lib/design/tokens";
import { Theme } from "@/lib/design/theme";

type Stat = { label: string; value: string };
type Feature = {
  id: string; icon: string; color: string; title: string; desc: string; stats: Stat[]; sheet?: string;
};

const wasteReduced = 2.4, budgetSaved = 34.5, nutritionScore = 87, pendingRecs = 5;

const FEATURES: Feature[] = [
  { id: "shopping", icon: "🛒", color: C.primary, title: "Shopping Assistant", desc: "Predictive lists, price comparisons & budget tracking", stats: [{ label: "Budget Left", value: "$65.50" }, { label: "Items to Buy", value: "8" }, { label: "Deals Found", value: "3" }], sheet: "shopping" },
  { id: "nutrition", icon: "🥗", color: C.success, title: "Nutrition Coach", desc: "Daily tracking, health goals & personalized recommendations", stats: [{ label: "Score", value: `${nutritionScore}/100` }, { label: "Calories", value: "1,420" }, { label: "Protein", value: "68g" }], sheet: "nutrition" },
  { id: "sustainability", icon: "🌱", color: C.teal, title: "Sustainability", desc: "Waste reduction metrics, CO₂ saved & environmental impact", stats: [{ label: "Waste Saved", value: `${wasteReduced}kg` }, { label: "CO₂ Saved", value: "1.8kg" }, { label: "Water", value: "240L" }] },
  { id: "price", icon: "💰", color: C.warning, title: "Price Alerts", desc: "Deal notifications, price history & store comparisons", stats: [{ label: "Active Alerts", value: "4" }, { label: "Saved This Week", value: "$8.20" }, { label: "Deals Live", value: "6" }] },
  { id: "deals", icon: "🎯", color: "#8B5CF6", title: "Deals & Offers", desc: "Personalized store deals, coupons & limited-time offers", stats: [{ label: "Coupons", value: "7" }, { label: "Expires Today", value: "2" }, { label: "Avg Saving", value: "18%" }] },
  { id: "insights", icon: "🔮", color: C.accent, title: "AI Insights", desc: "Smart recommendations, trend analysis & predictive alerts", stats: [{ label: "Pending", value: `${pendingRecs}` }, { label: "Accuracy", value: "94%" }, { label: "Streak", value: "12d" }] },
  { id: "recipes", icon: "🍳", color: "#F97316", title: "Recipes", desc: "AI-ranked recipes using your expiring pantry ingredients", stats: [{ label: "Available", value: "5" }, { label: "Ready Now", value: "2" }, { label: "Rating", value: "4.7⭐" }] },
  { id: "nlpchat", icon: "💬", color: "#8B5CF6", title: "AI Chat", desc: "NLP assistant with intent recognition & multi-turn context", stats: [{ label: "Intent AI", value: "✓ Active" }, { label: "Context", value: "Multi-turn" }, { label: "Accuracy", value: "94%" }], sheet: "chat" },
  { id: "iot", icon: "🌡", color: "#06B6D4", title: "Smart Fridge", desc: "IoT device connectivity, temperature monitoring & real-time sync", stats: [{ label: "Devices", value: "2 online" }, { label: "Temp", value: "38°F" }, { label: "Humidity", value: "65%" }], sheet: "iot" },
  { id: "blockchain", icon: "⛓", color: "#7C3AED", title: "Blockchain", desc: "Immutable impact ledger, NFT achievements & audit trail", stats: [{ label: "Tx Count", value: "47" }, { label: "Network", value: "Polygon" }, { label: "Verified", value: "✓" }], sheet: "ledger" },
  { id: "gamify", icon: "🏆", color: "#F59E0B", title: "Achievements", desc: "Points, XP rewards, badges & waste reduction milestones", stats: [{ label: "Points", value: "2,840" }, { label: "Level", value: "8" }, { label: "Badges", value: "12/20" }], sheet: "gamify" },
  { id: "challenges", icon: "⚡", color: "#EF4444", title: "Challenges", desc: "Weekly challenges with goals, progress tracking & prizes", stats: [{ label: "Active", value: "3" }, { label: "Completed", value: "14" }, { label: "Streak", value: "7d" }], sheet: "challenges" },
];

export function AIHubTab({ theme, toast, onOpenSheet }: { theme: Theme; toast: (m: string) => void; onOpenSheet?: (id: string) => void }) {
  const [active, setActive] = useState<string | null>(null);
  const sel = FEATURES.find((f) => f.id === active) || null;

  if (sel) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={{ padding: 16, paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => setActive(null)} style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 }}>
          <Text style={{ fontSize: 16, color: C.primary, fontWeight: "700" }}>← Back</Text>
        </Pressable>
        <LinearGradient colors={[sel.color + "18", sel.color + "08"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderWidth: 1.5, borderColor: sel.color + "30", borderRadius: 20, padding: 20, marginBottom: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
            <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: sel.color + "20", alignItems: "center", justifyContent: "center" }}><Text style={{ fontSize: 30 }}>{sel.icon}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: theme.fs.h3, fontWeight: "800", color: theme.text }}>{sel.title}</Text>
              <Text style={{ fontSize: theme.fs.sm, color: theme.textSub, marginTop: 3, lineHeight: 20 }}>{sel.desc}</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
            {sel.stats.map((s) => (
              <View key={s.label} style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.5)", borderRadius: 12, padding: 10, alignItems: "center" }}>
                <Text style={{ fontSize: 16, fontWeight: "800", color: sel.color }}>{s.value}</Text>
                <Text style={{ fontSize: 10, color: theme.textSub, marginTop: 2 }}>{s.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {sel.id === "sustainability" && <SustainabilityDetail theme={theme} />}
        {sel.id !== "sustainability" && (
          <View style={{ backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.border, borderRadius: 16, padding: 16 }}>
            <Text style={{ fontSize: theme.fs.sm, fontWeight: "800", color: theme.text, marginBottom: 10 }}>📊 Overview</Text>
            <Text style={{ fontSize: theme.fs.body, color: theme.textSub, lineHeight: 22 }}>{sel.desc}. This module continuously analyzes your inventory and habits to deliver smarter recommendations over time.</Text>
          </View>
        )}
      </ScrollView>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={{ paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingHorizontal: 20, paddingTop: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 24, fontWeight: "800", color: theme.text }}>AI Hub</Text>
        <LinearGradient colors={[C.primary, C.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 99, paddingHorizontal: 12, paddingVertical: 4 }}>
          <Text style={{ fontSize: theme.fs.xs, fontWeight: "700", color: "white" }}>BETA</Text>
        </LinearGradient>
      </View>

      {/* AI Summary Banner */}
      <LinearGradient colors={["#4F46E5", "#7C3AED", "#EC4899"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ marginHorizontal: 16, marginTop: 16, borderRadius: 20, padding: 18 }}>
        <Text style={{ fontSize: theme.fs.sm, fontWeight: "700", color: "white", opacity: 0.85, marginBottom: 14 }}>🤖 Your AI Summary</Text>
        <View style={{ flexDirection: "row" }}>
          {[{ label: "Waste Reduced", value: `${wasteReduced}kg`, icon: "♻️" }, { label: "Budget Saved", value: `$${budgetSaved}`, icon: "💰" }, { label: "Nutrition", value: `${nutritionScore}%`, icon: "💪" }, { label: "AI Tips", value: `${pendingRecs} new`, icon: "✨" }].map((s, i) => (
            <View key={s.label} style={{ flex: 1, paddingHorizontal: 8, borderLeftWidth: i > 0 ? 1 : 0, borderLeftColor: "rgba(255,255,255,0.2)", alignItems: "center" }}>
              <Text style={{ fontSize: 20 }}>{s.icon}</Text>
              <Text style={{ fontSize: 16, fontWeight: "800", color: "white", marginTop: 4 }}>{s.value}</Text>
              <Text style={{ fontSize: theme.fs.xs, color: "white", opacity: 0.75, marginTop: 2, textAlign: "center" }}>{s.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* Feature grid (2 cols) */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 16, paddingTop: 16, gap: 12 }}>
        {FEATURES.map((f) => (
          <Pressable key={f.id} onPress={() => { if (f.sheet) { onOpenSheet ? onOpenSheet(f.sheet) : toast(f.title); } else { setActive(f.id); } }}
            style={{ width: "47.8%", backgroundColor: theme.card, borderWidth: 1.5, borderColor: f.color + "30", borderRadius: 20, padding: 14 }}>
            <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: f.color + "18", alignItems: "center", justifyContent: "center", marginBottom: 10 }}><Text style={{ fontSize: 24 }}>{f.icon}</Text></View>
            <Text style={{ fontSize: theme.fs.sm, fontWeight: "800", color: theme.text, marginBottom: 4 }}>{f.title}</Text>
            <Text style={{ fontSize: theme.fs.xs, color: theme.textSub, lineHeight: 17, marginBottom: 10 }}>{f.desc}</Text>
            <View style={{ flexDirection: "row" }}>
              {f.stats.slice(0, 2).map((s, i) => (
                <View key={s.label} style={{ flex: 1, paddingLeft: i > 0 ? 8 : 0, borderLeftWidth: i > 0 ? 1 : 0, borderLeftColor: theme.border + "40" }}>
                  <Text style={{ fontSize: 12, fontWeight: "800", color: f.color }}>{s.value}</Text>
                  <Text style={{ fontSize: 10, color: theme.textSub }}>{s.label}</Text>
                </View>
              ))}
            </View>
            <Text style={{ marginTop: 10, fontSize: theme.fs.xs, color: f.color, fontWeight: "700", textAlign: "right" }}>Open →</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

function SustainabilityDetail({ theme }: { theme: Theme }) {
  return (
    <View style={{ gap: 12 }}>
      <View style={{ backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.border, borderRadius: 16, padding: 16 }}>
        <Text style={{ fontSize: theme.fs.h3, fontWeight: "700", color: theme.text, marginBottom: 12 }}>🌍 Environmental Impact</Text>
        {[{ label: "Food waste reduced", value: "2.4 kg", icon: "♻️", color: C.success }, { label: "CO₂ emissions saved", value: "1.8 kg", icon: "🌿", color: C.teal }, { label: "Water conserved", value: "240 L", icon: "💧", color: C.info }, { label: "Money saved", value: "$34.50", icon: "💰", color: C.warning }].map((m, i) => (
          <View key={m.label} style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10, borderTopWidth: i > 0 ? 1 : 0, borderTopColor: theme.border + "40" }}>
            <Text style={{ fontSize: 22 }}>{m.icon}</Text>
            <Text style={{ flex: 1, fontSize: theme.fs.body, color: theme.text }}>{m.label}</Text>
            <Text style={{ fontSize: theme.fs.body, fontWeight: "800", color: m.color }}>{m.value}</Text>
          </View>
        ))}
      </View>
      <View style={{ backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.border, borderRadius: 16, padding: 16 }}>
        <Text style={{ fontSize: theme.fs.sm, fontWeight: "800", color: theme.text, marginBottom: 12 }}>📈 CO₂ Reduction Timeline</Text>
        <View style={{ flexDirection: "row", gap: 6, alignItems: "flex-end", height: 90 }}>
          {[{ w: "W1", v: 2.1 }, { w: "W2", v: 1.9 }, { w: "W3", v: 1.7 }, { w: "W4", v: 1.4 }, { w: "W5", v: 1.0 }, { w: "W6", v: 0.8 }].map((d) => (
            <View key={d.w} style={{ flex: 1, alignItems: "center", gap: 3 }}>
              <Text style={{ fontSize: 9, color: C.teal, fontWeight: "700" }}>{d.v}kg</Text>
              <View style={{ width: "100%", height: (d.v / 2.1) * 60, minHeight: 8, backgroundColor: C.teal, borderTopLeftRadius: 4, borderTopRightRadius: 4 }} />
              <Text style={{ fontSize: 10, color: theme.textSub }}>{d.w}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
