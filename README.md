# FlashBankWeb

Frontend de demonstração do FlashBank feito com React e Vite.

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

O login fica em `index.html`. Cada tela interna tem um HTML em `pages/` que carrega sua entrada React correspondente em `src/`.

## Login de demonstração

CPF `123.456.789-09` · senha `12345678`.

## Estrutura

- `src/components/`: shell reutilizável, sidebar, topbar e avisos
- `src/pages/`: telas React
- `src/lib/`: autenticação simulada, armazenamento local e formatação
- `src/data/`: dados JSON de demonstração compartilhados pelas telas
- `src/assets/`: imagens e ícones importados pelo código React e CSS
- `css/`: folhas de estilo compartilhadas pelo app
- `public/`: favicon e imagem do login servidos diretamente pelo Vite

Não há backend: o usuário de demonstração e os dados das telas são fixtures locais. O estado editável fica no `localStorage` do navegador.
