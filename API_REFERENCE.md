# 📚 Formaly Backend - Referência Completa para Frontend

## 🎯 Visão Geral

Backend NestJS + Fastify + Prisma + PostgreSQL para sistema de criação e gerenciamento de formulários.

**URL Base**: `http://localhost:3333/api`

---

## 🗄️ Estrutura do Banco de Dados

### **User** (Usuários)
```typescript
{
  id: string          // cuid
  email: string       // único
  name: string
  image?: string      // URL da foto
  password?: string   // Hash bcrypt (null se OAuth)
  createdAt: DateTime
  updatedAt: DateTime
}
```

### **Account** (Contas OAuth)
```typescript
{
  id: string
  userId: string
  provider: 'google' | 'github' | 'facebook' | 'credentials'
  providerId: string       // ID do provedor
  accessToken?: string
  refreshToken?: string
  expiresAt?: DateTime     // Expiração do token
  createdAt: DateTime
  updatedAt: DateTime
}
```

### **Form** (Formulários)
```typescript
{
  id: string              // cuid - usado na URL: /f/{id}
  userId: string
  name: string
  description?: string
  status: 'ACTIVE' | 'INACTIVE'
  
  // Configurações
  passwordHash?: string              // Senha para acessar (bcrypt)
  maxResponses?: number              // Limite de respostas
  expiresAt?: DateTime               // Data de expiração
  successMessage?: string            // Mensagem após envio
  allowMultipleSubmissions: boolean  // Permitir múltiplas respostas (default: true)
  
  // Clonagem
  clonedFromId?: string   // ID do form original
  
  createdAt: DateTime
  updatedAt: DateTime
  deletedAt?: DateTime    // Soft delete
}
```

### **FormField** (Campos do Formulário)
```typescript
{
  id: string
  formId: string
  type: 'text' | 'email' | 'phone' | 'textarea' | 'number' | 'date' | 
        'select' | 'radio' | 'checkbox' | 'file'
  label: string
  name: string            // Único por formulário
  required: boolean
  order: number           // Ordem de exibição
  config?: {              // JSON com configurações específicas
    placeholder?: string
    options?: string[]    // Para select/radio/checkbox
    maxSize?: number      // Para file (5MB max)
    accept?: string[]     // Para file (mimeTypes)
    min?: number          // Para number
    max?: number          // Para number
  }
  createdAt: DateTime
}
```

### **FormSubmission** (Respostas)
```typescript
{
  id: string
  formId: string
  userId: string              // Dono do formulário
  
  fingerprint?: string        // Hash IP + User-Agent (validar duplicatas)
  respondentEmail?: string    // Email do respondente
  respondentName?: string     // Nome do respondente
  
  userAgent?: string
  device?: 'desktop' | 'mobile'
  
  createdAt: DateTime
  updatedAt: DateTime         // Se permitir edição
}
```

### **FormValue** (Valores dos Campos)
```typescript
{
  id: string
  submissionId: string
  fieldId?: string        // null se campo foi deletado
  
  // Snapshots (preservam histórico)
  fieldLabel: string      // "Nome Completo"
  fieldType: string       // "text"
  
  value?: any             // JSON: string, number, array, etc
  createdAt: DateTime
}
```

### **FormView** (Rastreamento de Visualizações)
```typescript
{
  formId: string          // Composite PK
  fingerprint: string     // Composite PK (Hash IP + User-Agent)
  createdAt: DateTime
}
```

### **FormFile** (Arquivos Enviados)
```typescript
{
  id: string
  submissionId: string
  fieldId?: string        // null se campo foi deletado
  
  // Snapshots
  fieldLabel: string
  fieldType: string
  
  filename: string        // uuid.ext
  originalName: string    // nome_original.pdf
  url: string             // URL do storage
  size: number            // bytes
  mimeType: string        // application/pdf
  createdAt: DateTime
}
```

---

## 🔐 Autenticação

### **POST /api/auth/sync**
Sincroniza usuário OAuth com o banco.

**Request**:
```typescript
{
  email: string
  name: string
  image?: string
  provider: 'google' | 'github' | 'facebook'
  providerId: string
  accessToken?: string
  refreshToken?: string
  expiresAt?: number  // Unix timestamp (converter para DateTime)
}
```

**Response**:
```typescript
{
  user: {
    id: string
    email: string
    name: string
    image?: string
  },
  token: string  // JWT
}
```

---

## 📝 Formulários (Autenticados)

### **POST /api/forms**
Criar formulário.

**Headers**: `Authorization: Bearer {token}`

**Request**:
```typescript
{
  name: string
  description?: string
  password?: string              // Senha em texto (backend faz hash)
  maxResponses?: number
  expiresAt?: string            // ISO 8601
  successMessage?: string
  allowMultipleSubmissions?: boolean
  fields: [
    {
      type: string
      label: string
      name: string
      required: boolean
      order: number
      config?: object
    }
  ]
}
```

**Response**:
```typescript
{
  id: string
  name: string
  url: string  // /f/{id}
  createdAt: string
}
```

---

### **GET /api/forms**
Listar formulários do usuário.

**Headers**: `Authorization: Bearer {token}`

**Query Params**:
- `page?: number` (default: 1)
- `limit?: number` (default: 20)
- `status?: 'ACTIVE' | 'INACTIVE'`

**Response**:
```typescript
{
  data: [
    {
      id: string
      name: string
      description?: string
      status: string
      _count: {
        submissions: number
        views: number
      }
      createdAt: string
      updatedAt: string
    }
  ],
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

---

### **GET /api/forms/:id**
Detalhes do formulário.

**Headers**: `Authorization: Bearer {token}`

**Response**:
```typescript
{
  id: string
  name: string
  description?: string
  status: string
  hasPassword: boolean  // Não retorna o hash
  maxResponses?: number
  expiresAt?: string
  successMessage?: string
  allowMultipleSubmissions: boolean
  fields: [
    {
      id: string
      type: string
      label: string
      name: string
      required: boolean
      order: number
      config?: object
    }
  ],
  _count: {
    submissions: number
    views: number
  },
  createdAt: string
  updatedAt: string
}
```

---

### **PUT /api/forms/:id**
Atualizar formulário.

**Headers**: `Authorization: Bearer {token}`

**Request**: Mesmos campos do POST (todos opcionais)

**Response**: Formulário atualizado

---

### **DELETE /api/forms/:id**
Deletar formulário (soft delete).

**Headers**: `Authorization: Bearer {token}`

**Response**: `204 No Content`

**Nota**: Se tiver respostas, retorna `409 Conflict` pedindo confirmação.

---

### **POST /api/forms/:id/clone**
Clonar formulário.

**Headers**: `Authorization: Bearer {token}`

**Response**: Novo formulário criado

---

### **GET /api/forms/:id/submissions**
Listar respostas do formulário.

**Headers**: `Authorization: Bearer {token}`

**Query Params**:
- `page?: number`
- `limit?: number`
- `email?: string` (filtrar por respondentEmail)

**Response**:
```typescript
{
  data: [
    {
      id: string
      respondentEmail?: string
      respondentName?: string
      device?: string
      values: [
        {
          fieldLabel: string
          fieldType: string
          value: any
          isDeleted: boolean  // Campo foi removido?
        }
      ],
      files: [
        {
          fieldLabel: string
          originalName: string
          url: string
          size: number
          mimeType: string
        }
      ],
      createdAt: string
      updatedAt: string
    }
  ],
  pagination: { ... }
}
```

---

## 🌐 Formulários Públicos (Sem Autenticação)

### **GET /f/:id**
Visualizar formulário público.

**Response**:
```typescript
{
  id: string
  name: string
  description?: string
  hasPassword: boolean
  isExpired: boolean
  isFull: boolean  // maxResponses atingido
  successMessage?: string
  fields: [
    {
      id: string
      type: string
      label: string
      name: string
      required: boolean
      order: number
      config?: object
    }
  ]
}
```

**Erros**:
- `404`: Formulário não encontrado ou inativo
- `410`: Formulário expirado

---

### **POST /f/:id/validate-password**
Validar senha do formulário.

**Request**:
```typescript
{
  password: string
}
```

**Response**:
```typescript
{
  valid: boolean
}
```

---

### **POST /f/:id/submit**
Enviar resposta.

**Request**:
```typescript
{
  password?: string  // Se formulário protegido
  respondentEmail?: string
  respondentName?: string
  values: {
    [fieldName: string]: any  // "nome": "João", "email": "joao@email.com"
  },
  files?: {
    [fieldName: string]: File  // Upload via multipart/form-data
  }
}
```

**Response**:
```typescript
{
  id: string
  message: string  // successMessage do form ou padrão
}
```

**Erros**:
- `400`: Validação falhou (campos obrigatórios, etc)
- `401`: Senha incorreta
- `409`: Já respondeu (se allowMultipleSubmissions = false)
- `410`: Formulário expirado
- `429`: Limite de respostas atingido

---

## 📊 Dashboard (Analytics)

### **GET /api/dashboard/stats**
KPIs gerais.

**Headers**: `Authorization: Bearer {token}`

**Response**:
```typescript
{
  totalForms: number
  activeForms: number
  totalSubmissions: number
  totalViews: number
  submissionsThisMonth: number
  viewsThisMonth: number
}
```

---

### **GET /api/dashboard/recent-forms**
Formulários recentes.

**Headers**: `Authorization: Bearer {token}`

**Query Params**: `limit?: number` (default: 5)

**Response**:
```typescript
{
  data: [
    {
      id: string
      name: string
      _count: {
        submissions: number
        views: number
      }
      createdAt: string
    }
  ]
}
```

---

## ⚙️ Regras de Negócio

### **Validação de Duplicatas**
```typescript
if (!form.allowMultipleSubmissions) {
  const fingerprint = createFingerprint(ip, userAgent)
  const exists = await prisma.formSubmission.findFirst({
    where: { formId, fingerprint }
  })
  if (exists) throw new ConflictException('Você já respondeu')
}
```

### **Validação de Expiração**
```typescript
if (form.expiresAt && form.expiresAt < new Date()) {
  throw new GoneException('Formulário expirado')
}
```

### **Validação de Limite**
```typescript
if (form.maxResponses) {
  const count = await prisma.formSubmission.count({ where: { formId } })
  if (count >= form.maxResponses) {
    throw new TooManyRequestsException('Limite atingido')
  }
}
```

### **Rastreamento de Views**
```typescript
// Criar view única (composite PK evita duplicatas)
await prisma.formView.create({
  data: {
    formId,
    fingerprint: createFingerprint(ip, userAgent)
  }
})
```

### **Snapshots de Campos**
```typescript
// Ao criar FormValue, sempre salvar snapshot
await prisma.formValue.create({
  data: {
    submissionId,
    fieldId: field.id,
    fieldLabel: field.label,  // Snapshot
    fieldType: field.type,    // Snapshot
    value: submittedValue
  }
})
```

---

## 🔧 Utilitários

### **createFingerprint(ip, userAgent)**
```typescript
import crypto from 'crypto'

function createFingerprint(ip: string, userAgent: string): string {
  return crypto
    .createHash('sha256')
    .update(`${ip}:${userAgent}`)
    .digest('hex')
}
```

### **detectDevice(userAgent)**
```typescript
function detectDevice(userAgent: string): 'desktop' | 'mobile' {
  const mobileRegex = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  return mobileRegex.test(userAgent) ? 'mobile' : 'desktop'
}
```

---

## 🚀 Fluxos Principais

### **1. Criar e Compartilhar Formulário**
```
Frontend → POST /api/forms → Backend cria form
Backend retorna URL: /f/{id}
Usuário compartilha link
```

### **2. Responder Formulário**
```
Anônimo acessa /f/{id}
Frontend → GET /f/{id} → Carrega campos
Se hasPassword → POST /f/{id}/validate-password
Usuário preenche → POST /f/{id}/submit
Backend valida e salva → Retorna successMessage
```

### **3. Visualizar Respostas**
```
Dono → GET /api/forms/{id}/submissions
Backend retorna respostas com snapshots
Frontend exibe mesmo se campos foram deletados
```

---

## 📦 Tipos TypeScript (Frontend)

```typescript
// types/form.ts
export type FormStatus = 'ACTIVE' | 'INACTIVE'

export type FieldType = 
  | 'text' | 'email' | 'phone' | 'textarea' | 'number' | 'date'
  | 'select' | 'radio' | 'checkbox' | 'file'

export interface Form {
  id: string
  name: string
  description?: string
  status: FormStatus
  hasPassword: boolean
  maxResponses?: number
  expiresAt?: string
  successMessage?: string
  allowMultipleSubmissions: boolean
  fields: FormField[]
  _count?: {
    submissions: number
    views: number
  }
  createdAt: string
  updatedAt: string
}

export interface FormField {
  id: string
  type: FieldType
  label: string
  name: string
  required: boolean
  order: number
  config?: {
    placeholder?: string
    options?: string[]
    maxSize?: number
    accept?: string[]
    min?: number
    max?: number
  }
}

export interface FormSubmission {
  id: string
  respondentEmail?: string
  respondentName?: string
  device?: string
  values: FormValue[]
  files: FormFile[]
  createdAt: string
  updatedAt: string
}

export interface FormValue {
  fieldLabel: string
  fieldType: string
  value: any
  isDeleted: boolean
}

export interface FormFile {
  fieldLabel: string
  originalName: string
  url: string
  size: number
  mimeType: string
}
```

---

## ✅ Checklist de Implementação Frontend

### **Landing Page**
- [ ] Hero section
- [ ] Features
- [ ] CTA para login

### **Autenticação**
- [ ] Login com Google/GitHub/Facebook
- [ ] Callback OAuth → POST /api/auth/sync
- [ ] Armazenar JWT no localStorage/cookie

### **Dashboard**
- [ ] GET /api/dashboard/stats
- [ ] GET /api/forms (lista de formulários)
- [ ] Cards com _count.submissions e _count.views

### **Form Builder**
- [ ] Drag-and-drop de campos
- [ ] Configuração de cada campo (label, required, config)
- [ ] POST /api/forms para salvar
- [ ] PUT /api/forms/:id para atualizar

### **Formulário Público**
- [ ] GET /f/:id para carregar
- [ ] Validar senha se hasPassword
- [ ] Renderizar campos dinamicamente
- [ ] POST /f/:id/submit
- [ ] Exibir successMessage

### **Respostas**
- [ ] GET /api/forms/:id/submissions
- [ ] Tabela com valores
- [ ] Filtro por email
- [ ] Exportar CSV/Excel

---

**Documentação completa! Use como referência para implementar o frontend.** 🎉
