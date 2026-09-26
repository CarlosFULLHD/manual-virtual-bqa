import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import { BarraSuperior } from "@/components/layout/BarraSuperior";
import { ProgresoProvider } from "@/context/ProgresoContext";
import "./globals.css";

const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Manual Virtual · Bioquímica Aplicada",
    template: "%s · Manual Virtual BQA",
  },
  description: "Manual virtual e interactivo de prácticas de laboratorio de Bioquímica Aplicada, UMSA.",
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4F6F7" },
    { media: "(prefers-color-scheme: dark)", color: "#0F161A" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <ProgresoProvider>
          <div className="wrap">
            <BarraSuperior />
            <main>{children}</main>
          </div>
        </ProgresoProvider>
      </body>
    </html>
  );
}
