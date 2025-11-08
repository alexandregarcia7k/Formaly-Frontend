# 📖 Guia Completo do Sidebar - Formaly

## 🗂️ Estrutura de Arquivos

```
src/
├── components/
│   ├── ui/
│   │   └── sidebar.tsx              # 🎨 Componentes BASE do Shadcn (não mexer muito)
│   ├── app-sidebar.tsx              # 🏠 SIDEBAR PRINCIPAL - Configure AQUI!
│   ├── nav-main.tsx                 # 🧭 Menu principal (Dashboard, Forms, etc)
│   ├── nav-secondary.tsx            # ⚙️ Menu secundário (Search, Help, Settings)
│   ├── nav-documents.tsx            # 📄 Menu de documentos/templates
│   ├── nav-user.tsx                 # 👤 Perfil do usuário (footer)
│   └── theme-switcher.tsx           # 🎨 Switcher de tema
└── app/
    └── dashboard/
        └── layout.tsx               # 📍 Onde o sidebar é USADO

src/app/globals.css                  # 🎨 Cores e temas (já configurado)
```

---

## 🏗️ Hierarquia Visual do Sidebar

```
┌─────────────────────────────────────┐
│ 🔝 SIDEBAR HEADER                   │
│   └─ Logo + Nome "Formaly"          │ ← app-sidebar.tsx (linha 129-143)
├─────────────────────────────────────┤
│ 📦 SIDEBAR CONTENT                  │
│   ├─ NavMain (Menu Principal)      │ ← nav-main.tsx
│   │   ├─ Dashboard                 │
│   │   ├─ Meus Formulários          │
│   │   ├─ Analytics                 │
│   │   ├─ Respostas                 │
│   │   └─ Equipe                    │
│   │                                 │
│   ├─ NavDocuments (se houver)      │ ← nav-documents.tsx
│   │   └─ Templates expandíveis     │
│   │                                 │
│   └─ NavSecondary (mt-auto)        │ ← nav-secondary.tsx
│       ├─ 🔍 Pesquisar              │
│       ├─ ❓ Ajuda                  │
│       └─ ⚙️ Configurações           │
├─────────────────────────────────────┤
│ 🔽 SIDEBAR FOOTER                   │
│   ├─ ThemeSwitcher                 │ ← theme-switcher.tsx
│   │   └─ [System] [Light] [Dark]  │
│   │                                 │
│   └─ NavUser                       │ ← nav-user.tsx
│       └─ Alexandre Garcia          │
│           alexandre@formaly.com    │
└─────────────────────────────────────┘
```

---

## 📝 ONDE ESTÁ CADA COISA?

### 1️⃣ **app-sidebar.tsx** - O Arquivo PRINCIPAL 🎯

Este é o arquivo que você vai mexer 90% do tempo!

#### 📍 O que tem aqui:

**Linha 33-126: Objeto `data`** - TODA a configuração do sidebar está aqui!

```tsx
const data = {
  // 👤 Dados do usuário (aparece no footer)
  user: {
    name: "Alexandre Garcia", // ← Mude aqui o nome
    email: "alexandre@formaly.com", // ← Mude aqui o email
    avatar: "/avatars/user.jpg", // ← Caminho da foto
  },

  // 🧭 Menu principal (items do meio)
  navMain: [
    {
      title: "Dashboard", // ← Nome que aparece
      url: "/dashboard", // ← Para onde vai
      icon: IconDashboard, // ← Ícone (importado do Tabler)
    },
    // ... mais items
  ],

  // 📄 Templates e Integrações (com submenus)
  navClouds: [
    {
      title: "Templates",
      icon: IconTemplate,
      url: "/dashboard/templates",
      items: [
        // ← Submenu!
        { title: "Meus Templates", url: "/..." },
        { title: "Templates Públicos", url: "/..." },
      ],
    },
  ],

  // ⚙️ Menu secundário (final do sidebar)
  navSecondary: [
    { title: "Pesquisar", url: "/dashboard/search", icon: IconSearch },
    { title: "Ajuda", url: "/help", icon: IconHelp },
    { title: "Configurações", url: "/dashboard/settings", icon: IconSettings },
  ],
};
```

**Linha 129-156: JSX do Sidebar** - A estrutura visual

```tsx
<Sidebar>
  <SidebarHeader>
    {" "}
    {/* 🔝 Cabeçalho: Logo + Nome */}
    <Logo /> Formaly
  </SidebarHeader>

  <SidebarContent>
    {" "}
    {/* 📦 Conteúdo: Menus */}
    <NavMain items={data.navMain} />
    <NavDocuments items={data.navClouds} />
    <NavSecondary items={data.navSecondary} />
  </SidebarContent>

  <SidebarFooter>
    {" "}
    {/* 🔽 Rodapé: Theme + User */}
    <ThemeSwitcher />
    <NavUser user={data.user} />
  </SidebarFooter>
</Sidebar>
```

---

### 2️⃣ **nav-main.tsx** - Menu Principal 🧭

Renderiza os itens do `navMain[]`.

**O que faz:**

- Recebe `items` do app-sidebar
- Renderiza cada item como botão
- Marca o item ativo baseado na URL atual
- Usa `usePathname()` para saber onde você está

**Estrutura:**

```tsx
{
  items.map((item) => (
    <Link href={item.url}>
      <item.icon /> {/* Ícone do Tabler */}
      <span>{item.title}</span> {/* Nome do item */}
    </Link>
  ));
}
```

---

### 3️⃣ **nav-secondary.tsx** - Menu Secundário ⚙️

Igual ao nav-main, mas para itens secundários.

**Diferença:** Fica no final do sidebar (antes do footer) com `className="mt-auto"`.

---

### 4️⃣ **nav-documents.tsx** - Templates Expandíveis 📄

Menu com subitens que expandem/colapsam.

**Estrutura:**

```tsx
<Collapsible>
  <CollapsibleTrigger>
    Templates ▼ {/* Clica para expandir */}
  </CollapsibleTrigger>
  <CollapsibleContent>
    - Meus Templates {/* Subitens */}- Templates Públicos - Favoritos
  </CollapsibleContent>
</Collapsible>
```

---

### 5️⃣ **nav-user.tsx** - Perfil do Usuário 👤

Dropdown com avatar, nome, email e ações.

**Recebe:**

```tsx
user = {
  name: "Alexandre Garcia",
  email: "alexandre@formaly.com",
  avatar: "/avatars/user.jpg",
};
```

**Mostra:**

- Avatar circular
- Nome e email
- Dropdown ao clicar (Account, Settings, Logout, etc)

---

### 6️⃣ **theme-switcher.tsx** - Troca de Tema 🎨

Botões para mudar entre System/Light/Dark.

**Como funciona:**

- Usa `next-themes` (biblioteca instalada)
- Salva no localStorage automaticamente
- 3 botões com ícones bonitos

---

### 7️⃣ **ui/sidebar.tsx** - Componentes Base 🎨

Componentes do Shadcn (framework de UI).

**NÃO MEXA AQUI!** Só se quiser customizar profundamente.

Exporta:

- `Sidebar` - Container principal
- `SidebarHeader` - Cabeçalho
- `SidebarContent` - Corpo
- `SidebarFooter` - Rodapé
- `SidebarMenu`, `SidebarMenuItem`, etc - Estrutura interna

---

## 🎨 COMO PERSONALIZAR?

### ✅ Adicionar um novo item no menu

**1. Importe o ícone (topo do app-sidebar.tsx):**

```tsx
import { IconRocket } from "@tabler/icons-react";
```

**2. Adicione no array `navMain`:**

```tsx
navMain: [
  // ... items existentes
  {
    title: "Minha Nova Página",
    url: "/dashboard/nova-pagina",
    icon: IconRocket,
  },
],
```

**3. Crie a página:**

```tsx
// src/app/dashboard/nova-pagina/page.tsx
export default function NovaPagina() {
  return <h1>Minha Nova Página!</h1>;
}
```

Pronto! O item aparece no menu automaticamente.

---

### ✅ Mudar o nome do usuário

**Em app-sidebar.tsx, linha 34:**

```tsx
user: {
  name: "Seu Nome Aqui",           // ← Mude aqui
  email: "seuemail@formaly.com",  // ← E aqui
  avatar: "/avatars/user.jpg",
},
```

---

### ✅ Remover um item do menu

**Simplesmente delete/comente o objeto no array:**

```tsx
navMain: [
  // {
  //   title: "Equipe",
  //   url: "/dashboard/team",
  //   icon: IconUsers,
  // },  ← Comentado = não aparece
],
```

---

### ✅ Adicionar submenu expandível

**Adicione em `navClouds`:**

```tsx
navClouds: [
  {
    title: "Relatórios",
    icon: IconFileAnalytics,
    url: "/dashboard/relatorios",
    items: [
      { title: "Mensais", url: "/dashboard/relatorios/mensais" },
      { title: "Anuais", url: "/dashboard/relatorios/anuais" },
    ],
  },
],
```

Isso cria um item clicável que expande mostrando os subitens!

---

### ✅ Mudar cores do sidebar

**Em globals.css (já configurado):**

```css
:root {
  --sidebar: oklch(0.975 0.002 286); /* Cor de fundo */
  --sidebar-foreground: oklch(...); /* Cor do texto */
  --sidebar-border: oklch(...); /* Cor da borda */
}

.dark {
  --sidebar: oklch(...); /* Cores para dark mode */
}
```

---

### ✅ Mudar logo e nome

**Em app-sidebar.tsx, linha 135:**

```tsx
<Link href="/dashboard" className="flex items-center gap-2">
  <Logo className="size-6!" /> {/* ← Componente de logo */}
  <span className="text-lg font-bold">Formaly</span> {/* ← Nome */}
</Link>
```

Para mudar o logo, edite: `src/components/landing/logo.tsx`

---

### ✅ Reordenar itens

**Simplesmente reordene os objetos no array:**

```tsx
navMain: [
  { title: "Dashboard", ... },
  { title: "Analytics", ... },     // ← Mova para cima
  { title: "Formulários", ... },   // ← Mova para baixo
],
```

A ordem no código = ordem no sidebar!

---

## 🔧 DICAS AVANÇADAS

### 💡 Badges nos itens

Em nav-main.tsx ou nav-secondary.tsx, adicione:

```tsx
<span className="ml-auto text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
  New
</span>
```

### 💡 Ícones customizados

Procure no [Tabler Icons](https://tabler.io/icons):

```tsx
import { IconSeuIcone } from "@tabler/icons-react";
```

### 💡 Sidebar colapsável

Já está configurado! Clique no botão hamburger (☰) para colapsar/expandir.

---

## 🎯 RESUMO - Onde mexer para cada coisa

| O que você quer fazer | Arquivo              | Linha aproximada           |
| --------------------- | -------------------- | -------------------------- |
| Adicionar item menu   | `app-sidebar.tsx`    | 33-126 (objeto `data`)     |
| Mudar nome usuário    | `app-sidebar.tsx`    | 34-38 (objeto `user`)      |
| Mudar logo/nome app   | `app-sidebar.tsx`    | 135-140                    |
| Adicionar submenu     | `app-sidebar.tsx`    | 64-103 (array `navClouds`) |
| Mudar cores           | `globals.css`        | 6-42                       |
| Customizar tema       | `theme-switcher.tsx` | Todo o arquivo             |
| Mudar comportamento   | `ui/sidebar.tsx`     | (Avançado)                 |

---

## 🚀 Fluxo de Dados

```
app-sidebar.tsx
    ↓ (passa data.navMain)
nav-main.tsx
    ↓ (renderiza items)
Sidebar visível na tela!
```

```
dashboard/layout.tsx
    ↓ (usa <SidebarProvider>)
    ↓ (renderiza <AppSidebar>)
app-sidebar.tsx
    ↓ (compõe todos os componentes)
Sidebar completo!
```

---

## 📚 Próximos Passos

1. **Abra `app-sidebar.tsx`** - 90% das mudanças são aqui
2. **Teste adicionar um item** no `navMain`
3. **Mude o nome do usuário** para ver a mudança
4. **Experimente os ícones** do Tabler Icons
5. **Brinque com as cores** no `globals.css`

---

## 🆘 Dúvidas Frequentes

**Q: Como adiciono um badge "Beta"?**
A: Em nav-main.tsx, adicione `<span>Beta</span>` após o título.

**Q: Como mudo a largura do sidebar?**
A: No `ui/sidebar.tsx`, procure por `--sidebar-width`.

**Q: Como faço o sidebar ficar sempre aberto?**
A: Mude `collapsible="offcanvas"` para `collapsible="none"` em app-sidebar.tsx.

**Q: Os ícones não aparecem!**
A: Certifique-se de importar do `@tabler/icons-react` no topo do arquivo.

---

🎉 **Agora você é expert em customizar o sidebar!**

Qualquer dúvida, me pergunte! 😊
