import Link from "next/link";

export function Pie() {
  return (
    <footer className="pie">
      <span>Manual virtual de prácticas · Cátedra de Bioquímica Aplicada · UMSA</span>
      <Link href="/docente">Panel docente</Link>
    </footer>
  );
}
