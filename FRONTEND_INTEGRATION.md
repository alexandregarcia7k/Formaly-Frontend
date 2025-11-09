# 🎨 Guia de Integração Frontend - Tipos de Campos Pré-Definidos

## 📋 **Visão Geral**

O backend agora usa **tipos de campos pré-definidos** com metadados completos (label, placeholder, validações). O frontend apenas escolhe o tipo e o backend retorna tudo configurado.

---

## 🔌 **Endpoint: Listar Tipos Disponíveis**

### **GET /api/forms/field-types** (Público)

Retorna todos os tipos de campos disponíveis com metadados completos.

**Response**:
```json
[
  {
    "name": "full_name",
    "label": "Nome Completo",
    "type": "text",
    "placeholder": "Digite seu nome completo",
    "category": "personal",
    "validation": {
      "minLength": 3,
      "maxLength": 100
    }
  },
  {
    "name": "email",
    "label": "Email",
    "type": "email",
    "placeholder": "seu@email.com",
    "category": "personal",
    "validation": {
      "pattern": "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"
    }
  }
]
```

---

## 📦 **40 Tipos de Campos Disponíveis**

### **Informações Pessoais** (9 tipos)
- `full_name`, `first_name`, `last_name`, `email`, `phone`, `birth_date`, `cpf`, `rg`, `gender`

### **Endereço** (9 tipos)
- `address`, `street`, `number`, `complement`, `neighborhood`, `city`, `state`, `zip_code`, `country`

### **Profissional** (4 tipos)
- `company`, `job_title`, `work_email`, `work_phone`

### **Comunicação** (8 tipos)
- `message`, `comments`, `feedback`, `website`, `instagram`, `facebook`, `linkedin`, `twitter`

### **Outros** (5 tipos)
- `age`, `quantity`, `price`, `date`, `time`

### **Custom** (1 tipo)
- `custom` - Campo personalizado

---

## 🎯 **Como Usar no Frontend**

### **1. Buscar tipos disponíveis**

```typescript
const response = await fetch('http://localhost:3333/api/forms/field-types');
const fieldTypes = await response.json();
```

### **2. Criar formulário**

```typescript
const formData = {
  name: "Formulário de Contato",
  fields: [
    {
      fieldType: "full_name",
      required: true
    },
    {
      fieldType: "email",
      required: true
    },
    {
      fieldType: "phone",
      required: false
    }
  ]
};

await fetch('http://localhost:3333/api/forms', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(formData)
});
```

### **3. Backend retorna campos completos**

```json
{
  "fields": [
    {
      "type": "text",
      "label": "Nome Completo",
      "name": "full_name",
      "placeholder": "Digite seu nome completo",
      "required": true,
      "config": {
        "minLength": 3,
        "maxLength": 100
      }
    }
  ]
}
```

---

## 🎨 **Customização Opcional**

```typescript
{
  fieldType: "full_name",
  customLabel: "Nome do Responsável",
  required: true,
  customConfig: {
    helpText: "Digite o nome completo"
  }
}
```

---

## 🔧 **Campo Custom**

```typescript
{
  fieldType: "custom",
  customName: "favorite_color",  // Obrigatório
  customLabel: "Cor Favorita",
  required: false
}
```

---

## 📊 **TypeScript Types**

```typescript
export interface CreateFieldInput {
  fieldType: string;
  customLabel?: string;
  customName?: string;
  required?: boolean;
  customConfig?: Record<string, any>;
}

export interface CreateFormInput {
  name: string;
  description?: string;
  password?: string;
  fields: CreateFieldInput[];
}
```

---

**Backend pronto com 40 tipos de campos configurados!** 🎉
