// Guarda dados no navegador (localStorage) com prefixo 'flashbank:'. try/catch evita erro se o storage estiver bloqueado.
export const store = {
  get(key, fallback = null) {
    try { const v = localStorage.getItem(`flashbank:${key}`); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  },
  set(key, value) { try { localStorage.setItem(`flashbank:${key}`, JSON.stringify(value)); } catch {} },
  remove(key) { try { localStorage.removeItem(`flashbank:${key}`); } catch {} },
};
