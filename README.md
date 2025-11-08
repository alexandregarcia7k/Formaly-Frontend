# Formaly Frontend

Plataforma de criação e gerenciamento de formulários online com Next.js 16.

## 🚀 Stack Tecnológica

- **Framework**: Next.js 16.0.1 (App Router)
- **UI**: React 19.2.0
- **Estilização**: Tailwind CSS 4.x
- **Componentes**: Shadcn/ui (style: new-york)
- **Autenticação**: Auth.js (NextAuth.js)
- **Validação**: Zod
- **Ícones**: Lucide React
- **TypeScript**: 5.x

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── (public)/          # Landing page (rota: /)
│   │   ├── layout.tsx     # Layout público
│   │   └── page.tsx       # Página inicial
│   │
│   ├── (auth)/            # Autenticação
│   │   └── login/         # Página de login
│   │       └── page.tsx
│   │
│   ├── (dashboard)/       # Área autenticada
│   │   ├── layout.tsx     # Layout com sidebar fixa
│   │   ├── page.tsx       # Dashboard principal
│   │   ├── forms/         # Gerenciamento de formulários
│   │   │   └── page.tsx
│   │   └── settings/      # Configurações
│   │       └── page.tsx
│   │
│   ├── api/
│   │   └── auth/          # Auth.js routes
│   │
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Estilos globais
│   └── page.tsx           # Redirect para landing
│
├── components/
│   ├── ui/                # Shadcn components
│   ├── dashboard/         # Componentes do dashboard
│   │   └── app-sidebar.tsx
│   ├── landing/           # Componentes da landing
│   └── forms/             # Componentes de formulários
│
├── lib/
│   └── utils.ts           # Utilitários (cn, etc)
│
└── hooks/                 # Custom hooks
```

## 🎯 Funcionalidades

### Landing Page (Pública)
- Apresentação da plataforma
- Call-to-action para login
- Informações sobre recursos

### Autenticação
- Login via OAuth (Google, GitHub)
- Gerenciamento de sessões com Auth.js
- Proteção de rotas

### Dashboard (Autenticado)
- **Sidebar Fixa**: Navegação persistente entre páginas
- **Dashboard**: Visão geral e estatísticas
- **Formulários**: Criar, editar, duplicar, excluir
- **Configurações**: Preferências do usuário

### Formulários Públicos (Futuro)
- Link único por formulário
- Preenchimento sem autenticação
- Validação de campos

## 🏗️ Arquitetura Next.js 16

### Route Groups
Usamos **route groups** `(nome)` para organizar rotas sem afetar a URL:

- `(public)` → Rotas públicas (landing page)
- `(auth)` → Rotas de autenticação
- `(dashboard)` → Rotas autenticadas

**Exemplo**: `app/(dashboard)/forms/page.tsx` → URL: `/forms`

### Layouts Aninhados
Layouts são compartilhados entre rotas e **preservam estado** durante navegação:

```
app/layout.tsx                    # Root layout (global)
  └── (dashboard)/layout.tsx      # Dashboard layout (sidebar fixa)
      ├── page.tsx                # /
      ├── forms/page.tsx          # /forms
      └── settings/page.tsx       # /settings
```

**Benefício**: A sidebar permanece montada ao navegar entre páginas do dashboard.

### Server Components (Padrão)
Todos os componentes são **Server Components** por padrão:
- Melhor performance
- Menor bundle JavaScript
- Acesso direto a dados no servidor

Use `"use client"` apenas quando necessário:
- Hooks (useState, useEffect, etc)
- Event handlers (onClick, onChange)
- Browser APIs

## 🎨 Sistema de Temas

- **Dark Mode**: Tema escuro completo
- **Light Mode**: Tema claro padrão
- **Persistência**: localStorage
- **Toggle**: Botão acessível

## 🔧 Comandos

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm start

# Lint
npm run lint
```

## 📝 Regras de Desenvolvimento

### Next.js 16
- `params` e `searchParams` são **Promises** (usar `await`)
- Server Components por padrão
- Turbopack ativo (não usar flags)

### Tailwind CSS 4
- Evitar `@apply` em produção
- Usar variáveis CSS do tema
- `@layer base` apenas para estilos globais

### TypeScript
- Strict mode sempre ativo
- Nunca usar `any`
- Path aliases: `@/*`

## 🔐 Segurança

- Validação com Zod
- Sanitização de dados
- Variáveis sensíveis em `.env`
- CORS configurado no backend

## 🚧 Próximos Passos

1. ✅ Estrutura de pastas
2. ⏳ Theme provider (dark/light mode)
3. ⏳ Configurar Auth.js
4. ⏳ Implementar landing page
5. ⏳ Form builder
6. ⏳ Formulários públicos
7. ⏳ Exportação de dados

## 📚 Documentação

- [Next.js 16](https://nextjs.org/docs)
- [Tailwind CSS 4](https://tailwindcss.com/docs)
- [Shadcn/ui](https://ui.shadcn.com)
- [Auth.js](https://authjs.dev)

## 📄 Licença

MIT
