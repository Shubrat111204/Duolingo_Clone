"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { api } from "@/lib/api";
import Duo from "./Duo";

const NAV = [["/", "Learn", "🏠"], ["/leaderboard", "Leaderboards", "🏆"], ["/profile", "Profile", "👤"], ["/settings", "Settings", "⚙️"]];

export default function Shell({ u, reload, children }: { u: any; reload: () => void; children: React.ReactNode }) {
  const p = usePathname();
  const pct = u ? Math.min(100, Math.round((u.today_xp / u.daily_goal) * 100)) : 0;
  return (
    <div className="shell">
      <aside className="side">
        <div className="logo">duolingo</div>
        {NAV.map(([h, l, i]) => (
          <Link key={h} href={h} className={"nav" + (p === h ? " on" : "")}><span>{i}</span><b>{l}</b></Link>
        ))}
      </aside>
      <main className="main">
        {u && (
          <div className="top">
            <span className="lang">🇪🇸</span>
            <span className="st" style={{ color: "var(--o)" }}>🔥 {u.streak}</span>
            <span className="st" style={{ color: "var(--b)" }}>💎 {u.gems}</span>
            <span className="st" style={{ color: "var(--r)" }} title={u.hearts < 5 ? `Next heart in ${Math.ceil(u.next_heart_in / 60)} min` : "Full hearts"}>❤️ {u.hearts}</span>
            <span className="st" style={{ color: "var(--y)" }}>⚡ {u.xp}</span>
          </div>
        )}
        {children}
      </main>
      <aside className="right">
        {u && (
          <>
            <div className="card">
              <h3>Daily goal</h3>
              <div className="goal"><div className="goalbar"><i style={{ width: pct + "%" }} /></div><b>{u.today_xp}/{u.daily_goal} XP</b></div>
              <p className="muted">{pct >= 100 ? "Goal crushed! 🎉" : "Earn XP to hit today's goal."}</p>
            </div>
            <div className="card dev">
              <Duo size={64} />
              <h3>Reviewer tools</h3>
              <button className="btn ghost sm" onClick={async () => { await api.nextDay(); reload(); }}>⏭ Simulate next day</button>
              <button className="btn blue sm" onClick={async () => { try { await api.refill(); } catch {} reload(); }}>❤️ Refill hearts · 350 💎</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
