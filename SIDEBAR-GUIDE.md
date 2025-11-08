# 📖 Guia Rápido - Sidebar

> **Para modificar a sidebar, você só precisa editar 1 arquivo!**

## 🎯 Arquivo Principal

```
src/config/sidebar.config.ts
```

**Este é o ÚNICO arquivo que você precisa modificar para:**

- ✅ Adicionar/remover links
- ✅ Alterar ordem dos links
- ✅ Mudar ícones
- ✅ Atualizar dados do usuário

---

## 📍 Como Adicionar um Link

**1. Importe o ícone:**

```typescript
import { IconNovo } from "@tabler/icons-react";
```

**2. Adicione ao array `mainLinks` ou `secondaryLinks`:**

```typescript
export const mainLinks = [
  // ... links existentes
  {
    title: "Novo Link",
    url: "/dashboard/novo",
    icon: IconNovo,
  },
];
```

**Pronto! O link aparecerá automaticamente na sidebar.**

---

## 🗑️ Como Remover um Link

Simplesmente delete o objeto correspondente do array:

```typescript
export const mainLinks = [
  // Delete esta linha completa ❌
  // { title: "Analytics", url: "/dashboard/analytics", icon: IconChartBar },
];
```

---

## 🔄 Como Alterar a Ordem

Reordene os itens no array:

```typescript
export const mainLinks = [
  { title: "Formulários", url: "/dashboard/forms", icon: IconForms }, // Era 2º, agora é 1º
  { title: "Dashboard", url: "/dashboard", icon: IconLayoutDashboard }, // Era 1º, agora é 2º
  // ... resto dos links
];
```

---

## 👤 Como Alterar Dados do Usuário

```typescript
export const sidebarUser = {
  name: "Seu Nome", // ← Modifique aqui
  email: "seu@email.com", // ← Modifique aqui
  avatar: "/avatars/foto.jpg", // ← Modifique aqui
};
```

---

## 🎨 Ícones Disponíveis

Todos os ícones são do **Tabler Icons**:

- https://tabler.io/icons

**Como usar:**

1. Encontre o ícone no site
2. Converta o nome para PascalCase com prefixo "Icon"
3. Importe no arquivo

**Exemplos:**

- `calendar` → `IconCalendar`
- `file-text` → `IconFileText`
- `chart-bar` → `IconChartBar`

---

## 📂 Estrutura

```
src/
├── config/
│   └── sidebar.config.ts     ← 🎯 MODIFIQUE AQUI
└── components/
    └── dashboard/
        ├── app-sidebar.tsx   ← Apenas usa os dados
        ├── nav-main.tsx      ← Renderiza links principais
        ├── nav-secondary.tsx ← Renderiza links secundários
        └── nav-user.tsx      ← Renderiza menu do usuário
```

---

## ✅ Checklist Rápido

Quando for adicionar/modificar a sidebar:

1. ✅ Abri o arquivo `src/config/sidebar.config.ts`?
2. ✅ Importei os ícones necessários?
3. ✅ Adicionei/modifiquei no array correto (`mainLinks` ou `secondaryLinks`)?
4. ✅ Salvei o arquivo?

**Pronto! Não precisa tocar em mais nenhum arquivo!**

---

## 🚀 Exemplo Completo

```typescript
// 1. Importe os ícones
import {
  IconLayoutDashboard,
  IconForms,
  IconNovo, // ← Novo ícone
} from "@tabler/icons-react";

// 2. Adicione ao array
export const mainLinks = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconLayoutDashboard,
  },
  {
    title: "Formulários",
    url: "/dashboard/forms",
    icon: IconForms,
  },
  {
    title: "Nova Página", // ← Novo link
    url: "/dashboard/nova", // ← Nova URL
    icon: IconNovo, // ← Novo ícone
  },
];
```

---

## ⚠️ Importante

- **NÃO modifique** os arquivos em `src/components/dashboard/`
- **Todos os dados** devem estar em `sidebar.config.ts`
- O sistema **atualiza automaticamente** quando você modifica o config

---

## 🆘 Precisa de Ajuda?

Se você precisa adicionar **submenus** ou funcionalidades mais complexas, consulte o arquivo `SIDEBAR-ANALYSIS.md` para entender a estrutura completa.
