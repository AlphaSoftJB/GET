import React, { useState, useEffect, useRef, useCallback } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { C, DT } from "../tokens";
import { AnimatedCounter, FadeIn, Badge, Btn, StatCard, ChartCard, Breadcrumb, PageHeader, Modal, AllergenPieChart, DataTable, Pagination, Toggle, Input, Select, AlertBanner, Spinner, AdminProgressBar, AdminTooltip, CheckboxInput, RadioGroup, AdminTextarea } from "../components/Shared";
import { exportToCSV } from "../utils";
import { userGrowthData, topProducts, allergenData, expirationTimeline, categoryData, alertsData, USERS, REPORTS, LIVE_EVENTS } from "../data";
import { useLiveFeed } from "../hooks";

export default function UsersScreen({ theme, toast, reduced }) {
  const [roleFilter,   setRoleFilter]   = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search,       setSearch]       = useState("");
  const [sortCol,      setSortCol]      = useState("name");
  const [sortDir,      setSortDir]      = useState("asc");
  const [editUser,     setEditUser]     = useState(null);
  const [page,         setPage]         = useState(1);
  const [perPage,      setPerPage]      = useState(10);

  const filtered = USERS
    .filter(u => roleFilter   === "All" || u.role   === roleFilter)
    .filter(u => statusFilter === "All" || u.status === statusFilter)
    .filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => { const v = a[sortCol] < b[sortCol] ? -1 : 1; return sortDir==="asc" ? v : -v; });

  const paginated  = filtered.slice((page-1)*perPage, page*perPage);
  const toggleSort = (col) => { if (sortCol===col) setSortDir(d => d==="asc"?"desc":"asc"); else { setSortCol(col); setSortDir("asc"); } };
  const statusColor = s => s==="Active" ? C.success : s==="Inactive" ? C.n400 : C.error;
  const statusBg    = s => s==="Active" ? C.successSoft : s==="Inactive" ? C.n100 : C.errorSoft;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <Breadcrumb items={["Admin","Users"]} theme={theme} />
      <PageHeader icon="👥" title="User Management" subtitle={`${USERS.length} total users in the system`} theme={theme}
        action={<Btn variant="primary" size="md" onClick={() => toast("+ Add User modal","info")}>+ Add User</Btn>} />

      {/* Filter bar — spec: WEB_ADMIN Screen 2 */}
      <FadeIn delay={0} reduced={reduced}>
        <div style={{ background: theme.card, border:`1.5px solid ${theme.border}`, borderRadius:10, padding:"14px 16px", display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
          <div style={{ position:"relative", flex:"1 1 200px" }}>
            <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:15 }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…" aria-label="Search users"
              style={{ width:"100%", height:38, padding:"0 12px 0 32px", border:`1.5px solid ${theme.border}`, borderRadius:8, fontSize:14, fontFamily:"'Plus Jakarta Sans',sans-serif", background: theme.inputBg, color: theme.text, outline:"none" }} />
          </div>
          <Select id="role-filter"   options={["All Roles","Admin","User"]}              theme={theme} value={roleFilter}   onChange={e => setRoleFilter(e.target.value)}   style={{ width:130 }} />
          <Select id="status-filter" options={["All Statuses","Active","Inactive","Suspended"]} theme={theme} value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width:150 }} />
          <Btn variant="secondary" size="sm" onClick={() => {
            exportToCSV(filtered, [
              {key:"name",label:"Name"},{key:"email",label:"Email"},
              {key:"role",label:"Role"},{key:"status",label:"Status"},
              {key:"lastLogin",label:"Last Login"},{key:"scans",label:"Scans"},
              {key:"joined",label:"Joined"},
            ], "users");
            toast("Users CSV downloaded!","success");
          }}>⬇ Export CSV</Btn>
        </div>
      </FadeIn>

      {/* Table */}
      <FadeIn delay={100} reduced={reduced}>
        <div style={{ background: theme.card, border:`1.5px solid ${theme.border}`, borderRadius:12, overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ overflowX:"auto" }}>
            <table role="grid" style={{ width:"100%", borderCollapse:"collapse", minWidth:560 }}>
              <thead>
                <tr style={{ background: theme.hover }}>
                  <th style={{ padding:"12px 16px", width:52 }}></th>
                  {[["name","Name"],["email","Email"],["role","Role"],["status","Status"],["lastLogin","Last Login"],["scans","Scans"]].map(([col,label]) => (
                    <th key={col} scope="col" onClick={() => toggleSort(col)}
                      style={{ padding:"12px 16px", textAlign:"left", fontSize:12, fontWeight:700, color: theme.textSub, borderBottom:`1.5px solid ${theme.border}`, cursor:"pointer", userSelect:"none", whiteSpace:"nowrap" }}>
                      {label} {sortCol===col && (sortDir==="asc"?"↑":"↓")}
                    </th>
                  ))}
                  <th style={{ padding:"12px 16px", textAlign:"right", fontSize:12, fontWeight:700, color: theme.textSub, borderBottom:`1.5px solid ${theme.border}` }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((u,i) => (
                  <tr key={u.id} style={{ borderTop:`1px solid ${theme.border}`, transition:"background 0.12s" }}
                    onMouseEnter={e => e.currentTarget.style.background=theme.hover}
                    onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                    <td style={{ padding:"13px 16px" }}>
                      <div style={{ width:36, height:36, borderRadius:"50%", background: C.primarySoft, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{u.avatar}</div>
                    </td>
                    <td style={{ padding:"13px 16px", fontSize:14, fontWeight:700, color: theme.text }}>{u.name}</td>
                    <td style={{ padding:"13px 16px", fontSize:13, color: theme.textSub }}>{u.email}</td>
                    <td style={{ padding:"13px 16px" }}><Badge color={u.role==="Admin"?C.primary:C.n600} bg={u.role==="Admin"?C.primarySoft:C.n100}>{u.role}</Badge></td>
                    <td style={{ padding:"13px 16px" }}><Badge color={statusColor(u.status)} bg={statusBg(u.status)}>{u.status}</Badge></td>
                    <td style={{ padding:"13px 16px", fontSize:13, color: theme.textSub }}>{u.lastLogin}</td>
                    <td style={{ padding:"13px 16px", fontSize:14, fontWeight:600, color: theme.text }}>{u.scans}</td>
                    <td style={{ padding:"13px 16px", textAlign:"right" }}>
                      <div style={{ display:"flex", gap:6, justifyContent:"flex-end" }}>
                        <button onClick={() => setEditUser(u)} aria-label={`Edit ${u.name}`}
                          style={{ width:34, height:34, borderRadius:7, background: theme.hover, border:`1px solid ${theme.border}`, cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.15s" }}>✏️</button>
                        <button onClick={() => toast(`${u.name} deleted`,"warning")} aria-label={`Delete ${u.name}`}
                          style={{ width:34, height:34, borderRadius:7, background: C.errorSoft, border:"none", cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.15s" }}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding:"10px 16px", borderTop:`1px solid ${theme.border}` }}>
            <Pagination total={filtered.length} perPage={perPage} setPerPage={setPerPage} page={page} setPage={setPage} theme={theme} />
          </div>
        </div>
      </FadeIn>

      {/* Edit Modal */}
      <Modal open={!!editUser} onClose={() => setEditUser(null)} title={`Edit User — ${editUser?.name}`} theme={theme} reduced={reduced}>
        {editUser && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <Input label="Full Name" id="u-name"   defaultValue={editUser.name}   theme={theme} />
            <Input label="Email"     id="u-email"  defaultValue={editUser.email}  type="email" theme={theme} />
            <Select label="Role"   id="u-role"   options={["User","Admin"]}                     theme={theme} defaultValue={editUser.role} />
            <Select label="Status" id="u-status" options={["Active","Inactive","Suspended"]}    theme={theme} defaultValue={editUser.status} />
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:6 }}>
              <Btn variant="secondary" size="md" onClick={() => setEditUser(null)}>Cancel</Btn>
              <Btn variant="primary"   size="md" onClick={() => { setEditUser(null); toast(`${editUser.name} updated!`); }}>Save Changes</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ANALYTICS SCREEN
// ══════════════════════════════════════════════════════════════════════════════
