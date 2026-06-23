import React, { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { C } from "@/lib/design/tokens";
import { Sheet } from "@/components/get/sheet";
import { Badge, Btn } from "@/components/get/ui";
import { useTheme } from "@/lib/design/theme-context";
import { useAppState } from "@/lib/state/app-state";

const WEEKLY = [
  { day: "Mon", kcal: 1820, protein: 62, fat: 58, carbs: 210, fiber: 22, sugar: 38 },
  { day: "Tue", kcal: 2100, protein: 75, fat: 71, carbs: 245, fiber: 26, sugar: 45 },
  { day: "Wed", kcal: 1650, protein: 54, fat: 49, carbs: 198, fiber: 18, sugar: 32 },
  { day: "Thu", kcal: 1980, protein: 68, fat: 63, carbs: 231, fiber: 24, sugar: 41 },
  { day: "Fri", kcal: 2240, protein: 82, fat: 77, carbs: 260, fiber: 28, sugar: 48 },
  { day: "Sat", kcal: 1720, protein: 59, fat: 52, carbs: 202, fiber: 20, sugar: 35 },
  { day: "Sun", kcal: 1420, protein: 48, fat: 44, carbs: 178, fiber: 15, sugar: 29 },
];
const MEAL_PLAN = [
  { meal: "Breakfast", emoji: "🌅", suggestion: "Spinach Omelette", kcal: 320, note: "Uses expiring eggs + spinach" },
  { meal: "Lunch", emoji: "☀️", suggestion: "Simple Green Salad", kcal: 180, note: "Fresh spinach & carrots" },
  { meal: "Dinner", emoji: "🌙", suggestion: "Chicken Stir Fry", kcal: 480, note: "Uses expiring chicken breast" },
  { meal: "Snack", emoji: "🍎", suggestion: "Greek Yogurt Bowl", kcal: 150, note: "Expiring yogurt + berries" },
];
const AI_RECS = [
  { emoji: "💪", title: "Increase Protein Intake", desc: "You're below your protein goal. Try Greek Yogurt or Eggs for a quick boost.", tag: "Goal" },
  { emoji: "🥗", title: "Add More Greens", desc: "Baby Spinach in your pantry provides only 20 kcal but boosts vitamins A, C and K.", tag: "Tip" },
  { emoji: "⏰", title: "Expiring = Opportunity", desc: "Whole Milk + Eggs expire soon — use them in French Toast for balanced macros.", tag: "Alert" },
  { emoji: "🌾", title: "Boost Fiber Intake", desc: "Add beans, lentils, or extra spinach to reach your fiber target.", tag: "Health" },
  { emoji: "💧", title: "Stay Hydrated", desc: "High protein days need more water. Aim for 8 glasses today.", tag: "Health" },
];
const GOALS = { kcal: 2000, protein: 50, fat: 65, carbs: 250, fiber: 30, sugar: 50 };

// Simple donut using SVG
function MacroDonut({ protein, carbs, fat }: { protein: number; carbs: number; fat: number }) {
  const total = protein * 4 + carbs * 4 + fat * 9;
  if (total === 0) return null;
  const r = 40; const cx = 50; const cy = 50; const circ = 2 * Math.PI * r;
  const pPct = (protein * 4) / total;
  const cPct = (carbs * 4) / total;
  const fPct = (fat * 9) / total;
  const slices = [
    { color: C.success, pct: pPct, label: "Protein" },
    { color: C.primary, pct: cPct, label: "Carbs" },
    { color: C.warning, pct: fPct, label: "Fat" },
  ];
  let offset = 0;
  return (
    <Svg width={100} height={100} viewBox="0 0 100 100">
      <G rotation="-90" origin="50,50">
        {slices.map((s) => {
          const dash = s.pct * circ;
          const gap = circ - dash;
          const el = (
            <Circle key={s.label} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth={18}
              strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-offset * circ} />
          );
          offset += s.pct;
          return el;
        })}
      </G>
      <Circle cx={cx} cy={cy} r={28} fill="#fff" />
    </Svg>
  );
}

export function NutritionSheet({ open, onClose, toast }: {
  open: boolean; onClose: () => void; toast?: (m: string) => void;
}) {
  const theme = useTheme();
  const { items } = useAppState();
  const [activeDay, setActiveDay] = useState(6);
  const today = WEEKLY[activeDay];
  const maxKcal = Math.max(...WEEKLY.map((d) => d.kcal));
  const pct = (v: number, g: number) => Math.min(Math.round((v / g) * 100), 100);
  const barColor = (p: number) => (p >= 100 ? C.error : p >= 75 ? C.warning : C.success);
  const pantryTotals = items.reduce((a, i) => ({ calories: a.calories + i.calories * i.qty, protein: a.protein + i.protein * i.qty, fat: a.fat + i.fat * i.qty }), { calories: 0, protein: 0, fat: 0 });
  const macroTotal = today.protein * 4 + today.carbs * 4 + today.fat * 9;
  const macroSlices = [
    { label: "Protein", pct: macroTotal > 0 ? Math.round((today.protein * 4 / macroTotal) * 100) : 0, color: C.success },
    { label: "Carbs", pct: macroTotal > 0 ? Math.round((today.carbs * 4 / macroTotal) * 100) : 0, color: C.primary },
    { label: "Fat", pct: macroTotal > 0 ? Math.round((today.fat * 9 / macroTotal) * 100) : 0, color: C.warning },
  ];

  const card = (children: React.ReactNode, extra?: object) => (
    <View style={{ backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.border, borderRadius: 18, padding: 16, ...(extra || {}) }}>{children}</View>
  );
  const h3 = (t: string) => <Text style={{ fontSize: theme.fs.h3, fontWeight: "700", color: theme.text, marginBottom: 14 }}>{t}</Text>;

  return (
    <Sheet open={open} onClose={onClose} title="🥗 Nutrition Coach" maxHRatio={0.96}>
      <View style={{ gap: 18 }}>
        {/* Today's Summary Banner */}
        <LinearGradient colors={["#4F46E5", "#7C3AED"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 20, padding: 18 }}>
          <Text style={{ fontSize: theme.fs.sm, color: "rgba(255,255,255,0.8)", marginBottom: 4 }}>Today's Nutrition</Text>
          <Text style={{ fontSize: 32, fontWeight: "700", color: "#fff" }}>{today.kcal.toLocaleString()} kcal</Text>
          <View style={{ flexDirection: "row", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
            {[["Protein", today.protein + "g", C.success], ["Fat", today.fat + "g", "#FCD34D"], ["Carbs", today.carbs + "g", "#93C5FD"], ["Fiber", today.fiber + "g", "#6EE7B7"], ["Sugar", today.sugar + "g", "#FCA5A5"]].map(([l, v, c]) => (
              <View key={l}>
                <Text style={{ fontSize: 16, fontWeight: "800", color: c as string }}>{v}</Text>
                <Text style={{ fontSize: theme.fs.xs, color: "rgba(255,255,255,0.72)" }}>{l}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Macro Breakdown Donut */}
        {card(<>
          {h3("🥧 Macro Breakdown")}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
            <MacroDonut protein={today.protein} carbs={today.carbs} fat={today.fat} />
            <View style={{ flex: 1, gap: 8 }}>
              {macroSlices.map((s) => (
                <View key={s.label} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: s.color }} />
                  <Text style={{ fontSize: theme.fs.sm, color: theme.text, fontWeight: "600", width: 52 }}>{s.label}</Text>
                  <View style={{ flex: 1, height: 6, backgroundColor: theme.border + "50", borderRadius: 99 }}>
                    <View style={{ width: `${s.pct}%`, height: "100%", backgroundColor: s.color, borderRadius: 99 }} />
                  </View>
                  <Text style={{ fontSize: theme.fs.xs, color: theme.textSub, minWidth: 30 }}>{s.pct}%</Text>
                </View>
              ))}
            </View>
          </View>
        </>)}

        {/* 7-Day History Chart */}
        {card(<>
          {h3("📅 7-Day History")}
          <View style={{ flexDirection: "row", gap: 6, alignItems: "flex-end", height: 80, marginBottom: 10 }}>
            {WEEKLY.map((d, i) => {
              const p = (d.kcal / maxKcal) * 100;
              const isActive = i === activeDay;
              return (
                <Pressable key={d.day} onPress={() => setActiveDay(i)} style={{ flex: 1, alignItems: "center", gap: 4 }}>
                  <Text style={{ fontSize: 9, color: isActive ? C.primary : theme.textSub, fontWeight: isActive ? "800" : "400" }}>{d.kcal}</Text>
                  <View style={{ width: "100%", height: `${p}%`, minHeight: 8, backgroundColor: isActive ? C.primary : theme.border, borderRadius: 4 }} />
                  <Text style={{ fontSize: 10, fontWeight: isActive ? "800" : "500", color: isActive ? C.primary : theme.textSub }}>{d.day}</Text>
                </Pressable>
              );
            })}
          </View>
        </>)}

        {/* Goals Progress */}
        {card(<>
          {h3("🎯 Goals Progress")}
          {[
            { label: "🔥 Calories", v: today.kcal, g: GOALS.kcal, unit: "kcal" },
            { label: "💪 Protein", v: today.protein, g: GOALS.protein, unit: "g" },
            { label: "🧈 Fat", v: today.fat, g: GOALS.fat, unit: "g" },
            { label: "🌾 Carbs", v: today.carbs, g: GOALS.carbs, unit: "g" },
            { label: "🥦 Fiber", v: today.fiber, g: GOALS.fiber, unit: "g" },
            { label: "🍬 Sugar", v: today.sugar, g: GOALS.sugar, unit: "g" },
          ].map(({ label, v, g, unit }) => {
            const p = pct(v, g);
            return (
              <View key={label} style={{ marginBottom: 12 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
                  <Text style={{ fontSize: theme.fs.body, color: theme.text, fontWeight: "600" }}>{label}</Text>
                  <Text style={{ fontSize: theme.fs.sm, color: theme.textSub }}>{v}/{g} {unit} · <Text style={{ fontWeight: "800", color: barColor(p) }}>{p}%</Text></Text>
                </View>
                <View style={{ backgroundColor: theme.border + "60", borderRadius: 99, height: 10, overflow: "hidden" }}>
                  <View style={{ width: `${p}%`, height: "100%", backgroundColor: barColor(p), borderRadius: 99 }} />
                </View>
              </View>
            );
          })}
        </>)}

        {/* Meal Plan */}
        {card(<>
          {h3("📅 Today's Meal Plan")}
          {MEAL_PLAN.map((m, i) => (
            <View key={m.meal} style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 11, borderBottomWidth: i < MEAL_PLAN.length - 1 ? 1 : 0, borderBottomColor: theme.border + "40" }}>
              <View style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: C.primary + "15", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 22 }}>{m.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: theme.fs.sm, fontWeight: "800", color: theme.text }}>{m.meal}: {m.suggestion}</Text>
                <Text style={{ fontSize: theme.fs.xs, color: theme.textSub, marginTop: 2 }}>{m.note}</Text>
              </View>
              <Badge color={C.success} bg={C.successSoft} fs={theme.fs.badge}>{m.kcal}kcal</Badge>
            </View>
          ))}
          <View style={{ marginTop: 12, padding: 10, backgroundColor: C.primarySoft, borderRadius: 10, flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: theme.fs.sm, fontWeight: "700", color: C.primary }}>Total Planned</Text>
            <Text style={{ fontSize: theme.fs.sm, fontWeight: "800", color: C.primary }}>{MEAL_PLAN.reduce((s, m) => s + m.kcal, 0)} kcal</Text>
          </View>
        </>)}

        {/* Pantry Nutrition Totals */}
        {card(<>
          {h3("📦 Pantry Nutrition")}
          <View style={{ flexDirection: "row" }}>
            {[["🔥", "Total Calories", pantryTotals.calories, "kcal", C.warning], ["💪", "Total Protein", pantryTotals.protein, "g", C.success], ["🧈", "Total Fat", pantryTotals.fat, "g", C.primary]].map(([icon, label, val, unit, color], i) => (
              <View key={label as string} style={{ flex: 1, paddingHorizontal: 8, borderLeftWidth: i > 0 ? 1 : 0, borderLeftColor: theme.border + "40", alignItems: "center" }}>
                <Text style={{ fontSize: 22, marginBottom: 4 }}>{icon as string}</Text>
                <Text style={{ fontSize: 18, fontWeight: "800", color: color as string }}>{Math.round(val as number)}{unit as string}</Text>
                <Text style={{ fontSize: theme.fs.xs, color: theme.textSub, marginTop: 2, textAlign: "center" }}>{label as string}</Text>
              </View>
            ))}
          </View>
        </>)}

        {/* AI Recommendations */}
        {card(<>
          {h3("🤖 AI Recommendations")}
          {AI_RECS.map((rec, i) => {
            const tagColor = rec.tag === "Alert" ? C.error : rec.tag === "Goal" ? C.primary : C.success;
            return (
              <View key={i} style={{ flexDirection: "row", gap: 12, paddingVertical: 12, borderBottomWidth: i < AI_RECS.length - 1 ? 1 : 0, borderBottomColor: theme.border + "40" }}>
                <Text style={{ fontSize: 22 }}>{rec.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 7, marginBottom: 3, flexWrap: "wrap" }}>
                    <Text style={{ fontSize: theme.fs.body, fontWeight: "700", color: theme.text }}>{rec.title}</Text>
                    <Badge color={tagColor} bg={tagColor + "1E"} fs={theme.fs.badge}>{rec.tag}</Badge>
                  </View>
                  <Text style={{ fontSize: theme.fs.xs, color: theme.textSub, lineHeight: theme.fs.xs * 1.55 }}>{rec.desc}</Text>
                </View>
              </View>
            );
          })}
        </>)}

        {/* Allergen Alerts */}
        <View style={{ backgroundColor: C.errorSoft, borderWidth: 1.5, borderColor: C.error + "25", borderRadius: 18, padding: 16 }}>
          <Text style={{ fontSize: theme.fs.body, fontWeight: "800", color: C.error, marginBottom: 8 }}>⚠️ Allergen Alerts in Pantry</Text>
          <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
            {["Milk (4 items)", "Eggs (2 items)", "Tree Nuts (1 item)", "Gluten (1 item)"].map((a) => (
              <Badge key={a} color={C.error} bg={C.errorSoft} fs={theme.fs.badge}>{a}</Badge>
            ))}
          </View>
        </View>

        <Btn variant="primary" size="lg" full onClick={onClose}>✅ Got It</Btn>
      </View>
    </Sheet>
  );
}
