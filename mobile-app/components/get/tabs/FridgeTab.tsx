import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, ScrollView, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { C } from "@/lib/design/tokens";
import { Theme } from "@/lib/design/theme";
import { Btn, StatusBadge } from "../ui";
import { urgencyLabel } from "@/lib/design/data";
import { useAppState } from "@/lib/state/app-state";

const CONFIDENCE = [94, 87, 96, 91, 82, 95, 88, 90];
const POSITIONS = [
  { top: "15%", left: "8%" }, { top: "15%", left: "40%" }, { top: "15%", right: "8%" },
  { top: "57%", left: "8%" }, { top: "57%", left: "40%" }, { top: "57%", right: "8%" },
] as const;

export function FridgeTab({ theme, toast, onOpenItem, onOpenAdd }: { theme: Theme; toast: (m: string) => void; onOpenItem?: (item: import("@/lib/design/data").Item) => void; onOpenAdd?: () => void }) {
  const { items } = useAppState();
  const [listView, setListView] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [detected, setDetected] = useState(false);
  const [temperature, setTemperature] = useState(38);
  const [humidity, setHumidity] = useState(65);
  const scanY = useRef(new Animated.Value(0)).current;

  const fridgeItems = items.slice(0, 8);
  const statusColor = (d: number) => (d <= 2 ? C.error : d <= 5 ? C.warning : C.success);
  const statusBg = (d: number) => (d <= 2 ? C.errorSoft : d <= 5 ? C.warningSoft : C.successSoft);

  useEffect(() => {
    const t = setInterval(() => {
      setTemperature((v) => +(v + (Math.random() - 0.5) * 0.4).toFixed(1));
      setHumidity((v) => +(v + (Math.random() - 0.5) * 1.2).toFixed(0));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!scanning) { scanY.setValue(0); return; }
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(scanY, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      Animated.timing(scanY, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [scanning, scanY]);

  const simulateScan = () => {
    setScanning(true);
    setTimeout(() => { setScanning(false); setDetected(true); }, 2200);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 24, fontWeight: "800", color: theme.text }}>AR Fridge</Text>
        <View style={{ flexDirection: "row", backgroundColor: theme.card, borderRadius: 12, borderWidth: 1.5, borderColor: theme.border, overflow: "hidden" }}>
          {[{ id: false, icon: "📷", label: "AR" }, { id: true, icon: "📋", label: "List" }].map((v) => {
            const on = listView === v.id;
            return (
              <Pressable key={String(v.id)} onPress={() => setListView(v.id)} style={{ height: 38, paddingHorizontal: 14, backgroundColor: on ? C.primary : "transparent", flexDirection: "row", alignItems: "center", gap: 5 }}>
                <Text style={{ fontWeight: "700", fontSize: theme.fs.sm, color: on ? "white" : theme.textSub }}>{v.icon} {v.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {!listView ? (
        <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
          {/* Viewfinder */}
          <View style={{ backgroundColor: "#0D0D14", borderRadius: 22, height: 300, overflow: "hidden", marginBottom: 14, justifyContent: "center", alignItems: "center" }}>
            {/* HUD */}
            <View style={{ position: "absolute", top: 12, left: 12, zIndex: 10, gap: 6 }}>
              <View style={{ backgroundColor: "rgba(0,0,0,0.7)", borderWidth: 1, borderColor: "rgba(255,255,255,0.15)", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Text style={{ fontSize: 12 }}>🌡</Text>
                <Text style={{ fontSize: 11, fontWeight: "800", color: temperature > 40 ? "#FCA5A5" : "#6EE7B7" }}>{temperature}°F</Text>
                <Text style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>FRIDGE</Text>
              </View>
              <View style={{ backgroundColor: "rgba(0,0,0,0.7)", borderWidth: 1, borderColor: "rgba(255,255,255,0.15)", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Text style={{ fontSize: 12 }}>💧</Text>
                <Text style={{ fontSize: 11, fontWeight: "800", color: humidity < 30 || humidity > 80 ? "#FCA5A5" : "#93C5FD" }}>{humidity}%</Text>
                <Text style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>HUMIDITY</Text>
              </View>
            </View>

            {!detected ? (
              <View style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: "rgba(255,255,255,0.2)", fontSize: 13, textAlign: "center" }}>📷{"\n"}Camera Feed</Text>
                {[{ top: 16, left: 16 }, { top: 16, right: 16 }, { bottom: 16, left: 16 }, { bottom: 16, right: 16 }].map((pos, i) => (
                  <View key={i} style={{ position: "absolute", width: 28, height: 28, ...pos, borderTopWidth: (pos as any).top !== undefined ? 3 : 0, borderBottomWidth: (pos as any).bottom !== undefined ? 3 : 0, borderLeftWidth: (pos as any).left !== undefined ? 3 : 0, borderRightWidth: (pos as any).right !== undefined ? 3 : 0, borderColor: C.primary }} />
                ))}
                {scanning ? (
                  <Animated.View style={{ position: "absolute", left: "7%", width: "86%", height: 2, backgroundColor: C.primary, transform: [{ translateY: scanY.interpolate({ inputRange: [0, 1], outputRange: [-120, 120] }) }] }} />
                ) : null}
                <View style={{ position: "absolute", bottom: 16, backgroundColor: "rgba(0,0,0,0.7)", borderRadius: 99, paddingHorizontal: 16, paddingVertical: 6, flexDirection: "row", gap: 12 }}>
                  {["🤏 Pinch", "👆 Tap", "👋 Swipe"].map((h) => <Text key={h} style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", fontWeight: "600" }}>{h}</Text>)}
                </View>
              </View>
            ) : (
              <LinearGradient colors={["#0D0D14", "#1a1a2e"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ width: "100%", height: "100%" }}>
                <View style={{ position: "absolute", top: 12, right: 12, zIndex: 5, backgroundColor: "rgba(16,185,129,0.2)", borderWidth: 1, borderColor: "#10B981", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
                  <Text style={{ fontSize: 10, color: "#10B981", fontWeight: "700" }}>✓ {fridgeItems.slice(0, 6).length} items · avg {Math.round(CONFIDENCE.slice(0, 6).reduce((s, v) => s + v, 0) / 6)}%</Text>
                </View>
                {fridgeItems.slice(0, 6).map((item, i) => (
                  <Pressable key={item.id} onPress={() => (onOpenItem ? onOpenItem(item) : toast(item.name))} style={{ position: "absolute", ...POSITIONS[i], backgroundColor: statusBg(item.daysLeft) + "ee", borderWidth: 2, borderColor: statusColor(item.daysLeft), borderRadius: 12, paddingHorizontal: 9, paddingVertical: 7, minWidth: 76, alignItems: "center" }}>
                    <Text style={{ fontSize: 20 }}>{item.emoji}</Text>
                    <Text style={{ fontSize: 9, fontWeight: "700", color: statusColor(item.daysLeft), marginTop: 2 }}>{urgencyLabel(item.daysLeft)}</Text>
                    <Text style={{ fontSize: 8, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>AI: {CONFIDENCE[i]}%</Text>
                  </Pressable>
                ))}
              </LinearGradient>
            )}
          </View>

          {/* Legend */}
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 14 }}>
            {[["🟢", "Fresh", "#10B981"], ["🟡", "Expiring", "#F59E0B"], ["🔴", "Critical", "#EF4444"]].map(([dot, label, color]) => (
              <View key={label} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Text>{dot}</Text><Text style={{ fontSize: theme.fs.xs, fontWeight: "600", color }}>{label}</Text>
              </View>
            ))}
          </View>

          {/* Controls */}
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={{ flex: 1 }}>
              {!detected
                ? <Btn variant="primary" size="lg" full theme={theme} onClick={simulateScan} disabled={scanning}>{scanning ? "🔍 Detecting…" : "📷 Scan Fridge"}</Btn>
                : <Btn variant="success" size="lg" full theme={theme} onClick={() => setDetected(false)}>🔄 Rescan</Btn>}
            </View>
            <Btn variant="secondary" size="lg" theme={theme} onClick={() => toast("📸 Screenshot saved!")}>📸</Btn>
          </View>

          {/* Recommendations / Tips */}
          {detected ? (
            <View style={{ marginTop: 12, backgroundColor: theme.card, borderWidth: 1.5, borderColor: C.primary + "30", borderRadius: 16, padding: 16 }}>
              <Text style={{ fontSize: theme.fs.sm, fontWeight: "800", color: C.primary, marginBottom: 8 }}>🤖 Smart Recommendations</Text>
              {[
                { emoji: "🍳", tip: "Use expiring Milk + Eggs → French Toast (expires tomorrow!)" },
                { emoji: "🌿", tip: "Move Spinach to crisper drawer to extend freshness by 3 days" },
                { emoji: "💡", tip: "Fridge at 38°F — optimal! Humidity at 65% — great for produce" },
              ].map((r, i) => (
                <View key={i} style={{ flexDirection: "row", gap: 8, paddingVertical: 6, borderTopWidth: i > 0 ? 1 : 0, borderTopColor: theme.border + "40" }}>
                  <Text style={{ fontSize: 16 }}>{r.emoji}</Text>
                  <Text style={{ flex: 1, fontSize: theme.fs.xs, color: theme.textSub, lineHeight: 18 }}>{r.tip}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={{ marginTop: 12, backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.border, borderRadius: 16, padding: 16 }}>
              <Text style={{ fontSize: theme.fs.sm, fontWeight: "800", color: theme.text, marginBottom: 8 }}>💡 Tips for Best Results</Text>
              {["Ensure good lighting inside fridge", "Keep fridge organized for accurate detection", "Update items after shopping", "Use List View if AR isn't detecting"].map((tip, i) => (
                <View key={i} style={{ flexDirection: "row", gap: 8, paddingVertical: 5, borderTopWidth: i > 0 ? 1 : 0, borderTopColor: theme.border + "40" }}>
                  <Text style={{ fontSize: 14, color: C.success }}>✓</Text>
                  <Text style={{ flex: 1, fontSize: theme.fs.xs, color: theme.textSub, lineHeight: 18 }}>{tip}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ) : (
        <View style={{ paddingHorizontal: 16, paddingTop: 16, gap: 10 }}>
          {fridgeItems.map((item) => (
            <Pressable key={item.id} onPress={() => (onOpenItem ? onOpenItem(item) : toast(item.name))} style={{ flexDirection: "row", alignItems: "center", gap: 14, padding: 14, backgroundColor: theme.card, borderWidth: 1.5, borderColor: statusColor(item.daysLeft) + "30", borderRadius: 16 }}>
              <View style={{ width: 46, height: 46, borderRadius: 12, backgroundColor: statusBg(item.daysLeft), alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 24 }}>{item.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: theme.fs.body, fontWeight: "700", color: theme.text }}>{item.name}</Text>
                <Text style={{ fontSize: theme.fs.xs, color: theme.textSub, marginTop: 2 }}>{item.qty} {item.unit} · {item.category}</Text>
              </View>
              <StatusBadge daysLeft={item.daysLeft} fs={theme.fs.badge} />
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
