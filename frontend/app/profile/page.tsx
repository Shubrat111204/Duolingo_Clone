"use client";
import { useEffect, useState } from "react";
import Shell from "@/components/Shell";
import Duo from "@/components/Duo";
import { api } from "@/lib/api";
import { useUser } from "@/lib/useUser";

export default function Profile() {
  const { u, load } = useUser();
  const [p, setP] = useState<any>(null);
  useEffect(() => { api.profile().then(setP).catch(() => {}); }, [u?.xp]);
  if (!p) return <Shell u={u} reload={load}><p className="muted">Loading…</p></Shell>;
  const max = Math.max(10, ...p.week.map((d: any) => d.xp));
  return (
    <Shell u={u} reload={load}>
      <div className="center"><Duo size={100} /><h1>{p.user.name}</h1><p className="muted">Learning Spanish 🇪🇸</p></div>
      <div className="stats">
        {[["🔥", p.user.streak, "Day streak"], ["⚡", p.user.xp, "Total XP"], ["📘", p.lessons, "Lessons done"], ["🎯", `${p.user.today_xp}/${p.user.daily_goal}`, "Daily goal"]].map(([i, v, l]: any) => (
          <div key={l} className="stat"><span>{i}</span><div><b>{v}</b><small>{l}</small></div></div>
        ))}
      </div>
      <h3>This week</h3>
      <div className="week">{p.week.map((d: any, i: number) => (
        <div key={i}><div className="col"><i style={{ height: (d.xp / max) * 100 + "%" }} /></div><small>{d.day}</small></div>
      ))}</div>
      <h3>Achievements</h3>
      <div className="ach">{p.achievements.map((a: any) => (
        <div key={a.title} className={"badge" + (a.unlocked ? "" : " off")}><span>{a.icon}</span><b>{a.title}</b><small>{a.desc}</small></div>
      ))}</div>
    </Shell>
  );
}
