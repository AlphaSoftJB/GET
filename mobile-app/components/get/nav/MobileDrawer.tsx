import React from "react";
import { View, Text, Pressable, Modal, ScrollView, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { C } from "@/lib/design/tokens";
import { Theme } from "@/lib/design/theme";
import { Toggle } from "../ui";
import type { TabKey } from "./BottomTabBar";

const { width: SCREEN_W } = Dimensions.get("window");

const NAV: { id: TabKey; icon: string; label: string }[] = [
  { id: "home", icon: "🏠", label: "Home" },
  { id: "fridge", icon: "🧊", label: "AR Fridge" },
  { id: "ai", icon: "🤖", label: "AI Hub" },
  { id: "inventory", icon: "📦", label: "Inventory" },
  { id: "profile", icon: "⚙️", label: "Profile" },
];

export function MobileDrawer({
  open, onClose, activeTab, onNavigate, theme, isDark, setDark, largeText, setLargeText,
}: {
  open: boolean; onClose: () => void; activeTab: TabKey; onNavigate: (t: TabKey) => void;
  theme: Theme; isDark: boolean; setDark: (v: boolean) => void; largeText: boolean; setLargeText: (v: boolean) => void;
}) {
  const insets = useSafeAreaInsets();
  const width = Math.min(SCREEN_W * 0.8, 300);
  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={{ flex: 1, backgroundColor: theme.overlay, flexDirection: "row" }} onPress={onClose}>
        <Pressable style={{ width, height: "100%", backgroundColor: theme.surface }} onPress={(e) => e.stopPropagation()}>
          <LinearGradient colors={["#4F46E5", "#7C3AED", "#EC4899"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingTop: insets.top + 22, paddingBottom: 22, paddingHorizontal: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View style={{ width: 46, height: 46, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" }}><Text style={{ fontSize: 26 }}>🥗</Text></View>
                <View>
                  <Text style={{ fontSize: 18, fontWeight: "800", color: "white" }}>GET</Text>
                  <Text style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>Expiration Tracker</Text>
                </View>
              </View>
              <Pressable onPress={onClose} style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: "white", fontSize: 15, fontWeight: "700" }}>✕</Text>
              </Pressable>
            </View>
          </LinearGradient>

          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 12, gap: 4 }}>
            {NAV.map((item) => {
              const active = activeTab === item.id;
              return (
                <Pressable key={item.id} onPress={() => { onNavigate(item.id); onClose(); }} style={[styles.navItem, { backgroundColor: active ? C.primarySoft : "transparent" }]}>
                  <Text style={{ fontSize: 22 }}>{item.icon}</Text>
                  <Text style={{ flex: 1, fontSize: theme.fs.body, fontWeight: active ? "800" : "600", color: active ? C.primary : theme.text }}>{item.label}</Text>
                  {active ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.primary }} /> : null}
                </Pressable>
              );
            })}

            <View style={{ marginTop: 12, padding: 16, borderRadius: 16, backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.border }}>
              <Text style={{ fontSize: theme.fs.xs, fontWeight: "800", color: theme.textSub, letterSpacing: 1, marginBottom: 10 }}>QUICK SETTINGS</Text>
              <Toggle on={isDark} onToggle={() => setDark(!isDark)} label="Dark Mode" emoji={isDark ? "☀️" : "🌙"} theme={theme} size="sm" />
              <View style={{ height: 1, backgroundColor: theme.border, marginVertical: 8 }} />
              <Toggle on={largeText} onToggle={() => setLargeText(!largeText)} label="Large Text" emoji="🔠" theme={theme} size="sm" />
            </View>
          </ScrollView>

          <View style={{ padding: 14, paddingBottom: insets.bottom + 20, borderTopWidth: 1, borderTopColor: theme.border }}>
            <Text style={{ fontSize: theme.fs.xs, color: theme.textSub, textAlign: "center" }}>GET v1.1 · Made for healthy kitchens</Text>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  navItem: { flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 14, minHeight: 52 },
});
