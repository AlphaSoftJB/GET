import React from "react";
import { View, Text, Pressable, Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { C } from "@/lib/design/tokens";
import { Theme } from "@/lib/design/theme";

export type TabKey = "home" | "fridge" | "ai" | "inventory" | "profile";

const TABS: { key: TabKey; icon: string; label: string }[] = [
  { key: "home", icon: "🏠", label: "Home" },
  { key: "fridge", icon: "🧊", label: "Fridge" },
  { key: "ai", icon: "🤖", label: "AI Hub" },
  { key: "inventory", icon: "📦", label: "Inventory" },
  { key: "profile", icon: "👤", label: "Profile" },
];

export function BottomTabBar({ active, onChange, theme }: { active: TabKey; onChange: (t: TabKey) => void; theme: Theme }) {
  const insets = useSafeAreaInsets();
  const pad = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 10);
  return (
    <View style={[styles.bar, { backgroundColor: theme.card, borderTopColor: theme.border, paddingBottom: pad }]}>
      {TABS.map((t) => {
        const on = active === t.key;
        return (
          <Pressable
            key={t.key}
            onPress={() => { if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onChange(t.key); }}
            style={styles.tab}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
          >
            <View style={[styles.iconWrap, on && { backgroundColor: C.primarySoft }]}>
              <Text style={{ fontSize: 20, opacity: on ? 1 : 0.55 }}>{t.icon}</Text>
            </View>
            <Text style={{ fontSize: 11, fontWeight: on ? "800" : "600", color: on ? C.primary : theme.textSub, marginTop: 2 }}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: "row", borderTopWidth: 0.5, paddingTop: 8, paddingHorizontal: 6 },
  tab: { flex: 1, alignItems: "center", justifyContent: "center" },
  iconWrap: { width: 48, height: 30, borderRadius: 99, alignItems: "center", justifyContent: "center" },
});
