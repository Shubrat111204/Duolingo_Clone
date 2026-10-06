"use client";
import { useEffect, useState } from "react";
import Shell from "@/components/Shell";
import Duo from "@/components/Duo";
import { api } from "@/lib/api";
import { useUser } from "@/lib/useUser";

export default function Board() {
  const { u, load } = useUser();
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { api.board().then(setRows).catch(() => {}); }, [u?.xp]);
  const medal = ["🥇", "🥈", "🥉"];
  return (
    <Shell u={u} reload={load}>
      <div className="center"><Duo size={90} /><h1>Emerald League</h1><p className="muted">Top 3 advance to the next league</p></div>
      <div className="list">
        {rows.map((r) => (
          <div key={r.rank} className={"row" + (r.me ? " me" : "")}>
            <b className="rank">{medal[r.rank - 1] || r.rank}</b>
            <span className="avatar">{r.name[0]}</span>
            <b className="grow">{r.name}{r.me ? " (you)" : ""}</b>
            <span>{r.xp} XP</span>
          </div>
        ))}
      </div>
    </Shell>
  );
}
