# 📋 Formaly - Plataforma de Criação de Formulários

> Plataforma moderna e completa para criação, gerenciamento e análise de formulários online com interface drag-and-drop

[![Next.js](https://img.shields.io/badge/Next.js-16.0.1-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)

## 🎯 Visão Geral

Formaly é uma plataforma completa de gerenciamento de formulários que permite aos usuários criar, personalizar e analisar formulários com uma interface intuitiva de arrastar e soltar. Construída com tecnologias de ponta, oferece analytics em tempo real, rastreamento de respostas e experiência de usuário impecável.

**🔗 Links do Projeto:**
- **Frontend**: [github.com/alexandregarcia7k/Formaly-Frontend](https://github.com/alexandregarcia7k/Formaly-Frontend)
- **Backend**: [github.com/alexandregarcia7k/Formaly-Backend](https://github.com/alexandregarcia7k/Formaly-Backend)
- **Demo**: Em breve

### ✨ Funcionalidades Principais

- 🎨 **Form Builder Drag & Drop** - Interface intuitiva com 10 tipos de campos
- 📊 **Analytics Avançado** - Insights em tempo real com funis de conversão, mapas de calor e KPIs
- 🔐 **Autenticação Segura** - Integração OAuth (Google, GitHub) via Auth.js
- 📱 **Totalmente Responsivo** - Design mobile-first com modo escuro/claro
- 🚀 **Alta Performance** - Server Components, Turbopack e React Compiler
- 🔍 **Filtros Inteligentes** - Capacidades avançadas de busca e filtragem
- 📈 **Gerenciamento de Respostas** - Rastreie, exporte e analise submissões
- 🎯 **Formulários Públicos** - Links compartilháveis com proteção por senha
- ⚡ **Validação em Tempo Real** - Validação de schemas com Zod
- 📊 **Dashboard Completo** - Estatísticas, gráficos e atividades recentes

## 🚀 Stack Tecnológica

### Tecnologias Core

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| [Next.js](https://nextjs.org/) | 16.0.1 | Framework React com App Router |
| [React](https://react.dev/) | 19.2.0 | Biblioteca UI com Server Components |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Desenvolvimento type-safe |
| [Tailwind CSS](https://tailwindcss.com/) | 4.x | Estilização utility-first |
| [Shadcn/ui](https://ui.shadcn.com/) | Latest | Biblioteca de componentes acessíveis |
| [Auth.js](https://authjs.dev/) | 5.0.0-beta | Solução de autenticação |
| [Zod](https://zod.dev/) | 3.25.76 | Validação de schemas |

### Bibliotecas Adicionais

- **Gerenciamento de Estado**: React hooks, Context API
- **Requisições HTTP**: Axios com hooks customizados
- **Drag & Drop**: @dnd-kit
- **Gráficos**: Recharts
- **Tabelas**: TanStack Table
- **Manipulação de Datas**: date-fns
- **Ícones**: Tabler Icons, Lucide React
- **Animações**: Motion (Framer Motion) - usado no form builder
- **Notificações**: Sonner

## 📁 Estrutura do Projeto

```
formaly-frontend/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # Rotas de autenticação
│   │   │   └── login/           # Página de login
│   │   ├── dashboard/           # Área protegida do dashboard
│   │   │   ├── forms/           # Gerenciamento de formulários
│   │   │   ├── analytics/       # Dashboard de analytics
│   │   │   ├── responses/       # Gerenciamento de respostas
│   │   │   ├── settings/        # Configurações do usuário
│   │   │   └── layout.tsx       # Layout do dashboard com sidebar
│   │   ├── publicform/[id]/     # Submissão de formulário público
│   │   ├── api/                 # Rotas de API
│   │   └── page.tsx             # Landing page
│   │
│   ├── components/              # Componentes React
│   │   ├── ui/                  # Primitivos Shadcn/ui
│   │   ├── form-builder/        # Componentes do form builder
│   │   ├── form-renderer/       # Renderizador de formulário público
│   │   ├── dashboard/           # Componentes do dashboard
│   │   ├── sidebar/             # Sidebar de navegação
│   │   ├── datatable/           # Componentes de tabela de dados
│   │   └── filters/             # Componentes de filtro
│   │
│   ├── lib/                     # Utilitários e serviços
│   │   ├── services/            # Camada de serviço da API
│   │   │   ├── auth.service.ts
│   │   │   ├── forms.service.ts
│   │   │   ├── analytics.service.ts
│   │   │   └── public-forms.service.ts
│   │   ├── api/                 # Configuração do cliente API
│   │   └── utils.ts             # Funções auxiliares
│   │
│   ├── hooks/                   # Hooks React customizados
│   │   ├── useForms.ts          # Gerenciamento de formulários
│   │   ├── useAnalytics.ts      # Dados de analytics
│   │   ├── useDashboard.ts      # Dados do dashboard
│   │   └── useDebounce.ts       # Utilitário de debounce
│   │
│   ├── schemas/                 # Schemas de validação Zod
│   │   ├── form.schema.ts
│   │   ├── field.schema.ts
│   │   ├── response.schema.ts
│   │   ├── analytics.schema.ts
│   │   └── dashboard.schema.ts
│   │
│   ├── types/                   # Definições de tipos TypeScript
│   └── config/                  # Arquivos de configuração
│
├── public/                      # Assets estáticos
└── README.md                    # Este arquivo
```

## 🎨 Detalhamento de Funcionalidades

### 1. Form Builder

**Interface Drag & Drop intuitiva para criação de formulários**

- **Tipos de Campos Disponíveis**:
  - **Texto**: text, textarea, email, phone, number
  - **Seleção**: select (dropdown), radio, checkbox
  - **Data**: date picker
  - **Arquivo**: file upload

- **Configuração de Campos**:
  - Labels e placeholders personalizáveis
  - Regras de validação
  - Flags de obrigatório/opcional
  - Opções customizadas para campos de seleção

- **Configurações do Formulário**:
  - Título e descrição
  - Proteção por senha
  - Estilização customizada
  - Preview em tempo real

### 2. Dashboard de Analytics

**Análise completa do desempenho dos formulários**

- **Dados Temporais**: Visualizações e respostas ao longo do tempo
- **Distribuição por Dispositivo**: Breakdown mobile, desktop, tablet
- **Analytics de Navegador**: Chrome, Safari, Firefox, etc.
- **Funil de Conversão**: Análise em 3 estágios (Visualizou → Iniciou → Enviou)
- **Mapa de Calor**: Atividade por dia da semana e hora (12 blocos de 2h)
- **Distribuição Geográfica**: Top 10 estados/países
- **KPIs**:
  - Taxa de crescimento com tendências
  - Taxa de conversão
  - Tempo médio de conclusão
  - Score de engajamento
- **Ranking de Formulários**: Top 10 formulários por taxa de conversão

### 3. Gerenciamento de Respostas

**Visualização e análise detalhada das submissões**

- **Tabela de Dados**: Respostas ordenáveis e filtráveis
- **Filtros Avançados**:
  - Seletor de intervalo de datas
  - Seleção de formulário
  - Tipo de dispositivo
  - Tipo de navegador
  - Status de conclusão
- **Opções de Exportação**: CSV, Excel, JSON (em desenvolvimento)
- **Ações em Massa**: Deletar múltiplas respostas
- **Detalhes da Resposta**: Visualizar submissões individuais

### 4. Configurações do Usuário

**Gerenciamento completo de preferências**

- **Aba Minha Conta**:
  - Informações do perfil
  - Upload de avatar
  - Configurações de segurança
  - Alteração de senha

- **Aba Planos e Pagamentos**:
  - Exibição do plano atual
  - Opções de upgrade
  - Histórico de pagamentos

- **Aba Notificações**:
  - Preferências de email
  - Configurações de alertas
  - Opt-in/out de marketing

### 5. Formulários Públicos

**Compartilhamento e coleta de respostas**

- **Links Compartilháveis**: URL única por formulário
- **Proteção por Senha**: Controle de acesso opcional
- **Suporte a Temas**: Modo escuro/claro
- **Otimizado para Mobile**: Interface touch-friendly
- **Validação em Tempo Real**: Feedback instantâneo
- **Rastreamento de Metadados**:
  - Hora de início
  - Hora de conclusão
  - Tempo gasto
  - Informações de dispositivo e navegador

## 🏗️ Arquitetura e Padrões

### Padrões de Desenvolvimento

- **Service Layer Pattern**: Camada de serviço centralizada para chamadas de API
- **Custom Hooks**: Lógica reutilizável encapsulada em hooks personalizados
- **Compound Components**: Composição flexível de componentes (Shadcn/ui)
- **Controlled Components**: Estado gerenciado pelo componente pai
- **Type-Safe Validation**: Validação com Zod em todos os inputs
- **Optimistic Updates**: Atualizações otimistas para melhor UX

### Performance

- ✅ React Compiler (memoização automática)
- ✅ Server Components (bundle JS reduzido)
- ✅ Turbopack (builds mais rápidos)
- ✅ Otimização de imagens e fontes
- ✅ Code splitting e lazy loading

## 📚 Documentação Adicional

- [📊 Analytics API](./ANALYTICS_API.md) - Documentação completa dos endpoints de analytics

## 🎯 Destaques Técnicos

### Validação com Zod
Todos os inputs de usuário são validados com Zod, garantindo type-safety em runtime:
- Schemas organizados em `/src/schemas/`
- Validação em tempo real com feedback visual
- Mensagens de erro em português
- Inferência automática de tipos TypeScript

### Analytics Avançado
Sistema completo de analytics com 8 endpoints especializados:
- Dados temporais com gráficos interativos
- Funil de conversão em 3 estágios
- Mapa de calor com 12 blocos de 2 horas
- KPIs com tendências e comparações
- Ranking de formulários por performance

### Form Builder
Editor drag-and-drop com preview em tempo real:
- 10 tipos de campos diferentes
- Validação configurável por campo
- Proteção por senha opcional
- Animações suaves com Motion

## 📄 Sobre o Projeto

Formaly é um projeto real e funcional desenvolvido para demonstrar habilidades em desenvolvimento full-stack moderno. A plataforma está em desenvolvimento ativo e o código está disponível publicamente para análise técnica e avaliação de competências.

**Status**: Em desenvolvimento | **Tipo**: Projeto pessoal

**Nota**: Este projeto não está disponível para uso comercial, redistribuição ou cópia. O código é compartilhado exclusivamente para fins de portfólio e análise técnica por recrutadores e empresas. Todos os direitos reservados.

## 👨💻 Desenvolvedor

**Alexandre Garcia**
- GitHub: [@alexandregarcia7k](https://github.com/alexandregarcia7k)
- LinkedIn: [Alexandre Garcia](https://linkedin.com/in/alexandregarcia7k)
- Portfolio: Em breve

## 🛠️ Tecnologias Utilizadas

Este projeto utiliza as tecnologias mais modernas do ecossistema React:

- **Next.js 16** - Framework React com App Router e Server Components
- **React 19** - Biblioteca UI com React Compiler
- **TypeScript 5** - Tipagem estática e segurança de tipos
- **Tailwind CSS 4** - Framework de estilização utility-first
- **Shadcn/ui** - Componentes acessíveis e customizáveis
- **Zod** - Validação de schemas type-safe
- **Auth.js** - Autenticação OAuth moderna
- **Recharts** - Biblioteca de gráficos para React
- **TanStack Table** - Tabelas de dados poderosas
- **@dnd-kit** - Drag and drop acessível

---

**Desenvolvido com Next.js 16 e React 19 | © 2025 Alexandre Garcia**
