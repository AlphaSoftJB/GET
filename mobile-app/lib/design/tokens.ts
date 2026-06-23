// ══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS — translated verbatim from GETMobileApp design template
// ══════════════════════════════════════════════════════════════════════════════

export const C = {
  // Primary (Indigo) — all 10 shades
  primary50: "#F0F4FF", primary100: "#E0E7FF", primary200: "#C7D2FE",
  primary300: "#A5B4FC", primary400: "#818CF8",
  primary: "#6366F1", primarySoft: "#EEF2FF", primaryDark: "#4F46E5",
  primary700: "#4338CA", primary800: "#3730A3", primary900: "#312E81",
  // Accent / Teal
  accent: "#F472B6", accentSoft: "#FDF2F8", accent500: "#EC4899",
  teal: "#14B8A6", tealSoft: "#F0FDFA", teal600: "#0D9488",
  // Semantic
  success: "#10B981", successSoft: "#D1FAE5", success600: "#059669",
  warning: "#F59E0B", warningSoft: "#FEF3C7", warning600: "#D97706",
  error: "#EF4444", errorSoft: "#FEE2E2", error600: "#DC2626",
  info: "#3B82F6", infoSoft: "#DBEAFE", info600: "#2563EB",
  // Neutrals
  white: "#FFFFFF",
  n50: "#F9FAFB", n100: "#F3F4F6", n150: "#EEEFF2", n200: "#E5E7EB",
  n300: "#D1D5DB", n400: "#9CA3AF", n500: "#6B7280",
  n600: "#4B5563", n700: "#374151", n800: "#1F2937", n900: "#111827",
  // Dark mode (Zinc)
  dk_bg: "#09090B", dk_surf: "#18181B", dk_card: "#27272A",
  dk_elev: "#3F3F46", dk_border: "#3F3F46",
  dk_text: "#FAFAFA", dk_sub: "#A1A1AA", dk_hover: "#323238",
} as const;

export const DT = {
  spacing: {
    xs: 4, sm: 8, md: 12, base: 16, lg: 20, xl: 24,
    "2xl": 32, "3xl": 40, "4xl": 48, "5xl": 56,
    gutter: 16, section: 32, card: 20, input: 12,
  },
  radius: {
    xs: 4, sm: 6, md: 8, base: 10, lg: 12, xl: 14, "2xl": 16, "3xl": 20, full: 9999,
    badge: 6, button: 10, card: 12, input: 8, modal: 16, tooltip: 6,
  },
  animation: {
    duration: { fast: 120, normal: 300, slow: 600 },
  },
  size: {
    button: { xs: { h: 28, px: 10, fs: 12 }, sm: { h: 34, px: 14, fs: 13 }, md: { h: 40, px: 16, fs: 14 }, lg: { h: 48, px: 20, fs: 15 }, xl: { h: 56, px: 24, fs: 16 } },
    input: { sm: { h: 32, px: 12, fs: 13 }, md: { h: 40, px: 14, fs: 14 }, lg: { h: 48, px: 16, fs: 15 } },
    avatar: { xs: 24, sm: 32, md: 40, lg: 48, xl: 56, "2xl": 64 },
    icon: { xs: 16, sm: 20, md: 24, lg: 32, xl: 40 },
    badge: { sm: { h: 20, px: 8, fs: 11 }, md: { h: 24, px: 10, fs: 12 }, lg: { h: 28, px: 12, fs: 13 } },
  },
} as const;
