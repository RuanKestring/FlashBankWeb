# FlashBankWeb

Frontend do FlashBank, em migração gradual de HTML/CSS/JavaScript para React com Vite.

## Como rodar

Requisitos: Node.js compatível com a versão do Vite instalada.

```sh
npm install
npm run dev
```

O Vite informa o endereço local no terminal. Para gerar e visualizar a versão de produção:

```sh
npm run build
npm run preview
```

Durante a migração, as telas ainda não convertidas continuam como páginas HTML antigas. `pages/home.html` é uma entrada Vite que monta a Home React.

## Login de demonstração

CPF `123.456.789-09` · senha `12345678`.

## Estrutura

- `src/components/`: shell reutilizável, sidebar, topbar e avisos
- `src/pages/`: páginas React, incluindo Home
- `src/lib/`: dados, autenticação, armazenamento e formatação compartilhados
- `src/assets/`: imagens e ícones importados pelo código React e CSS
- `css/`: estilos compartilhados pelas telas React e pelas páginas HTML ainda não migradas
- `public/`: dados, partials e logo servidos por URL para as páginas legadas
- `js/`, `pages/`, `partials/` e `data/`: partes antigas mantidas durante a migração; `js/core/` reexporta módulos de `src/lib/`
