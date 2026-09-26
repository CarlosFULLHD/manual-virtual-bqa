export function Vacio({ mensaje = "Esta sección todavía no tiene contenido." }: { mensaje?: string }) {
  return (
    <div className="vacio">
      <p>{mensaje}</p>
      <p className="muted" style={{ fontSize: 13, marginTop: 4 }}>
        Se completa editando el archivo de la práctica en <code>src/data/practicas/</code>.
      </p>
    </div>
  );
}
