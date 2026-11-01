// Títulos que podem vir no início do nome cadastrado ("Dr. Carlos Mendes", "Profa. Ana").
const TITLE_PATTERN = /^(dr|dra|prof|profa|profª|me|ma|sr|sra|srta)\.?$/i;

// Partes do nome sem os títulos do início.
function nameParts(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  while (parts.length > 1 && TITLE_PATTERN.test(parts[0])) parts.shift();
  return parts;
}

// Primeiro nome, sem título ("Dr. Carlos Mendes" → "Carlos").
export function firstName(name: string) {
  return nameParts(name)[0] ?? "";
}

// Iniciais do primeiro e do último nome, sem título ("Ana Beatriz Silva" → "AS").
export function initials(name: string) {
  const parts = nameParts(name);
  if (parts.length === 0) return "?";
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}
