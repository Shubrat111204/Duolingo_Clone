"use client";
import { useEffect, useState } from "react";
import Shell from "@/components/Shell";
import Duo from "@/components/Duo";
import { useUser } from "@/lib/useUser";
import { setSound, soundOn, speak } from "@/lib/sound";

export default function Settings() {
  const { u, load } = useUser();
  const [on, setOn] = useState(true);
  useEffect(() => { setOn(soundOn()); }, []);
  const toggle = () => { setSound(!on); setOn(!on); if (!on) speak("¡Hola! El sonido está activado"); };
  return (
    <Shell u={u} reload={load}>
      <div className="center"><Duo size={100} /><h1>Settings</h1><p className="muted">Sound and voice work now. The rest is coming soon.</p></div>
      <div className="list">
        <div className="row"><b className="grow">Sound effects & voice</b><button className={"switch" + (on ? " on" : "")} onClick={toggle} aria-label="Toggle sound"><i /></button></div>
        {["Daily reminders", "Super Duolingo", "Friends"].map((s) => (
          <div key={s} className="row"><b className="grow">{s}</b><span className="muted">Coming soon</span></div>
        ))}
      </div>
    </Shell>
  );
}
