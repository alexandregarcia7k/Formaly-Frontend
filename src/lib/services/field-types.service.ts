import { api } from "@/lib/api";

export interface FieldTypeOption {
  name: string;
  label: string;
  type: string; // Tipo HTML base: text, email, phone, textarea, number, date, select, radio, checkbox
  placeholder: string;
  category: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
}

export interface FieldTypeCategory {
  name: string;
  label: string;
  options: FieldTypeOption[];
}

export class FieldTypesService {
  /**
   * Busca todos os presets de campos disponíveis do backend
   * São 40 presets pré-configurados que usam 9 tipos HTML base
   */
  static async getFieldTypes(): Promise<FieldTypeOption[]> {
    try {
      const response = await api.get<
        {
          type: string;
          label: string;
          htmlType: string;
          placeholder: string;
          category: string;
          validation?: Record<string, unknown>;
        }[]
      >("/api/forms/field-types");

      // Mapear resposta da API para formato esperado
      return response.data.map((item) => ({
        name: item.type,
        label: item.label,
        type: item.htmlType,
        placeholder: item.placeholder,
        category: item.category,
        validation: item.validation,
      }));
    } catch {
      return this.getFallbackFieldTypes();
    }
  }

  /**
   * Agrupa os presets por categoria
   */
  static async getFieldTypesByCategory(): Promise<FieldTypeCategory[]> {
    const fieldTypes = await this.getFieldTypes();

    const categories = new Map<string, FieldTypeOption[]>();

    fieldTypes.forEach((field) => {
      if (!categories.has(field.category)) {
        categories.set(field.category, []);
      }
      categories.get(field.category)?.push(field);
    });

    const categoryLabels: Record<string, string> = {
      personal: "Informações Pessoais",
      address: "Endereço",
      professional: "Profissional",
      communication: "Comunicação",
      other: "Outros",
    };

    return Array.from(categories.entries()).map(([name, options]) => ({
      name,
      label: categoryLabels[name] || name,
      options,
    }));
  }

  /**
   * Presets fallback temporários (até API ficar pronta)
   * 40 presets organizados por categoria
   */
  private static getFallbackFieldTypes(): FieldTypeOption[] {
    return [
      // Informações Pessoais (9)
      {
        name: "full_name",
        label: "Nome Completo",
        type: "text",
        placeholder: "Digite seu nome completo",
        category: "personal",
        validation: { minLength: 3, maxLength: 100 },
      },
      {
        name: "first_name",
        label: "Primeiro Nome",
        type: "text",
        placeholder: "Digite seu primeiro nome",
        category: "personal",
        validation: { minLength: 2, maxLength: 50 },
      },
      {
        name: "last_name",
        label: "Sobrenome",
        type: "text",
        placeholder: "Digite seu sobrenome",
        category: "personal",
        validation: { minLength: 2, maxLength: 50 },
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "seu@email.com",
        category: "personal",
        validation: { pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$" },
      },
      {
        name: "phone",
        label: "Telefone",
        type: "phone",
        placeholder: "(11) 99999-9999",
        category: "personal",
      },
      {
        name: "birth_date",
        label: "Data de Nascimento",
        type: "date",
        placeholder: "DD/MM/AAAA",
        category: "personal",
      },
      {
        name: "cpf",
        label: "CPF",
        type: "text",
        placeholder: "000.000.000-00",
        category: "personal",
        validation: { pattern: "^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$" },
      },
      {
        name: "rg",
        label: "RG",
        type: "text",
        placeholder: "00.000.000-0",
        category: "personal",
      },
      {
        name: "gender",
        label: "Gênero",
        type: "select",
        placeholder: "Selecione seu gênero",
        category: "personal",
      },

      // Endereço (9)
      {
        name: "address",
        label: "Endereço Completo",
        type: "textarea",
        placeholder: "Digite seu endereço completo",
        category: "address",
      },
      {
        name: "street",
        label: "Rua",
        type: "text",
        placeholder: "Nome da rua",
        category: "address",
      },
      {
        name: "number",
        label: "Número",
        type: "text",
        placeholder: "123",
        category: "address",
      },
      {
        name: "complement",
        label: "Complemento",
        type: "text",
        placeholder: "Apto, bloco, etc",
        category: "address",
      },
      {
        name: "neighborhood",
        label: "Bairro",
        type: "text",
        placeholder: "Nome do bairro",
        category: "address",
      },
      {
        name: "city",
        label: "Cidade",
        type: "text",
        placeholder: "Nome da cidade",
        category: "address",
      },
      {
        name: "state",
        label: "Estado",
        type: "text",
        placeholder: "SP",
        category: "address",
      },
      {
        name: "zip_code",
        label: "CEP",
        type: "text",
        placeholder: "00000-000",
        category: "address",
      },
      {
        name: "country",
        label: "País",
        type: "text",
        placeholder: "Brasil",
        category: "address",
      },

      // Profissional (4)
      {
        name: "company",
        label: "Empresa",
        type: "text",
        placeholder: "Nome da empresa",
        category: "professional",
      },
      {
        name: "job_title",
        label: "Cargo",
        type: "text",
        placeholder: "Seu cargo",
        category: "professional",
      },
      {
        name: "work_email",
        label: "Email Profissional",
        type: "email",
        placeholder: "seu@empresa.com",
        category: "professional",
      },
      {
        name: "work_phone",
        label: "Telefone Comercial",
        type: "phone",
        placeholder: "(11) 3000-0000",
        category: "professional",
      },

      // Comunicação (8)
      {
        name: "message",
        label: "Mensagem",
        type: "textarea",
        placeholder: "Digite sua mensagem",
        category: "communication",
        validation: { minLength: 10, maxLength: 500 },
      },
      {
        name: "comments",
        label: "Comentários",
        type: "textarea",
        placeholder: "Deixe seus comentários",
        category: "communication",
      },
      {
        name: "feedback",
        label: "Feedback",
        type: "textarea",
        placeholder: "Compartilhe seu feedback",
        category: "communication",
      },
      {
        name: "website",
        label: "Website",
        type: "text",
        placeholder: "https://seusite.com",
        category: "communication",
      },
      {
        name: "instagram",
        label: "Instagram",
        type: "text",
        placeholder: "@seuusuario",
        category: "communication",
      },
      {
        name: "facebook",
        label: "Facebook",
        type: "text",
        placeholder: "facebook.com/seuusuario",
        category: "communication",
      },
      {
        name: "linkedin",
        label: "LinkedIn",
        type: "text",
        placeholder: "linkedin.com/in/seuusuario",
        category: "communication",
      },
      {
        name: "twitter",
        label: "Twitter/X",
        type: "text",
        placeholder: "@seuusuario",
        category: "communication",
      },

      // Outros (5)
      {
        name: "age",
        label: "Idade",
        type: "number",
        placeholder: "18",
        category: "other",
        validation: { min: 0, max: 150 },
      },
      {
        name: "quantity",
        label: "Quantidade",
        type: "number",
        placeholder: "1",
        category: "other",
        validation: { min: 0 },
      },
      {
        name: "price",
        label: "Preço",
        type: "number",
        placeholder: "0.00",
        category: "other",
        validation: { min: 0 },
      },
      {
        name: "date",
        label: "Data",
        type: "date",
        placeholder: "DD/MM/AAAA",
        category: "other",
      },
      {
        name: "time",
        label: "Horário",
        type: "text",
        placeholder: "14:30",
        category: "other",
      },

      // Custom (1)
      {
        name: "custom",
        label: "Campo Personalizado",
        type: "text",
        placeholder: "Digite aqui",
        category: "other",
      },
    ];
  }
}
