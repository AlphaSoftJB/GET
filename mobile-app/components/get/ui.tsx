import React, { useState } from "react";
import {
  View, Text, Pressable, TextInput, ActivityIndicator,
  StyleSheet, ViewStyle, TextStyle, Platform, Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { C, DT } from "@/lib/design/tokens";
import { Theme } from "@/lib/design/theme";
import { useTheme } from "@/lib/design/theme-context";
import { urgencyColor, urgencyBg, urgencyIcon, urgencyLabel } from "@/lib/design/data";

const haptic = () => { if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); };

// ── Badge ─────────────────────────────────────────────────────────────────────
export function Badge({ children, color = C.primary, bg, fs = 11 }: { children: React.ReactNode; color?: string; bg?: string; fs?: number; }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", alignSelf: "flex-start", backgroundColor: bg || color + "1E", borderRadius: 99, paddingHorizontal: 10, paddingVertical: 3 }}>
      <Text style={{ color, fontSize: fs, fontWeight: "700" }}>{children}</Text>
    </View>
  );
}

// ── StatusBadge ─────────────────────────────────────────────────────────────────
export function StatusBadge({ daysLeft, fs }: { daysLeft: number; fs?: number }) {
  return <Badge color={urgencyColor(daysLeft)} bg={urgencyBg(daysLeft)} fs={fs || 11}>{`${urgencyIcon(daysLeft)} ${urgencyLabel(daysLeft)}`}</Badge>;
}

// ── ExpiryBar ─────────────────────────────────────────────────────────────────
export function ExpiryBar({ daysLeft }: { daysLeft: number }) {
  const pct = Math.min(daysLeft / 20, 1) * 100;
  return (
    <View style={{ backgroundColor: urgencyBg(daysLeft), borderRadius: 99, height: 5, overflow: "hidden", marginTop: 8 }}>
      <View style={{ height: "100%", width: `${pct}%`, backgroundColor: urgencyColor(daysLeft), borderRadius: 99 }} />
    </View>
  );
}

// ── Btn (press-animated, gradient) ──────────────────────────────────────────────
type BtnVariant = "primary" | "success" | "danger" | "secondary" | "ghost" | "dark";
type BtnSize = "sm" | "md" | "lg";
export function Btn({
  children, variant = "primary", size = "md", full = false, onClick, disabled = false, theme, style,
}: {
  children: React.ReactNode; variant?: BtnVariant; size?: BtnSize; full?: boolean;
  onClick?: () => void; disabled?: boolean; theme?: Theme; style?: ViewStyle;
}) {
  const s = { sm: { h: 36, px: 14, fs: 13 }, md: { h: 46, px: 20, fs: 15 }, lg: { h: 54, px: 24, fs: 16 } }[size];
  const gradients: Record<string, [string, string]> = {
    primary: [C.primary, C.primaryDark],
    success: [C.success, "#059669"],
    danger: [C.error, "#DC2626"],
  };
  const isGradient = variant === "primary" || variant === "success" || variant === "danger";
  const textColor =
    variant === "secondary" ? C.primary : variant === "ghost" ? C.n600 : variant === "dark" ? C.n700 : "#fff";

  const content = (
    <Text style={{ color: textColor, fontSize: s.fs, fontWeight: "700" }}>{children}</Text>
  );

  const handle = () => { if (disabled) return; haptic(); onClick && onClick(); };

  const baseStyle: ViewStyle = {
    height: s.h, paddingHorizontal: s.px, borderRadius: 14,
    alignItems: "center", justifyContent: "center", flexDirection: "row",
    width: full ? "100%" : undefined, opacity: disabled ? 0.5 : 1,
  };

  if (isGradient) {
    return (
      <Pressable onPress={handle} disabled={disabled} style={({ pressed }) => [{ width: full ? "100%" : undefined, transform: [{ scale: pressed ? 0.96 : 1 }] }, style]}>
        <LinearGradient colors={gradients[variant]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={baseStyle}>
          {content}
        </LinearGradient>
      </Pressable>
    );
  }
  const borderStyle: ViewStyle =
    variant === "secondary" ? { borderWidth: 2, borderColor: C.primary, backgroundColor: "transparent" }
      : variant === "dark" ? { backgroundColor: "rgba(0,0,0,0.08)" }
        : { backgroundColor: "transparent" };
  return (
    <Pressable onPress={handle} disabled={disabled} style={({ pressed }) => [baseStyle, borderStyle, { transform: [{ scale: pressed ? 0.96 : 1 }] }, style]}>
      {content}
    </Pressable>
  );
}

// ── Toggle switch ──────────────────────────────────────────────────────────────
export function Toggle({ on, onToggle, label, desc, emoji, theme: themeProp, size = "md" }: {
  on: boolean; onToggle: () => void; label?: string; desc?: string; emoji?: string; theme?: Theme; size?: "sm" | "md" | "lg";
}) {
  const themeCtx = useTheme();
  const theme = themeProp ?? themeCtx;
  const sizes = { sm: { h: 26, w: 46, thumb: 20 }, md: { h: 30, w: 54, thumb: 24 }, lg: { h: 34, w: 62, thumb: 28 } };
  const ss = sizes[size];
  const thumbLeft = on ? ss.w - ss.thumb - (ss.h - ss.thumb) / 2 : (ss.h - ss.thumb) / 2;
  const Switch = (
    <Pressable onPress={() => { haptic(); onToggle(); }} accessibilityRole="switch" accessibilityState={{ checked: on }}
      style={{ width: ss.w, height: ss.h, borderRadius: 99, backgroundColor: on ? C.primary : "rgba(0,0,0,0.12)", justifyContent: "center" }}>
      <View style={{ position: "absolute", top: (ss.h - ss.thumb) / 2, left: thumbLeft, width: ss.thumb, height: ss.thumb, borderRadius: ss.thumb / 2, backgroundColor: "white", ...shadow(2) }} />
    </Pressable>
  );
  if (!label) return Switch;
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 16, paddingVertical: 2 }}>
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 10 }}>
        {emoji ? <Text style={{ fontSize: 20 }}>{emoji}</Text> : null}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: theme.fs.body, color: theme.text, fontWeight: "700" }}>{label}</Text>
          {desc ? <Text style={{ fontSize: theme.fs.sm, color: theme.textSub, marginTop: 2 }}>{desc}</Text> : null}
        </View>
      </View>
      {Switch}
    </View>
  );
}

// ── QuickSettingCard ─────────────────────────────────────────────────────────────
export function QuickSettingCard({ emoji, label, desc, on, onToggle, color, theme: themeProp }: {
  emoji: string; label: string; desc: string; on: boolean; onToggle: () => void; color: string; theme?: Theme;
}) {
  const themeCtx = useTheme();
  const theme = themeProp ?? themeCtx;
  return (
    <Pressable onPress={() => { haptic(); onToggle(); }} accessibilityState={{ selected: on }}
      style={{ flex: 1, minWidth: 140, padding: 14, borderRadius: 20, borderWidth: 2, borderColor: on ? color + "40" : theme.border, backgroundColor: on ? color + "12" : theme.card, gap: 10 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: on ? color + "20" : theme.border + "60", alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 22 }}>{emoji}</Text>
        </View>
        <View style={{ width: 36, height: 20, borderRadius: 99, backgroundColor: on ? color : "rgba(0,0,0,0.08)", justifyContent: "center", alignItems: on ? "flex-end" : "flex-start", paddingHorizontal: 3 }}>
          <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: "white" }} />
        </View>
      </View>
      <View>
        <Text style={{ fontSize: theme.fs.sm, fontWeight: "700", color: on ? color : theme.text }}>{label}</Text>
        <Text style={{ fontSize: theme.fs.xs, color: theme.textSub, marginTop: 2 }}>{desc}</Text>
      </View>
    </Pressable>
  );
}

// ── Spinner ─────────────────────────────────────────────────────────────────────
export function Spinner({ size = "md", color = C.primary }: { size?: "sm" | "md" | "lg"; color?: string }) {
  const sz = { sm: "small", md: "small", lg: "large" }[size] as "small" | "large";
  return <ActivityIndicator size={sz} color={color} />;
}

// ── ProgressBar ───────────────────────────────────────────────────────────────
export function ProgressBar({ value, max = 100, label, showPct = true, color = C.primary, height = 8, theme: themeProp }: {
  value: number; max?: number; label?: string; showPct?: boolean; color?: string; height?: number; theme?: Theme;
}) {
  const themeCtx = useTheme();
  const theme = themeProp ?? themeCtx;
  const pct = Math.min(Math.round((value / max) * 100), 100);
  return (
    <View style={{ marginBottom: DT.spacing.md }}>
      {(label || showPct) && (
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
          {label ? <Text style={{ color: theme.text, fontSize: 13, fontWeight: "600" }}>{label}</Text> : null}
          {showPct ? <Text style={{ color: theme.textSub, fontSize: 13, fontWeight: "600" }}>{pct}%</Text> : null}
        </View>
      )}
      <View style={{ width: "100%", height, backgroundColor: theme.border, borderRadius: 99, overflow: "hidden" }}>
        <View style={{ height: "100%", width: `${pct}%`, backgroundColor: color, borderRadius: 99 }} />
      </View>
    </View>
  );
}

// ── AlertBanner ─────────────────────────────────────────────────────────────────
export function AlertBanner({ type = "info", title, message, onClose, dismissible = true }: {
  type?: "success" | "warning" | "error" | "info"; title?: string; message: string; onClose?: () => void; dismissible?: boolean;
}) {
  const MAP = {
    success: { bg: "#D1FAE5", text: "#065F46", icon: "✅" },
    warning: { bg: "#FEF3C7", text: "#92400E", icon: "⚠️" },
    error: { bg: C.errorSoft, text: "#7F1D1D", icon: "❌" },
    info: { bg: C.infoSoft, text: "#1E40AF", icon: "ℹ️" },
  };
  const s = MAP[type];
  return (
    <View style={{ flexDirection: "row", gap: DT.spacing.md, padding: DT.spacing.base, backgroundColor: s.bg, borderRadius: DT.radius["2xl"], marginBottom: DT.spacing.base }}>
      <Text style={{ fontSize: 20 }}>{s.icon}</Text>
      <View style={{ flex: 1 }}>
        {title ? <Text style={{ fontSize: 14, fontWeight: "700", color: s.text, marginBottom: 3 }}>{title}</Text> : null}
        <Text style={{ fontSize: 13, color: s.text, lineHeight: 20 }}>{message}</Text>
      </View>
      {dismissible && onClose ? (
        <Pressable onPress={onClose}><Text style={{ fontSize: 18, color: s.text, opacity: 0.6, fontWeight: "700" }}>✕</Text></Pressable>
      ) : null}
    </View>
  );
}

// ── CheckboxInput ───────────────────────────────────────────────────────────────
export function CheckboxInput({ label, checked, onChange, error, theme: themeProp }: {
  label: string; checked: boolean; onChange: () => void; error?: string; theme?: Theme;
}) {
  const themeCtx = useTheme();
  const theme = themeProp ?? themeCtx;
  return (
    <View style={{ marginBottom: DT.spacing.md }}>
      <Pressable onPress={onChange} style={{ flexDirection: "row", alignItems: "center", gap: DT.spacing.sm }}>
        <View style={{ width: 20, height: 20, borderRadius: DT.radius.sm, borderWidth: 2, borderColor: checked ? C.primary : theme.border, backgroundColor: checked ? C.primary : "transparent", alignItems: "center", justifyContent: "center" }}>
          {checked ? <Text style={{ color: "white", fontSize: 13, fontWeight: "900" }}>✓</Text> : null}
        </View>
        <Text style={{ fontSize: 14, color: theme.text, fontWeight: "500" }}>{label}</Text>
      </Pressable>
      {error ? <Text style={{ fontSize: 12, color: C.error, marginTop: 5, marginLeft: 28 }}>⚠ {error}</Text> : null}
    </View>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, title, subtitle, footer, onClick, theme: themeProp, style }: {
  children?: React.ReactNode; title?: string; subtitle?: string; footer?: React.ReactNode; onClick?: () => void; theme?: Theme; style?: ViewStyle;
}) {
  const themeCtx = useTheme();
  const theme = themeProp ?? themeCtx;
  const inner = (
    <View style={[{ backgroundColor: theme.card, borderWidth: 1.5, borderColor: theme.border, borderRadius: DT.radius.card, padding: DT.spacing.base }, style]}>
      {title ? <Text style={{ fontSize: theme.fs.h4, fontWeight: "700", color: theme.text, marginBottom: subtitle ? 2 : 8 }}>{title}</Text> : null}
      {subtitle ? <Text style={{ fontSize: theme.fs.sm, color: theme.textSub, marginBottom: 8 }}>{subtitle}</Text> : null}
      {children}
      {footer ? <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: theme.border }}>{footer}</View> : null}
    </View>
  );
  if (onClick) return <Pressable onPress={onClick} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>{inner}</Pressable>;
  return inner;
}

// ── TextField (text input with label) ────────────────────────────────────────────
export function TextField({ label, value, onChange, placeholder, error, hint, required, keyboardType, secureTextEntry, theme: themeProp }: {
  label?: string; value: string; onChange: (t: string) => void; placeholder?: string; error?: string; hint?: string;
  required?: boolean; keyboardType?: "default" | "email-address" | "numeric"; secureTextEntry?: boolean; theme?: Theme;
}) {
  const themeCtx = useTheme();
  const theme = themeProp ?? themeCtx;
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ marginBottom: DT.spacing.base }}>
      {label ? (
        <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 6, color: theme.textSub }}>
          {label}{required ? <Text style={{ color: C.error }}> *</Text> : null}
        </Text>
      ) : null}
      <TextInput
        value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor={theme.textSub}
        keyboardType={keyboardType} secureTextEntry={secureTextEntry}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ paddingHorizontal: 14, height: 48, fontSize: 15, borderWidth: 1.5, borderColor: error ? C.error : focused ? C.primary : theme.border, borderRadius: DT.radius.input, backgroundColor: theme.inputBg, color: theme.text }}
      />
      {error ? <Text style={{ fontSize: 12, color: C.error, marginTop: 5, fontWeight: "600" }}>⚠ {error}</Text> : null}
      {hint && !error ? <Text style={{ fontSize: 12, color: theme.textSub, marginTop: 5 }}>{hint}</Text> : null}
    </View>
  );
}

// Cross-platform shadow helper
export function shadow(level: number): ViewStyle {
  if (Platform.OS === "android") return { elevation: level };
  const map: Record<number, ViewStyle> = {
    2: { shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
    4: { shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
    8: { shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 16, shadowOffset: { width: 0, height: 8 } },
  };
  return map[level] || map[4];
}
