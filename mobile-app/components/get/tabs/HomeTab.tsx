import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet, Animated, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { C } from "@/lib/design/tokens";
import { Theme } from "@/lib/design/theme";
import { Badge, StatusBadge, Btn } from "../ui";
import { DAILY_TIPS, SEASONAL_PRODUCE, HOUSEHOLD_FEED, RECIPES, urgency, urgencyLabel } from "@/lib/design/data";
import { useAppState } from "@/lib/state/app-state";
import { useSettings } from "@/lib/design/theme-context";
import type { TabKey } from "../nav/BottomTabBar";

const haptic = () => { if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); };

export function HomeTab({ theme, toast, onNavigate, onOpenScan, onOpenAdd, onOpenItem, onOpenRecipe, onOpenDrawer }: {
  theme: Theme; toast: (m: string) => void; onNavigate: (t: TabKey) => void;
  onOpenScan?: () => void; onOpenAdd?: () => void; onOpenItem?: (item: import("@/lib/design/data").Item) => void;
  onOpenRecipe?: (id: string) => void; onOpenDrawer?: () => void;
}) {
  const { items } = useAppState();
  const { isDark, setDark, largeText, setLargeText } = useSettings();
  const insets = useSafeAreaInsets();

  const expiring = items.filter((i) => i.daysLeft <= 3);
  const recent = [...items].sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 6);
  const [tipIdx, setTipIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTipIdx((i) => (i + 1) % DAILY_TIPS.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
      {/* Gradient hero */}
      <LinearGradient colors={["#4F46E5", "#7C3AED", "#EC4899"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingTop: insets.top + 16, paddingHorizontal: 20, paddingBottom: 30 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <View>
            <Text style={{ fontSize: theme.fs.sm, color: "rgba(255,255,255,0.75)", fontWeight: "600", marginBottom: 3 }}>Good morning 👋</Text>
            <Text style={{ fontSize: 26, fontWeight: "800", color: "white" }}>Your Pantry</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <HeroBtn label="A" active={largeText} onPress={() => setLargeText(!largeText)} text />
            <HeroBtn label={isDark ? "☀️" : "🌙"} onPress={() => setDark(!isDark)} />
            <HeroBtn label="🔔" onPress={() => toast("🔔 No new notifications")} dot={expiring.length > 0} />
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
          {[
            { label: "Total Items", value: `${items.length}`, icon: "📦", color: "rgba(255,255,255,0.95)" },
            { label: "Expiring Soon", value: `${expiring.length}`, icon: "⏰", color: "#FCD34D" },
            { label: "Waste Saved", value: "2.4kg", icon: "♻️", color: "#6EE7B7" },
          ].map((s) => (
            <Pressable key={s.label} onPress={() => { haptic(); onNavigate("inventory"); }} style={styles.statCard}>
              <Text style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</Text>
              <Text style={{ fontSize: 24, fontWeight: "800", color: s.color }}>{s.value}</Text>
              <Text style={{ fontSize: theme.fs.xs, color: "rgba(255,255,255,0.72)", marginTop: 4, fontWeight: "600" }}>{s.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </LinearGradient>

      {/* AI Tip of the day */}
      <View style={{ margin: 16, marginBottom: 0, backgroundColor: C.primarySoft, borderWidth: 1.5, borderColor: C.primary + "25", borderRadius: 18, padding: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text style={{ fontSize: 16 }}>💡</Text>
            <Text style={{ fontSize: theme.fs.xs, fontWeight: "800", color: C.primary, letterSpacing: 0.8 }}>AI TIP OF THE DAY</Text>
          </View>
          <Badge color={C.primary} bg={C.primarySoft} fs={theme.fs.badge}>{DAILY_TIPS[tipIdx].category}</Badge>
        </View>
        <Text style={{ fontSize: theme.fs.body, color: theme.text, lineHeight: 22 }}>{DAILY_TIPS[tipIdx].icon} {DAILY_TIPS[tipIdx].tip}</Text>
        <View style={{ flexDirection: "row", gap: 5, justifyContent: "center", marginTop: 10 }}>
          {DAILY_TIPS.map((_, i) => (
            <Pressable key={i} onPress={() => setTipIdx(i)} style={{ width: i === tipIdx ? 20 : 7, height: 7, borderRadius: 99, backgroundColor: i === tipIdx ? C.primary : theme.border }} />
          ))}
        </View>
      </View>

      {/* Monthly budget */}
      <View style={{ margin: 16, marginBottom: 0, backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.border, borderRadius: 18, padding: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <Text style={{ fontSize: theme.fs.body, fontWeight: "800", color: theme.text }}>💰 Monthly Budget</Text>
          <Pressable onPress={() => onNavigate("ai")}><Text style={{ fontSize: theme.fs.xs, color: C.primary, fontWeight: "700" }}>Manage →</Text></Pressable>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
          <Text style={{ color: theme.textSub, fontSize: theme.fs.sm }}>Spent: <Text style={{ color: C.warning, fontWeight: "800" }}>$127</Text></Text>
          <Text style={{ color: theme.textSub, fontSize: theme.fs.sm }}>Budget: <Text style={{ color: theme.text, fontWeight: "800" }}>$200</Text></Text>
          <Text style={{ color: theme.textSub, fontSize: theme.fs.sm }}>Left: <Text style={{ color: C.success, fontWeight: "800" }}>$73</Text></Text>
        </View>
        <View style={{ backgroundColor: theme.border, borderRadius: 99, height: 10, overflow: "hidden" }}>
          <View style={{ width: "63.5%", height: "100%", backgroundColor: C.warning, borderRadius: 99 }} />
        </View>
      </View>

      {/* Expiry alert strip */}
      {expiring.length > 0 && (
        <View style={{ margin: 16, marginBottom: 0, backgroundColor: C.warningSoft, borderWidth: 1.5, borderColor: C.warning + "30", borderRadius: 16, padding: 14, flexDirection: "row", gap: 12 }}>
          <Text style={{ fontSize: 22 }}>⏰</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: theme.fs.sm, fontWeight: "800", color: C.warning }}>Use these soon!</Text>
            <Text style={{ fontSize: theme.fs.xs, color: theme.textSub, marginTop: 2 }}>{expiring.map((i) => i.name).join(" · ")}</Text>
          </View>
        </View>
      )}

      {/* Expiring first */}
      <Section title="Expiring First" action="See All →" onAction={() => onNavigate("inventory")} theme={theme}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingHorizontal: 4 }}>
          {recent.map((item) => (
            <Pressable key={item.id} onPress={() => { haptic(); onOpenItem ? onOpenItem(item) : onNavigate("inventory"); }}
              style={{ minWidth: 92, backgroundColor: theme.card, borderWidth: 1.5, borderColor: urgency(item.daysLeft) === "error" ? C.error + "40" : theme.border, borderRadius: 18, padding: 12, alignItems: "center", gap: 6 }}>
              <Text style={{ fontSize: 34 }}>{item.emoji}</Text>
              <Text style={{ fontSize: theme.fs.xs, fontWeight: "700", color: theme.text, textAlign: "center" }}>{item.name.split(" ")[0]}</Text>
              <StatusBadge daysLeft={item.daysLeft} fs={theme.fs.badge} />
            </Pressable>
          ))}
        </ScrollView>
      </Section>

      {/* Seasonal picks */}
      <Section title="🌿 Seasonal Picks" badge="In Season Now" theme={theme}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
          {SEASONAL_PRODUCE.map((p) => (
            <View key={p.name} style={{ minWidth: 130, backgroundColor: C.successSoft, borderWidth: 1.5, borderColor: C.success + "25", borderRadius: 16, padding: 14 }}>
              <Text style={{ fontSize: 30, marginBottom: 6 }}>{p.emoji}</Text>
              <Text style={{ fontSize: theme.fs.sm, fontWeight: "800", color: theme.text }}>{p.name}</Text>
              <Text style={{ fontSize: theme.fs.xs, color: theme.textSub, marginTop: 3 }}>{p.note}</Text>
              <Text style={{ fontSize: theme.fs.xs, fontWeight: "800", color: C.success, marginTop: 6 }}>{p.store}</Text>
            </View>
          ))}
        </ScrollView>
      </Section>

      {/* Family activity */}
      <Section title="👨‍👩‍👧 Family Activity" badge="Live" theme={theme}>
        <View style={{ backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.border, borderRadius: 18, overflow: "hidden" }}>
          {HOUSEHOLD_FEED.map((f, i) => (
            <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderBottomWidth: i < HOUSEHOLD_FEED.length - 1 ? 1 : 0, borderBottomColor: theme.border }}>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: C.primary + "18", alignItems: "center", justifyContent: "center" }}><Text style={{ fontSize: 20 }}>{f.avatar}</Text></View>
              <Text style={{ flex: 1, fontSize: theme.fs.sm, color: theme.textSub }}><Text style={{ fontWeight: "700", color: theme.text }}>{f.member}</Text> {f.action} {f.emoji}</Text>
              <Text style={{ fontSize: theme.fs.xs, color: theme.textSub }}>{f.time}</Text>
            </View>
          ))}
        </View>
      </Section>

      {/* Quick recipes */}
      <Section title="Quick Recipes" action="More in AI Hub →" onAction={() => onNavigate("ai")} theme={theme}>
        <View style={{ gap: 10 }}>
          {RECIPES.slice(0, 2).map((r) => (
            <View key={r.id} style={{ backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.border, borderRadius: 16, padding: 14, flexDirection: "row", alignItems: "center", gap: 14 }}>
              <View style={{ width: 54, height: 54, borderRadius: 14, backgroundColor: C.primarySoft, alignItems: "center", justifyContent: "center" }}><Text style={{ fontSize: 28 }}>{r.emoji}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: theme.fs.body, fontWeight: "700", color: theme.text }}>{r.name}</Text>
                <Text style={{ fontSize: theme.fs.xs, color: theme.textSub, marginTop: 2 }}>⏱ {r.time} · {r.servings} servings</Text>
              </View>
              <Badge color={C.primary} bg={C.primarySoft} fs={theme.fs.badge}>{r.meal}</Badge>
            </View>
          ))}
        </View>
      </Section>

      {/* Action buttons */}
      <View style={{ flexDirection: "row", gap: 12, padding: 16 }}>
        <View style={{ flex: 1 }}><Btn variant="primary" size="lg" full theme={theme} onClick={() => (onOpenScan ? onOpenScan() : toast("📷 Scanner opening…"))}>📷 Scan Item</Btn></View>
        <View style={{ flex: 1 }}><Btn variant="secondary" size="lg" full theme={theme} onClick={() => (onOpenAdd ? onOpenAdd() : toast("➕ Add item"))}>➕ Add Item</Btn></View>
      </View>
    </ScrollView>
  );
}

function HeroBtn({ label, onPress, active, text, dot }: { label: string; onPress: () => void; active?: boolean; text?: boolean; dot?: boolean }) {
  return (
    <Pressable onPress={() => { haptic(); onPress(); }} style={{ width: 40, height: 40, borderRadius: 12, borderWidth: 2, borderColor: "rgba(255,255,255,0.3)", backgroundColor: active ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.12)", alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: "white", fontWeight: text ? "900" : "400", fontSize: text ? (active ? 18 : 14) : 19 }}>{label}</Text>
      {dot ? <View style={{ position: "absolute", top: 7, right: 7, width: 8, height: 8, borderRadius: 4, backgroundColor: C.error, borderWidth: 2, borderColor: "#5b4fd6" }} /> : null}
    </Pressable>
  );
}

function Section({ title, action, onAction, badge, theme, children }: { title: string; action?: string; onAction?: () => void; badge?: string; theme: Theme; children: React.ReactNode }) {
  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 18 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <Text style={{ fontSize: theme.fs.h3, fontWeight: "800", color: theme.text }}>{title}</Text>
        {action ? <Pressable onPress={onAction}><Text style={{ fontSize: theme.fs.sm, color: C.primary, fontWeight: "700" }}>{action}</Text></Pressable> : null}
        {badge ? <Badge color={C.success} bg={C.successSoft} fs={theme.fs.badge}>{badge}</Badge> : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  statCard: { minWidth: 110, backgroundColor: "rgba(255,255,255,0.14)", borderWidth: 1.5, borderColor: "rgba(255,255,255,0.2)", borderRadius: 18, padding: 14 },
});
