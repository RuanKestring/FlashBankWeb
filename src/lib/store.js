// Armazenamento local compartilhado pelas telas React.
export const store = {
  get(key, fallback = null) {
    try {
      const value = localStorage.getItem(`flashbank:${key}`)
      return value ? JSON.parse(value) : fallback
    } catch {
      return fallback
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(`flashbank:${key}`, JSON.stringify(value))
    } catch {
      // O site continua utilizável quando o navegador bloqueia o armazenamento.
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(`flashbank:${key}`)
    } catch {
      // Nada a fazer se o navegador bloquear o armazenamento.
    }
  },
}
