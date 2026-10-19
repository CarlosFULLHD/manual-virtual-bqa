import { Icono } from "./Icono";

export function Vacio({ mensaje = "Esta sección se está preparando." }: { mensaje?: string }) {
  return (
    <div className="vacio">
      <Icono nombre="matraz" tam={34} />
      <p style={{ marginTop: 8, fontWeight: 600 }}>{mensaje}</p>
      <p className="pequeno" style={{ marginTop: 4 }}>
        Tu docente la publicará antes de la fecha de la práctica.
      </p>
    </div>
  );
}
