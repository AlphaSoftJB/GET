import React, { useState, useEffect, useRef } from "react";
import { C, DT, Theme } from "../tokens";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

// ── AnimatedCounter ───────────────────────────────────────────────────────────
export function AnimatedCounter({ target, prefix="", suffix="", duration=1200, reduced }: {
  target: number|string; prefix?: string; suffix?: string; duration?: number; reduced?: boolean;
}) {
  const [val, setVal] = useState(reduced ? (typeof target === "number" ? target : 0) : 0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    if (typeof target !== "number") return;
    if (reduced) { setVal(target); return; }
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const tick = () => {
          const p = Math.min((Date.now() - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(ease * (target as number)));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration, reduced]);
  const display = typeof target === "string" ? target : val.toLocaleString();
  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

// ── FadeIn ────────────────────────────────────────────────────────────────────
export function FadeIn({ children, delay=0, reduced }: { children: React.ReactNode; delay?: number; reduced?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(!!reduced);
  useEffect(() => {
    if (reduced) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [reduced]);
  return (
    <div ref={ref} style={{ opacity: vis?1:0, transform: vis?"translateY(0)":"translateY(16px)", transition: reduced?"none":`opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────
export function Badge({ children, color=C.primary, bg }: { children: React.ReactNode; color?: string; bg?: string }) {
  return <span style={{ display:"inline-flex", alignItems:"center", gap:3, background: bg||color+"18", color, borderRadius:6, padding:"3px 10px", fontSize:12, fontWeight:700, whiteSpace:"nowrap", lineHeight:1.4 }}>{children}</span>;
}

// ── Btn ───────────────────────────────────────────────────────────────────────
export function Btn({ children, variant="primary", size="md", onClick, disabled=false, style={}, ariaLabel, ...rest }: any) {
  const [h, setH] = useState(false);
  const v: any = {
    primary:   { background: h ? C.primaryDark : C.primary, color:"white", border:"none", boxShadow:`0 2px 10px ${C.primary}40` },
    secondary: { background: h ? C.n100 : C.white, color: C.n900, border:`1.5px solid ${C.n300}`, boxShadow:"none" },
    ghost:     { background: h ? C.primarySoft : "transparent", color: C.primary, border:`1.5px solid ${C.primary}`, boxShadow:"none" },
    danger:    { background: h ? "#DC2626" : C.error, color:"white", border:"none", boxShadow:`0 2px 8px ${C.error}40` },
    success:   { background: h ? "#059669" : C.success, color:"white", border:"none", boxShadow:`0 2px 8px ${C.success}40` },
  };
  const s: any = { sm:{minHeight:34,padding:"0 14px",fontSize:13}, md:{minHeight:40,padding:"0 16px",fontSize:14}, lg:{minHeight:48,padding:"0 22px",fontSize:15} };
  return (
    <button onClick={onClick} disabled={disabled} aria-label={ariaLabel}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      {...rest}
      style={{ ...v[variant], ...s[size], borderRadius:8, fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, cursor:disabled?"not-allowed":"pointer", opacity:disabled?0.5:1, display:"inline-flex", alignItems:"center", gap:7, transition:"all 0.18s ease", ...style }}>
      {children}
    </button>
  );
}

// ── AdminTooltip ──────────────────────────────────────────────────────────────
export function AdminTooltip({ content, children, position="top", delay=180 }: any) {
  const [vis, setVis] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>|null>(null);
  const pos: any = {
    top:    { bottom:"calc(100% + 8px)", left:"50%", transform:"translateX(-50%)" },
    bottom: { top:"calc(100% + 8px)",   left:"50%", transform:"translateX(-50%)" },
    left:   { right:"calc(100% + 8px)", top:"50%",  transform:"translateY(-50%)" },
    right:  { left:"calc(100% + 8px)",  top:"50%",  transform:"translateY(-50%)" },
  };
  return (
    <div style={{ position:"relative", display:"inline-flex" }}
      onMouseEnter={() => { t.current = setTimeout(() => setVis(true), delay); }}
      onMouseLeave={() => { if(t.current) clearTimeout(t.current); setVis(false); }}>
      {children}
      {vis && (
        <div style={{ position:"absolute", ...pos[position], background:C.n900, color:C.white, padding:"7px 12px", borderRadius:DT.radius.tooltip, fontSize:12, fontWeight:500, whiteSpace:"nowrap", zIndex:DT.zIndex.tooltip, pointerEvents:"none", boxShadow:DT.shadow.md, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
          {content}
        </div>
      )}
    </div>
  );
}

// ── StatCard ──────────────────────────────────────────────────────────────────
export function StatCard({ icon, title, value, suffix="", prefix="", trend, trendUp, color=C.primary, delay=0, reduced, theme, tooltip }: any) {
  const [hov, setHov] = useState(false);
  const numericVal = typeof value === "number" ? value : parseInt(String(value)?.replace(/[^0-9]/g,"")) || value;
  const card = (
    <FadeIn delay={delay} reduced={reduced}>
      <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{ background:theme.card, border:`1.5px solid ${hov?color:theme.border}`, borderRadius:DT.radius.card, padding:"20px 22px", boxShadow:hov?DT.shadow.primary(0.15):DT.shadow.xs, display:"flex", flexDirection:"column", gap:DT.spacing.md, transition:DT.animation.transition.normal, transform:hov&&!reduced?"translateY(-3px)":"none" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:11, fontWeight:700, color:theme.textSub, textTransform:"uppercase", letterSpacing:0.7 }}>{title}</span>
          <div style={{ width:38, height:38, borderRadius:DT.radius.lg, background:`${color}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{icon}</div>
        </div>
        <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:"clamp(24px,3vw,34px)", fontWeight:700, color:theme.text, lineHeight:1 }}>
          {typeof numericVal === "number"
            ? <>{prefix}<AnimatedCounter target={numericVal} suffix={suffix} reduced={reduced} /></>
            : <span>{value}</span>
          }
        </div>
        {trend && <div style={{ fontSize:12, fontWeight:700, color:trendUp?C.success:C.error, display:"flex", alignItems:"center", gap:4 }}>{trendUp?"↑":"↓"} {trend}</div>}
      </div>
    </FadeIn>
  );
  return tooltip ? <AdminTooltip content={tooltip} position="top">{card}</AdminTooltip> : card;
}

// ── ChartCard ─────────────────────────────────────────────────────────────────
export function ChartCard({ title, children, action, theme, delay=0, reduced }: any) {
  return (
    <FadeIn delay={delay} reduced={reduced}>
      <div style={{ background: theme.card, border:`1.5px solid ${theme.border}`, borderRadius:12, padding:"22px 24px", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, gap:12, flexWrap:"wrap" }}>
          <div style={{ fontSize:16, fontWeight:700, color: theme.text }}>{title}</div>
          {action && <div>{action}</div>}
        </div>
        {children}
      </div>
    </FadeIn>
  );
}

// ── Breadcrumb ────────────────────────────────────────────────────────────────
export function Breadcrumb({ items, theme }: { items: string[]; theme: Theme }) {
  return (
    <nav aria-label="Breadcrumb" style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color: theme.textSub, marginBottom:16, flexWrap:"wrap" }}>
      {items.map((item, i) => (
        <span key={i} style={{ display:"flex", alignItems:"center", gap:6 }}>
          {i > 0 && <span style={{ color: theme.border, fontSize:14 }}>/</span>}
          <span style={{ color: i===items.length-1 ? C.primary : theme.textSub, fontWeight: i===items.length-1 ? 700 : 400 }}>{item}</span>
        </span>
      ))}
    </nav>
  );
}

// ── PageHeader ────────────────────────────────────────────────────────────────
export function PageHeader({ icon, title, subtitle, action, theme }: any) {
  return (
    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24, gap:16, flexWrap:"wrap" }}>
      <div>
        <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:"clamp(22px,3vw,30px)", fontWeight:700, color: theme.text, display:"flex", alignItems:"center", gap:10 }}>
          <span>{icon}</span> {title}
        </div>
        {subtitle && <div style={{ fontSize:14, color: theme.textSub, marginTop:4 }}>{subtitle}</div>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, width=500, theme, reduced }: any) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    setTimeout(() => ref.current?.focus(), 50);
    document.body.style.overflow = "hidden";
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label={title}
      style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(0,0,0,0.55)", backdropFilter:"blur(3px)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
      onClick={onClose}>
      <div ref={ref} tabIndex={-1} onClick={e => e.stopPropagation()}
        style={{ background: theme.card, borderRadius:14, width:`min(${width}px,100%)`, boxShadow:"0 24px 80px rgba(0,0,0,0.25)", outline:"none", animation: reduced ? "none" : "modalIn 0.22s cubic-bezier(0.32,0.72,0,1)", maxHeight:"90vh", display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"18px 22px", borderBottom:`1px solid ${theme.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div style={{ fontSize:18, fontWeight:700, color: theme.text }}>{title}</div>
          <button onClick={onClose} aria-label="Close dialog" style={{ background: theme.hover, border:"none", borderRadius:8, width:34, height:34, cursor:"pointer", fontSize:16, color: theme.textSub, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>
        <div style={{ padding:22, overflowY:"auto" }}>{children}</div>
      </div>
    </div>
  );
}

// ── AllergenPieChart ──────────────────────────────────────────────────────────
export function AllergenPieChart({ data, innerRadius=0, outerRadius=90, height=240, reduced, theme }: any) {
  const [hovered, setHovered] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleMouseEnter = (entry: any, index: number, e: any) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setHovered({ name: entry.name, value: entry.value, color: entry.color || data[index]?.color || "#6366F1", x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  const handleMouseMove = (_: any, __: number, e: any) => {
    if (!containerRef.current || !hovered) return;
    const rect = containerRef.current.getBoundingClientRect();
    setHovered((h: any) => h ? { ...h, x: e.clientX - rect.left, y: e.clientY - rect.top } : null);
  };
  return (
    <div ref={containerRef} style={{ position:"relative", width:"100%", height }}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart margin={{ top:0, right:0, bottom:0, left:0 }}>
          <Pie data={data} cx="50%" cy="50%" innerRadius={innerRadius} outerRadius={outerRadius} paddingAngle={3} dataKey="value" animationDuration={reduced ? 0 : 1000} cursor="pointer"
            onMouseEnter={handleMouseEnter} onMouseMove={handleMouseMove} onMouseLeave={() => setHovered(null)}>
            {data.map((entry: any, i: number) => (
              <Cell key={i} fill={entry.color} opacity={hovered && hovered.name !== entry.name ? 0.65 : 1} style={{ transition:"opacity 0.15s", outline:"none" }} />
            ))}
          </Pie>
          <Legend wrapperStyle={{ fontSize:12, color: theme.textSub }} />
        </PieChart>
      </ResponsiveContainer>
      {hovered && (
        <div style={{ position:"absolute", left: Math.min(hovered.x + 12, (containerRef.current?.offsetWidth||300) - 140), top: Math.max(hovered.y - 44, 4), background: theme.card, border:`1.5px solid ${theme.border}`, borderRadius:10, padding:"7px 13px", boxShadow:"0 4px 20px rgba(0,0,0,0.14)", pointerEvents:"none", display:"flex", alignItems:"center", gap:8, zIndex:200, whiteSpace:"nowrap", fontSize:13 }}>
          <div style={{ width:10, height:10, borderRadius:"50%", background:hovered.color, flexShrink:0 }} />
          <span style={{ fontWeight:700, color:theme.text }}>{hovered.name}</span>
          <span style={{ color:theme.textSub, marginLeft:4 }}>{hovered.value}%</span>
        </div>
      )}
    </div>
  );
}

// ── AdminToastStack ───────────────────────────────────────────────────────────
export function AdminToastStack({ toasts, theme }: any) {
  const typeMap: any = { success:{ bg:C.successSoft, text:C.success, icon:"✅" }, error:{ bg:C.errorSoft, text:C.error, icon:"❌" }, warning:{ bg:C.warningSoft, text:C.warning, icon:"⚠️" }, info:{ bg:C.primarySoft, text:C.primary, icon:"ℹ️" } };
  return (
    <div role="log" aria-live="polite" style={{ position:"fixed", top:76, right:20, zIndex:3000, display:"flex", flexDirection:"column", gap:10, width:"min(340px, calc(100vw - 40px))" }}>
      {toasts.map((t: any) => {
        const s = typeMap[t.type] || typeMap.info;
        return (
          <div key={t.id} role="alert" style={{ background: s.bg, border:`1.5px solid ${s.text}25`, color: s.text, borderRadius:10, padding:"14px 16px", fontSize:14, fontWeight:600, boxShadow:"0 8px 32px rgba(0,0,0,0.15)", animation:"toastIn 0.3s ease", display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:20 }}>{s.icon}</span><span style={{ flex:1 }}>{t.msg}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── DataTable ─────────────────────────────────────────────────────────────────
export function DataTable({ columns, rows, theme, onRowClick }: any) {
  return (
    <div style={{ overflowX:"auto", borderRadius:10, border:`1.5px solid ${theme.border}` }}>
      <table role="grid" style={{ width:"100%", borderCollapse:"collapse", fontFamily:"'Plus Jakarta Sans',sans-serif", minWidth:500 }}>
        <thead>
          <tr style={{ background: theme.hover }}>
            {columns.map((col: any) => (
              <th key={col.key || col.label} scope="col" style={{ padding:"12px 16px", textAlign:"left", fontSize:12, fontWeight:700, color: theme.textSub, borderBottom:`1.5px solid ${theme.border}`, whiteSpace:"nowrap", userSelect:"none" }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row: any, i: number) => (
            <tr key={i} onClick={() => onRowClick?.(row)}
              style={{ borderTop:`1px solid ${theme.border}`, cursor: onRowClick ? "pointer" : "default", transition:"background 0.12s" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background=theme.hover}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background="transparent"}>
              {columns.map((col: any) => (
                <td key={col.key || col.label} style={{ padding:"13px 16px", fontSize:14, color: theme.text, whiteSpace: col.wrap ? "normal" : "nowrap" }}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────
export function Pagination({ total, perPage, setPerPage, page, setPage, theme }: any) {
  const pages = Math.ceil(total / perPage);
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 0", flexWrap:"wrap", gap:10 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
        <div style={{ fontSize:13, color: theme.textSub }}>Showing {total === 0 ? 0 : (page-1)*perPage+1}–{Math.min(page*perPage,total)} of {total}</div>
        {setPerPage && (
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:13, color:theme.textSub }}>Rows:</span>
            <select value={perPage} onChange={e => { setPerPage(+e.target.value); setPage(1); }} aria-label="Rows per page"
              style={{ height:32, padding:"0 8px", borderRadius:7, border:`1px solid ${theme.border}`, background:theme.inputBg, color:theme.text, fontSize:13, cursor:"pointer", outline:"none" }}>
              {[10,25,50].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        )}
      </div>
      {pages > 1 && (
        <div style={{ display:"flex", gap:5 }}>
          <button onClick={() => setPage((p: number) => Math.max(1,p-1))} disabled={page===1} style={{ height:34, padding:"0 12px", borderRadius:7, border:`1px solid ${theme.border}`, background: theme.card, cursor:"pointer", fontSize:13, color: page===1 ? theme.textSub : theme.text }}>← Prev</button>
          {Array.from({length:Math.min(pages,5)},(_,i) => {
            const p = pages <= 5 ? i+1 : Math.max(1, Math.min(page - 2 + i, pages));
            return <button key={p} onClick={() => setPage(p)} style={{ height:34, width:34, borderRadius:7, border:`1px solid ${p===page?C.primary:theme.border}`, background: p===page ? C.primary : theme.card, cursor:"pointer", fontSize:13, color: p===page ? "white" : theme.text, fontWeight: p===page ? 700 : 400 }}>{p}</button>;
          })}
          <button onClick={() => setPage((p: number) => Math.min(pages,p+1))} disabled={page===pages} style={{ height:34, padding:"0 12px", borderRadius:7, border:`1px solid ${theme.border}`, background: theme.card, cursor:"pointer", fontSize:13, color: page===pages ? theme.textSub : theme.text }}>Next →</button>
        </div>
      )}
    </div>
  );
}

// ── Toggle ────────────────────────────────────────────────────────────────────
export function Toggle({ on, onToggle, label, desc, theme }: any) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 0", gap:16 }}>
      <div>
        <div style={{ fontSize:14, color: theme.text, fontWeight:600 }}>{label}</div>
        {desc && <div style={{ fontSize:12, color: theme.textSub, marginTop:2 }}>{desc}</div>}
      </div>
      <div role="switch" aria-checked={on} aria-label={label} tabIndex={0}
        onClick={onToggle} onKeyDown={(e: React.KeyboardEvent) => (e.key===" "||e.key==="Enter") && onToggle()}
        style={{ width:46, height:26, borderRadius:99, background: on ? C.primary : C.n300, cursor:"pointer", position:"relative", transition:"background 0.2s", flexShrink:0, outline:"none" }}>
        <div style={{ position:"absolute", top:3, left: on ? 23 : 3, width:20, height:20, borderRadius:"50%", background:"white", boxShadow:"0 2px 6px rgba(0,0,0,0.25)", transition:"left 0.2s" }} />
      </div>
    </div>
  );
}

// ── Input ─────────────────────────────────────────────────────────────────────
export function Input({ label, id, error, helper, hint, icon, type="text", required=false, theme, ...rest }: any) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: DT.spacing.md }}>
      {label && <label htmlFor={id} style={{ fontSize:13, fontWeight:700, color:theme.textSub, display:"block", marginBottom:5 }}>{label}{required && <span style={{ color:C.error, marginLeft:3 }}> *</span>}</label>}
      <div style={{ position:"relative", display:"flex", alignItems:"center" }}>
        {icon && <span style={{ position:"absolute", left:12, fontSize:16, pointerEvents:"none", color:theme.textSub }}>{icon}</span>}
        <input id={id} type={type} aria-required={required} aria-invalid={!!error}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ width:"100%", boxSizing:"border-box", height:DT.size.input.md.h, paddingLeft:icon?40:DT.size.input.md.px, paddingRight:DT.size.input.md.px, border:`1.5px solid ${error?C.error:focused?C.primary:theme.border}`, borderRadius:DT.radius.input, fontSize:DT.size.input.md.fs, fontFamily:"'Plus Jakarta Sans',sans-serif", background:theme.inputBg, color:theme.text, outline:"none", transition:DT.animation.transition.fast, boxShadow:focused?`0 0 0 3px ${error?C.error:C.primary}20`:"none" }}
          {...rest} />
      </div>
      {error && <div role="alert" style={{ color:C.error, fontSize:12, marginTop:4, fontWeight:600 }}>⚠ {error}</div>}
      {(helper||hint) && !error && <div style={{ color:theme.textSub, fontSize:12, marginTop:4 }}>{helper||hint}</div>}
    </div>
  );
}

// ── Select ────────────────────────────────────────────────────────────────────
export function Select({ label, id, options, theme, error, required, hint, ...rest }: any) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: DT.spacing.md }}>
      {label && <label htmlFor={id} style={{ fontSize:13, fontWeight:700, color:theme.textSub, display:"block", marginBottom:5 }}>{label}{required && <span style={{ color:C.error, marginLeft:3 }}> *</span>}</label>}
      <select id={id} aria-invalid={!!error} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ width:"100%", height:DT.size.input.md.h, padding:`0 ${DT.size.input.md.px}px`, border:`1.5px solid ${error?C.error:focused?C.primary:theme.border}`, borderRadius:DT.radius.input, fontSize:DT.size.input.md.fs, fontFamily:"'Plus Jakarta Sans',sans-serif", background:theme.inputBg, color:theme.text, outline:"none", cursor:"pointer", transition:DT.animation.transition.fast, boxShadow:focused?`0 0 0 3px ${C.primary}20`:"none" }}
        {...rest}>
        {options.map((o: any) => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
      </select>
      {error && <div role="alert" style={{ color:C.error, fontSize:12, marginTop:4, fontWeight:600 }}>⚠ {error}</div>}
      {hint && !error && <div style={{ color:theme.textSub, fontSize:12, marginTop:4 }}>{hint}</div>}
    </div>
  );
}

// ── AlertBanner ───────────────────────────────────────────────────────────────
export function AlertBanner({ type="info", title, message, onClose, dismissible=true }: any) {
  const MAP: any = {
    success:{ bg:"#D1FAE5", border:C.success, text:"#065F46", icon:"✅" },
    warning:{ bg:"#FEF3C7", border:C.warning, text:"#92400E", icon:"⚠️" },
    error:  { bg:C.errorSoft, border:C.error, text:"#7F1D1D", icon:"❌" },
    info:   { bg:C.infoSoft, border:C.info,   text:"#1E40AF", icon:"ℹ️" },
  };
  const [vis, setVis] = useState(true);
  if (!vis) return null;
  const s = MAP[type]||MAP.info;
  return (
    <div role="alert" style={{ display:"flex", gap:12, padding:16, background:s.bg, border:`1px solid ${s.border}30`, borderRadius:DT.radius["2xl"], marginBottom:DT.spacing.base }}>
      <span style={{ fontSize:18 }}>{s.icon}</span>
      <div style={{ flex:1 }}>
        {title && <div style={{ fontSize:14, fontWeight:700, color:s.text, marginBottom:3 }}>{title}</div>}
        <div style={{ fontSize:13, color:s.text, lineHeight:1.55 }}>{message}</div>
      </div>
      {dismissible && <button onClick={() => { setVis(false); onClose?.(); }} style={{ background:"none", border:"none", fontSize:16, color:s.text, cursor:"pointer", opacity:0.6, padding:0, fontWeight:700 }}>✕</button>}
    </div>
  );
}

// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner({ size="md", color=C.primary }: { size?: "sm"|"md"|"lg"; color?: string }) {
  const sz = { sm:18, md:32, lg:48 }[size] || 32;
  return <div style={{ width:sz, height:sz, border:`3px solid ${color}22`, borderTop:`3px solid ${color}`, borderRadius:"50%", animation:"spin 0.8s linear infinite", display:"inline-block", flexShrink:0 }} />;
}

// ── AdminProgressBar ──────────────────────────────────────────────────────────
export function AdminProgressBar({ value, max=100, label, showPct=true, color=C.primary, height=8, theme }: any) {
  const pct = Math.min(Math.round(value/max*100), 100);
  return (
    <div style={{ marginBottom:DT.spacing.md }}>
      {(label||showPct) && (
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6, fontSize:13, fontWeight:600 }}>
          {label && <span style={{ color:theme?.text||C.n900 }}>{label}</span>}
          {showPct && <span style={{ color:theme?.textSub||C.n600 }}>{pct}%</span>}
        </div>
      )}
      <div style={{ width:"100%", height, background:theme?.border||C.n200, borderRadius:99, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct}%`, background:color, borderRadius:99, transition:"width 0.6s ease" }} />
      </div>
    </div>
  );
}

// ── CheckboxInput ─────────────────────────────────────────────────────────────
export function CheckboxInput({ label, checked, onChange, error, theme }: any) {
  return (
    <div style={{ marginBottom: DT.spacing.md }}>
      <label style={{ display:"flex", alignItems:"center", gap:DT.spacing.sm, cursor:"pointer", userSelect:"none" }}>
        <div onClick={onChange} role="checkbox" aria-checked={!!checked} tabIndex={0}
          onKeyDown={(e: React.KeyboardEvent) => (e.key===" "||e.key==="Enter") && onChange()}
          style={{ width:20, height:20, borderRadius:DT.radius.sm, border:`2px solid ${checked?C.primary:theme?.border||C.n200}`, background:checked?C.primary:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:DT.animation.transition.fast, cursor:"pointer" }}>
          {checked && <span style={{ color:"white", fontSize:12, fontWeight:900, lineHeight:1 }}>✓</span>}
        </div>
        <span style={{ fontSize:14, color:theme?.text||C.n900, fontWeight:500 }}>{label}</span>
      </label>
      {error && <div style={{ fontSize:12, color:C.error, marginTop:5, marginLeft:28 }}>⚠ {error}</div>}
    </div>
  );
}

// ── RadioGroup ────────────────────────────────────────────────────────────────
export function RadioGroup({ label, options, value, onChange, theme }: any) {
  return (
    <div style={{ marginBottom: DT.spacing.base }}>
      {label && <div style={{ fontSize:14, fontWeight:600, color:theme?.textSub||C.n600, marginBottom:DT.spacing.sm }}>{label}</div>}
      <div style={{ display:"flex", gap:DT.spacing.base, flexWrap:"wrap" }}>
        {options.map((opt: any) => (
          <label key={opt.value} style={{ display:"flex", alignItems:"center", gap:DT.spacing.sm, cursor:"pointer", userSelect:"none" }}>
            <div onClick={() => onChange(opt.value)} role="radio" aria-checked={value===opt.value} tabIndex={0}
              onKeyDown={(e: React.KeyboardEvent) => (e.key===" "||e.key==="Enter") && onChange(opt.value)}
              style={{ width:18, height:18, borderRadius:"50%", border:`2px solid ${value===opt.value?C.primary:theme?.border||C.n200}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:DT.animation.transition.fast, cursor:"pointer" }}>
              {value===opt.value && <div style={{ width:9, height:9, borderRadius:"50%", background:C.primary }} />}
            </div>
            <span style={{ fontSize:13, color:theme?.text||C.n900, fontWeight:500 }}>{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

// ── AdminTextarea ─────────────────────────────────────────────────────────────
export function AdminTextarea({ label, id, value, onChange, placeholder, error, hint, required, rows=4, theme }: any) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: DT.spacing.base }}>
      {label && (
        <label htmlFor={id} style={{ fontSize:13, fontWeight:700, color:theme?.textSub||C.n600, display:"block", marginBottom:6 }}>
          {label}{required && <span style={{ color:C.error, marginLeft:4 }}>*</span>}
        </label>
      )}
      <textarea id={id} value={value} onChange={onChange} placeholder={placeholder} rows={rows}
        aria-required={required} aria-invalid={!!error}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ width:"100%", boxSizing:"border-box", padding:"10px 12px", fontSize:14, border:`1.5px solid ${error?C.error:focused?C.primary:theme?.border||C.n200}`, borderRadius:DT.radius.input, background:theme?.inputBg||C.white, color:theme?.text||C.n900, fontFamily:"'Plus Jakarta Sans',sans-serif", outline:"none", resize:"vertical", transition:DT.animation.transition.fast, boxShadow:focused?`0 0 0 3px ${C.primary}20`:"none", lineHeight:1.6 }} />
      {error && <div style={{ fontSize:12, color:C.error, marginTop:5, fontWeight:600 }}>⚠ {error}</div>}
      {hint && !error && <div style={{ fontSize:12, color:theme?.textSub||C.n600, marginTop:5 }}>{hint}</div>}
    </div>
  );
}
