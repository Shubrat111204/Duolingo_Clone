import "./globals.css";
import { Nunito } from "next/font/google";
const nunito = Nunito({ subsets: ["latin"], weight: ["400", "700", "800", "900"] });
export const metadata = { title: "Duolingo Clone", description: "Learn Spanish the fun way" };
export default function Root({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className={nunito.className}>{children}</body></html>;
}
