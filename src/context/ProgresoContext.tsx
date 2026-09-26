"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * Estado del estudiante: rol elegido y avance de cada práctica.
 * En el piloto se guarda en el navegador (localStorage).
 * Para la versión con seguimiento docente, reemplazar load/save por una API + base de datos.
 */

export type Rol = "estudiante" | "docente";

export interface ProgresoPractica {
  pasosHechos: number[];
  datos: Record<string, string>;
  checks: Record<string, boolean>;
  conclusion: string;
}

const VACIO: ProgresoPractica = { pasosHechos: [], datos: {}, checks: {}, conclusion: "" };
const KEY = "bqa-progreso-v1";
const KEY_ROL = "bqa-rol";

interface Ctx {
  listo: boolean;
  rol: Rol;
  setRol: (r: Rol) => void;
  obtener: (id: string) => ProgresoPractica;
  actualizar: (id: string, cambio: (p: ProgresoPractica) => ProgresoPractica) => void;
  reiniciar: (id: string) => void;
}

const ProgresoContext = createContext<Ctx | null>(null);

function leer<T>(key: string, def: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : def;
  } catch {
    return def;
  }
}
function escribir(key: string, v: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {
    /* almacenamiento no disponible: se sigue trabajando en memoria */
  }
}

export function ProgresoProvider({ children }: { children: ReactNode }) {
  const [listo, setListo] = useState(false);
  const [rol, setRolState] = useState<Rol>("estudiante");
  const [progreso, setProgreso] = useState<Record<string, ProgresoPractica>>({});

  useEffect(() => {
    setRolState(leer<Rol>(KEY_ROL, "estudiante"));
    setProgreso(leer<Record<string, ProgresoPractica>>(KEY, {}));
    setListo(true);
  }, []);

  useEffect(() => {
    if (listo) escribir(KEY, progreso);
  }, [progreso, listo]);

  const setRol = useCallback((r: Rol) => {
    setRolState(r);
    escribir(KEY_ROL, r);
  }, []);

  const obtener = useCallback((id: string) => ({ ...VACIO, ...progreso[id] }), [progreso]);

  const actualizar = useCallback((id: string, cambio: (p: ProgresoPractica) => ProgresoPractica) => {
    setProgreso((prev) => ({ ...prev, [id]: cambio({ ...VACIO, ...prev[id] }) }));
  }, []);

  const reiniciar = useCallback((id: string) => {
    setProgreso((prev) => {
      const copia = { ...prev };
      delete copia[id];
      return copia;
    });
  }, []);

  return (
    <ProgresoContext.Provider value={{ listo, rol, setRol, obtener, actualizar, reiniciar }}>
      {children}
    </ProgresoContext.Provider>
  );
}

export function useProgreso() {
  const ctx = useContext(ProgresoContext);
  if (!ctx) throw new Error("useProgreso debe usarse dentro de <ProgresoProvider>");
  return ctx;
}

/** Atajo para una práctica concreta */
export function usePractica(id: string) {
  const { obtener, actualizar, reiniciar, listo } = useProgreso();
  return {
    listo,
    progreso: obtener(id),
    actualizar: (cambio: (p: ProgresoPractica) => ProgresoPractica) => actualizar(id, cambio),
    reiniciar: () => reiniciar(id),
  };
}
