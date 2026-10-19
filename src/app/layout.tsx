import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import { BarraSuperior } from "@/components/layout/BarraSuperior";
import { Pie } from "@/components/layout/Pie";
import { ProgresoProvider } from "@/context/ProgresoContext";
import "./globals.css";

const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Lab BQA · Manual virtual de Bioquímica Aplicada",
    template: "%s · Lab BQA",
  },
  description: "Manual virtual e interactivo de prácticas de laboratorio de Bioquímica Aplicada, UMSA.",
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#F4F6F7",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${sans.variable} ${mono.variable} ${display.variable}`}>
      <body>
        <ProgresoProvider>
          <div className="wrap">
            <BarraSuperior />
            <main>{children}</main>
            <Pie />
          </div>
        </ProgresoProvider>
      </body>
    </html>
  );
}
