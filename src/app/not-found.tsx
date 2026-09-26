import Link from "next/link";

export default function NoEncontrado() {
  return (
    <div className="vacio" style={{ marginTop: 40 }}>
      <h2>No encontramos esa página</h2>
      <p className="muted" style={{ margin: "8px 0 16px" }}>
        Puede que la práctica haya cambiado de nombre o todavía no exista.
      </p>
      <Link href="/" className="btn primary">
        Ver todas las prácticas
      </Link>
    </div>
  );
}
