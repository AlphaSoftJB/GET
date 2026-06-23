import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SLIDES = [
  { emoji: "🥗", title: "Track Expiration Dates Effortlessly", desc: "Never let groceries expire again. Scan barcodes or add items manually — GET tracks every expiry date automatically.", bg: ["#4F46E5", "#7C3AED"] as [string, string], textColor: "#4F46E5" },
  { emoji: "♻️", title: "Reduce Food Waste with Smart Alerts", desc: "Receive AI-powered alerts before items expire. Save money, eat healthier, and reduce your environmental footprint.", bg: ["#059669", "#0D9488"] as [string, string], textColor: "#059669" },
  { emoji: "🤖", title: "Your Smart AI Pantry Starts Here", desc: "AR fridge view, NLP chat, nutrition coaching, blockchain-verified sustainability — everything in one beautiful app.", bg: ["#7C3AED", "#EC4899"] as [string, string], textColor: "#7C3AED" },
];

export function OnboardingFlow({ onDone }: { onDone: () => void }) {
  const [slide, setSlide] = useState(0);
  const insets = useSafeAreaInsets();
  const s = SLIDES[slide];
  const isLast = slide === SLIDES.length - 1;
  const goNext = () => (isLast ? onDone() : setSlide((x) => x + 1));

  return (
    <LinearGradient colors={s.bg} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.fill, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }]}>
      <View style={{ width: "100%", alignItems: "flex-end" }}>
        <Pressable onPress={onDone} style={styles.skip}><Text style={styles.skipTxt}>Skip</Text></Pressable>
      </View>

      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 28 }}>
        <View style={styles.illu}><Text style={{ fontSize: 84 }}>{s.emoji}</Text></View>
        <View style={{ alignItems: "center", maxWidth: 340 }}>
          <Text style={styles.title}>{s.title}</Text>
          <Text style={styles.desc}>{s.desc}</Text>
        </View>
      </View>

      <View style={{ width: "100%", alignItems: "center", gap: 16 }}>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {SLIDES.map((_, i) => (
            <Pressable key={i} onPress={() => setSlide(i)} style={{ width: i === slide ? 28 : 9, height: 9, borderRadius: 99, backgroundColor: i === slide ? "white" : "rgba(255,255,255,0.35)" }} />
          ))}
        </View>
        <Pressable onPress={goNext} style={({ pressed }) => [styles.cta, { maxWidth: 340, transform: [{ scale: pressed ? 0.97 : 1 }] }]}>
          <Text style={[styles.ctaTxt, { color: s.textColor }]}>{isLast ? "🚀 Get Started" : "Next →"}</Text>
        </Pressable>
        {isLast ? (
          <Pressable onPress={onDone}>
            <Text style={styles.loginLink}>Already have an account? <Text style={{ color: "white", fontWeight: "800", textDecorationLine: "underline" }}>Log In</Text></Text>
          </Pressable>
        ) : null}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, alignItems: "center", justifyContent: "space-between", paddingHorizontal: 28 },
  skip: { backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 99, paddingHorizontal: 18, paddingVertical: 8 },
  skipTxt: { color: "white", fontSize: 14, fontWeight: "600" },
  illu: { width: 160, height: 160, borderRadius: 40, backgroundColor: "rgba(255,255,255,0.15)", borderWidth: 2, borderColor: "rgba(255,255,255,0.3)", alignItems: "center", justifyContent: "center" },
  title: { fontSize: 30, fontWeight: "800", color: "white", textAlign: "center", marginBottom: 16, lineHeight: 36 },
  desc: { fontSize: 16, color: "rgba(255,255,255,0.82)", textAlign: "center", lineHeight: 26 },
  cta: { width: "100%", height: 56, borderRadius: 18, backgroundColor: "white", alignItems: "center", justifyContent: "center" },
  ctaTxt: { fontSize: 17, fontWeight: "800" },
  loginLink: { color: "rgba(255,255,255,0.75)", fontSize: 15, fontWeight: "600", paddingVertical: 4 },
});
