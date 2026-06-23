import React, { useState } from "react";
import { View, Text, Pressable, TextInput, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { C, DT } from "@/lib/design/tokens";
import { Theme } from "@/lib/design/theme";
import { Btn, Spinner } from "../ui";

type Mode = "login" | "signup";

export function LoginScreen({ onDone, theme, toast }: { onDone: () => void; theme: Theme; toast: (m: string) => void }) {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({});
  const [focused, setFocused] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = "Valid email required";
    if (password.length < 6) e.password = "Password must be at least 6 characters";
    if (mode === "signup" && !name.trim()) e.name = "Name is required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast(`${mode === "login" ? "Welcome back" : "Account created"}! 🎉`);
      onDone();
    }, 1200);
  };

  const fieldStyle = (field: string, hasError: boolean) => ({
    height: 52, paddingLeft: 44, paddingRight: field === "password" ? 48 : 16,
    borderWidth: 1.5, borderColor: hasError ? C.error : focused === field ? C.primary : theme.border,
    borderRadius: DT.radius["2xl"], fontSize: 16, backgroundColor: theme.card, color: theme.text,
  });

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}>
          <LinearGradient colors={["#4F46E5", "#7C3AED", "#EC4899"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingTop: insets.top + 36, paddingHorizontal: 28, paddingBottom: 48 }}>
            <Text style={{ fontSize: 52, textAlign: "center", marginBottom: 12 }}>🥗</Text>
            <Text style={styles.hTitle}>{mode === "login" ? "Welcome Back!" : "Create Account"}</Text>
            <Text style={styles.hSub}>{mode === "login" ? "Sign in to your pantry" : "Join thousands reducing food waste"}</Text>
          </LinearGradient>

          <View style={{ paddingHorizontal: 24 }}>
            <View style={[styles.card, { backgroundColor: theme.card, marginTop: -24 }]}>
              <View style={{ flexDirection: "row", backgroundColor: theme.hover, borderRadius: 14, padding: 4, marginBottom: 24 }}>
                {([{ id: "login", label: "Log In" }, { id: "signup", label: "Sign Up" }] as const).map((m) => (
                  <Pressable key={m.id} onPress={() => { setMode(m.id); setErrors({}); }} style={{ flex: 1, height: 40, borderRadius: 11, alignItems: "center", justifyContent: "center", backgroundColor: mode === m.id ? C.primary : "transparent" }}>
                    <Text style={{ fontSize: 15, fontWeight: "700", color: mode === m.id ? "white" : theme.textSub }}>{m.label}</Text>
                  </Pressable>
                ))}
              </View>

              {mode === "signup" ? (
                <View style={{ marginBottom: 16 }}>
                  <View style={styles.iconWrap}><Text style={styles.fieldIcon}>👤</Text>
                    <TextInput value={name} onChangeText={setName} placeholder="Full Name" placeholderTextColor={theme.textSub} onFocus={() => setFocused("name")} onBlur={() => setFocused(null)} style={fieldStyle("name", !!errors.name)} />
                  </View>
                  {errors.name ? <Text style={styles.err}>⚠ {errors.name}</Text> : null}
                </View>
              ) : null}

              <View style={{ marginBottom: 16 }}>
                <View style={styles.iconWrap}><Text style={styles.fieldIcon}>📧</Text>
                  <TextInput value={email} onChangeText={setEmail} placeholder="Email Address" placeholderTextColor={theme.textSub} keyboardType="email-address" autoCapitalize="none" onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} style={fieldStyle("email", !!errors.email)} />
                </View>
                {errors.email ? <Text style={styles.err}>⚠ {errors.email}</Text> : null}
              </View>

              <View style={{ marginBottom: 8 }}>
                <View style={styles.iconWrap}><Text style={styles.fieldIcon}>🔒</Text>
                  <TextInput value={password} onChangeText={setPassword} placeholder="Password" placeholderTextColor={theme.textSub} secureTextEntry={!showPass} onFocus={() => setFocused("password")} onBlur={() => setFocused(null)} style={fieldStyle("password", !!errors.password)} />
                  <Pressable onPress={() => setShowPass((s) => !s)} style={styles.eye}><Text style={{ fontSize: 18 }}>{showPass ? "🙈" : "👁"}</Text></Pressable>
                </View>
                {errors.password ? <Text style={styles.err}>⚠ {errors.password}</Text> : null}
              </View>

              {mode === "login" ? (
                <View style={{ alignItems: "flex-end", marginBottom: 20, marginTop: 8 }}>
                  <Pressable onPress={() => toast("Password reset link sent!")}><Text style={{ color: C.primary, fontSize: 13, fontWeight: "700" }}>Forgot Password?</Text></Pressable>
                </View>
              ) : <View style={{ height: 12 }} />}

              <Btn variant="primary" full theme={theme} onClick={submit} disabled={loading}>
                {loading ? (mode === "login" ? "Signing in…" : "Creating account…") : mode === "login" ? "🔑 Log In" : "🚀 Create Account"}
              </Btn>

              <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginVertical: 20 }}>
                <View style={{ flex: 1, height: 1, backgroundColor: theme.border }} />
                <Text style={{ fontSize: 13, color: theme.textSub, fontWeight: "600" }}>or continue with</Text>
                <View style={{ flex: 1, height: 1, backgroundColor: theme.border }} />
              </View>

              <View style={{ flexDirection: "row", gap: 12 }}>
                {[{ icon: "🔵", label: "Google" }, { icon: "⬛", label: "Apple" }].map((sb) => (
                  <Pressable key={sb.label} onPress={() => toast(`${sb.label} login coming soon!`)} style={{ flex: 1, height: 48, borderRadius: 14, borderWidth: 1.5, borderColor: theme.border, backgroundColor: theme.card, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <Text style={{ fontSize: 20 }}>{sb.icon}</Text><Text style={{ fontSize: 14, fontWeight: "700", color: theme.text }}>{sb.label}</Text>
                  </Pressable>
                ))}
              </View>

              {mode === "signup" ? (
                <Text style={{ fontSize: 12, color: theme.textSub, textAlign: "center", marginTop: 20, lineHeight: 19 }}>
                  By creating an account, you agree to our <Text style={{ color: C.primary, fontWeight: "700" }}>Terms of Service</Text> and <Text style={{ color: C.primary, fontWeight: "700" }}>Privacy Policy</Text>
                </Text>
              ) : null}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  hTitle: { fontSize: 28, fontWeight: "800", color: "white", textAlign: "center" },
  hSub: { fontSize: 15, color: "rgba(255,255,255,0.75)", textAlign: "center", marginTop: 6 },
  card: { borderRadius: 28, padding: 28, shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 24, shadowOffset: { width: 0, height: 10 }, elevation: 8 },
  iconWrap: { justifyContent: "center" },
  fieldIcon: { position: "absolute", left: 14, fontSize: 18, zIndex: 1 },
  eye: { position: "absolute", right: 14 },
  err: { fontSize: 12, color: C.error, marginTop: 4, fontWeight: "600" },
});
