# 📋 MAPEAMENTO COMPLETO - FORMALY FRONTEND

> Documentação detalhada de toda a estrutura do projeto, incluindo cada pasta, arquivo e suas responsabilidades.

---

## 📁 ESTRUTURA RAIZ

```
formaly-frontend/
├── .amazonq/              # Configurações e regras do Amazon Q
├── .next/                 # Build output do Next.js (gerado automaticamente)
├── node_modules/          # Dependências do projeto
├── public/                # Arquivos estáticos públicos
├── src/                   # Código fonte da aplicação
├── .env                   # Variáveis de ambiente
├── .env.local             # Variáveis de ambiente locais (não versionado)
├── .eslintrc.json         # Configuração do ESLint
├── .gitignore             # Arquivos ignorados pelo Git
├── next.config.ts         # Configuração do Next.js
├── package.json           # Dependências e scripts
├── package-lock.json      # Lock de versões das dependências
├── postcss.config.mjs     # Configuração do PostCSS
├── README.md              # Documentação principal do projeto
├── tailwind.config.ts     # Configuração do Tailwind CSS
└── tsconfig.json          # Configuração do TypeScript
```

---

## 🎯 DIRETÓRIO `/src/` - CÓDIGO FONTE

### 📂 `/src/app/` - Next.js App Router

Contém todas as rotas da aplicação usando o App Router do Next.js 16.

#### **Arquivos Raiz**
- **`layout.tsx`**: Layout global da aplicação
  - Define estrutura HTML base
  - Configura fonte Geist Sans
  - Envolve toda aplicação com `<Providers>`
  - Metadata global (título, descrição)

- **`page.tsx`**: Landing page (rota `/`)
  - Página inicial pública
  - Componentes: `<Hero>` e `<Features>`
  - Apresentação da plataforma

- **`globals.css`**: Estilos globais CSS
  - Variáveis CSS do tema (cores, espaçamentos)
  - Configuração de dark/light mode
  - Estilos base do Tailwind
  - Customizações do Shadcn/ui

- **`globals.css.d.ts`**: Declaração de tipos TypeScript para CSS

- **`favicon.ico`**: Ícone do site

---

#### 📁 `/src/app/(auth)/` - Route Group de Autenticação

**Propósito**: Agrupa rotas de autenticação sem afetar a URL.

##### `/src/app/(auth)/login/`
- **`page.tsx`**: Página de login (rota `/login`)
  - Formulário de login com email/senha
  - Botões de login social (Google, GitHub, Facebook)
  - Integração com Auth.js e AuthContext
  - Redirecionamento após login bem-sucedido

---

#### 📁 `/src/app/api/` - API Routes

##### `/src/app/api/auth/[...nextauth]/`
- **`route.ts`**: Rota dinâmica do Auth.js
  - Handlers de autenticação OAuth
  - Endpoints: `/api/auth/signin`, `/api/auth/callback`, etc.
  - Configurado em `lib/auth.ts`

---

#### 📁 `/src/app/dashboard/` - Área Autenticada

**Propósito**: Área protegida para usuários autenticados com sidebar persistente.

##### **Arquivos Raiz do Dashboard**
- **`layout.tsx`**: Layout do dashboard (Server Component)
  - Proteção de rota no servidor
  - Verifica sessão com `auth()`
  - Redireciona para `/login` se não autenticado
  - Renderiza `<DashboardLayoutClient>` com sessão

- **`layout-client.tsx`**: Layout cliente do dashboard
  - Client Component com `"use client"`
  - Renderiza `<SidebarProvider>` e `<AppSidebar>`
  - Sidebar fixa que persiste entre navegações
  - Breadcrumbs e header

- **`page.tsx`**: Dashboard principal (rota `/dashboard`)
  - Visão geral com estatísticas
  - Componentes: `<SectionCards>`, `<ChartAreaInteractive>`, `<DataTable>`
  - Exibe formulários recentes

- **`data.json`**: Dados mockados para tabela do dashboard

---

##### 📁 `/src/app/dashboard/analytics/`
- **`page.tsx`**: Página de analytics (rota `/dashboard/analytics`)
  - Gráficos e métricas de formulários
  - Análise de respostas e tendências
  - Visualizações interativas

---

##### 📁 `/src/app/dashboard/forms/`
- **`page.tsx`**: Lista de formulários (rota `/dashboard/forms`)
  - Tabela com todos os formulários do usuário
  - Ações: criar, editar, duplicar, excluir
  - Filtros e busca

##### `/src/app/dashboard/forms/new/`
- **`page.tsx`**: Criar novo formulário (rota `/dashboard/forms/new`)
  - Form Builder completo
  - Drag-and-drop de campos
  - Preview em tempo real
  - Configurações de formulário

##### `/src/app/dashboard/forms/[id]/edit/`
- **`page.tsx`**: Editar formulário (rota `/dashboard/forms/[id]/edit`)
  - Mesma interface do Form Builder
  - Carrega dados do formulário existente
  - Atualiza formulário no backend

---

##### 📁 `/src/app/dashboard/responses/`
- **`page.tsx`**: Respostas coletadas (rota `/dashboard/responses`)
  - Visualização de todas as respostas
  - Filtros por formulário, data, status
  - Exportação (CSV, Excel, JSON)

---

##### 📁 `/src/app/dashboard/integrations/`
- **`page.tsx`**: Integrações (rota `/dashboard/integrations`)
  - Conectar com serviços externos
  - Webhooks, Zapier, API
  - Configurações de integração

---

##### 📁 `/src/app/dashboard/search/`
- **`page.tsx`**: Busca global (rota `/dashboard/search`)
  - Busca em formulários e respostas
  - Filtros avançados
  - Resultados paginados

---

##### 📁 `/src/app/dashboard/settings/`
- **`page.tsx`**: Configurações (rota `/dashboard/settings`)
  - Preferências do usuário
  - Configurações de conta
  - Tema, notificações, privacidade

---

##### 📁 `/src/app/dashboard/team/`
- **`page.tsx`**: Gerenciamento de equipe (rota `/dashboard/team`)
  - Convidar membros
  - Gerenciar permissões
  - Colaboração em formulários

---

##### 📁 `/src/app/dashboard/templates/`
- **`page.tsx`**: Templates de formulários (rota `/dashboard/templates`)
  - Galeria de templates prontos
  - Criar formulário a partir de template
  - Salvar formulário como template

---

#### 📁 `/src/app/help/`
- **`page.tsx`**: Página de ajuda (rota `/help`)
  - Documentação e tutoriais
  - FAQ
  - Suporte ao usuário

---

#### 📁 `/src/app/publicform/[id]/`
- **`page.tsx`**: Formulário público (rota `/publicform/[id]`)
  - Acesso sem autenticação
  - Renderiza formulário para preenchimento
  - Validação de campos
  - Envio de respostas
  - Suporte a dark/light mode

---

### 📂 `/src/assets/` - Recursos Estáticos

#### `/src/assets/images/`
- **`analitcs.jpg`**: Imagem de analytics para landing page
- **`charts.jpg`**: Imagem de gráficos para landing page
- **`data.png`**: Imagem de dados para landing page
- **`share.jpg`**: Imagem de compartilhamento para landing page

**Responsabilidade**: Armazenar imagens e recursos visuais usados na aplicação.

---

### 📂 `/src/components/` - Componentes React

#### 📁 `/src/components/auth/` - Componentes de Autenticação

- **`ProtectedRoute.tsx`**: HOC para proteção de rotas
  - Verifica se usuário está autenticado
  - Redireciona para login se necessário
  - Exibe loading durante verificação

- **`social-login-buttons.tsx`**: Botões de login social
  - Google, GitHub, Facebook
  - Integração com Auth.js
  - Estilos consistentes com tema

- **`user-button.tsx`**: Botão de perfil do usuário
  - Avatar do usuário
  - Dropdown com opções (perfil, configurações, logout)
  - Exibe nome e email

---

#### 📁 `/src/components/dashboard/` - Componentes do Dashboard

- **`app-sidebar.tsx`**: Sidebar principal do dashboard
  - Navegação entre páginas
  - Links principais e secundários
  - Botão de collapse
  - Integração com `sidebar.config.ts`

- **`chart-area-interactive.tsx`**: Gráfico de área interativo
  - Visualização de dados temporais
  - Seleção de período (30d, 60d, 90d)
  - Integração com Recharts

- **`data-table.tsx`**: Tabela de dados reutilizável
  - Drag-and-drop para reordenar linhas
  - Seleção múltipla de linhas
  - Ordenação e paginação
  - Integração com TanStack Table

- **`nav-main.tsx`**: Navegação principal da sidebar
  - Links principais do dashboard
  - Ícones e labels
  - Highlight de rota ativa

- **`nav-secondary.tsx`**: Navegação secundária da sidebar
  - Links secundários (team, templates, settings)
  - Separação visual da navegação principal

- **`nav-user.tsx`**: Navegação do usuário na sidebar
  - Avatar e informações do usuário
  - Dropdown com ações (perfil, logout)

- **`section-cards.tsx`**: Cards de estatísticas
  - Métricas principais (total de formulários, respostas, etc.)
  - Ícones e valores
  - Layout responsivo

- **`sidebar-theme-switcher.tsx`**: Switcher de tema na sidebar
  - Toggle entre dark/light mode
  - Ícones de sol/lua
  - Persistência no localStorage

---

#### 📁 `/src/components/form-builder/` - Construtor de Formulários

- **`FormBuilderContainer.tsx`**: Container principal do builder
  - Gerencia estado dos campos do formulário
  - Drag-and-drop de campos
  - Adicionar, editar, remover campos
  - Salvar formulário

- **`FormBuilderHeader.tsx`**: Header do form builder
  - Título e descrição do formulário
  - Botões de ação (salvar, preview, publicar)
  - Breadcrumbs

- **`FormFieldEditor.tsx`**: Editor de campo individual
  - Configuração de propriedades do campo
  - Label, placeholder, validações
  - Opções específicas por tipo de campo

- **`FormFieldTypes.tsx`**: Definições de tipos de campos
  - Lista de tipos disponíveis (text, email, select, etc.)
  - Configurações padrão por tipo
  - Ícones e labels

- **`FormPreview.tsx`**: Preview do formulário
  - Visualização em tempo real
  - Simula aparência final
  - Teste de validações

- **`FormSettings.tsx`**: Configurações do formulário
  - Configurações gerais (título, descrição)
  - Opções avançadas (limite de respostas, expiração)
  - Proteção por senha

- **`index.ts`**: Exportações centralizadas do módulo

---

#### 📁 `/src/components/form-renderer/` - Renderizador de Formulários

- **`FormFieldRenderer.tsx`**: Renderiza campo individual
  - Renderização dinâmica baseada no tipo
  - Validação de campo
  - Mensagens de erro

- **`FormRenderer.tsx`**: Renderiza formulário completo
  - Container do formulário público
  - Gerencia estado de preenchimento
  - Envio de respostas
  - Mensagens de sucesso/erro

- **`PasswordProtection.tsx`**: Proteção por senha
  - Tela de senha antes do formulário
  - Validação de senha
  - Acesso ao formulário após validação

- **`index.ts`**: Exportações centralizadas do módulo

---

#### 📁 `/src/components/forms/`
**Status**: Pasta vazia (reservada para componentes futuros)

---

#### 📁 `/src/components/landing/` - Componentes da Landing Page

- **`features.tsx`**: Seção de features
  - Lista de funcionalidades da plataforma
  - Cards com ícones e descrições
  - Layout responsivo

- **`header.tsx`**: Header da landing page
  - Logo e navegação
  - Botões de login/cadastro
  - Menu responsivo

- **`hero-accordion.tsx`**: Accordion na seção hero
  - Perguntas frequentes
  - Animações de abertura/fechamento
  - Integração com Radix UI

- **`hero.tsx`**: Seção hero principal
  - Título e subtítulo
  - Call-to-action principal
  - Imagem/ilustração de destaque

- **`logo.tsx`**: Componente de logo
  - Logo da plataforma
  - Variantes (com/sem texto)
  - Responsivo

---

#### 📁 `/src/components/providers/` - Providers React

- **`Providers.tsx`**: Provider raiz da aplicação
  - Envolve `<SessionProvider>` (Auth.js)
  - Envolve `<ThemeProvider>` (next-themes)
  - Envolve `<AuthProvider>` (contexto customizado)
  - Ordem: SessionProvider → ThemeProvider → AuthProvider

---

#### 📁 `/src/components/shared/` - Componentes Compartilhados

- **`theme-icons.tsx`**: Ícones de tema
  - Ícones de sol (light mode)
  - Ícones de lua (dark mode)
  - Ícones de sistema

- **`theme-switcher.tsx`**: Switcher de tema genérico
  - Toggle entre dark/light/system
  - Dropdown com opções
  - Reutilizável em qualquer parte da aplicação

---

#### 📁 `/src/components/ui/` - Componentes Shadcn/ui

**Propósito**: Componentes de UI primitivos do Shadcn/ui (style: new-york).

- **`accordion.tsx`**: Componente de accordion
- **`alert-dialog.tsx`**: Diálogo de alerta
- **`avatar.tsx`**: Avatar de usuário
- **`badge.tsx`**: Badge/tag
- **`border-beam.tsx`**: Efeito de borda animada
- **`breadcrumb.tsx`**: Breadcrumbs de navegação
- **`button.tsx`**: Botão com variantes
- **`calendar.tsx`**: Calendário/date picker
- **`card.tsx`**: Card container
- **`chart.tsx`**: Componentes de gráficos
- **`checkbox.tsx`**: Checkbox
- **`dialog.tsx`**: Diálogo modal
- **`drawer.tsx`**: Drawer lateral
- **`dropdown-menu.tsx`**: Menu dropdown
- **`input.tsx`**: Input de texto
- **`label.tsx`**: Label de formulário
- **`popover.tsx`**: Popover
- **`radio-group.tsx`**: Grupo de radio buttons
- **`select.tsx`**: Select/dropdown
- **`separator.tsx`**: Separador visual
- **`sheet.tsx`**: Sheet lateral
- **`sidebar.tsx`**: Componente de sidebar
- **`skeleton.tsx`**: Skeleton loader
- **`switch.tsx`**: Switch/toggle
- **`table.tsx`**: Tabela
- **`tabs.tsx`**: Tabs/abas
- **`textarea.tsx`**: Textarea
- **`toggle-group.tsx`**: Grupo de toggles
- **`toggle.tsx`**: Toggle button
- **`tooltip.tsx`**: Tooltip

**Características**:
- Baseados em Radix UI
- Totalmente acessíveis (ARIA)
- Estilizados com Tailwind CSS
- Customizáveis via props
- TypeScript strict

---

### 📂 `/src/config/` - Configurações

- **`sidebar.config.ts`**: Configuração da sidebar
  - Links principais (mainLinks)
  - Links secundários (secondaryLinks)
  - Dados do usuário (sidebarUser)
  - Ícones e URLs
  - Centraliza toda configuração da navegação

**Responsabilidade**: Centralizar configurações estáticas da aplicação.

---

### 📂 `/src/contexts/` - React Contexts

- **`AuthContext.tsx`**: Contexto de autenticação
  - Gerencia estado do usuário autenticado
  - Funções: `login()`, `register()`, `logout()`, `refreshUser()`
  - Integração com localStorage (modo mock)
  - Integração com Auth.js (OAuth)
  - Hook customizado: `useAuth()`

- **`AuthContext.tsx.backup`**: Backup do contexto de autenticação

**Responsabilidade**: Gerenciar estado global da aplicação usando React Context API.

---

### 📂 `/src/hooks/` - Custom Hooks

- **`use-mobile.ts`**: Hook para detectar dispositivos móveis
  - Usa `matchMedia` para detectar breakpoint
  - Retorna `boolean` indicando se é mobile
  - Atualiza em tempo real ao redimensionar

- **`useDragAndDrop.ts`**: Hook para drag-and-drop
  - Integração com @dnd-kit
  - Gerencia estado de arrastar/soltar
  - Reordenação de itens

**Responsabilidade**: Encapsular lógica reutilizável em hooks customizados.

---

### 📂 `/src/lib/` - Bibliotecas e Utilitários

#### 📁 `/src/lib/api/`
- **`client.ts`**: Cliente HTTP (Axios)
  - Configuração base do Axios
  - Interceptors de request/response
  - Tratamento de erros
  - Base URL do backend

---

#### 📁 `/src/lib/services/` - Camada de Serviços

- **`auth.service.ts`**: Serviço de autenticação
  - `login()`: Login com email/senha
  - `register()`: Registro de novo usuário
  - `getMe()`: Buscar dados do usuário atual
  - `logout()`: Logout do usuário

- **`field-types.service.ts`**: Serviço de tipos de campos
  - `getFieldTypes()`: Buscar tipos de campos disponíveis
  - Configurações padrão de cada tipo
  - Validações por tipo

- **`forms.service.ts`**: Serviço de formulários
  - `getForms()`: Listar formulários do usuário
  - `getFormById()`: Buscar formulário por ID
  - `createForm()`: Criar novo formulário
  - `updateForm()`: Atualizar formulário
  - `deleteForm()`: Excluir formulário
  - `duplicateForm()`: Duplicar formulário

- **`public-forms.service.ts`**: Serviço de formulários públicos
  - `getPublicForm()`: Buscar formulário público por ID
  - `submitResponse()`: Enviar resposta de formulário
  - `validatePassword()`: Validar senha de formulário protegido

**Responsabilidade**: Centralizar lógica de negócio e chamadas à API.

---

#### **Arquivos Raiz de `/src/lib/`**

- **`api.ts`**: Utilitários de API (legado)
  - Funções auxiliares para chamadas HTTP
  - Pode ser substituído por `api/client.ts`

- **`auth.ts`**: Configuração do Auth.js
  - Providers OAuth (Google, GitHub, Facebook)
  - Callbacks JWT e Session
  - Páginas customizadas (signIn)
  - Extensão de tipos do NextAuth

- **`mock-data.ts`**: Dados mockados para desenvolvimento
  - `MOCK_USER`: Usuário mockado
  - `MOCK_FORMS`: Array de formulários mockados
  - Funções auxiliares: `getMockFormById()`, `getMockFormsPaginated()`
  - `mockDelay()`: Simula delay de API

- **`utils.ts`**: Funções utilitárias
  - `cn()`: Combina classes CSS com Tailwind Merge
  - Outras funções auxiliares

**Responsabilidade**: Fornecer utilitários, configurações e lógica compartilhada.

---

### 📄 `/src/proxy.ts` - Next.js 16 Middleware

**Responsabilidade**: Middleware do Next.js 16 (renomeado de `middleware.ts`).

- Intercepta requisições antes de chegar às rotas
- Proteção de rotas
- Redirecionamentos
- Manipulação de headers

**Nota**: No Next.js 16, o arquivo foi renomeado de `middleware.ts` para `proxy.ts`.

---

## 🔧 ARQUIVOS DE CONFIGURAÇÃO (RAIZ)

### **`.env` e `.env.local`**
Variáveis de ambiente:
```env
# Auth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua-chave-secreta

# OAuth Providers
AUTH_GOOGLE_ID=seu-google-client-id
AUTH_GOOGLE_SECRET=seu-google-secret
AUTH_GITHUB_ID=seu-github-client-id
AUTH_GITHUB_SECRET=seu-github-secret
AUTH_FACEBOOK_ID=seu-facebook-client-id
AUTH_FACEBOOK_SECRET=seu-facebook-secret

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

### **`next.config.ts`**
Configuração do Next.js:
- Experimental features (MCP server)
- Configuração de imagens
- Redirects e rewrites
- Variáveis de ambiente públicas

---

### **`tailwind.config.ts`**
Configuração do Tailwind CSS:
- Tema customizado (cores, fontes, espaçamentos)
- Plugins (Shadcn/ui)
- Variantes responsivas
- Dark mode

---

### **`postcss.config.mjs`**
Configuração do PostCSS:
- Plugin `@tailwindcss/postcss`
- Processamento de CSS

---

### **`tsconfig.json`**
Configuração do TypeScript:
- Strict mode ativo
- Path aliases (`@/*` → `./src/*`)
- Target ES2017+
- Module ESNext

---

### **`.eslintrc.json`**
Configuração do ESLint:
- Regras do Next.js
- Regras customizadas
- Plugins

---

### **`package.json`**
Dependências e scripts:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

**Principais dependências**:
- Next.js 16.0.1
- React 19.2.0
- Tailwind CSS 4.x
- Auth.js 5.0.0-beta.30
- Shadcn/ui components
- Zod, Axios, Recharts, TanStack Table

---

## 📊 FLUXO DE DADOS

### **Autenticação**
```
Login Page → Auth.js → OAuth Provider → Callback → Backend Sync → Session → Dashboard
```

### **Criação de Formulário**
```
Dashboard → Form Builder → Field Editor → Preview → Save → Backend → Database
```

### **Submissão de Formulário**
```
Public Link → Form Renderer → Field Validation → Submit → Backend → Database
```

---

## 🎨 PADRÕES DE CÓDIGO

### **Nomenclatura**
- **Componentes**: PascalCase (`FormBuilder.tsx`)
- **Funções**: camelCase (`handleSubmit`)
- **Constantes**: UPPER_SNAKE_CASE (`API_URL`)
- **Tipos**: PascalCase (`FormField`)

### **Estrutura de Componentes**
```tsx
"use client"; // Se for Client Component

import * as React from "react";
// Imports externos
// Imports internos

interface ComponentProps {
  // Props
}

export function Component({ props }: ComponentProps) {
  // Hooks
  // Estado
  // Funções
  // Render
}
```

### **Organização de Imports**
1. React e core libraries
2. Third-party UI libraries
3. Ícones
4. Hooks internos
5. Componentes internos
6. Utilitários

---

## 🔐 SEGURANÇA

- **Validação**: Zod schemas em todos os formulários
- **Sanitização**: Dados do usuário sempre sanitizados
- **Autenticação**: Auth.js com OAuth seguro
- **Variáveis sensíveis**: Sempre em `.env` (nunca no código)
- **CORS**: Configurado no backend

---

## 📱 RESPONSIVIDADE

- **Mobile-first**: Design otimizado para mobile
- **Breakpoints**: sm, md, lg, xl, 2xl
- **Touch-friendly**: Botões e interações otimizadas para touch
- **Sidebar**: Drawer em mobile, fixa em desktop

---

## ♿ ACESSIBILIDADE

- **ARIA labels**: Todos os componentes interativos
- **Navegação por teclado**: Suporte completo
- **Contraste**: WCAG AA compliance
- **Screen readers**: Compatível com leitores de tela

---

## 🚀 PERFORMANCE

- **Server Components**: Padrão para melhor performance
- **Code splitting**: Automático pelo Next.js
- **Image optimization**: Next.js Image component
- **Font optimization**: Geist Sans otimizada
- **Lazy loading**: Componentes pesados carregados sob demanda

---

## 📝 RESUMO DE RESPONSABILIDADES

| Diretório | Responsabilidade |
|-----------|------------------|
| `/src/app/` | Rotas e páginas (App Router) |
| `/src/components/` | Componentes React reutilizáveis |
| `/src/contexts/` | Estado global (React Context) |
| `/src/hooks/` | Lógica reutilizável (Custom Hooks) |
| `/src/lib/` | Utilitários, serviços, configurações |
| `/src/assets/` | Imagens e recursos estáticos |
| `/src/config/` | Configurações estáticas |

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ Estrutura de pastas completa
2. ✅ Componentes base do Shadcn/ui
3. ✅ Sistema de autenticação (Auth.js + Context)
4. ✅ Landing page
5. ✅ Dashboard com sidebar
6. ✅ Form Builder (em desenvolvimento)
7. ⏳ Formulários públicos
8. ⏳ Gerenciamento de respostas
9. ⏳ Exportação de dados
10. ⏳ Integrações

---

## 📚 DOCUMENTAÇÃO ADICIONAL

- [Next.js 16 Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev)
- [Tailwind CSS 4 Docs](https://tailwindcss.com/docs)
- [Shadcn/ui Docs](https://ui.shadcn.com)
- [Auth.js Docs](https://authjs.dev)
- [Zod Docs](https://zod.dev)

---

**Última atualização**: 2024
**Versão**: 1.0.0
**Autor**: Equipe Formaly
