"use client";
import Shell from "@/components/Shell";
import Duo from "@/components/Duo";
import { useUser } from "@/lib/useUser";

export default function Settings() {
  const { u, load } = useUser();
  return (
    <Shell u={u} reload={load}>
      <div className="center"><Duo size={100} /><h1>Settings</h1><p className="muted">Sound effects, notifications, Super and friends are coming soon.</p></div>
      <div className="list">{["Sound effects", "Daily reminders", "Super Duolingo", "Friends"].map((s) => (
        <div key={s} className="row"><b className="grow">{s}</b><span className="muted">Coming soon</span></div>
      ))}</div>
    </Shell>
  );
}
