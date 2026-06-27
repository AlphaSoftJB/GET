// ── Design Tokens — exact match to GETWebAdmin(2).tsx ──────────────────────
export const C = {
  primary50:"#F0F4FF", primary100:"#E0E7FF", primary200:"#C7D2FE",
  primary300:"#A5B4FC", primary400:"#818CF8",
  primary:   "#6366F1", primarySoft:"#EEF2FF", primaryDark:"#4F46E5",
  primary700:"#4338CA", primary800:"#3730A3", primary900:"#312E81",
  accent:    "#F472B6", accentSoft:"#FDF2F8", accent500:"#EC4899",
  teal:      "#14B8A6", tealSoft:  "#F0FDFA", teal600:"#0D9488",
  success:   "#10B981", successSoft:"#D1FAE5", success600:"#059669",
  warning:   "#F59E0B", warningSoft:"#FEF3C7", warning600:"#D97706",
  error:     "#EF4444", errorSoft:  "#FEE2E2", error600:  "#DC2626",
  info:      "#3B82F6", infoSoft:   "#DBEAFE", info600:   "#2563EB",
  white:"#FFFFFF",
  n50:"#F9FAFB", n100:"#F3F4F6", n150:"#EEEFF2", n200:"#E5E7EB",
  n300:"#D1D5DB", n400:"#9CA3AF", n500:"#6B7280",
  n600:"#4B5563", n700:"#374151", n800:"#1F2937", n900:"#111827",
  d_bg:"#09090B", d_surf:"#18181B", d_card:"#27272A",
  d_elev:"#3F3F46", d_border:"#3F3F46",
  d_text:"#FAFAFA", d_sub:"#A1A1AA", d_hover:"#323238",
};

export const DT = {
  spacing: { xs:4, sm:8, md:12, base:16, lg:20, xl:24, "2xl":32, "3xl":40, "4xl":48, "5xl":56, gutter:16, section:32, card:20, input:12 },
  radius:  { xs:4, sm:6, md:8, base:10, lg:12, xl:14, "2xl":16, "3xl":20, full:9999, badge:6, button:10, card:12, input:8, modal:16, tooltip:6 },
  shadow: {
    xs:   "0 1px 2px 0 rgba(0,0,0,0.05)",
    sm:   "0 1px 3px 0 rgba(0,0,0,0.1),0 1px 2px 0 rgba(0,0,0,0.06)",
    md:   "0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06)",
    lg:   "0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05)",
    xl:   "0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04)",
    card: "0 4px 12px rgba(0,0,0,0.08)",
    button:"0 2px 8px rgba(99,102,241,0.3)",
    primary:(o=0.3)=>`0 4px 16px rgba(99,102,241,${o})`,
    success:(o=0.3)=>`0 4px 16px rgba(16,185,129,${o})`,
    error:  (o=0.3)=>`0 4px 16px rgba(239,68,68,${o})`,
    dark: { xs:"0 1px 2px 0 rgba(0,0,0,0.3)", sm:"0 1px 3px 0 rgba(0,0,0,0.4)", md:"0 4px 6px -1px rgba(0,0,0,0.5)", lg:"0 10px 15px -3px rgba(0,0,0,0.6)" },
  },
  animation: {
    duration: { fast:120, normal:300, slow:600 },
    easing:   { standard:"cubic-bezier(0.4,0,0.2,1)", easeOut:"cubic-bezier(0,0,0.2,1)", spring:"cubic-bezier(0.34,1.56,0.64,1)" },
    transition: { fast:"all 120ms cubic-bezier(0.4,0,0.2,1)", normal:"all 300ms cubic-bezier(0.4,0,0.2,1)" },
  },
  zIndex: { dropdown:1000, sticky:1020, fixed:1030, backdrop:1040, offcanvas:1050, modal:1060, popover:1070, tooltip:1080, notification:1090 },
  size: {
    button: { xs:{h:28,px:10,fs:12}, sm:{h:34,px:14,fs:13}, md:{h:40,px:16,fs:14}, lg:{h:48,px:20,fs:15} },
    input:  { sm:{h:32,px:12,fs:13}, md:{h:40,px:14,fs:14}, lg:{h:48,px:16,fs:15} },
    avatar: { xs:24, sm:32, md:40, lg:48, xl:56, "2xl":64 },
    icon:   { xs:16, sm:20, md:24, lg:32, xl:40 },
    badge:  { sm:{h:20,px:8,fs:11}, md:{h:24,px:10,fs:12}, lg:{h:28,px:12,fs:13} },
  },
};

export type Theme = {
  bg: string; surface: string; card: string; border: string;
  text: string; textSub: string; hover: string; navBg: string;
  inputBg: string; chartGrid: string;
  shadow: typeof DT.shadow | typeof DT.shadow.dark;
  spacing: typeof DT.spacing; radius: typeof DT.radius;
  anim: typeof DT.animation; zIndex: typeof DT.zIndex;
  size: typeof DT.size;
};

export function buildTheme(isDark: boolean, highContrast: boolean): Theme {
  const T: any = isDark ? {
    bg: C.d_bg, surface: C.d_surf, card: C.d_card, border: C.d_border||C.d_elev,
    text: C.d_text, textSub: C.d_sub, hover: C.d_hover, navBg: C.d_surf,
    inputBg: C.d_card, chartGrid: C.d_elev,
    shadow: DT.shadow.dark,
  } : {
    bg: C.n50, surface: C.white, card: C.white, border: C.n200,
    text: C.n900, textSub: C.n600, hover: C.n100, navBg: C.white,
    inputBg: C.white, chartGrid: C.n200,
    shadow: DT.shadow,
  };
  if (highContrast) { T.text = "#000"; T.textSub = "#1A202C"; T.border = "#374151"; }
  T.spacing = DT.spacing; T.radius = DT.radius; T.anim = DT.animation;
  T.zIndex = DT.zIndex; T.size = DT.size;
  return T as Theme;
}
