# Rampanelli Planejados

Sistema moderno de gerenciamento de orçamentos para móveis planejados, desenvolvido com Next.js, React, TypeScript e shadcn/ui. O projeto permite criar, editar, visualizar e exportar orçamentos profissionais em PDF, com experiência de usuário moderna e responsiva.

## Funcionalidades

- **Autenticação de usuários**
- **Cadastro e seleção de clientes** com autocomplete
- **Gerenciamento de materiais** (CRUD, catálogo dinâmico)
- **Criação e edição de orçamentos** com múltiplos itens, mão de obra e custos adicionais
- **Validação de formulários** com feedback visual
- **Notificações (toasts)** usando shadcn/ui (Sonner)
- **Exportação de orçamentos em PDF** (layout moderno, logo, multi-página)
- **Persistência local** (localStorage) para dados de orçamentos e materiais
- **UI/UX moderna** com animações, dark mode e responsividade

## Estrutura de Pastas

- `src/app/` — Rotas e páginas do Next.js
- `src/components/` — Componentes reutilizáveis (formulários, UI, PDF, etc.)
- `src/contexts/` — Providers e contextos globais (auth, orçamentos, clientes)
- `src/services/` — Serviços de dados (CRUD, localStorage)
- `src/types/` — Tipos e interfaces TypeScript
- `src/lib/` — Utilitários e componentes de geração de PDF
- `src/mocks/` — Dados mockados para desenvolvimento

## Tecnologias Utilizadas

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [shadcn/ui](https://ui.shadcn.com/) (Sonner, Dialog, Button, etc.)
- [React Hook Form](https://react-hook-form.com/)
- [React PDF](https://react-pdf.org/)
- [Framer Motion](https://www.framer.com/motion/)

## Como rodar o projeto

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Rode o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
3. Acesse em [http://localhost:3000](http://localhost:3000)

## Observações

- O projeto utiliza localStorage para persistência local, mas pode ser facilmente adaptado para backend/API.
- O layout dos PDFs pode ser customizado em `src/lib/OrcamentoPDFCliente.tsx` e `src/lib/OrcamentoPDFInterno.tsx`.
- Toasts e notificações utilizam o padrão shadcn/ui (Sonner).

## Licença

MIT
