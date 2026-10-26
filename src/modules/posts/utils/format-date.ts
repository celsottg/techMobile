const dateFormatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" });

export function formatDate(iso: string) {
  return dateFormatter.format(new Date(iso));
}
