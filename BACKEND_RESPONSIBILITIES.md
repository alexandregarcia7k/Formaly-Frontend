# Responsabilidades do Backend - Formaly

## 📋 ETAPA 1: LocationTable - Distribuição Geográfica

### Endpoint Necessário
`GET /analytics/locations`

### Query Parameters
```typescript
{
  period: "7d" | "30d" | "90d" | "1y";  // Obrigatório
  formId?: string;                       // Opcional - filtro por formulário
}
```

### Response Schema (Zod)
```typescript
import { z } from "zod";

export const locationDataSchema = z.object({
  estado: z.string().min(1, "Estado não pode ser vazio"),
  acessos: z.number().int().min(0, "Acessos deve ser >= 0"),
  respostas: z.number().int().min(0, "Respostas deve ser >= 0"),
  taxa: z.number().min(0).max(100, "Taxa deve estar entre 0-100"),
});

export const locationResponseSchema = z.object({
  data: z.array(locationDataSchema),
  bestConversion: z.object({
    estado: z.string(),
    taxa: z.number(),
  }),
});

export type LocationData = z.infer<typeof locationDataSchema>;
export type LocationResponse = z.infer<typeof locationResponseSchema>;
```

### Validações Obrigatórias
1. ✅ Validar `period` com Zod
2. ✅ Retornar array vazio se sem dados (não retornar erro 404)
3. ✅ Calcular `taxa` = (respostas / acessos) * 100
4. ✅ Ordenar por `acessos` DESC
5. ✅ Limitar a 10 estados + "Outros" (agregado)

### Exemplo de Response
```json
{
  "data": [
    {
      "estado": "São Paulo",
      "acessos": 3421,
      "respostas": 2341,
      "taxa": 68.4
    }
  ],
  "bestConversion": {
    "estado": "Paraná",
    "taxa": 72.1
  }
}
```

### Tratamento de Erros
- **400**: Parâmetros inválidos
- **401**: Não autenticado
- **500**: Erro interno

### Cache
- TTL: 5 minutos
- Invalidar ao receber nova resposta

---

## 📋 ETAPA 2: DeviceChart & BrowserChart - Distribuição de Dispositivos e Navegadores

### Endpoints Necessários

#### 1. `GET /analytics/devices`

### Query Parameters
```typescript
{
  period: "7d" | "30d" | "90d" | "1y";  // Obrigatório
  formId?: string;                       // Opcional
}
```

### Response Schema (Zod)
```typescript
import { z } from "zod";

export const deviceDataSchema = z.object({
  name: z.enum(["Mobile", "Desktop", "Tablet"]),
  value: z.number().min(0).max(100, "Percentual deve estar entre 0-100"),
  count: z.number().int().min(0, "Contagem deve ser >= 0"),
});

export const deviceResponseSchema = z.object({
  data: z.array(deviceDataSchema),
  topDevice: z.string(),
});

export type DeviceData = z.infer<typeof deviceDataSchema>;
export type DeviceResponse = z.infer<typeof deviceResponseSchema>;
```

### Validações Obrigatórias
1. ✅ Detectar dispositivo via User Agent
2. ✅ Calcular percentuais (soma deve ser 100%)
3. ✅ Retornar array vazio se sem dados
4. ✅ Identificar dispositivo mais usado

### Exemplo de Response
```json
{
  "data": [
    {
      "name": "Mobile",
      "value": 54,
      "count": 3240
    },
    {
      "name": "Desktop",
      "value": 38,
      "count": 2280
    },
    {
      "name": "Tablet",
      "value": 8,
      "count": 480
    }
  ],
  "topDevice": "Mobile"
}
```

---

#### 2. `GET /analytics/browsers`

### Query Parameters
```typescript
{
  period: "7d" | "30d" | "90d" | "1y";  // Obrigatório
  formId?: string;                       // Opcional
}
```

### Response Schema (Zod)
```typescript
import { z } from "zod";

export const browserDataSchema = z.object({
  name: z.string().min(1, "Nome do navegador não pode ser vazio"),
  value: z.number().min(0).max(100, "Percentual deve estar entre 0-100"),
  count: z.number().int().min(0, "Contagem deve ser >= 0"),
});

export const browserResponseSchema = z.object({
  data: z.array(browserDataSchema),
  topBrowser: z.string(),
});

export type BrowserData = z.infer<typeof browserDataSchema>;
export type BrowserResponse = z.infer<typeof browserResponseSchema>;
```

### Validações Obrigatórias
1. ✅ Detectar navegador via User Agent
2. ✅ Normalizar nomes: "Chrome", "Safari", "Firefox", "Edge", "Outros"
3. ✅ Calcular percentuais (soma deve ser 100%)
4. ✅ Retornar array vazio se sem dados
5. ✅ Agrupar navegadores minoritários em "Outros" (< 2%)

### Exemplo de Response
```json
{
  "data": [
    {
      "name": "Chrome",
      "value": 68,
      "count": 4080
    },
    {
      "name": "Safari",
      "value": 18,
      "count": 1080
    },
    {
      "name": "Firefox",
      "value": 9,
      "count": 540
    },
    {
      "name": "Edge",
      "value": 5,
      "count": 300
    }
  ],
  "topBrowser": "Chrome"
}
```

### Tratamento de Erros (Ambos Endpoints)
- **400**: Parâmetros inválidos
- **401**: Não autenticado
- **500**: Erro interno

### Cache (Ambos Endpoints)
- TTL: 5 minutos
- Invalidar ao receber nova resposta

### Detecção de User Agent
Usar biblioteca como `ua-parser-js` ou similar:
```typescript
import UAParser from 'ua-parser-js';

const parser = new UAParser(userAgent);
const device = parser.getDevice().type || 'desktop'; // mobile, tablet, desktop
const browser = parser.getBrowser().name; // Chrome, Safari, etc
```

---

## 📝 Status Geral
- [ ] Endpoint `/analytics/locations` implementado
- [ ] Endpoint `/analytics/devices` implementado
- [ ] Endpoint `/analytics/browsers` implementado
- [ ] Validação Zod configurada
- [ ] Detecção User Agent implementada
- [ ] Testes unitários
- [ ] Documentação Swagger



---

## 📋 ETAPA 3: ActivityHeatmap & ConversionFunnel

### Endpoints Necessários

#### 1. `GET /analytics/heatmap`

### Query Parameters
```typescript
{
  period: "7d" | "30d" | "90d";  // Obrigatório (máximo 90 dias)
  formId?: string;                // Opcional
}
```

### Response Schema (Zod)
```typescript
import { z } from "zod";

export const heatmapHourSchema = z.object({
  hour: z.number().int().min(0).max(23, "Hora deve estar entre 0-23"),
  value: z.number().int().min(0, "Valor deve ser >= 0"),
});

export const heatmapDaySchema = z.object({
  day: z.enum(["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]),
  data: z.array(heatmapHourSchema).length(24, "Deve ter 24 horas"),
});

export const heatmapResponseSchema = z.object({
  data: z.array(heatmapDaySchema).length(7, "Deve ter 7 dias"),
  peakDay: z.string(),
  peakHour: z.number().int().min(0).max(23),
});

export type HeatmapHour = z.infer<typeof heatmapHourSchema>;
export type HeatmapDay = z.infer<typeof heatmapDaySchema>;
export type HeatmapResponse = z.infer<typeof heatmapResponseSchema>;
```

### Validações Obrigatórias
1. ✅ Agrupar respostas por dia da semana (0=Dom, 6=Sáb)
2. ✅ Agrupar por hora (0-23)
3. ✅ Retornar SEMPRE 7 dias × 24 horas (preencher com 0 se sem dados)
4. ✅ Calcular pico de atividade (dia + hora com mais respostas)
5. ✅ Usar timezone do usuário ou UTC

### Exemplo de Response
```json
{
  "data": [
    {
      "day": "Dom",
      "data": [
        { "hour": 0, "value": 5 },
        { "hour": 1, "value": 2 },
        ...
        { "hour": 23, "value": 8 }
      ]
    },
    ...
  ],
  "peakDay": "Qui",
  "peakHour": 14
}
```

### Lógica de Agregação
```sql
-- Exemplo PostgreSQL
SELECT 
  EXTRACT(DOW FROM submitted_at) as day_of_week,
  EXTRACT(HOUR FROM submitted_at) as hour,
  COUNT(*) as value
FROM responses
WHERE submitted_at >= NOW() - INTERVAL '30 days'
GROUP BY day_of_week, hour
ORDER BY day_of_week, hour;
```

---

#### 2. `GET /analytics/funnel`

### Query Parameters
```typescript
{
  period: "7d" | "30d" | "90d" | "1y";  // Obrigatório
  formId?: string;                       // Opcional
}
```

### Response Schema (Zod)
```typescript
import { z } from "zod";

export const funnelStageSchema = z.object({
  stage: z.string().min(1, "Nome da etapa não pode ser vazio"),
  count: z.number().int().min(0, "Contagem deve ser >= 0"),
  percentage: z.number().min(0).max(100, "Percentual deve estar entre 0-100"),
  dropoff: z.number().min(0).max(100, "Dropoff deve estar entre 0-100"),
});

export const funnelResponseSchema = z.object({
  data: z.array(funnelStageSchema).length(4, "Funil deve ter 4 etapas"),
  totalViews: z.number().int().min(0),
  totalSubmissions: z.number().int().min(0),
  overallConversion: z.number().min(0).max(100),
  criticalPoints: z.array(z.object({
    stage: z.string(),
    dropoff: z.number(),
    suggestion: z.string(),
  })),
});

export type FunnelStage = z.infer<typeof funnelStageSchema>;
export type FunnelResponse = z.infer<typeof funnelResponseSchema>;
```

### Validações Obrigatórias
1. ✅ Rastrear 4 etapas do funil:
   - Etapa 1: "Visualizaram Link" (view event)
   - Etapa 2: "Abriram Formulário" (form load event)
   - Etapa 3: "Completaram Campos" (field interaction event)
   - Etapa 4: "Enviaram Resposta" (submit event)
2. ✅ Calcular percentuais baseados na etapa 1 (100%)
3. ✅ Calcular dropoff entre etapas consecutivas
4. ✅ Identificar pontos críticos (dropoff > 15%)
5. ✅ Gerar sugestões automáticas

### Exemplo de Response
```json
{
  "data": [
    {
      "stage": "Visualizaram Link",
      "count": 12543,
      "percentage": 100,
      "dropoff": 0
    },
    {
      "stage": "Abriram Formulário",
      "count": 9783,
      "percentage": 78,
      "dropoff": 22
    },
    {
      "stage": "Completaram Campos",
      "count": 8315,
      "percentage": 66,
      "dropoff": 15
    },
    {
      "stage": "Enviaram Resposta",
      "count": 7650,
      "percentage": 61,
      "dropoff": 8
    }
  ],
  "totalViews": 12543,
  "totalSubmissions": 7650,
  "overallConversion": 61,
  "criticalPoints": [
    {
      "stage": "Visualizaram Link → Abriram Formulário",
      "dropoff": 22,
      "suggestion": "Melhorar título e descrição do formulário"
    },
    {
      "stage": "Abriram Formulário → Completaram Campos",
      "dropoff": 15,
      "suggestion": "Simplificar campos ou melhorar UX"
    }
  ]
}
```

### Rastreamento de Eventos
Criar tabela de eventos:
```sql
CREATE TABLE form_events (
  id UUID PRIMARY KEY,
  form_id UUID NOT NULL,
  event_type VARCHAR(50) NOT NULL, -- 'view', 'load', 'interact', 'submit'
  session_id VARCHAR(255),
  user_agent TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_form_events_form_id ON form_events(form_id);
CREATE INDEX idx_form_events_type ON form_events(event_type);
CREATE INDEX idx_form_events_created_at ON form_events(created_at);
```

### Lógica de Sugestões
```typescript
function generateSuggestions(data: FunnelStage[]): CriticalPoint[] {
  const suggestions = [];
  
  for (let i = 0; i < data.length - 1; i++) {
    const dropoff = data[i].dropoff;
    
    if (dropoff > 15) {
      let suggestion = "";
      
      if (i === 0) {
        suggestion = "Melhorar título e descrição do formulário";
      } else if (i === 1) {
        suggestion = "Simplificar campos ou melhorar UX";
      } else if (i === 2) {
        suggestion = "Revisar validações e mensagens de erro";
      }
      
      suggestions.push({
        stage: `${data[i].stage} → ${data[i + 1].stage}`,
        dropoff,
        suggestion,
      });
    }
  }
  
  return suggestions;
}
```

### Tratamento de Erros (Ambos Endpoints)
- **400**: Parâmetros inválidos
- **401**: Não autenticado
- **500**: Erro interno

### Cache (Ambos Endpoints)
- TTL: 5 minutos
- Invalidar ao receber nova resposta

---

## 📝 Status Geral Atualizado
- [ ] Endpoint `/analytics/locations` implementado
- [ ] Endpoint `/analytics/devices` implementado
- [ ] Endpoint `/analytics/browsers` implementado
- [ ] Endpoint `/analytics/heatmap` implementado
- [ ] Endpoint `/analytics/funnel` implementado
- [ ] Tabela `form_events` criada
- [ ] Rastreamento de eventos implementado
- [ ] Validação Zod configurada
- [ ] Detecção User Agent implementada
- [ ] Lógica de sugestões automáticas
- [ ] Testes unitários
- [ ] Documentação Swagger


---

## 📋 ETAPA 4: FieldPerformanceTable & FormRankingTable

### Endpoints Necessários

#### 1. `GET /analytics/field-performance`

### Query Parameters
```typescript
{
  period: "7d" | "30d" | "90d" | "1y";  // Obrigatório
  formId?: string;                       // Opcional
}
```

### Response Schema (Zod)
```typescript
import { z } from "zod";

export const fieldPerformanceSchema = z.object({
  tipo: z.string().min(1, "Tipo não pode ser vazio"),
  quantidade: z.number().int().min(0, "Quantidade deve ser >= 0"),
  taxaPreenchimento: z.number().min(0).max(100, "Taxa deve estar entre 0-100"),
  tempoMedio: z.string().regex(/^\d+[smh]$/, "Formato inválido (ex: 12s, 2m, 1h)"),
  taxaErro: z.number().min(0).max(100, "Taxa de erro deve estar entre 0-100"),
});

export const fieldPerformanceResponseSchema = z.object({
  data: z.array(fieldPerformanceSchema),
  problematicFields: z.array(z.string()),
});

export type FieldPerformance = z.infer<typeof fieldPerformanceSchema>;
export type FieldPerformanceResponse = z.infer<typeof fieldPerformanceResponseSchema>;
```

### Validações Obrigatórias
1. ✅ Agrupar por tipo de campo (Email, Text, Select, etc)
2. ✅ Calcular taxa de preenchimento = (campos preenchidos / total campos) * 100
3. ✅ Calcular tempo médio de preenchimento por tipo
4. ✅ Calcular taxa de erro = (erros validação / tentativas) * 100
5. ✅ Identificar campos problemáticos (taxa < 70% ou erro > 5%)

### Exemplo de Response
```json
{
  "data": [
    {
      "tipo": "Email",
      "quantidade": 45,
      "taxaPreenchimento": 98,
      "tempoMedio": "12s",
      "taxaErro": 2
    }
  ],
  "problematicFields": ["Textarea", "Telefone"]
}
```

---

#### 2. `GET /analytics/form-ranking`

### Query Parameters
```typescript
{
  period: "7d" | "30d" | "90d" | "1y";  // Obrigatório
  limit?: number;                        // Opcional (padrão: 5)
}
```

### Response Schema (Zod)
```typescript
import { z } from "zod";

export const formRankingSchema = z.object({
  rank: z.number().int().min(1, "Rank deve ser >= 1"),
  formId: z.string().uuid("ID inválido"),
  nome: z.string().min(1, "Nome não pode ser vazio"),
  acessos: z.number().int().min(0),
  respostas: z.number().int().min(0),
  conversao: z.number().min(0).max(100),
  tempo: z.string().regex(/^\d+[smh]\s\d+[smh]$/, "Formato: 2m 15s"),
  score: z.number().int().min(1).max(5, "Score deve estar entre 1-5"),
});

export const formRankingResponseSchema = z.object({
  data: z.array(formRankingSchema),
  averageConversion: z.number().min(0).max(100),
  problematicForms: z.array(z.object({
    formId: z.string().uuid(),
    nome: z.string(),
    issue: z.string(),
  })),
});

export type FormRanking = z.infer<typeof formRankingSchema>;
export type FormRankingResponse = z.infer<typeof formRankingResponseSchema>;
```

### Validações Obrigatórias
1. ✅ Ordenar por score DESC (critério principal)
2. ✅ Calcular score (1-5 estrelas):
   - Taxa de conversão: 40%
   - Tempo de preenchimento: 30%
   - Taxa de completude: 30%
3. ✅ Calcular média de conversão
4. ✅ Identificar formulários problemáticos (conversão < média - 10pp)
5. ✅ Limitar resultados (padrão: top 5)

### Cálculo do Score
```typescript
function calculateScore(form: Form): number {
  const conversionScore = (form.conversao / 100) * 0.4;
  const timeScore = (1 - (form.tempoSegundos / 600)) * 0.3; // 600s = 10min max
  const completionScore = (form.taxaCompletude / 100) * 0.3;
  
  const totalScore = (conversionScore + timeScore + completionScore) * 5;
  return Math.max(1, Math.min(5, Math.round(totalScore)));
}
```

### Exemplo de Response
```json
{
  "data": [
    {
      "rank": 1,
      "formId": "uuid-123",
      "nome": "Formulário de Contato",
      "acessos": 3200,
      "respostas": 2304,
      "conversao": 72,
      "tempo": "2m 15s",
      "score": 5
    }
  ],
  "averageConversion": 66.4,
  "problematicForms": [
    {
      "formId": "uuid-456",
      "nome": "Cadastro de Cliente",
      "issue": "Conversão 21pp abaixo da média"
    }
  ]
}
```

### Tratamento de Erros (Ambos Endpoints)
- **400**: Parâmetros inválidos
- **401**: Não autenticado
- **500**: Erro interno

### Cache (Ambos Endpoints)
- TTL: 5 minutos
- Invalidar ao receber nova resposta

---

## 📝 Status Geral Atualizado
- [ ] Endpoint `/analytics/locations` implementado
- [ ] Endpoint `/analytics/devices` implementado
- [ ] Endpoint `/analytics/browsers` implementado
- [ ] Endpoint `/analytics/heatmap` implementado
- [ ] Endpoint `/analytics/funnel` implementado
- [ ] Endpoint `/analytics/field-performance` implementado
- [ ] Endpoint `/analytics/form-ranking` implementado
- [ ] Tabela `form_events` criada
- [ ] Rastreamento de eventos implementado
- [ ] Validação Zod configurada
- [ ] Detecção User Agent implementada
- [ ] Lógica de score de formulários
- [ ] Testes unitários
- [ ] Documentação Swagger
