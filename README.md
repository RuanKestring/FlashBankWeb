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

Durante a migração, as telas que ainda não foram convertidas continuam como páginas HTML antigas.

## Login de demonstração

CPF `123.456.789-09` · senha `12345678`.

## Estrutura

- `src/`: entrada React e telas/componentes migrados; `src/assets/` guarda assets importados por esses componentes
- `public/`: cópias temporárias de arquivos estáticos que as páginas antigas ainda carregam por URL
- `css/`, `js/`, `pages/`, `partials/` e `data/`: implementação antiga, mantida durante a migração
- `assets/`: assets ainda usados pela implementação antiga, incluindo ícones referenciados pelo CSS legado
