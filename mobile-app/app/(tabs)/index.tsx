import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, StatusBar as RNStatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSettings } from "@/lib/design/theme-context";
import { useToast } from "@/components/get/sheet";
import { SplashScreen } from "@/components/get/flow/SplashScreen";
import { OnboardingFlow } from "@/components/get/flow/OnboardingFlow";
import { LoginScreen } from "@/components/get/flow/LoginScreen";
import { BottomTabBar, TabKey } from "@/components/get/nav/BottomTabBar";
import { MobileDrawer } from "@/components/get/nav/MobileDrawer";
import { HomeTab } from "@/components/get/tabs/HomeTab";
import { InventoryTab } from "@/components/get/tabs/InventoryTab";
import { FridgeTab } from "@/components/get/tabs/FridgeTab";
import { AIHubTab } from "@/components/get/tabs/AIHubTab";
import { ProfileTab } from "@/components/get/tabs/ProfileTab";
import { AddItemSheet, ScannerSheet, ItemDetailSheet, RecipeDetailSheet } from "@/components/get/sheets/ItemSheets";
import { HealthSheet, ShoppingListSheet } from "@/components/get/sheets/CareSheets";
import { NutritionSheet } from "@/components/get/sheets/NutritionSheet";
import { NLPChatSheet, HistorySheet, IoTDeviceSheet, BlockchainLedgerSheet, GamificationSheet, ChallengesSheet } from "@/components/get/sheets/AISheets";
import { useAppState } from "@/lib/state/app-state";
import type { Item } from "@/lib/design/data";

type Phase = "splash" | "onboard" | "login" | "app";
type SheetKey = "add" | "scan" | "item" | "recipe" | "health" | "shopping" | "nutrition" | "chat" | "history" | "iot" | "ledger" | "gamify" | "challenges" | null;

const TAB_TITLES: Record<TabKey, string> = {
  home: "GET", fridge: "AR Fridge", ai: "AI Hub", inventory: "Inventory", profile: "Profile",
};

export default function GetApp() {
  const { theme, isDark, setDark, largeText, setLargeText, highContrast, setHighContrast } = useSettings();
  const toast = useToast();
  const insets = useSafeAreaInsets();
  const { items } = useAppState();

  const [phase, setPhase] = useState<Phase>("splash");
  const [tab, setTab] = useState<TabKey>("home");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sheet, setSheet] = useState<SheetKey>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  const openSheet = (key: SheetKey) => setSheet(key);
  const closeSheet = () => setSheet(null);

  const openItem = (item: Item) => { setSelectedItem(item); setSheet("item"); };
  const openRecipe = (id: string) => { setSelectedRecipeId(id); setSheet("recipe"); };

  if (phase === "splash") return <SplashScreen onDone={() => setPhase("onboard")} />;
  if (phase === "onboard") return <OnboardingFlow onDone={() => setPhase("login")} />;
  if (phase === "login") return <LoginScreen onDone={() => setPhase("app")} theme={theme} toast={toast} />;

  const isHome = tab === "home";

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <RNStatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header — hidden on Home tab (HomeTab has its own gradient hero header) */}
      {!isHome && (
        <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: theme.card, borderBottomColor: theme.border }]}>
          <Pressable onPress={() => setDrawerOpen(true)} style={styles.menuBtn} hitSlop={8}>
            <Text style={{ fontSize: 22 }}>☰</Text>
          </Pressable>
          <Text style={{ fontSize: theme.fs.h3, fontWeight: "800", color: theme.text }}>{TAB_TITLES[tab]}</Text>
          <Pressable onPress={() => toast("🔔 No new notifications")} style={styles.menuBtn} hitSlop={8}>
            <Text style={{ fontSize: 20 }}>🔔</Text>
          </Pressable>
        </View>
      )}

      {/* Tab content */}
      <View style={{ flex: 1 }}>
        {tab === "home" && (
          <HomeTab
            theme={theme} toast={toast} onNavigate={setTab}
            onOpenAdd={() => openSheet("add")}
            onOpenScan={() => openSheet("scan")}
            onOpenItem={openItem}
            onOpenRecipe={openRecipe}
            onOpenDrawer={() => setDrawerOpen(true)}
          />
        )}
        {tab === "fridge" && <FridgeTab theme={theme} toast={toast} onOpenItem={openItem} onOpenAdd={() => openSheet("add")} />}
        {tab === "ai" && (
          <AIHubTab
            theme={theme} toast={toast}
            onOpenSheet={(id) => {
              const map: Record<string, SheetKey> = {
                shopping: "shopping", nutrition: "nutrition", chat: "chat",
                history: "history", iot: "iot", ledger: "ledger",
                gamify: "gamify", challenges: "challenges",
              };
              if (map[id]) openSheet(map[id]);
            }}
          />
        )}
        {tab === "inventory" && (
          <InventoryTab theme={theme} toast={toast} onOpenItem={openItem} onOpenAdd={() => openSheet("add")} onOpenScan={() => openSheet("scan")} />
        )}
        {tab === "profile" && (
          <ProfileTab
            theme={theme} toast={toast}
            isDark={isDark} setDark={setDark}
            largeText={largeText} setLargeText={setLargeText}
            highContrast={highContrast} setHighContrast={setHighContrast}
            onOpenHealth={() => openSheet("health")}
          />
        )}
      </View>

      <BottomTabBar active={tab} onChange={setTab} theme={theme} />

      <MobileDrawer
        open={drawerOpen} onClose={() => setDrawerOpen(false)} activeTab={tab} onNavigate={setTab}
        theme={theme} isDark={isDark} setDark={setDark} largeText={largeText} setLargeText={setLargeText}
      />

      {/* ── Sheets ── */}
      <AddItemSheet open={sheet === "add"} onClose={closeSheet} toast={toast} />
      <ScannerSheet open={sheet === "scan"} onClose={closeSheet} toast={toast} onItemFound={(item) => { closeSheet(); openItem(item); }} />
      <ItemDetailSheet open={sheet === "item"} onClose={closeSheet} item={selectedItem} toast={toast} onOpenRecipe={openRecipe} />
      <RecipeDetailSheet open={sheet === "recipe"} onClose={closeSheet} recipeId={selectedRecipeId} toast={toast} />
      <HealthSheet open={sheet === "health"} onClose={closeSheet} toast={toast} />
      <ShoppingListSheet open={sheet === "shopping"} onClose={closeSheet} toast={toast} />
      <NutritionSheet open={sheet === "nutrition"} onClose={closeSheet} toast={toast} />
      <NLPChatSheet open={sheet === "chat"} onClose={closeSheet} toast={toast} />
      <HistorySheet open={sheet === "history"} onClose={closeSheet} toast={toast} />
      <IoTDeviceSheet open={sheet === "iot"} onClose={closeSheet} toast={toast} />
      <BlockchainLedgerSheet open={sheet === "ledger"} onClose={closeSheet} toast={toast} />
      <GamificationSheet open={sheet === "gamify"} onClose={closeSheet} toast={toast} />
      <ChallengesSheet open={sheet === "challenges"} onClose={closeSheet} toast={toast} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 0.5 },
  menuBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
});
