# 🔌 Integração com Backend (NestJS + Fastify)

Este documento descreve como o frontend se integra com a API backend.

## 📋 Responsabilidades

### 🎨 Frontend (Next.js)

- ✅ Interface do usuário
- ✅ Validações básicas de formulário
- ✅ Estado local (campos, drag-and-drop)
- ✅ Comunicação com API via `FormsService`

### ⚙️ Backend (NestJS + Fastify)

- ✅ Geração de links públicos (slugs únicos)
- ✅ Persistência de dados (banco de dados)
- ✅ Autenticação e autorização
- ✅ Validação de dados
- ✅ Lógica de negócio
- ✅ Hash de senhas de formulários

## 🚀 Endpoints Esperados

### Forms

| Método | Endpoint                   | Descrição                     | Body                     | Response             |
| ------ | -------------------------- | ----------------------------- | ------------------------ | -------------------- |
| POST   | `/api/forms`               | Criar formulário              | `CreateFormDTO`          | `FormResponse`       |
| GET    | `/api/forms`               | Listar formulários do usuário | -                        | `FormResponse[]`     |
| GET    | `/api/forms/:id`           | Buscar formulário específico  | -                        | `FormResponse`       |
| PUT    | `/api/forms/:id`           | Atualizar formulário          | `Partial<CreateFormDTO>` | `FormResponse`       |
| DELETE | `/api/forms/:id`           | Deletar formulário            | -                        | `void`               |
| GET    | `/api/forms/:id/responses` | Respostas do formulário       | -                        | `FormResponseData[]` |

### Public Forms (sem autenticação)

| Método | Endpoint                     | Descrição                     | Body                   | Response             |
| ------ | ---------------------------- | ----------------------------- | ---------------------- | -------------------- |
| GET    | `/f/:slug`                   | Visualizar formulário público | -                      | `PublicFormView`     |
| POST   | `/f/:slug`                   | Enviar resposta               | `FormSubmission`       | `SubmissionResponse` |
| POST   | `/f/:slug/validate-password` | Validar senha                 | `{ password: string }` | `{ valid: boolean }` |

## 📦 DTOs (Data Transfer Objects)

### CreateFormDTO

```typescript
{
  name: string;                // Obrigatório
  description?: string;        // Opcional
  password?: string;           // Opcional (será hasheado no backend)
  fields: FormField[];         // Array de campos
}
```

### FormField

```typescript
{
  id: string;                  // UUID gerado no frontend
  type: FieldType;             // 'text' | 'email' | 'phone' | etc
  label: string;               // Rótulo do campo
  placeholder?: string;        // Placeholder opcional
  required: boolean;           // Se é obrigatório
  options?: string[];          // Para select, radio, checkbox
}
```

### FormResponse

```typescript
{
  id: string;                  // UUID do formulário
  name: string;
  description?: string;
  publicLink: string;          // Gerado pelo backend: "/f/meu-formulario-123abc"
  fields: FormField[];
  createdAt: string;           // ISO 8601
  updatedAt: string;           // ISO 8601
}
```

## 🔐 Autenticação

O backend deve implementar autenticação (JWT) e o frontend enviará o token em todas as requisições:

```typescript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

## ⚠️ Validações Backend

O backend DEVE validar:

1. ✅ Nome do formulário não vazio
2. ✅ Tipos de campos válidos
3. ✅ Campos obrigatórios para tipos que precisam (select precisa de options)
4. ✅ Unicidade do slug gerado
5. ✅ Tamanho máximo de senha (8 caracteres)
6. ✅ Propriedade do formulário (usuário só pode editar seus formulários)

## 🔄 Fluxo de Criação

1. **Frontend**: Usuário preenche formulário e clica em "Salvar"
2. **Frontend**: Validação básica (nome não vazio)
3. **Frontend**: `FormsService.createForm()` envia para API
4. **Backend**: Valida dados completos
5. **Backend**: Gera slug único (`nome-do-formulario-abc123`)
6. **Backend**: Hash da senha (se fornecida)
7. **Backend**: Salva no banco de dados
8. **Backend**: Retorna `FormResponse` com `publicLink`
9. **Frontend**: Atualiza estado com link recebido
10. **Frontend**: Mostra toast de sucesso

## 📝 Exemplo de Request/Response

### Request: POST /api/forms

```json
{
  "name": "Cadastro de Clientes",
  "description": "Formulário para novos clientes",
  "password": "senha123",
  "fields": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "type": "text",
      "label": "Nome Completo",
      "placeholder": "Digite seu nome",
      "required": true
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "type": "email",
      "label": "E-mail",
      "placeholder": "seu@email.com",
      "required": true
    }
  ]
}
```

### Response: 201 Created

```json
{
  "id": "form-123-abc-456",
  "name": "Cadastro de Clientes",
  "description": "Formulário para novos clientes",
  "publicLink": "https://formaly.app/f/cadastro-de-clientes-x7k2p9",
  "fields": [...],
  "createdAt": "2025-11-08T10:30:00.000Z",
  "updatedAt": "2025-11-08T10:30:00.000Z"
}
```

## 🛠️ Como Integrar

1. Configure a variável de ambiente:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

2. O serviço `FormsService` já está preparado - basta descomentar o código real e remover o mock

3. Implemente os endpoints no backend seguindo a estrutura acima

4. Teste a integração!

## 📚 Próximos Passos

- [ ] Implementar autenticação (JWT)
- [ ] Adicionar tratamento de erros robusto
- [ ] Implementar toast notifications
- [ ] Adicionar loading states em todos os botões
- [ ] Implementar Preview do formulário
- [ ] Implementar visualização de Respostas
- [ ] Adicionar validação de formulários públicos
- [ ] Implementar sistema de submissão de respostas
