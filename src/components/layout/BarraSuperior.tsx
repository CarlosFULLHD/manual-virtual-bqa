"use client";

import Link from "next/link";
import { useProgreso, type Rol } from "@/context/ProgresoContext";
import { Logo } from "./Logo";

export function BarraSuperior() {
  const { rol, setRol } = useProgreso();
  const roles: Rol[] = ["estudiante", "docente"];
  return (
    <header className="topbar">
      <Link href="/" className="brand">
        <Logo />
        <span>
          <b>Manual Virtual · Bioquímica Aplicada</b>
          <span>UMSA · Laboratorio · Piloto</span>
        </span>
      </Link>
      <div className="row">
        {rol === "docente" && (
          <Link href="/docente" className="btn small">
            Panel docente
          </Link>
        )}
        <div className="seg" role="group" aria-label="Rol">
          {roles.map((r) => (
            <button key={r} aria-pressed={rol === r} onClick={() => setRol(r)}>
              {r === "estudiante" ? "Estudiante" : "Docente"}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
