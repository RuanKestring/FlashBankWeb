// Funções de formatação e o aviso temporário (toast).
// Formata número como moeda brasileira (R$ 1.234,56)
export const brl = (v) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
// Remove tudo que não é número
export const digits = (s) => String(s).replace(/\D/g, "");
// Oculta partes do CPF: ***.456.789-**
export const maskCpf = (c) => `***.${c.slice(3, 6)}.${c.slice(6, 9)}-**`;
// Máscara de digitação 000.000.000-00
export const formatCpf = (s) => digits(s).slice(0, 11)
  .replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
// Mostra uma mensagem por 2,5s (role=status no CSS/leitores)
export function toast(msg) {
  const el = Object.assign(document.createElement("div"), { className: "toast", textContent: msg });
  document.body.append(el);
  setTimeout(() => el.remove(), 2500);
}
// ma•••@email.com
export const maskEmail = (e) => e.replace(/^(.{2}).*(@.*)$/, "$1•••$2");
// (••) •••••-••42
export const maskPhone = (t) => `(••) •••••-••${digits(t).slice(-2)}`;
