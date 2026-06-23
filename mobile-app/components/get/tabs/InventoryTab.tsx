import React, { useMemo, useState } from "react";
import { View, Text, Pressable, ScrollView, TextInput, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { C } from "@/lib/design/tokens";
import { Theme } from "@/lib/design/theme";
import { Badge, StatusBadge, ExpiryBar } from "../ui";
import { CATEGORIES, urgency, urgencyLabel, Item } from "@/lib/design/data";
import { useAppState } from "@/lib/state/app-state";

const SORT_OPTIONS = [
  { id: "expiry", label: "Expiry", icon: "⏰" },
  { id: "name", label: "Name", icon: "🔤" },
  { id: "date", label: "Date Added", icon: "📅" },
];

export function InventoryTab({ theme, toast, onOpenItem, onOpenAdd, onOpenScan }: {
  theme: Theme; toast: (m: string) => void; onOpenItem?: (item: Item) => void; onOpenAdd?: () => void; onOpenScan?: () => void;
}) {
  const { items, healthProfile, deleteItem } = useAppState();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("expiry");
  const [bulkMode, setBulkMode] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items
      .filter((i) => catFilter === "All" || i.category === catFilter)
      .filter((i) => {
        if (statusFilter === "Expiring Soon") return i.daysLeft <= 5 && i.daysLeft > 0;
        if (statusFilter === "Expired") return i.daysLeft <= 0;
        return true;
      })
      .filter((i) => i.name.toLowerCase().includes(q) || i.brand.toLowerCase().includes(q) || i.category.toLowerCase().includes(q))
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "date") return b.id - a.id;
        return a.daysLeft - b.daysLeft;
      });
  }, [items, catFilter, statusFilter, search, sortBy]);

  const toggleSelect = (id: number) => setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const clearSelect = () => { setSelected(new Set()); setBulkMode(false); };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      {/* Header row */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 14 }}>
        <Text style={{ fontSize: 24, fontWeight: "800", color: theme.text }}>Inventory</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <IconBtn icon="⬇" theme={theme} onPress={() => toast("⬇ Inventory exported as CSV")} />
          <IconBtn icon="☑" theme={theme} active={bulkMode} onPress={() => { setBulkMode((b) => !b); clearSelect(); }} />
          <Pressable onPress={() => setSortBy((s) => (s === "expiry" ? "name" : s === "name" ? "date" : "expiry"))}
            style={{ height: 40, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1.5, borderColor: theme.border, backgroundColor: theme.card, flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text style={{ fontSize: theme.fs.sm, fontWeight: "700", color: theme.textSub }}>⇅ {SORT_OPTIONS.find((s) => s.id === sortBy)?.label}</Text>
          </Pressable>
        </View>
      </View>

      {/* Bulk action bar */}
      {bulkMode && (
        <LinearGradient colors={[C.primary, C.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ marginHorizontal: 20, marginTop: 10, borderRadius: 14, padding: 12, flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Text style={{ fontSize: theme.fs.sm, fontWeight: "700", color: "white", flex: 1 }}>{selected.size} selected</Text>
          <Pressable onPress={() => { selected.forEach(deleteItem); toast(`🗑 Deleted ${selected.size} item(s)`); clearSelect(); }} style={{ height: 32, paddingHorizontal: 12, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.2)", justifyContent: "center" }}>
            <Text style={{ color: "white", fontSize: theme.fs.xs, fontWeight: "700" }}>🗑 Delete</Text>
          </Pressable>
          <Pressable onPress={clearSelect} style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: "rgba(255,255,255,0.25)", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "white", fontSize: 15 }}>✕</Text>
          </Pressable>
        </LinearGradient>
      )}

      {/* Search */}
      <View style={{ paddingHorizontal: 20, paddingTop: 14 }}>
        <View style={{ position: "relative", justifyContent: "center" }}>
          <Text style={{ position: "absolute", left: 14, fontSize: 16, opacity: 0.5, zIndex: 1 }}>🔍</Text>
          <TextInput value={search} onChangeText={setSearch} placeholder="Search name, brand, category…" placeholderTextColor={theme.textSub}
            style={{ height: 46, paddingLeft: 42, paddingRight: search ? 46 : 14, borderWidth: 1.5, borderColor: theme.border, borderRadius: 14, fontSize: theme.fs.body, color: theme.text, backgroundColor: theme.card }} />
          {search ? (
            <Pressable onPress={() => setSearch("")} style={{ position: "absolute", right: 10, width: 28, height: 28, borderRadius: 14, backgroundColor: theme.border, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: theme.textSub, fontWeight: "700" }}>✕</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* Filter chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ gap: 8, paddingHorizontal: 20, paddingVertical: 12 }}>
        {["All", "Expiring Soon", "Expired"].map((f) => {
          const on = statusFilter === f;
          return on ? (
            <LinearGradient key={f} colors={[C.primary, C.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.chip}>
              <Pressable onPress={() => setStatusFilter(f)}><Text style={{ color: "white", fontWeight: "700", fontSize: theme.fs.sm }}>{f}</Text></Pressable>
            </LinearGradient>
          ) : (
            <Pressable key={f} onPress={() => setStatusFilter(f)} style={[styles.chip, { borderWidth: 1.5, borderColor: theme.border }]}>
              <Text style={{ color: theme.textSub, fontWeight: "700", fontSize: theme.fs.sm }}>{f}</Text>
            </Pressable>
          );
        })}
        <View style={{ width: 1, backgroundColor: theme.border, marginVertical: 4 }} />
        {CATEGORIES.filter((c) => c !== "All").map((c) => {
          const on = catFilter === c;
          return (
            <Pressable key={c} onPress={() => setCatFilter(on ? "All" : c)} style={[styles.chipSm, { borderWidth: 1.5, borderColor: on ? C.teal + "50" : theme.border, backgroundColor: on ? C.tealSoft : "transparent" }]}>
              <Text style={{ color: on ? C.teal : theme.textSub, fontWeight: "600", fontSize: theme.fs.xs }}>{c}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Count bar */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 10 }}>
        <Text style={{ fontSize: theme.fs.sm, color: theme.textSub, fontWeight: "600" }}>{filtered.length} item{filtered.length !== 1 ? "s" : ""}</Text>
        {filtered.length > 0 ? <Text style={{ fontSize: theme.fs.xs, color: theme.textSub }}>{bulkMode ? `${selected.size} selected` : "Tap for details"}</Text> : null}
      </View>

      {/* Items list */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 10 }} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={{ alignItems: "center", paddingVertical: 60 }}>
            <Text style={{ fontSize: 56, marginBottom: 16 }}>📦</Text>
            <Text style={{ fontWeight: "800", fontSize: theme.fs.h3, color: theme.text, marginBottom: 8 }}>No items found</Text>
            <Text style={{ fontSize: theme.fs.body, color: theme.textSub, textAlign: "center" }}>Adjust filters or add new items to your pantry.</Text>
          </View>
        ) : filtered.map((item) => {
          const hasAlert = item.allergens?.some((a) => healthProfile.allergens.includes(a));
          const u = urgency(item.daysLeft);
          const isChecked = selected.has(item.id);
          return (
            <Pressable key={item.id}
              onPress={() => (bulkMode ? toggleSelect(item.id) : onOpenItem ? onOpenItem(item) : toast(item.name))}
              onLongPress={() => { setBulkMode(true); toggleSelect(item.id); }}
              style={{ flexDirection: "row", alignItems: "center", gap: 14, padding: 15, backgroundColor: isChecked ? C.primarySoft : theme.card, borderWidth: 1.5, borderColor: isChecked ? C.primary : hasAlert ? C.error + "50" : u === "error" ? C.error + "25" : theme.border, borderRadius: 18 }}>
              <View style={{ width: 52, height: 52, borderRadius: 15, backgroundColor: bulkMode && isChecked ? C.primary : u === "error" ? C.errorSoft : u === "warning" ? C.warningSoft : C.primarySoft, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: bulkMode && isChecked ? 22 : 28, color: bulkMode && isChecked ? "white" : undefined, fontWeight: bulkMode && isChecked ? "900" : "400" }}>{bulkMode && isChecked ? "✓" : item.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                  <Text style={{ fontSize: theme.fs.body, fontWeight: "700", color: theme.text }}>{item.name}</Text>
                  {hasAlert ? <Badge color={C.error} bg={C.errorSoft} fs={theme.fs.xs}>⚠ Allergen</Badge> : null}
                </View>
                <Text style={{ fontSize: theme.fs.xs, color: theme.textSub, marginTop: 2 }}>{item.qty} {item.unit} · {item.category}</Text>
                <ExpiryBar daysLeft={item.daysLeft} />
              </View>
              <View style={{ alignItems: "flex-end", gap: 5 }}>
                <StatusBadge daysLeft={item.daysLeft} fs={theme.fs.badge} />
                <Text style={{ fontSize: theme.fs.xs, color: theme.textSub }}>+{item.added}</Text>
              </View>
            </Pressable>
          );
        })}

        <Pressable onPress={() => (onOpenAdd ? onOpenAdd() : toast("➕ Add item"))} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, padding: 16, borderWidth: 2, borderStyle: "dashed", borderColor: C.primary + "40", borderRadius: 18, marginTop: 4 }}>
          <Text style={{ fontSize: theme.fs.body, fontWeight: "700", color: C.primary }}>➕ Add New Item</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function IconBtn({ icon, theme, active, onPress }: { icon: string; theme: Theme; active?: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ width: 40, height: 40, borderRadius: 12, borderWidth: 1.5, borderColor: active ? C.primary : theme.border, backgroundColor: active ? C.primarySoft : theme.card, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 17, color: active ? C.primary : theme.text }}>{icon}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: { height: 36, paddingHorizontal: 16, borderRadius: 99, alignItems: "center", justifyContent: "center" },
  chipSm: { height: 36, paddingHorizontal: 14, borderRadius: 99, alignItems: "center", justifyContent: "center" },
});
