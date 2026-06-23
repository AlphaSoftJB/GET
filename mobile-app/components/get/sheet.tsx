import React, { createContext, useContext, useCallback, useState } from "react";
import { View, Text, Pressable, Modal, ScrollView, StyleSheet, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { C } from "@/lib/design/tokens";
import { useTheme } from "@/lib/design/theme-context";

const { height: SCREEN_H } = Dimensions.get("window");

// ── Sheet (bottom sheet modal) ───────────────────────────────────────────────
export function Sheet({ open, onClose, title, children, maxHRatio = 0.91 }: {
  open: boolean; onClose: () => void; title?: string; children: React.ReactNode; maxHRatio?: number;
}) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={{ flex: 1, backgroundColor: theme.overlay, justifyContent: "flex-end" }}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
        <View style={{ backgroundColor: theme.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: SCREEN_H * maxHRatio, paddingBottom: insets.bottom }}>
          <View style={{ alignItems: "center", paddingTop: 10 }}>
            <View style={{ width: 40, height: 5, borderRadius: 99, backgroundColor: theme.border }} />
          </View>
          {title ? (
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 14 }}>
              <Text style={{ fontSize: theme.fs.h3, fontWeight: "800", color: theme.text }}>{title}</Text>
              <Pressable onPress={onClose} hitSlop={10} style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: theme.hover, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 16, color: theme.textSub, fontWeight: "700" }}>✕</Text>
              </Pressable>
            </View>
          ) : null}
          <ScrollView contentContainerStyle={{ padding: 20, paddingTop: title ? 0 : 12 }} showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ── Toast system ────────────────────────────────────────────────────────────
interface ToastItem { id: number; msg: string; }
interface ToastCtx { toast: (msg: string, type?: string) => void; }
const ToastContext = createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const insets = useSafeAreaInsets();
  const toast = useCallback((msg: string, _type?: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);
  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <View pointerEvents="none" style={[styles.toastWrap, { bottom: insets.bottom + 90 }]}>
        {toasts.map((t) => (
          <View key={t.id} style={[styles.toast, { backgroundColor: C.n900 }]}>
            <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600", textAlign: "center" }}>{t.msg}</Text>
          </View>
        ))}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast(): (msg: string, type?: string) => void {
  const ctx = useContext(ToastContext);
  return ctx ? ctx.toast : () => {};
}

const styles = StyleSheet.create({
  toastWrap: { position: "absolute", left: 0, right: 0, alignItems: "center", gap: 8 },
  toast: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 14, maxWidth: "88%", shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
});
