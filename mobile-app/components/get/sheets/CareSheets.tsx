import React, { useState } from "react";
import { View, Text, Pressable, TextInput, ScrollView } from "react-native";
import { C, DT } from "@/lib/design/tokens";
import { ALL_ALLERGENS, HEALTH_CONDITIONS, DIETARY_PREFS } from "@/lib/design/data";
import { Sheet } from "@/components/get/sheet";
import { Badge, Btn, Toggle, ProgressBar } from "@/components/get/ui";
import { useAppState, HealthProfile } from "@/lib/state/app-state";
import { useTheme } from "@/lib/design/theme-context";

// ── HealthSheet ─────────────────────────────────────────────────────────────
export function HealthSheet({ open, onClose, toast }: {
  open: boolean; onClose: () => void; toast?: (m: string) => void;
}) {
  const theme = useTheme();
  const { healthProfile: profile, setHealthProfile: setProfile } = useAppState();
  const [search, setSearch] = useState("");
  const toggle = (key: keyof HealthProfile, val: string) =>
    setProfile({ ...profile, [key]: (profile[key] as string[]).includes(val) ? (profile[key] as string[]).filter((x: string) => x !== val) : [...(profile[key] as string[]), val] });
  const filtered = ALL_ALLERGENS.filter((a) => a.toLowerCase().includes(search.toLowerCase()));

  const Row = ({ label, on, onTog, last }: { label: string; on: boolean; onTog: () => void; last: boolean }) => (
    <Pressable onPress={onTog} style={{ flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 14, borderBottomWidth: last ? 0 : 1, borderBottomColor: theme.border + "40" }}>
      <View style={{ width: 24, height: 24, borderRadius: 7, borderWidth: 2, borderColor: on ? C.primary : theme.border, backgroundColor: on ? C.primary : "transparent", alignItems: "center", justifyContent: "center" }}>
        {on && <Text style={{ color: "#fff", fontSize: 13, fontWeight: "900" }}>✓</Text>}
      </View>
      <Text style={{ fontSize: theme.fs.body, color: theme.text, fontWeight: "500" }}>{label}</Text>
    </Pressable>
  );
  const heading = (t: string) => <Text style={{ fontSize: theme.fs.h3, fontWeight: "700", color: theme.text, marginBottom: 10 }}>{t}</Text>;
  const card = (children: React.ReactNode) => <View style={{ backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.border, borderRadius: 18, paddingHorizontal: 16 }}>{children}</View>;

  return (
    <Sheet open={open} onClose={onClose} title="💚 Health Profile" maxHRatio={0.96}>
      <View style={{ gap: 22 }}>
        <View>
          {heading("Health Conditions")}
          {card(HEALTH_CONDITIONS.map((c, i) => <Row key={c} label={c} on={profile.conditions.includes(c)} onTog={() => toggle("conditions", c)} last={i === HEALTH_CONDITIONS.length - 1} />))}
        </View>
        <View>
          {heading("Allergens")}
          <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.border, borderRadius: 12, paddingHorizontal: 14, marginBottom: 10 }}>
            <Text style={{ fontSize: 15, opacity: 0.5 }}>🔍</Text>
            <TextInput value={search} onChangeText={setSearch} placeholder="Search allergens…" placeholderTextColor={theme.textSub} style={{ flex: 1, height: 46, paddingHorizontal: 10, fontSize: theme.fs.body, color: theme.text }} />
          </View>
          {card(filtered.map((a, i) => <Row key={a} label={a} on={profile.allergens.includes(a)} onTog={() => toggle("allergens", a)} last={i === filtered.length - 1} />))}
        </View>
        <View>
          {heading("Dietary Preferences")}
          {card(DIETARY_PREFS.map((d, i) => (
            <View key={d} style={{ borderBottomWidth: i < DIETARY_PREFS.length - 1 ? 1 : 0, borderBottomColor: theme.border + "40", paddingVertical: 4 }}>
              <Toggle on={profile.dietary.includes(d)} onToggle={() => toggle("dietary", d)} label={d} />
            </View>
          )))}
        </View>
        <Btn variant="primary" size="lg" full onClick={() => { onClose(); toast?.("💚 Health profile saved!"); }}>💾 Save Profile</Btn>
      </View>
    </Sheet>
  );
}

// ── ShoppingListSheet ─────────────────────────────────────────────────────────
const STORE_OPTIONS = ["Any Store", "Walmart", "Kroger", "Aldi", "Trader Joe's", "Whole Foods"];
const PREDICTIVE_ITEMS = [
  { emoji: "🥛", name: "Whole Milk", reason: "Running low", price: { walmart: 2.89, kroger: 3.19, aldi: 2.49 }, priority: "high" },
  { emoji: "🍞", name: "Bread", reason: "Expires in 2d", price: { walmart: 3.49, kroger: 3.29, aldi: 2.79 }, priority: "high" },
  { emoji: "🥚", name: "Brown Eggs", reason: "AI suggests", price: { walmart: 3.29, kroger: 3.49, aldi: 2.19 }, priority: "medium" },
  { emoji: "🍎", name: "Apples", reason: "Weekly staple", price: { walmart: 1.99, kroger: 2.29, aldi: 1.49 }, priority: "low" },
  { emoji: "🥬", name: "Baby Spinach", reason: "Health goal", price: { walmart: 2.99, kroger: 3.29, aldi: 1.99 }, priority: "medium" },
];
const ACTIVE_DEALS = [
  { store: "Walmart", deal: "20% off all produce", emoji: "🥕", expires: "Today" },
  { store: "Kroger", deal: "Buy 2 get 1 free — Dairy", emoji: "🥛", expires: "2 days" },
  { store: "Aldi", deal: "Weekly meats 30% off", emoji: "🥩", expires: "3 days" },
];
interface ListItem { id: number; name: string; emoji: string; done: boolean; price: number; }

export function ShoppingListSheet({ open, onClose, toast }: {
  open: boolean; onClose: () => void; toast?: (m: string) => void;
}) {
  const theme = useTheme();
  const [list, setList] = useState<ListItem[]>([]);
  const [newItem, setNewItem] = useState("");
  const [budget, setBudget] = useState(80);
  const [spent, setSpent] = useState(0);
  const [store, setStore] = useState("Any Store");
  const [added, setAdded] = useState<Set<string>>(new Set());
  const [section, setSection] = useState<"list" | "deals" | "compare">("list");

  const addItem = (name: string, emoji = "🛒", price = 0) => {
    if (!name.trim() || list.some((l) => l.name === name)) return;
    setList((l) => [...l, { id: Date.now(), name, emoji, done: false, price }]);
    setNewItem(""); setSpent((s) => s + price);
  };
  const addPredicted = (it: typeof PREDICTIVE_ITEMS[0]) => { addItem(it.name, it.emoji, it.price.walmart); setAdded((s) => new Set([...s, it.name])); toast?.(`✅ ${it.name} added to list`); };
  const toggleItem = (id: number) => setList((l) => l.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  const removeItem = (id: number) => { const it = list.find((i) => i.id === id); setList((l) => l.filter((i) => i.id !== id)); if (it) setSpent((s) => Math.max(0, s - it.price)); };
  const budgetPct = Math.min(Math.round((spent / budget) * 100), 100);
  const todo = list.filter((i) => !i.done), done = list.filter((i) => i.done);
  const bestPrice = (it: typeof PREDICTIVE_ITEMS[0]) => Math.min(...Object.values(it.price));
  const bestStore = (it: typeof PREDICTIVE_ITEMS[0]) => Object.keys(it.price).reduce((a, b) => ((it.price as any)[a] < (it.price as any)[b] ? a : b));

  return (
    <Sheet open={open} onClose={onClose} title="🛒 Shopping Assistant" maxHRatio={0.96}>
      <View style={{ flexDirection: "row", backgroundColor: theme.card, borderRadius: 14, borderWidth: 1.5, borderColor: theme.border, overflow: "hidden", marginBottom: 16 }}>
        {([{ id: "list", label: "📋 List" }, { id: "deals", label: "🎯 Deals" }, { id: "compare", label: "💰 Compare" }] as const).map((s) => (
          <Pressable key={s.id} onPress={() => setSection(s.id)} style={{ flex: 1, height: 38, alignItems: "center", justifyContent: "center", backgroundColor: section === s.id ? C.primary : "transparent" }}>
            <Text style={{ fontWeight: "700", fontSize: theme.fs.sm, color: section === s.id ? "#fff" : theme.textSub }}>{s.label}</Text>
          </Pressable>
        ))}
      </View>

      {section === "list" && (
        <View style={{ gap: 14 }}>
          <View style={{ backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.border, borderRadius: 16, padding: 16 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <Text style={{ fontSize: theme.fs.body, fontWeight: "700", color: theme.text }}>💰 Budget Tracker</Text>
              <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
                <Text style={{ fontSize: theme.fs.sm, color: theme.textSub }}>$</Text>
                <TextInput value={String(budget)} onChangeText={(v) => setBudget(parseInt(v) || 0)} keyboardType="number-pad" style={{ width: 64, height: 32, borderWidth: 1.5, borderColor: theme.border, borderRadius: 8, textAlign: "center", fontWeight: "700", color: theme.text }} />
              </View>
            </View>
            <View style={{ backgroundColor: theme.border + "40", borderRadius: 99, height: 12, overflow: "hidden", marginBottom: 8 }}>
              <View style={{ width: `${budgetPct}%`, height: "100%", backgroundColor: budgetPct >= 90 ? C.error : budgetPct >= 70 ? C.warning : C.success, borderRadius: 99 }} />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: theme.fs.sm, color: budgetPct >= 90 ? C.error : theme.textSub, fontWeight: "600" }}>Spent: ${spent.toFixed(2)}</Text>
              <Text style={{ fontSize: theme.fs.sm, color: theme.textSub }}>Left: <Text style={{ color: C.success, fontWeight: "700" }}>${Math.max(0, budget - spent).toFixed(2)}</Text></Text>
            </View>
          </View>

          <View>
            <Text style={{ fontSize: theme.fs.sm, fontWeight: "700", color: theme.textSub, marginBottom: 8 }}>🏪 Preferred Store</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}><View style={{ flexDirection: "row", gap: 7 }}>
              {STORE_OPTIONS.map((s) => (
                <Pressable key={s} onPress={() => setStore(s)} style={{ height: 34, paddingHorizontal: 14, justifyContent: "center", borderRadius: 99, borderWidth: 1.5, borderColor: store === s ? C.primary : theme.border, backgroundColor: store === s ? C.primarySoft : "transparent" }}>
                  <Text style={{ fontWeight: "700", fontSize: theme.fs.xs, color: store === s ? C.primary : theme.textSub }}>{s}</Text>
                </Pressable>
              ))}
            </View></ScrollView>
          </View>

          <View>
            <Text style={{ fontSize: theme.fs.sm, fontWeight: "800", color: theme.textSub, letterSpacing: 1, marginBottom: 8 }}>🤖 AI SMART PICKS</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}><View style={{ flexDirection: "row", gap: 8 }}>
              {PREDICTIVE_ITEMS.filter((p) => !added.has(p.name)).map((it) => (
                <Pressable key={it.name} onPress={() => addPredicted(it)} style={{ width: 120, backgroundColor: theme.card, borderWidth: 1.5, borderColor: it.priority === "high" ? C.error + "40" : theme.border, borderRadius: 16, padding: 12, alignItems: "center", gap: 6 }}>
                  <Text style={{ fontSize: 26 }}>{it.emoji}</Text>
                  <Text style={{ fontSize: theme.fs.xs, fontWeight: "700", color: theme.text }}>{it.name}</Text>
                  <Text style={{ fontSize: 10, color: it.priority === "high" ? C.error : theme.textSub }}>{it.reason}</Text>
                  <Badge color={C.success} bg={C.successSoft} fs={10}>Best ${bestPrice(it).toFixed(2)}</Badge>
                </Pressable>
              ))}
            </View></ScrollView>
          </View>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <TextInput value={newItem} onChangeText={setNewItem} onSubmitEditing={() => addItem(newItem)} placeholder="Add an item…" placeholderTextColor={theme.textSub} returnKeyType="done" style={{ flex: 1, height: 46, paddingHorizontal: 14, borderWidth: 1.5, borderColor: theme.border, borderRadius: 12, fontSize: theme.fs.body, color: theme.text, backgroundColor: theme.card }} />
            <Btn variant="primary" size="md" onClick={() => addItem(newItem)}>Add</Btn>
          </View>

          {todo.length > 0 && (
            <View style={{ backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.border, borderRadius: 18, overflow: "hidden" }}>
              <Text style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 6, fontSize: theme.fs.xs, fontWeight: "800", color: theme.textSub, letterSpacing: 1 }}>TO BUY ({todo.length})</Text>
              {todo.map((it, i) => (
                <View key={it.id} style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 13, borderTopWidth: i > 0 ? 1 : 0, borderTopColor: theme.border + "40" }}>
                  <Pressable onPress={() => toggleItem(it.id)} style={{ width: 26, height: 26, borderRadius: 8, borderWidth: 2, borderColor: theme.border }} />
                  <Text style={{ fontSize: 20 }}>{it.emoji}</Text>
                  <Text style={{ flex: 1, fontSize: theme.fs.body, color: theme.text, fontWeight: "600" }}>{it.name}</Text>
                  {it.price > 0 && <Text style={{ fontSize: theme.fs.sm, color: C.success, fontWeight: "700" }}>${it.price.toFixed(2)}</Text>}
                  <Pressable onPress={() => removeItem(it.id)} style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: C.errorSoft, alignItems: "center", justifyContent: "center" }}><Text style={{ color: C.error, fontWeight: "700" }}>✕</Text></Pressable>
                </View>
              ))}
            </View>
          )}
          {done.length > 0 && (
            <View style={{ backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.border, borderRadius: 18, overflow: "hidden", opacity: 0.7 }}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 10 }}>
                <Text style={{ fontSize: theme.fs.xs, fontWeight: "800", color: theme.textSub, letterSpacing: 1 }}>DONE ({done.length})</Text>
                <Pressable onPress={() => setList((l) => l.filter((i) => !i.done))}><Text style={{ fontSize: theme.fs.xs, color: C.error, fontWeight: "700" }}>Clear</Text></Pressable>
              </View>
              {done.map((it, i) => (
                <View key={it.id} style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 13, borderTopWidth: 1, borderTopColor: theme.border + "40" }}>
                  <Pressable onPress={() => toggleItem(it.id)} style={{ width: 26, height: 26, borderRadius: 8, backgroundColor: C.success, alignItems: "center", justifyContent: "center" }}><Text style={{ color: "#fff", fontWeight: "900" }}>✓</Text></Pressable>
                  <Text style={{ fontSize: 20 }}>{it.emoji}</Text>
                  <Text style={{ flex: 1, fontSize: theme.fs.body, color: theme.textSub, textDecorationLine: "line-through" }}>{it.name}</Text>
                </View>
              ))}
            </View>
          )}
          {list.length === 0 && <Text style={{ textAlign: "center", color: theme.textSub, paddingVertical: 24 }}>Your list is empty. Add items or tap a smart pick!</Text>}
        </View>
      )}

      {section === "deals" && (
        <View style={{ gap: 12 }}>
          {ACTIVE_DEALS.map((d) => (
            <View key={d.store} style={{ flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.border, borderRadius: 18, padding: 16 }}>
              <Text style={{ fontSize: 34 }}>{d.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: theme.fs.body, fontWeight: "800", color: theme.text }}>{d.deal}</Text>
                <Text style={{ fontSize: theme.fs.sm, color: theme.textSub }}>{d.store}</Text>
              </View>
              <Badge color={C.warning} bg={C.warning + "1E"} fs={theme.fs.badge}>⏰ {d.expires}</Badge>
            </View>
          ))}
        </View>
      )}

      {section === "compare" && (
        <View style={{ gap: 12 }}>
          {PREDICTIVE_ITEMS.map((it) => (
            <View key={it.name} style={{ backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.border, borderRadius: 18, padding: 16 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <Text style={{ fontSize: 24 }}>{it.emoji}</Text>
                <Text style={{ flex: 1, fontSize: theme.fs.body, fontWeight: "800", color: theme.text }}>{it.name}</Text>
                <Badge color={C.success} bg={C.successSoft} fs={theme.fs.badge}>Best: {bestStore(it)}</Badge>
              </View>
              {Object.entries(it.price).map(([store, price]) => {
                const isBest = price === bestPrice(it);
                return (
                  <View key={store} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 }}>
                    <Text style={{ fontSize: theme.fs.sm, color: theme.textSub, textTransform: "capitalize" }}>{store}</Text>
                    <Text style={{ fontSize: theme.fs.sm, fontWeight: "800", color: isBest ? C.success : theme.text }}>${(price as number).toFixed(2)}{isBest ? " ✓" : ""}</Text>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      )}
    </Sheet>
  );
}
