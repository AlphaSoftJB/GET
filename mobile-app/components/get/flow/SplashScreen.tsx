import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Easing, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const scale = useRef(new Animated.Value(0.4)).current;
  const dot = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, { toValue: 1, friction: 4, tension: 80, useNativeDriver: true }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(dot, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(dot, { toValue: 0, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, [onDone, scale, dot]);

  return (
    <LinearGradient colors={["#4F46E5", "#7C3AED", "#EC4899"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.fill}>
      <Animated.Text style={{ fontSize: 84, marginBottom: 20, transform: [{ scale }] }}>🥗</Animated.Text>
      <Text style={styles.title}>Groceries Expiration{"\n"}Tracker</Text>
      <Text style={styles.sub}>Reduce waste · Eat healthier · Save money</Text>
      <View style={{ flexDirection: "row", gap: 8, marginTop: 48 }}>
        {[0, 1, 2].map((i) => (
          <Animated.View key={i} style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "white", opacity: i === 0 ? 1 : dot.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.8] }) }} />
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "800", color: "white", textAlign: "center", lineHeight: 36, marginBottom: 10 },
  sub: { fontSize: 14, color: "rgba(255,255,255,0.72)", textAlign: "center", maxWidth: 250, lineHeight: 22 },
});
