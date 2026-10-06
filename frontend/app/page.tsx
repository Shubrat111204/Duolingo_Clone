"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Shell from "@/components/Shell";
import { api } from "@/lib/api";
import { useUser } from "@/lib/useUser";

const OFFS = [0, -44, -64, -44, 0, 44, 64, 44];

export default function Home() {
  const { u, load } = useUser();
  const r = useRouter();
  const [path, setPath] = useState<any[]>([]);
  const [toast, setToast] = useState("");
  useEffect(() => { api.path().then(setPath).catch(() => {}); }, [u?.xp]);
  const open = (s: any) => {
    if (s.state === "locked") { setToast("Finish the previous skill to unlock this one"); setTimeout(() => setToast(""), 2200); return; }
    r.push(`/lesson/${s.next_lesson_id}`);
  };
  return (
    <Shell u={u} reload={load}>
      {path.map((un) => (
        <section key={un.id}>
          <div className="unit" style={{ background: un.color }}>
            <div><small>UNIT {un.position}</small><h2>{un.title}</h2><p>{un.description}</p></div>
          </div>
          <div className="trail">
            {un.skills.map((s: any, i: number) => {
              const pct = (s.done / s.total) * 100;
              return (
                <div key={s.id} className="nodewrap" style={{ transform: `translateX(${OFFS[i % 8]}px)` }}>
                  {s.current && <div className="start">START<i /></div>}
                  <div className="ring" style={{ background: s.state === "locked" ? "transparent" : `conic-gradient(var(--y) ${pct}%, var(--line) 0)` }}>
                    <button className={"node " + s.state} onClick={() => open(s)} aria-label={s.title}
                      style={s.state === "completed" ? { background: "var(--y)", boxShadow: "0 7px 0 #d9a800" } : s.state === "available" ? { background: un.color, boxShadow: "0 7px 0 rgba(0,0,0,.25)" } : {}}>
                      {s.state === "locked" ? "🔒" : s.state === "completed" ? "✓" : s.icon}
                    </button>
                  </div>
                  <div className="nodelabel">{s.title}</div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
      {toast && <div className="toast">{toast}</div>}
    </Shell>
  );
}
