# FlashBankWeb

Front-end do FlashBank em HTML, CSS e JavaScript puro (módulos ES).

## Como rodar
Abra a pasta no VS Code e use a extensão **Live Server** no `index.html`
(os módulos e o `fetch` não funcionam abrindo o arquivo direto).

Login de demonstração: CPF `123.456.789-09` · senha `12345678`.

## Estrutura
- `css/` estilos por camada (base, layout, components, pages)
- `js/core` utilidades (auth, store, api, format) · `js/pages` um módulo por tela
- `data/` JSONs que simulam a API · `partials/` sidebar e topbar compartilhadas
