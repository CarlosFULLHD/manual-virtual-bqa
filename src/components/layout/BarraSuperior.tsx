"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icono } from "@/components/ui/Icono";
import { Logo } from "./Logo";

const ENLACES = [
  { href: "/", nombre: "Prácticas", icono: "matraz" },
  { href: "/herramientas", nombre: "Herramientas", icono: "herramientas" },
  { href: "/glosario", nombre: "Glosario", icono: "libro" },
];

function activo(pathname: string, href: string) {
  if (href === "/") return pathname === "/" || pathname.startsWith("/practicas");
  return pathname.startsWith(href);
}

export function BarraSuperior() {
  const pathname = usePathname();
  return (
    <>
      <header className="topbar">
        <Link href="/" className="brand">
          <span className="brand-logo">
            <Logo />
          </span>
          <span>
            <b>Lab BQA</b>
            <span>Bioquímica Aplicada · UMSA</span>
          </span>
        </Link>
        <nav className="nav-principal" aria-label="Principal">
          {ENLACES.map((e) => (
            <Link key={e.href} href={e.href} aria-current={activo(pathname, e.href) ? "page" : undefined}>
              <Icono nombre={e.icono} tam={18} />
              {e.nombre}
            </Link>
          ))}
        </nav>
      </header>
      <nav className="nav-inferior" aria-label="Principal (móvil)">
        {ENLACES.map((e) => (
          <Link key={e.href} href={e.href} aria-current={activo(pathname, e.href) ? "page" : undefined}>
            <Icono nombre={e.icono} tam={22} />
            <span>{e.nombre}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
