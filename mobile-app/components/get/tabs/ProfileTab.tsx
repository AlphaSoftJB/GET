import React, { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { C } from "@/lib/design/tokens";
import { Theme } from "@/lib/design/theme";
import { Badge, Btn, QuickSettingCard } from "../ui";
import { useAppState } from "@/lib/state/app-state";

interface ProfileTabProps {
  theme: Theme;
  toast: (m: string) => void;
  isDark: boolean;
  setDark: (v: boolean) => void;
  largeText: boolean;
  setLargeText: (v: boolean) => void;
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
  onOpenHealth?: () => void;
  onOpenShopping?: () => void;
  onOpenNutrition?: () => void;
  onOpenHistory?: () => void;
  onOpenShare?: () => void;
}

function SectionLabel({ children, theme }: { children: React.ReactNode; theme: Theme }) {
  return (
    <Text style={{ fontSize: theme.fs.xs, fontWeight: "800", color: theme.textSub, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 12 }}>
      {children}
    </Text>
  );
}

function ListRow({ icon, label, sub, badge, danger, iconBg, theme, onPress, small }: {
  icon: string; label: string; sub: string; badge?: string | null; danger?: boolean; iconBg?: string; theme: Theme; onPress?: () => void; small?: boolean;
}) {
  const size = small ? 38 : 42;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 18, paddingVertical: small ? 14 : 16, minHeight: small ? 54 : 58, opacity: pressed ? 0.6 : 1 })}>
      <View style={{ width: size, height: size, borderRadius: small ? 10 : 12, backgroundColor: iconBg || theme.card, borderWidth: iconBg ? 0 : 1.5, borderColor: theme.border, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: small ? 18 : 22 }}>{icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: theme.fs.body, color: danger ? C.error : theme.text, fontWeight: "600" }}>{label}</Text>
        <Text style={{ fontSize: theme.fs.xs, color: theme.textSub, marginTop: 1 }}>{sub}</Text>
      </View>
      {badge ? <Badge color={C.primary} bg={C.primarySoft} fs={theme.fs.badge}>{badge}</Badge> : null}
      <Text style={{ fontSize: 16, color: theme.textSub }}>›</Text>
    </Pressable>
  );
}

export function ProfileTab({ theme, toast, isDark, setDark, largeText, setLargeText, highContrast, setHighContrast, onOpenHealth, onOpenShopping, onOpenNutrition, onOpenHistory, onOpenShare }: ProfileTabProps) {
  const { healthProfile } = useAppState();
  const [notifOn, setNotifOn] = useState(true);
  const divider = <View style={{ height: 1, backgroundColor: theme.border + "60", marginHorizontal: 18 }} />;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={{ paddingBottom: 44 }} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 26, fontWeight: "800", color: theme.text }}>Profile</Text>
        <Pressable onPress={() => toast("⚙️ Settings")} style={{ backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.border, borderRadius: 12, width: 40, height: 40, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 17 }}>⚙️</Text>
        </Pressable>
      </View>

      {/* User Card */}
      <LinearGradient colors={["#4F46E5", "#7C3AED", "#EC4899"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ margin: 16, marginBottom: 0, marginTop: 16, borderRadius: 24, padding: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <View style={{ width: 66, height: 66, borderRadius: 33, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center", borderWidth: 2.5, borderColor: "rgba(255,255,255,0.4)" }}>
            <Text style={{ fontSize: 32 }}>👤</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 22, fontWeight: "700", color: "white" }}>My Kitchen</Text>
            <Text style={{ fontSize: theme.fs.sm, color: "rgba(255,255,255,0.82)", marginTop: 3 }}>Family of 4 · Healthy plan</Text>
            <View style={{ flexDirection: "row", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
              {healthProfile.allergens.length > 0 ? <Badge color="rgba(255,255,255,0.95)" bg="rgba(255,255,255,0.2)" fs={theme.fs.xs}>{healthProfile.allergens.length} allergens</Badge> : null}
              {healthProfile.dietary.length > 0 ? <Badge color="rgba(255,255,255,0.95)" bg="rgba(255,255,255,0.2)" fs={theme.fs.xs}>{healthProfile.dietary[0]}</Badge> : null}
              {healthProfile.dietary.length === 0 && healthProfile.allergens.length === 0 ? <Badge color="rgba(255,255,255,0.95)" bg="rgba(255,255,255,0.2)" fs={theme.fs.xs}>No profile set</Badge> : null}
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Display Settings */}
      <View style={{ marginHorizontal: 16, marginTop: 18 }}>
        <SectionLabel theme={theme}>Display Settings</SectionLabel>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <QuickSettingCard emoji={isDark ? "☀️" : "🌙"} label={isDark ? "Light Mode" : "Dark Mode"} desc={isDark ? "Switch to light theme" : "Easy on the eyes"} on={isDark} onToggle={() => setDark(!isDark)} color={C.primary} theme={theme} />
          <QuickSettingCard emoji="🔠" label="Large Text" desc={largeText ? "Larger fonts active" : "Increase font size"} on={largeText} onToggle={() => setLargeText(!largeText)} color={C.teal} theme={theme} />
        </View>
        <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
          <QuickSettingCard emoji="🎨" label="High Contrast" desc="Better readability" on={highContrast} onToggle={() => setHighContrast(!highContrast)} color={C.accent} theme={theme} />
          <QuickSettingCard emoji="🔔" label="Notifications" desc="Expiry alerts" on={notifOn} onToggle={() => setNotifOn((n) => !n)} color={C.warning} theme={theme} />
        </View>
      </View>

      {/* Text Size */}
      <View style={{ marginHorizontal: 16, marginTop: 18 }}>
        <SectionLabel theme={theme}>Text Size</SectionLabel>
        <View style={{ backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.border, borderRadius: 18, padding: 16, flexDirection: "row", alignItems: "center", gap: 16 }}>
          <Pressable onPress={() => setLargeText(false)} style={{ flex: 1, height: 44, borderRadius: 12, borderWidth: 2, borderColor: !largeText ? C.primary : theme.border, backgroundColor: !largeText ? C.primarySoft : "transparent", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontWeight: "700", fontSize: 13, color: !largeText ? C.primary : theme.textSub }}>A Normal</Text>
          </Pressable>
          <Pressable onPress={() => setLargeText(true)} style={{ flex: 1, height: 44, borderRadius: 12, borderWidth: 2, borderColor: largeText ? C.primary : theme.border, backgroundColor: largeText ? C.primarySoft : "transparent", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontWeight: "700", fontSize: 15, color: largeText ? C.primary : theme.textSub }}>A Large</Text>
          </Pressable>
        </View>
      </View>

      {/* Health & Safety */}
      <View style={{ marginHorizontal: 16, marginTop: 18 }}>
        <SectionLabel theme={theme}>Health & Safety</SectionLabel>
        <View style={{ backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.border, borderRadius: 18, overflow: "hidden" }}>
          <ListRow icon="💚" iconBg={C.successSoft} label="Health Profile" sub={healthProfile.allergens.length > 0 ? `⚠ ${healthProfile.allergens.join(", ")}` : "Set your allergens & diet preferences"} theme={theme} onPress={onOpenHealth} />
          {divider}
          <ListRow icon="🏥" label="Medical History" sub="Conditions & medications" theme={theme} onPress={() => toast("🏥 Medical History")} />
          <ListRow icon="📊" label="Nutrition Dashboard" sub="Daily targets & tracking" theme={theme} onPress={onOpenNutrition} />
          <ListRow icon="🛒" label="Shopping List" sub="Plan your next grocery run" theme={theme} onPress={onOpenShopping} />
          <ListRow icon="📋" label="Item History" sub="View used & consumed items" theme={theme} onPress={onOpenHistory} />
          <ListRow icon="🤝" label="Share & Collaborate" sub="Invite family to your pantry" theme={theme} onPress={onOpenShare} />
        </View>
      </View>

      {/* Account */}
      <View style={{ marginHorizontal: 16, marginTop: 18 }}>
        <SectionLabel theme={theme}>Account</SectionLabel>
        <View style={{ backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.border, borderRadius: 18, overflow: "hidden" }}>
          {[
            { icon: "✏️", label: "Edit Profile", sub: "Name, photo, email" },
            { icon: "🔒", label: "Change Password", sub: "Security settings" },
            { icon: "📧", label: "Email Preferences", sub: "Newsletter & alerts" },
            { icon: "🌐", label: "Language", sub: "English (US)" },
          ].map((it, i) => (
            <View key={it.label}>{i > 0 ? divider : null}<ListRow small icon={it.icon} label={it.label} sub={it.sub} theme={theme} onPress={() => toast(it.label)} /></View>
          ))}
        </View>
      </View>

      {/* Privacy & Security */}
      <View style={{ marginHorizontal: 16, marginTop: 18 }}>
        <SectionLabel theme={theme}>Privacy & Security</SectionLabel>
        <View style={{ backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.border, borderRadius: 18, overflow: "hidden" }}>
          {[
            { icon: "🔒", label: "Two-Factor Authentication", sub: "Add extra login security", badge: "Recommended" },
            { icon: "👁", label: "Privacy Settings", sub: "Control data visibility & sharing", badge: null },
            { icon: "📱", label: "Connected Devices", sub: "Manage linked devices", badge: "2 devices" },
            { icon: "🔑", label: "Change Password", sub: "Last changed 30 days ago", badge: null },
          ].map((it, i) => (
            <View key={it.label}>{i > 0 ? divider : null}<ListRow small icon={it.icon} label={it.label} sub={it.sub} badge={it.badge} theme={theme} onPress={() => toast(it.label)} /></View>
          ))}
        </View>
      </View>

      {/* Data Management */}
      <View style={{ marginHorizontal: 16, marginTop: 18 }}>
        <SectionLabel theme={theme}>Data Management</SectionLabel>
        <View style={{ backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.border, borderRadius: 18, overflow: "hidden" }}>
          {[
            { icon: "📤", label: "Export My Data", sub: "Download all your grocery & health data as CSV", color: C.primary },
            { icon: "📥", label: "Import Data", sub: "Import items from a CSV or previous backup", color: C.teal },
            { icon: "🗑", label: "Delete Account", sub: "Permanently remove all data", color: C.error, danger: true },
          ].map((it, i) => (
            <View key={it.label}>{i > 0 ? divider : null}<ListRow small icon={it.icon} label={it.label} sub={it.sub} danger={it.danger} iconBg={it.color + "15"} theme={theme} onPress={() => toast(it.label)} /></View>
          ))}
        </View>
      </View>

      {/* Sign Out */}
      <View style={{ paddingHorizontal: 16, paddingTop: 18 }}>
        <Btn variant="danger" size="lg" full theme={theme} onClick={() => toast("👋 Signed out")}>Sign Out</Btn>
        <Text style={{ textAlign: "center", marginTop: 14, fontSize: theme.fs.xs, color: theme.textSub }}>GET v1.1 · Groceries Expiration Tracker</Text>
      </View>
    </ScrollView>
  );
}
