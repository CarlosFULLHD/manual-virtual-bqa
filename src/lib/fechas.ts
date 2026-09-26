export function fechaCorta(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("es-BO", { day: "numeric", month: "short" });
}

export function fechaLarga(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("es-BO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export const numero2 = (n: number) => String(n).padStart(2, "0");
