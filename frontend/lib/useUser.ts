"use client";
import { useCallback, useEffect, useState } from "react";
import { api } from "./api";
export function useUser() {
  const [u, setU] = useState<any>(null);
  const load = useCallback(() => api.me().then(setU).catch(() => {}), []);
  useEffect(() => { load(); }, [load]);
  return { u, setU, load };
}
