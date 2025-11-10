# Migração para Next.js 16 + NextAuth v5 - Implementação Correta

## 📚 Resumo das Mudanças

Este documento descreve a implementação **correta** da autenticação seguindo os padrões atualizados do **Next.js 16** e **NextAuth v5 (Auth.js)**.

---

## ✅ O Que Foi Implementado

### 1. **Proxy (Substituindo Middleware)**

**Arquivo**: `src/proxy.ts`

Next.js 16 renomeou `middleware` para `proxy`. A funcionalidade é a mesma, mas com nome atualizado:

```typescript
// ✅ CORRETO - Next.js 16
export default async function proxy(req: NextRequest) {
  const session = await auth();
  // Lógica de proteção de rotas
}

// ❌ ERRADO - Padrão antigo
export default async function middleware(req: NextRequest) {
  // ...
}
```

**Funcionalidades**:
- Redireciona usuários não autenticados para `/login`
- Redireciona usuários autenticados de rotas públicas para `/dashboard`
- Usa `auth()` do NextAuth v5 para verificar sessão

---

### 2. **Dashboard Layout com Server Component**

**Arquivos**: 
- `src/app/dashboard/layout.tsx` (Server Component - Proteção)
- `src/app/dashboard/layout-client.tsx` (Client Component - UI)

**Padrão Correto Next.js 16 + NextAuth v5**:

```typescript
// layout.tsx - Server Component (PROTEÇÃO NO SERVIDOR)
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login"); // ✅ Redireciona ANTES de renderizar cliente
  }

  return <DashboardLayoutClient session={session}>{children}</DashboardLayoutClient>;
}
```

**Por que isso é importante**:
- ✅ Proteção acontece **no servidor** antes de qualquer código cliente
- ✅ Elimina o "flash" de conteúdo protegido
- ✅ Mais seguro (não expõe rotas protegidas ao cliente)
- ✅ Melhor performance (menos JavaScript no cliente)

---

### 3. **Providers Sem SessionProvider no Root**

**Arquivo**: `src/components/providers/Providers.tsx`

**Mudança Crítica**:

```typescript
// ❌ ERRADO - NextAuth v4 / Next.js 13-14
export function Providers({ children }) {
  return (
    <SessionProvider>  {/* ❌ Não deve estar aqui */}
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}

// ✅ CORRETO - NextAuth v5 / Next.js 16
export function Providers({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}
```

**Regra do NextAuth v5**:
- ❌ **NÃO** colocar `SessionProvider` no root layout (Server Component)
- ✅ `SessionProvider` apenas em Client Components que usam `useSession()`
- ✅ Server Components usam `auth()` diretamente

---

## 🎯 Fluxo de Autenticação Correto

### **OAuth Login (Google, GitHub, Facebook)**

1. Usuário clica em "Login with Google"
2. NextAuth redireciona para OAuth provider
3. Após autorização, callback retorna para `/api/auth/callback/google`
4. NextAuth:
   - Cria sessão JWT
   - **Chama callback `jwt()`** → Salva provider data no token
   - **Chama callback `session()`** → Expõe dados na sessão
5. **Proxy intercepta** e verifica sessão
6. Se autenticado, redireciona para `/dashboard`
7. **Server Component** `layout.tsx` verifica sessão e renderiza

### **Email/Password Login**

1. Usuário preenche formulário de login
2. `AuthContext.login()` → POST `/api/auth/login`
3. Backend retorna cookie HTTP-only
4. `AuthContext.refreshUser()` → GET `/api/auth/me` (valida cookie)
5. Se válido, atualiza state e redireciona para `/dashboard`

---

## 📋 Checklist de Implementação

- [x] **Proxy criado** (`src/proxy.ts`)
- [x] **Server Component layout** para dashboard
- [x] **Client Component separado** para UI interativa
- [x] **SessionProvider removido** do root layout
- [x] **AuthContext simplificado** (apenas email/password)
- [x] **Build passando sem erros**
- [ ] **Testar OAuth login** (Google/GitHub/Facebook)
- [ ] **Testar email/password login**
- [ ] **Testar refresh de página** (sessão deve persistir)

---

## 🔧 Arquitetura Final

```
Next.js App
├── src/proxy.ts                    ✅ Proteção global de rotas
├── src/lib/auth.ts                 ✅ Configuração NextAuth v5
├── src/contexts/AuthContext.tsx    ✅ State para email/password
│
├── src/app/
│   ├── layout.tsx                  ✅ Server Component (root)
│   ├── login/                      ✅ Página de login
│   └── dashboard/
│       ├── layout.tsx              ✅ Server Component (proteção)
│       └── layout-client.tsx       ✅ Client Component (UI)
│
└── src/components/providers/
    └── Providers.tsx               ✅ ThemeProvider + AuthProvider
```

---

## 📚 Documentação Consultada

1. **Next.js 16 Upgrade Guide**: https://nextjs.org/docs/app/guides/upgrading/version-16
   - Renomeação `middleware` → `proxy`
   - Server Components como padrão

2. **NextAuth v5 (Auth.js)**: https://authjs.dev
   - `auth()` em Server Components
   - SessionProvider apenas em Client Components específicos
   - Callbacks `jwt()` e `session()` para OAuth

---

## 🚀 Próximos Passos

1. **Testar OAuth login** em desenvolvimento:
   ```bash
   npm run dev
   ```

2. **Verificar cookies** nas DevTools:
   - Deve existir cookie `authjs.session-token` (NextAuth)
   - Deve existir cookie `connect.sid` ou similar (backend)

3. **Testar cenários**:
   - Login com Google → Dashboard
   - Refresh da página → Sessão mantida
   - Logout → Redireciona para login
   - Acesso direto a `/dashboard` sem autenticação → Redireciona para login

4. **Remover componentes antigos**:
   - `ProtectedRoute.tsx` (não é mais necessário)
   - Logs de debug do `AuthContext`

---

## ⚠️ Padrões Depreciados (NÃO USAR)

```typescript
// ❌ middleware.ts (renomeado para proxy.ts)
export default function middleware(req) { }

// ❌ SessionProvider no root layout
<SessionProvider>
  <App />
</SessionProvider>

// ❌ ProtectedRoute client-side
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// ❌ getServerSession (NextAuth v4)
const session = await getServerSession(authOptions);

// ❌ useSession() sem SessionProvider
const { data: session } = useSession();
```

---

## ✅ Padrões Corretos (USAR)

```typescript
// ✅ proxy.ts (Next.js 16)
export default async function proxy(req) { }

// ✅ Server Component com auth()
const session = await auth();
if (!session) redirect("/login");

// ✅ SessionProvider apenas onde necessário
<SessionProvider>
  <ClientComponentThatNeedsSession />
</SessionProvider>

// ✅ auth() em Server Components
import { auth } from "@/lib/auth";
const session = await auth();
```

---

## 📝 Notas Finais

Esta implementação segue **exatamente** os padrões recomendados pela documentação oficial do Next.js 16 e NextAuth v5. Qualquer desvio desses padrões pode causar:

- Loops de redirecionamento
- Sessões não persistindo
- Erros de hidratação
- Problemas de performance

**Sempre consulte a documentação oficial antes de fazer mudanças!**
