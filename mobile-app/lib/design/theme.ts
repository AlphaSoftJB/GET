import { C, DT } from "./tokens";

export interface Theme {
  bg: string; surface: string; card: string; elevated: string;
  border: string; text: string; textSub: string; navBg: string;
  navBorder: string; inputBg: string; hover: string; overlay: string;
  shimmer1: string; shimmer2: string;
  fs: { h1: number; h2: number; h3: number; h4: number; body: number; sm: number; xs: number; badge: number };
  spacing: typeof DT.spacing;
  radius: typeof DT.radius;
  size: typeof DT.size;
  isDark: boolean;
}

// Theme builder — mirrors buildTheme() in the design template
export function buildTheme(isDark: boolean, largeText: boolean, highContrast: boolean): Theme {
  const base = isDark
    ? {
        bg: C.dk_bg, surface: C.dk_surf, card: C.dk_card,
        elevated: C.dk_elev, border: C.dk_border, text: C.dk_text,
        textSub: C.dk_sub, navBg: C.dk_surf, navBorder: C.dk_border,
        inputBg: C.dk_card, hover: C.dk_hover, overlay: "rgba(0,0,0,0.8)",
        shimmer1: "#27272A", shimmer2: "#3F3F46",
      }
    : {
        bg: C.n50, surface: C.white, card: C.white,
        elevated: C.white, border: C.n200, text: C.n900,
        textSub: C.n600, navBg: C.white, navBorder: C.n200,
        inputBg: C.n50, hover: C.n100, overlay: "rgba(15,23,42,0.6)",
        shimmer1: C.n100, shimmer2: C.n200,
      };

  const T: Theme = {
    ...base,
    fs: largeText
      ? { h1: 30, h2: 24, h3: 20, h4: 18, body: 17, sm: 15, xs: 13, badge: 12 }
      : { h1: 26, h2: 21, h3: 17, h4: 16, body: 15, sm: 13, xs: 11, badge: 11 },
    spacing: DT.spacing,
    radius: DT.radius,
    size: DT.size,
    isDark,
  };

  if (highContrast) {
    T.text = isDark ? "#FFFFFF" : "#000000";
    T.textSub = isDark ? "#E4E4E7" : "#1C1917";
    T.border = isDark ? "#A1A1AA" : "#374151";
  }
  return T;
}
