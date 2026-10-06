"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Duo from "@/components/Duo";
import { speak, playCorrect, playWrong, playDone, soundOn } from "@/lib/sound";

function WordBank({ bank, setAns }: { bank: string[]; setAns: (a: string) => void }) {
  const [picked, setPicked] = useState<number[]>([]);
  const update = (p: number[]) => { setPicked(p); setAns(p.map((i) => bank[i]).join(" ")); };
  return (
    <>
      <div className="answerline">{picked.map((i) => <button key={i} className="chip" onClick={() => update(picked.filter((x) => x !== i))}>{bank[i]}</button>)}</div>
      <div className="bank">{bank.map((w, i) => picked.includes(i)
        ? <span key={i} className="chip ghost">{w}</span>
        : <button key={i} className="chip" onClick={() => update([...picked, i])}>{w}</button>)}</div>
    </>
  );
}

function Mic({ onResult }: { onResult: (t: string) => void }) {
  const [on, setOn] = useState(false);
  const SR = typeof window !== "undefined" ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition : null;
  if (!SR) return null;
  const go = () => { const r = new SR(); r.lang = "es-ES"; r.onstart = () => setOn(true); r.onend = () => setOn(false); r.onresult = (e: any) => onResult(e.results[0][0].transcript); r.start(); };
  return <button className={"mic" + (on ? " live" : "")} onClick={go}>🎤 {on ? "Listening…" : "Speak your answer"}</button>;
}

function Match({ pairs, onWrong, onDone }: { pairs: string[][]; onWrong: () => void; onDone: () => void }) {
  const [left] = useState(() => pairs.map((p) => p[0]).sort(() => Math.random() - 0.5));
  const [right] = useState(() => pairs.map((p) => p[1]).sort(() => Math.random() - 0.5));
  const [sl, setSl] = useState<string | null>(null);
  const [sr, setSr] = useState<string | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [bad, setBad] = useState(false);
  const pick = (side: "l" | "r", v: string) => {
    const l = side === "l" ? v : sl, r = side === "r" ? v : sr;
    if (side === "l") setSl(v); else setSr(v);
    if (l && r) {
      if (pairs.some((p) => p[0] === l && p[1] === r)) {
        const d = [...done, l]; setDone(d); if (d.length === pairs.length) onDone();
      } else { onWrong(); setBad(true); setTimeout(() => setBad(false), 450); }
      setSl(null); setSr(null);
    }
  };
  const cls = (v: string, sel: string | null, key: string) => "opt" + (sel === v ? " sel" : "") + (done.includes(key) ? " gone" : "") + (bad && sel === v ? " shake" : "");
  return (
    <div className="match">
      <div>{left.map((v) => <button key={v} className={cls(v, sl, v)} onClick={() => pick("l", v)}>{v}</button>)}</div>
      <div>{right.map((v) => { const key = pairs.find((p) => p[1] === v)![0]; return <button key={v} className={cls(v, sr, key)} onClick={() => pick("r", v)}>{v}</button>; })}</div>
    </div>
  );
}

export default function Lesson() {
  const { id } = useParams<{ id: string }>();
  const r = useRouter();
  const [q, setQ] = useState<any[]>([]);
  const [total, setTotal] = useState(1);
  const [done, setDone] = useState(0);
  const [ans, setAns] = useState("");
  const [st, setSt] = useState<"idle" | "ok" | "bad">("idle");
  const [sol, setSol] = useState("");
  const [mist, setMist] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [res, setRes] = useState<any>(null);
  const [key, setKey] = useState(0);
  const [spoken, setSpoken] = useState("");

  useEffect(() => {
    api.lesson(id).then((l) => { setQ(l.exercises); setTotal(l.exercises.length); });
    api.me().then((u) => setHearts(u.hearts));
  }, [id]);

  const ex = q[0];
  const lose = async () => { const u = await api.lose(); setHearts(u.hearts); setMist((m) => m + 1); };
  const check = async () => {
    if (!ans || st !== "idle") return;
    const c = await api.check(ex.id, ans);
    setSol(c.solution);
    const sp = ex.type === "choice" ? (ex.prompt.match(/"(.+)"/) || [])[1] : ex.type === "match" ? "" : c.solution;
    setSpoken(sp || "");
    if (c.correct) { setSt("ok"); playCorrect(); } else { setSt("bad"); playWrong(); await lose(); }
    if (sp && soundOn()) setTimeout(() => speak(sp), 400);
  };
  const next = async () => {
    if (st === "bad") { if (hearts <= 0) return; setQ((x) => [...x.slice(1), x[0]]); }
    else {
      const rest = q.slice(1); setDone((d) => d + 1);
      if (!rest.length) { playDone(); setRes(await api.complete(id, mist)); return; }
      setQ(rest);
    }
    setSt("idle"); setAns(""); setKey((k) => k + 1);
  };

  if (!ex && !res) return <div className="lesson"><p className="muted center">Loading…</p></div>;

  if (res) return (
    <div className="lesson finish">
      {Array.from({ length: 40 }).map((_, i) => <i key={i} className="confetti" style={{ left: `${(i * 53) % 100}%`, background: ["#ffc800", "#58cc02", "#1cb0f6", "#ff4b4b", "#ce82ff"][i % 5], animationDelay: `${(i % 10) * 0.12}s` }} />)}
      <Duo size={160} /><h1>Lesson complete!</h1>
      <div className="results">
        <div className="rbox" style={{ borderColor: "var(--y)", color: "var(--y)" }}><small>TOTAL XP</small><b>⚡ {res.xp}</b></div>
        <div className="rbox" style={{ borderColor: "var(--g)", color: "var(--g)" }}><small>ACCURACY</small><b>🎯 {Math.round((total / (total + mist)) * 100)}%</b></div>
      </div>
      <div className="foot"><button className="btn green" onClick={() => r.push("/")}>Continue</button></div>
    </div>
  );

  return (
    <div className="lesson">
      <header>
        <button className="x" onClick={() => r.push("/")} aria-label="Quit">✕</button>
        <div className="pbar"><i style={{ width: (done / total) * 100 + "%" }} /></div>
        <b style={{ color: "var(--r)" }}>❤️ {hearts}</b>
      </header>
      <div className="body" key={key}>
        <h2>{ex.type === "choice" ? "Select the correct meaning" : ex.type === "wordbank" ? "Write this in Spanish" : ex.type === "fill" ? "Fill in the blank" : ex.type === "type" ? "Write this in Spanish" : "Tap the matching pairs"}</h2>
        {ex.type !== "match" && (
          <div className="prompt"><Duo size={72} /><div className="bubble">{ex.type === "choice" && <button className="spk" onClick={() => speak((ex.prompt.match(/"(.+)"/) || [])[1])} aria-label="Listen">🔊</button>}{ex.prompt}{ex.data.hint && ex.type === "fill" && <small>{ex.data.hint}</small>}</div></div>
        )}
        {(ex.type === "choice" || ex.type === "fill") && (
          <div className="opts">{ex.data.options.map((o: string) => (
            <button key={o} disabled={st !== "idle"} className={"opt" + (ans === o ? " sel" : "")} onClick={() => setAns(o)}>{o}</button>
          ))}</div>
        )}
        {ex.type === "wordbank" && <WordBank bank={ex.data.bank} setAns={setAns} />}
        {ex.type === "type" && <input className="input" autoFocus placeholder="Type in Spanish" value={ans} disabled={st !== "idle"} onChange={(e) => setAns(e.target.value)} onKeyDown={(e) => e.key === "Enter" && check()} />}
        {ex.type === "type" && st === "idle" && <Mic onResult={setAns} />}
        {ex.type === "match" && <Match pairs={ex.data.pairs} onWrong={lose} onDone={() => setAns("match")} />}
      </div>
      <footer className={"fb " + st}>
        {st === "idle" ? (
          <button className={"btn " + (ans ? "green" : "off")} disabled={!ans} onClick={check}>Check</button>
        ) : (
          <>
            <div className="msg">
              <span className="ico">{st === "ok" ? "✓" : "✕"}</span>
              {spoken && <button className="spk" onClick={() => speak(spoken)} aria-label="Listen">🔊</button>}
              <div><b>{st === "ok" ? "Nicely done!" : "Wrong!"}</b>{st === "bad" && <p>Correct answer: {sol}</p>}</div>
            </div>
            <button className={"btn " + (st === "ok" ? "green" : "red")} onClick={next}>Continue</button>
          </>
        )}
      </footer>
      {hearts <= 0 && (
        <div className="modal"><div className="mbox">
          <Duo size={110} /><h2>You ran out of hearts</h2><p className="muted">Refill to keep learning, or come back when hearts regenerate (1 every 5 min).</p>
          <button className="btn blue" onClick={async () => { try { const u = await api.refill(); setHearts(u.hearts); } catch {} }}>Refill hearts · 350 💎</button>
          <button className="btn ghost" onClick={() => r.push("/")}>No thanks</button>
        </div></div>
      )}
    </div>
  );
}
