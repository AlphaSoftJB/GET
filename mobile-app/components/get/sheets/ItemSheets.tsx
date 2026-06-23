import React, { useState } from "react";
import { View, Text, Pressable, TextInput, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { C, DT } from "@/lib/design/tokens";
import { Item, Recipe, RECIPES, urgencyColor, urgencyBg } from "@/lib/design/data";
import { useTheme } from "@/lib/design/theme-context";
import { useAppState } from "@/lib/state/app-state";
import { Sheet } from "@/components/get/sheet";
import { Badge, StatusBadge, ExpiryBar, Btn, AlertBanner, CheckboxInput, shadow } from "@/components/get/ui";

const EMOJIS = ["🥛","🍞","🥚","🧀","🍎","🥕","🍗","🥬","🍓","🍊","🫙","🥤","🧄","🥑","🫐","🥦","🍋","🧅","🥩","🧆"];
const CATS = ["Dairy","Produce","Meat","Bakery","Beverages","Pantry"];
const ALLERGENS = ["Milk","Eggs","Gluten","Wheat","Peanuts","Tree Nuts","Soy","Fish"];

// ── AddItemSheet ────────────────────────────────────────────────────────────
export function AddItemSheet({ open, onClose, toast }: {
  open: boolean; onClose: () => void; toast?: (m: string) => void;
}) {
  const theme = useTheme();
  const { addItem } = useAppState();
  const onSave = (it: Omit<Item, "id">) => { addItem(it); toast?.(`✅ ${it.name} added!`); };
  const blank = { name: "", brand: "", category: "Dairy", qty: 1, unit: "unit", daysLeft: 7, emoji: "📦", allergens: [] as string[], notes: "", reminder: true };
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const set = (k: string, v: any) => { setForm((p) => ({ ...p, [k]: v })); if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined })); };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Item name is required";
    if (form.qty < 1) e.qty = "Quantity must be at least 1";
    if (!form.unit.trim()) e.unit = "Unit is required";
    setErrors(e);
    return !Object.keys(e).length;
  };
  const submit = () => {
    if (validate()) {
      onSave({ emoji: form.emoji, name: form.name, brand: form.brand, category: form.category, qty: form.qty, unit: form.unit, daysLeft: form.daysLeft, calories: 0, protein: 0, fat: 0, allergens: form.allergens, added: "Jun 15" });
      setAlert({ type: "success", message: `✅ ${form.name} added to your pantry!` });
      setTimeout(() => { onClose(); setForm(blank); setAlert(null); }, 1000);
    } else {
      setAlert({ type: "error", message: "Please fix the errors above before saving." });
    }
  };

  const label = (t: string, req?: boolean) => (
    <Text style={{ fontSize: theme.fs.sm, fontWeight: "700", color: theme.textSub, marginBottom: 6 }}>{t}{req ? <Text style={{ color: C.error }}> *</Text> : null}</Text>
  );
  const inputStyle = (field: string, err?: string) => ({
    width: "100%" as const, height: DT.size.input.lg.h, paddingHorizontal: DT.size.input.lg.px,
    fontSize: theme.fs.body, borderWidth: 1.5, borderColor: err ? C.error : theme.border,
    borderRadius: DT.radius.input, color: theme.text, backgroundColor: theme.inputBg,
  });

  return (
    <Sheet open={open} onClose={onClose} title="➕ Add Grocery Item">
      <View style={{ gap: DT.spacing.base }}>
        {alert && <AlertBanner type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
        <View>
          {label("Item Name", true)}
          <TextInput value={form.name} onChangeText={(v) => set("name", v)} placeholder="e.g. Greek Yogurt, Whole Milk…" placeholderTextColor={theme.textSub} style={inputStyle("name", errors.name)} />
          {errors.name && <Text style={{ color: C.error, fontSize: theme.fs.xs, marginTop: 4, fontWeight: "700" }}>⚠ {errors.name}</Text>}
        </View>
        <View>
          {label("Brand (optional)")}
          <TextInput value={form.brand} onChangeText={(v) => set("brand", v)} placeholder="e.g. Chobani, Organic Valley…" placeholderTextColor={theme.textSub} style={inputStyle("brand")} />
        </View>
        <View>
          {label("Emoji")}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 7 }}>
            {EMOJIS.map((e) => {
              const on = form.emoji === e;
              return (
                <Pressable key={e} onPress={() => set("emoji", e)} style={{ width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: DT.radius.md, backgroundColor: on ? C.primarySoft : theme.card, borderWidth: 2, borderColor: on ? C.primary : theme.border }}>
                  <Text style={{ fontSize: 22 }}>{e}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: DT.spacing.md }}>
          <View style={{ flex: 1 }}>
            {label("Quantity", true)}
            <TextInput value={String(form.qty)} onChangeText={(v) => set("qty", parseInt(v) || 0)} keyboardType="number-pad" style={inputStyle("qty", errors.qty)} />
            {errors.qty && <Text style={{ color: C.error, fontSize: theme.fs.xs, marginTop: 4 }}>⚠ {errors.qty}</Text>}
          </View>
          <View style={{ flex: 1 }}>
            {label("Unit", true)}
            <TextInput value={form.unit} onChangeText={(v) => set("unit", v)} placeholder="lbs, cups, gal…" placeholderTextColor={theme.textSub} style={inputStyle("unit", errors.unit)} />
            {errors.unit && <Text style={{ color: C.error, fontSize: theme.fs.xs, marginTop: 4 }}>⚠ {errors.unit}</Text>}
          </View>
        </View>
        <View>
          {label("Expires in")}
          <Text style={{ fontSize: theme.fs.sm, fontWeight: "900", color: urgencyColor(form.daysLeft), marginBottom: 6 }}>{form.daysLeft} days</Text>
          <View style={{ backgroundColor: urgencyBg(form.daysLeft), borderRadius: 99, height: 6, overflow: "hidden" }}>
            <View style={{ height: "100%", width: `${Math.min(form.daysLeft / 60, 1) * 100}%`, backgroundColor: urgencyColor(form.daysLeft) }} />
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8, gap: 8 }}>
            {[1, 7, 14, 30, 60].map((d) => (
              <Pressable key={d} onPress={() => set("daysLeft", d)} style={{ flex: 1, paddingVertical: 8, borderRadius: DT.radius.md, alignItems: "center", backgroundColor: form.daysLeft === d ? C.primary : theme.card, borderWidth: 1.5, borderColor: form.daysLeft === d ? C.primary : theme.border }}>
                <Text style={{ fontSize: theme.fs.xs, fontWeight: "700", color: form.daysLeft === d ? "#fff" : theme.textSub }}>{d}d</Text>
              </Pressable>
            ))}
          </View>
        </View>
        <View>
          {label("Category")}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 7 }}>
            {CATS.map((c) => {
              const on = form.category === c;
              return (
                <Pressable key={c} onPress={() => set("category", c)} style={{ paddingHorizontal: 14, height: 36, justifyContent: "center", borderRadius: DT.radius.full, backgroundColor: on ? C.primarySoft : theme.card, borderWidth: 1.5, borderColor: on ? C.primary : theme.border }}>
                  <Text style={{ fontSize: theme.fs.xs, fontWeight: "700", color: on ? C.primary : theme.textSub }}>{c}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
        <View>
          {label("Allergens")}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 7 }}>
            {ALLERGENS.map((a) => {
              const on = form.allergens.includes(a);
              return (
                <Pressable key={a} onPress={() => set("allergens", on ? form.allergens.filter((x) => x !== a) : [...form.allergens, a])} style={{ height: 34, paddingHorizontal: 13, justifyContent: "center", borderRadius: DT.radius.full, backgroundColor: on ? C.errorSoft : theme.card, borderWidth: 1.5, borderColor: on ? C.error + "40" : theme.border }}>
                  <Text style={{ fontSize: theme.fs.xs, fontWeight: "700", color: on ? C.error : theme.textSub }}>{a}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
        <CheckboxInput label="Set expiry reminder notification" checked={form.reminder} onChange={() => set("reminder", !form.reminder)} />
        <Btn variant="primary" size="lg" full onClick={submit} style={{ marginTop: 4 }}>✅ Add to Pantry</Btn>
      </View>
    </Sheet>
  );
}

// ── ScannerSheet ──────────────────────────────────────────────────────────────
export function ScannerSheet({ open, onClose, toast, onItemFound }: {
  open: boolean; onClose: () => void; toast?: (m: string) => void; onItemFound?: (item: Item) => void;
}) {
  const theme = useTheme();
  const { addItem } = useAppState();
  const onAdd = (it: Omit<Item, "id">) => { addItem(it); toast?.(`✅ ${it.name} added!`); onClose(); };
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<null | { emoji: string; name: string; brand: string; category: string; daysLeft: number }>(null);

  const MOCK = [
    { emoji: "🥫", name: "Canned Tomatoes", brand: "Hunt's", category: "Pantry", daysLeft: 365 },
    { emoji: "🧃", name: "Apple Juice", brand: "Mott's", category: "Beverages", daysLeft: 20 },
    { emoji: "🍝", name: "Spaghetti Pasta", brand: "Barilla", category: "Pantry", daysLeft: 400 },
  ];
  const scan = () => {
    setScanning(true); setResult(null);
    setTimeout(() => { setScanning(false); setResult(MOCK[Math.floor(Math.random() * MOCK.length)]); }, 1600);
  };

  return (
    <Sheet open={open} onClose={onClose} title="📷 Scan Barcode">
      <View style={{ gap: DT.spacing.base }}>
        <LinearGradient colors={[C.primary, C.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 22, height: 220, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 64 }}>{scanning ? "🔎" : result ? result.emoji : "📷"}</Text>
          <Text style={{ color: "#fff", fontWeight: "700", marginTop: 10, fontSize: theme.fs.body }}>{scanning ? "Scanning…" : result ? "Product found!" : "Point camera at barcode"}</Text>
          <View style={{ width: 180, height: 2, backgroundColor: "rgba(255,255,255,0.7)", marginTop: 16 }} />
        </LinearGradient>
        {result && (
          <View style={{ backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.border, borderRadius: 18, padding: 16, flexDirection: "row", alignItems: "center", gap: 14 }}>
            <Text style={{ fontSize: 40 }}>{result.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: theme.fs.body, fontWeight: "800", color: theme.text }}>{result.name}</Text>
              <Text style={{ fontSize: theme.fs.sm, color: theme.textSub }}>{result.brand}</Text>
              <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
                <Badge color={C.primary} fs={theme.fs.badge}>{result.category}</Badge>
                <Badge color={urgencyColor(result.daysLeft)} bg={urgencyBg(result.daysLeft)} fs={theme.fs.badge}>{result.daysLeft}d</Badge>
              </View>
            </View>
          </View>
        )}
        {result ? (
          <Btn variant="success" size="lg" full onClick={() => { onAdd({ emoji: result.emoji, name: result.name, brand: result.brand, category: result.category, qty: 1, unit: "unit", daysLeft: result.daysLeft, calories: 0, protein: 0, fat: 0, allergens: [], added: "Jun 15" }); onClose(); setResult(null); }}>✅ Add to Pantry</Btn>
        ) : (
          <Btn variant="primary" size="lg" full onClick={scan}>{scanning ? "Scanning…" : "🔍 Start Scan"}</Btn>
        )}
      </View>
    </Sheet>
  );
}

// ── ItemDetailSheet ─────────────────────────────────────────────────────────
export function ItemDetailSheet({ item, open, onClose, toast, onOpenRecipe }: {
  item: Item | null; open: boolean; onClose: () => void; toast?: (m: string) => void; onOpenRecipe?: (id: string) => void;
}) {
  const theme = useTheme();
  const { deleteItem, useItem } = useAppState();
  const onDelete = (id: number) => { deleteItem(id); toast?.("🗑 Item removed"); };
  const onUse = (id: number) => { useItem(id); toast?.("✅ Marked as used!"); };
  if (!item) return null;
  return (
    <Sheet open={open} onClose={onClose} title={item.name}>
      <View style={{ gap: 16 }}>
        <LinearGradient colors={[urgencyBg(item.daysLeft), C.primarySoft]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 22, height: 180, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 92 }}>{item.emoji}</Text>
          <View style={{ position: "absolute", top: 14, right: 14 }}><StatusBadge daysLeft={item.daysLeft} /></View>
          {!!item.brand && <View style={{ position: "absolute", bottom: 14, left: 14, backgroundColor: "rgba(0,0,0,0.08)", borderRadius: 99, paddingHorizontal: 12, paddingVertical: 4 }}><Text style={{ fontSize: theme.fs.xs, fontWeight: "700", color: theme.text }}>{item.brand}</Text></View>}
        </LinearGradient>
        <View style={{ backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.border, borderRadius: 18, padding: 16 }}>
          <Text style={{ fontSize: theme.fs.h1, fontWeight: "700", color: theme.text }}>{item.name}</Text>
          <View style={{ flexDirection: "row", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            <Badge color={C.primary} fs={theme.fs.badge}>{item.category}</Badge>
            <Badge color={theme.textSub} bg={theme.border + "50"} fs={theme.fs.badge}>{item.qty} {item.unit}</Badge>
            <Badge color={theme.textSub} bg={theme.border + "50"} fs={theme.fs.badge}>Added {item.added}</Badge>
          </View>
          <ExpiryBar daysLeft={item.daysLeft} />
        </View>
        <View style={{ backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.border, borderRadius: 18, padding: 16 }}>
          <Text style={{ fontSize: theme.fs.h3, fontWeight: "700", color: theme.text, marginBottom: 12 }}>Nutrition Facts</Text>
          {([["🔥", "Calories", `${item.calories} kcal`], ["💪", "Protein", `${item.protein}g`], ["🧈", "Fat", `${item.fat}g`]] as const).map(([icon, k, v], i) => (
            <View key={k} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, borderTopWidth: i > 0 ? 1 : 0, borderTopColor: theme.border + "40" }}>
              <Text style={{ fontSize: theme.fs.body, color: theme.textSub }}>{icon} {k}</Text>
              <Text style={{ fontSize: theme.fs.body, fontWeight: "800", color: theme.text }}>{v}</Text>
            </View>
          ))}
        </View>
        {item.allergens?.length > 0 && (
          <View style={{ backgroundColor: C.errorSoft, borderWidth: 1.5, borderColor: C.error + "25", borderRadius: 18, padding: 16, flexDirection: "row", gap: 12 }}>
            <Text style={{ fontSize: 26 }}>⚠️</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: theme.fs.body, fontWeight: "800", color: C.error }}>Contains Allergens</Text>
              <Text style={{ fontSize: theme.fs.sm, color: theme.textSub, marginTop: 3 }}>{item.allergens.join(", ")}</Text>
            </View>
          </View>
        )}
        <View style={{ gap: 10, paddingBottom: 8 }}>
          <Btn variant="success" size="lg" full onClick={() => { onUse(item.id); onClose(); }}>✓ Mark as Used</Btn>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Btn variant="secondary" size="md" full>✏️ Edit</Btn>
            <Btn variant="danger" size="md" full onClick={() => { onDelete(item.id); onClose(); }}>🗑 Delete</Btn>
          </View>
        </View>
      </View>
    </Sheet>
  );
}

// ── RecipeDetailSheet ─────────────────────────────────────────────────────────
export function RecipeDetailSheet({ recipeId, open, onClose, toast }: {
  recipeId: string | null; open: boolean; onClose: () => void; toast?: (m: string) => void;
}) {
  const theme = useTheme();
  const recipe = recipeId != null ? RECIPES.find(r => String(r.id) === String(recipeId)) ?? null : null;
  if (!recipe) return null;
  return (
    <Sheet open={open} onClose={onClose} title={recipe.name} maxHRatio={0.95}>
      <View style={{ gap: 16 }}>
        <LinearGradient colors={[C.primarySoft, C.tealSoft]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 22, height: 150, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 80 }}>{recipe.emoji}</Text>
        </LinearGradient>
        <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
          <Badge color={C.primary} fs={theme.fs.badge}>⏱ {recipe.time}</Badge>
          <Badge color={C.teal} fs={theme.fs.badge}>🍽 {recipe.servings} servings</Badge>
          <Badge color="#F59E0B" bg="#FEF3C7" fs={theme.fs.badge}>⭐ {recipe.rating}</Badge>
          <Badge color={theme.textSub} bg={theme.border + "50"} fs={theme.fs.badge}>{recipe.meal}</Badge>
        </View>
        <View style={{ backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.border, borderRadius: 18, padding: 16 }}>
          <Text style={{ fontSize: theme.fs.h3, fontWeight: "700", color: theme.text, marginBottom: 12 }}>Ingredients</Text>
          {recipe.ingredients.map((ing, i) => (
            <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10, borderBottomWidth: i < recipe.ingredients.length - 1 ? 1 : 0, borderBottomColor: theme.border + "40" }}>
              <Text style={{ color: C.success, fontWeight: "900", fontSize: 17 }}>✓</Text>
              <Text style={{ fontSize: theme.fs.body, color: theme.text }}>{ing}</Text>
            </View>
          ))}
        </View>
        <View style={{ backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.border, borderRadius: 18, padding: 16 }}>
          <Text style={{ fontSize: theme.fs.h3, fontWeight: "700", color: theme.text, marginBottom: 12 }}>Instructions</Text>
          {recipe.steps.map((step, i) => (
            <View key={i} style={{ flexDirection: "row", gap: 14, paddingVertical: 12, borderBottomWidth: i < recipe.steps.length - 1 ? 1 : 0, borderBottomColor: theme.border + "40" }}>
              <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: C.primary, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: "#fff", fontSize: 13, fontWeight: "800" }}>{i + 1}</Text>
              </View>
              <Text style={{ fontSize: theme.fs.body, color: theme.textSub, flex: 1, lineHeight: theme.fs.body * 1.6 }}>{step}</Text>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: "row", gap: 10, paddingBottom: 8 }}>
          <Btn variant="primary" size="lg" full onClick={() => toast?.("🍳 Let's start cooking!")}>🍳 Start Cooking</Btn>
          <Btn variant="ghost" size="lg" onClick={() => toast?.("📋 Recipe copied to clipboard!")}>📤 Share</Btn>
        </View>
      </View>
    </Sheet>
  );
}
