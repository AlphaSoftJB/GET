import { useState, useEffect } from "react";

export function useBreakpoint() {
  const [bp, setBp] = useState(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1366;
    return w < 768 ? "mobile" : w < 1024 ? "tablet" : w < 1366 ? "laptop" : "desktop";
  });
  useEffect(() => {
    const h = () => {
      const w = window.innerWidth;
      setBp(w < 768 ? "mobile" : w < 1024 ? "tablet" : w < 1366 ? "laptop" : "desktop");
    };
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return bp;
}

export function useOrientation() {
  const get = () => typeof window !== "undefined" && window.innerWidth > window.innerHeight;
  const [isLandscape, setLandscape] = useState(get);
  useEffect(() => {
    const h = () => setLandscape(get());
    window.addEventListener("resize", h);
    window.addEventListener("orientationchange", h);
    return () => { window.removeEventListener("resize", h); window.removeEventListener("orientationchange", h); };
  }, []);
  return isLandscape;
}

export function usePrefersReducedMotion() {
  const [r, setR] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion:reduce)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion:reduce)");
    const h = (e: MediaQueryListEvent) => setR(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return r;
}

const LIVE_EVENTS = [
  {user:"Alice Johnson",  action:"added 3 items to inventory",          icon:"📦", color:"#6366F1"},
  {user:"Bob Smith",      action:"scanned a barcode in Kitchen",         icon:"📷", color:"#10B981"},
  {user:"Eve Martinez",   action:"marked Greek Yogurt as used",          icon:"✅", color:"#10B981"},
  {user:"David Lee",      action:"viewed recipe: Spinach Omelette",      icon:"🍳", color:"#F59E0B"},
  {user:"Carol Davis",    action:"reported 2 expired items",             icon:"⚠️", color:"#EF4444"},
  {user:"Frank Wilson",   action:"updated allergen profile",             icon:"💚", color:"#14B8A6"},
  {user:"Alice Johnson",  action:"generated Inventory Summary report",   icon:"📋", color:"#6366F1"},
  {user:"Bob Smith",      action:"set expiry alert for Whole Milk",      icon:"🔔", color:"#F59E0B"},
];

export function useLiveFeed(enabled = true) {
  const [feed, setFeed] = useState(LIVE_EVENTS.slice(0,5).map((e,i) => ({...e, id:i, time:"just now"})));
  const [liveCount, setLiveCount] = useState(1892);
  useEffect(() => {
    if (!enabled) return;
    const t = setInterval(() => {
      const ev = LIVE_EVENTS[Math.floor(Math.random()*LIVE_EVENTS.length)];
      setFeed(f => [{...ev, id:Date.now(), time:"just now"}, ...f.slice(0,9)]);
      setLiveCount(n => n + Math.floor(Math.random()*3 + 1));
    }, 8000);
    return () => clearInterval(t);
  }, [enabled]);
  return { feed, liveCount };
}
