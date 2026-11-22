// Adaptador dos JSONs e partials para as páginas que ainda usam fetch.
export const root = document.body.dataset.root || ''

export const getJSON = async (name) => {
  const response = await fetch(`${root}data/${name}.json`)
  if (!response.ok) throw new Error(`Não foi possível carregar data/${name}.json`)
  return response.json()
}

export const getText = async (path) => {
  const response = await fetch(`${root}${path}`)
  if (!response.ok) throw new Error(`Não foi possível carregar ${path}`)
  return response.text()
}
