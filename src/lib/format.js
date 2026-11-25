// Funções sem dependência de uma tela específica.
export const brl = (value) => new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
}).format(value)

export const digits = (value) => String(value).replace(/\D/g, '')
export const maskCpf = (cpf) => `***.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-**`
export const formatCpf = (value) => digits(value).slice(0, 11)
  .replace(/(\d{3})(\d)/, '$1.$2')
  .replace(/(\d{3})(\d)/, '$1.$2')
  .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
export const maskEmail = (email) => email.replace(/^(.{2}).*(@.*)$/, '$1•••$2')
export const maskPhone = (phone) => `(••) •••••-••${digits(phone).slice(-2)}`
