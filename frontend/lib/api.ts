const B = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
async function j(p: string, method = "GET", body?: any): Promise<any> {
  const r = await fetch(B + p, { method, cache: "no-store", headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
export const api = {
  me: () => j("/api/me"), path: () => j("/api/path"), lesson: (id: any) => j(`/api/lessons/${id}`),
  check: (id: number, answer: string) => j(`/api/exercises/${id}/check`, "POST", { answer }),
  lose: () => j("/api/hearts/lose", "POST"), refill: () => j("/api/hearts/refill", "POST"),
  complete: (id: any, mistakes: number) => j(`/api/lessons/${id}/complete`, "POST", { mistakes }),
  nextDay: () => j("/api/debug/next-day", "POST"), board: () => j("/api/leaderboard"), profile: () => j("/api/profile"),
};
