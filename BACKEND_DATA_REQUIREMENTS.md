# Backend Data Requirements - Formaly

Este documento detalha todos os tipos de dados, estruturas, filtros e agregações que o backend deve fornecer para alimentar o frontend.

---

## 1. AUTENTICAÇÃO E USUÁRIO

### 1.1. Dados do Usuário Autenticado
```typescript
interface User {
  id: string;                    // UUID
  email: string;
  name: string;
  image?: string;                // URL da foto de perfil
  createdAt: string;             // ISO 8601
  updatedAt: string;             // ISO 8601
}
```

**Quando usar:**
- Após login/callback OAuth
- Header do dashboard
- Dropdown de perfil do usuário

**Endpoint sugerido:** `GET /auth/me`

---

## 2. FORMULÁRIOS (CRUD)

### 2.1. Lista de Formulários
```typescript
interface FormListItem {
  id: string;                    // UUID
  title: string;
  description?: string;
  status: "draft" | "published" | "archived";
  isPublic: boolean;
  hasPassword: boolean;
  totalResponses: number;        // Contador de respostas
  totalViews: number;            // Contador de visualizações
  createdAt: string;             // ISO 8601
  updatedAt: string;             // ISO 8601
  lastResponseAt?: string;       // ISO 8601 - última resposta recebida
}

interface FormListResponse {
  data: FormListItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
```

**Filtros necessários:**
- `status`: "draft" | "published" | "archived" | "all"
- `search`: string (busca em title e description)
- `sortBy`: "createdAt" | "updatedAt" | "title" | "totalResponses"
- `sortOrder`: "asc" | "desc"
- `page`: number
- `pageSize`: number

**Endpoint sugerido:** `GET /forms?status=published&search=contato&sortBy=createdAt&sortOrder=desc&page=1&pageSize=10`

---

### 2.2. Detalhes do Formulário (para edição)
```typescript
interface FormField {
  id: string;                    // UUID único do campo
  type: "text" | "email" | "url" | "tel" | "number" | "textarea" | 
        "date" | "time" | "datetime" | "select" | "radio" | "checkbox";
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];            // Para select, radio, checkbox
  order: number;                 // Ordem de exibição
}

interface Form {
  id: string;
  userId: string;
  title: string;
  description?: string;
  fields: FormField[];           // Array de campos
  status: "draft" | "published" | "archived";
  isPublic: boolean;
  hasPassword: boolean;
  password?: string;             // Apenas se hasPassword = true
  createdAt: string;
  updatedAt: string;
}
```

**Endpoint sugerido:** `GET /forms/:id`

---

### 2.3. Formulário Público (para preenchimento)
```typescript
interface PublicForm {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];           // Mesma estrutura de FormField
  hasPassword: boolean;
  // NÃO retornar: userId, password, status
}
```

**Endpoint sugerido:** `GET /public/forms/:id`

**Validação de senha:** `POST /public/forms/:id/validate-password`
```typescript
interface PasswordValidation {
  password: string;
}

// Response
interface PasswordValidationResponse {
  valid: boolean;
}
```

---

## 3. RESPOSTAS

### 3.1. Lista de Respostas de um Formulário
```typescript
interface ResponseListItem {
  id: string;                    // UUID
  formId: string;
  data: Record<string, unknown>; // Dados do formulário (chave = fieldId, valor = resposta)
  submittedAt: string;           // ISO 8601
  ipAddress?: string;            // IP do respondente (opcional)
  userAgent?: string;            // User agent (para analytics)
  device?: "mobile" | "desktop" | "tablet";
  browser?: string;              // Chrome, Safari, Firefox, Edge
  location?: {
    country?: string;
    state?: string;
    city?: string;
  };
}

interface ResponseListResponse {
  data: ResponseListItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
```

**Filtros necessários:**
- `formId`: string (obrigatório)
- `startDate`: string (ISO 8601)
- `endDate`: string (ISO 8601)
- `device`: "mobile" | "desktop" | "tablet"
- `browser`: string
- `state`: string (filtro por estado)
- `sortBy`: "submittedAt"
- `sortOrder`: "asc" | "desc"
- `page`: number
- `pageSize`: number

**Endpoint sugerido:** `GET /responses?formId=xxx&startDate=2024-01-01&device=mobile&page=1&pageSize=10`

---

### 3.2. Detalhes de uma Resposta
```typescript
interface Response {
  id: string;
  formId: string;
  formTitle: string;             // Título do formulário (para contexto)
  data: Record<string, unknown>; // Dados completos
  submittedAt: string;
  ipAddress?: string;
  userAgent?: string;
  device?: "mobile" | "desktop" | "tablet";
  browser?: string;
  location?: {
    country?: string;
    state?: string;
    city?: string;
  };
}
```

**Endpoint sugerido:** `GET /responses/:id`

---

### 3.3. Exportação de Respostas
**Formatos:** CSV, Excel, JSON

**Endpoint sugerido:** `GET /responses/export?formId=xxx&format=csv&startDate=2024-01-01`

**Query params:**
- `formId`: string (obrigatório)
- `format`: "csv" | "excel" | "json"
- `startDate`: string (ISO 8601)
- `endDate`: string (ISO 8601)
- Mesmos filtros da lista de respostas

**Response:** Arquivo para download

---

## 4. DASHBOARD - ESTATÍSTICAS GERAIS

### 4.1. Estatísticas do Dashboard Principal
```typescript
interface DashboardStats {
  totalForms: number;
  totalResponses: number;
  totalViews: number;
  averageCompletionRate: number; // Percentual (0-100)
}
```

**Endpoint sugerido:** `GET /dashboard/stats`

---

### 4.2. Atividades Recentes
```typescript
interface Activity {
  id: string;
  type: "form_created" | "response_received" | "form_published" | "form_archived";
  message: string;               // Ex: "Nova resposta no formulário 'Contato'"
  formId?: string;
  formTitle?: string;
  timestamp: string;             // ISO 8601
}

interface ActivitiesResponse {
  data: Activity[];
  total: number;
}
```

**Endpoint sugerido:** `GET /dashboard/activities?limit=5`

**Query params:**
- `limit`: number (padrão: 5)

---

### 4.3. Últimas Respostas (Dashboard)
```typescript
interface LatestResponse {
  id: string;
  formId: string;
  formTitle: string;
  status: "completed" | "partial"; // completed = todos campos preenchidos
  submittedAt: string;
  device?: "mobile" | "desktop" | "tablet";
}

interface LatestResponsesResponse {
  data: LatestResponse[];
  total: number;
}
```

**Endpoint sugerido:** `GET /dashboard/latest-responses?limit=10`

**Query params:**
- `limit`: number (padrão: 10)

---

### 4.4. Gráfico de Respostas ao Longo do Tempo
```typescript
interface ResponsesOverTime {
  date: string;                  // YYYY-MM-DD
  count: number;
}

interface ResponsesOverTimeResponse {
  data: ResponsesOverTime[];
}
```

**Endpoint sugerido:** `GET /dashboard/responses-over-time?period=7d`

**Query params:**
- `period`: "7d" | "30d" | "90d" | "1y"

---

## 5. ANALYTICS - DADOS AGREGADOS

### 5.1. KPIs Principais
```typescript
interface AnalyticsKPIs {
  growth: {
    value: string;               // Ex: "+23.5%"
    trend: number;               // Valor absoluto: +156
    isPositive: boolean;
    description: string;         // "vs período anterior"
  };
  conversionRate: {
    value: number;               // Percentual: 68.4
    trend: number;               // Pontos percentuais: +5.2
    isPositive: boolean;
    description: string;         // "Submits / Acessos"
  };
  averageTime: {
    value: string;               // "2m 34s"
    trend: number;               // Segundos: -18
    isPositive: boolean;
    description: string;         // "Tempo de preenchimento"
  };
  engagement: {
    value: number;               // Score: 8.2
    maxValue: number;            // 10
    trend: number;               // +0.8
    isPositive: boolean;
    description: string;         // "Score de qualidade"
  };
}
```

**Endpoint sugerido:** `GET /analytics/kpis?period=30d`

**Query params:**
- `period`: "7d" | "30d" | "90d" | "1y"
- `formId`: string (opcional - para analytics de formulário específico)

---

### 5.2. Dados Temporais (Acessos vs Respostas)
```typescript
interface TemporalData {
  date: string;                  // YYYY-MM-DD
  acessos: number;               // Visualizações do formulário
  respostas: number;             // Submissões completadas
}

interface TemporalDataResponse {
  data: TemporalData[];
}
```

**Endpoint sugerido:** `GET /analytics/temporal?period=30d`

**Query params:**
- `period`: "7d" | "30d" | "90d" | "1y"
- `formId`: string (opcional)

---

### 5.3. Distribuição por Dispositivo
```typescript
interface DeviceDistribution {
  name: "Mobile" | "Desktop" | "Tablet";
  value: number;                 // Percentual
  count: number;                 // Quantidade absoluta
}

interface DeviceDistributionResponse {
  data: DeviceDistribution[];
  topDevice: string;             // Nome do dispositivo mais usado
}
```

**Endpoint sugerido:** `GET /analytics/devices?period=30d`

**Query params:**
- `period`: "7d" | "30d" | "90d" | "1y"
- `formId`: string (opcional)

---

### 5.4. Distribuição por Navegador
```typescript
interface BrowserDistribution {
  name: string;                  // Chrome, Safari, Firefox, Edge
  value: number;                 // Percentual
  count: number;                 // Quantidade absoluta
}

interface BrowserDistributionResponse {
  data: BrowserDistribution[];
  topBrowser: string;            // Nome do navegador mais usado
}
```

**Endpoint sugerido:** `GET /analytics/browsers?period=30d`

**Query params:**
- `period`: "7d" | "30d" | "90d" | "1y"
- `formId`: string (opcional)

---

### 5.5. Funil de Conversão
```typescript
interface FunnelStage {
  stage: string;                 // "Visualizaram Link", "Abriram Formulário", etc
  count: number;                 // Quantidade absoluta
  percentage: number;            // Percentual do total inicial
  dropoff: number;               // Percentual de abandono para próxima etapa
}

interface FunnelResponse {
  data: FunnelStage[];
  totalViews: number;            // Total de visualizações iniciais
  totalSubmissions: number;      // Total de submissões finais
  overallConversion: number;     // Taxa de conversão geral (%)
}
```

**Endpoint sugerido:** `GET /analytics/funnel?period=30d`

**Query params:**
- `period`: "7d" | "30d" | "90d" | "1y"
- `formId`: string (opcional)

**Etapas do funil:**
1. Visualizaram Link (100%)
2. Abriram Formulário
3. Completaram Campos
4. Enviaram Resposta

---

### 5.6. Heatmap de Atividade (Dia x Hora)
```typescript
interface HeatmapHour {
  hour: number;                  // 0-23
  value: number;                 // Quantidade de respostas
}

interface HeatmapDay {
  day: string;                   // "Dom", "Seg", "Ter", etc
  data: HeatmapHour[];
}

interface HeatmapResponse {
  data: HeatmapDay[];            // 7 dias
  peakDay: string;               // Dia com mais atividade
  peakHour: number;              // Hora com mais atividade
}
```

**Endpoint sugerido:** `GET /analytics/heatmap?period=30d`

**Query params:**
- `period`: "7d" | "30d" | "90d"
- `formId`: string (opcional)

---

### 5.7. Distribuição Geográfica
```typescript
interface LocationData {
  estado: string;                // Nome do estado
  acessos: number;
  respostas: number;
  taxa: number;                  // Taxa de conversão (%)
}

interface LocationResponse {
  data: LocationData[];
  bestConversion: {
    estado: string;
    taxa: number;
  };
}
```

**Endpoint sugerido:** `GET /analytics/locations?period=30d`

**Query params:**
- `period`: "7d" | "30d" | "90d" | "1y"
- `formId`: string (opcional)

---

### 5.8. Performance por Tipo de Campo
```typescript
interface FieldPerformance {
  tipo: string;                  // "Email", "Telefone", "Text", etc
  quantidade: number;            // Quantos campos desse tipo existem
  taxaPreenchimento: number;     // % de campos preenchidos
  tempoMedio: string;            // Tempo médio para preencher (ex: "12s")
  taxaErro: number;              // % de erros de validação
}

interface FieldPerformanceResponse {
  data: FieldPerformance[];
  problematicFields: string[];   // Tipos com baixa performance
}
```

**Endpoint sugerido:** `GET /analytics/field-performance?period=30d`

**Query params:**
- `period`: "7d" | "30d" | "90d" | "1y"
- `formId`: string (opcional)

**Critérios de campo problemático:**
- Taxa de preenchimento < 70%
- Taxa de erro > 5%

---

### 5.9. Ranking de Formulários
```typescript
interface FormRanking {
  rank: number;
  formId: string;
  nome: string;
  acessos: number;
  respostas: number;
  conversao: number;             // Taxa de conversão (%)
  tempo: string;                 // Tempo médio de preenchimento
  score: number;                 // Score de 1-5 estrelas
}

interface FormRankingResponse {
  data: FormRanking[];           // Top 5 formulários
  averageConversion: number;     // Média de conversão
  problematicForms: {
    formId: string;
    nome: string;
    issue: string;               // Descrição do problema
  }[];
}
```

**Endpoint sugerido:** `GET /analytics/form-ranking?period=30d`

**Query params:**
- `period`: "7d" | "30d" | "90d" | "1y"
- `limit`: number (padrão: 5)

**Cálculo do score (1-5 estrelas):**
- Taxa de conversão: 40%
- Tempo de preenchimento: 30%
- Taxa de completude: 30%

---

## 6. RASTREAMENTO E COLETA DE DADOS

### 6.1. Dados a Coletar em Cada Resposta

**Obrigatórios:**
- `formId`: UUID do formulário
- `data`: Respostas dos campos (Record<fieldId, value>)
- `submittedAt`: Timestamp ISO 8601

**Opcionais (para analytics):**
- `ipAddress`: IP do respondente
- `userAgent`: String do user agent
- `device`: Detectar via user agent (mobile/desktop/tablet)
- `browser`: Detectar via user agent (Chrome, Safari, Firefox, Edge)
- `location`: Geolocalização via IP (país, estado, cidade)

**Rastreamento de Visualizações:**
- Criar evento de "view" quando formulário público é acessado
- Armazenar: `formId`, `timestamp`, `device`, `browser`, `location`
- Não precisa de ID único (apenas contadores agregados)

---

### 6.2. Cálculos e Agregações Necessárias

**Para Dashboard:**
1. Total de formulários por usuário
2. Total de respostas por usuário
3. Total de visualizações por usuário
4. Taxa média de completude (campos preenchidos / total de campos)

**Para Analytics:**
1. **Crescimento**: Comparar período atual vs anterior
2. **Taxa de Conversão**: (respostas / visualizações) * 100
3. **Tempo Médio**: Calcular diferença entre primeira interação e submit
4. **Score de Engajamento**: Fórmula customizada baseada em completude + tempo
5. **Funil**: Contar eventos em cada etapa
6. **Heatmap**: Agrupar respostas por dia da semana e hora
7. **Performance de Campos**: Analisar campos não preenchidos e erros de validação

---

## 7. OTIMIZAÇÕES E BOAS PRÁTICAS

### 7.1. Paginação Padrão
- Sempre retornar objeto `pagination` com: `page`, `pageSize`, `total`, `totalPages`
- Padrão: `pageSize = 10`
- Máximo: `pageSize = 100`

### 7.2. Filtros de Data
- Sempre aceitar `startDate` e `endDate` em ISO 8601
- Se não fornecido, usar período padrão (últimos 30 dias)

### 7.3. Cache
- Endpoints de analytics devem ter cache de 5-15 minutos
- Dashboard stats podem ter cache de 1 minuto
- Listas de formulários e respostas: sem cache (dados em tempo real)

### 7.4. Formato de Datas
- **Sempre ISO 8601**: `2024-01-15T14:30:00Z`
- Backend deve converter para timezone do usuário se necessário

### 7.5. Segurança
- Validar `userId` em todas as requisições autenticadas
- Formulários públicos: não expor dados sensíveis (userId, password)
- Rate limiting em endpoints públicos

### 7.6. Performance
- Índices no banco:
  - `forms.userId`
  - `responses.formId`
  - `responses.submittedAt`
  - `views.formId`
  - `views.timestamp`

---

## 8. RESUMO EXECUTIVO

### Total de Endpoints Necessários: 20

**Autenticação (1):**
- GET /auth/me

**Formulários (3):**
- GET /forms (lista com filtros)
- GET /forms/:id (detalhes)
- GET /public/forms/:id (público)
- POST /public/forms/:id/validate-password

**Respostas (3):**
- GET /responses (lista com filtros)
- GET /responses/:id (detalhes)
- GET /responses/export (exportação)

**Dashboard (4):**
- GET /dashboard/stats
- GET /dashboard/activities
- GET /dashboard/latest-responses
- GET /dashboard/responses-over-time

**Analytics (9):**
- GET /analytics/kpis
- GET /analytics/temporal
- GET /analytics/devices
- GET /analytics/browsers
- GET /analytics/funnel
- GET /analytics/heatmap
- GET /analytics/locations
- GET /analytics/field-performance
- GET /analytics/form-ranking

### Dados Críticos a Armazenar:

1. **Users**: id, email, name, image, timestamps
2. **Forms**: id, userId, title, description, fields (JSON), status, isPublic, hasPassword, password, timestamps
3. **Responses**: id, formId, data (JSON), submittedAt, ipAddress, userAgent, device, browser, location (JSON)
4. **Views** (opcional): formId, timestamp, device, browser, location (JSON)

### Agregações Principais:

- Contadores: totalForms, totalResponses, totalViews
- Taxas: conversionRate, completionRate
- Médias: averageTime, averageScore
- Agrupamentos: por data, dispositivo, navegador, localização, tipo de campo
- Rankings: formulários por performance

---


