/**
 * Dados mockados para desenvolvimento frontend sem backend
 */

export interface MockUser {
  id: string;
  email: string;
  name: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MockFormField {
  id: string;
  formId: string;
  type: string;
  label: string;
  name: string;
  required: boolean;
  config: Record<string, unknown> | null;
}

export interface MockForm {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  status: "ACTIVE" | "INACTIVE";
  maxResponses: number | null;
  expiresAt: string | null;
  allowMultipleSubmissions: boolean;
  successMessage: string | null;
  createdAt: string;
  updatedAt: string;
  fields: MockFormField[];
  _count: {
    submissions: number;
  };
}

// Usuário mockado
export const MOCK_USER: MockUser = {
  id: "mock-user-1",
  email: "dev@formaly.com",
  name: "Alexandre Garcia",
  image: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Formulários mockados
export const MOCK_FORMS: MockForm[] = [
  {
    id: "1",
    userId: "mock-user-1",
    name: "Formulário de Contato",
    description: "Formulário para contato com clientes",
    status: "ACTIVE",
    maxResponses: 500,
    expiresAt: null,
    allowMultipleSubmissions: true,
    successMessage: null,
    createdAt: "2024-11-01T10:00:00.000Z",
    updatedAt: "2024-11-01T10:00:00.000Z",
    fields: [
      {
        id: "field-1-1",
        formId: "1",
        type: "text",
        label: "Nome Completo",
        name: "nome_completo",
        required: true,
        config: {
          placeholder: "Digite seu nome completo",
          minLength: 3,
          maxLength: 100,
        },
      },
      {
        id: "field-1-2",
        formId: "1",
        type: "email",
        label: "E-mail",
        name: "email",
        required: true,
        config: {
          placeholder: "seu@email.com",
        },
      },
      {
        id: "field-1-3",
        formId: "1",
        type: "phone",
        label: "Telefone",
        name: "telefone",
        required: false,
        config: {
          placeholder: "(00) 00000-0000",
        },
      },
      {
        id: "field-1-4",
        formId: "1",
        type: "textarea",
        label: "Mensagem",
        name: "mensagem",
        required: true,
        config: {
          placeholder: "Digite sua mensagem",
          minLength: 10,
          maxLength: 500,
        },
      },
    ],
    _count: {
      submissions: 150,
    },
  },
  {
    id: "2",
    userId: "mock-user-1",
    name: "Pesquisa de Satisfação",
    description: "Avalie nosso atendimento",
    status: "ACTIVE",
    maxResponses: 200,
    expiresAt: null,
    allowMultipleSubmissions: false,
    successMessage: null,
    createdAt: "2024-11-02T14:30:00.000Z",
    updatedAt: "2024-11-02T14:30:00.000Z",
    fields: [
      {
        id: "field-2-1",
        formId: "2",
        type: "radio",
        label: "Como você avalia nosso atendimento?",
        name: "avaliacao",
        required: true,
        config: {
          options: ["Excelente", "Bom", "Regular", "Ruim"],
        },
      },
      {
        id: "field-2-2",
        formId: "2",
        type: "textarea",
        label: "Sugestões",
        name: "sugestoes",
        required: false,
        config: {
          placeholder: "Deixe suas sugestões",
        },
      },
    ],
    _count: {
      submissions: 85,
    },
  },
  {
    id: "3",
    userId: "mock-user-1",
    name: "Cadastro de Clientes",
    description: "Cadastre-se para receber novidades",
    status: "ACTIVE",
    maxResponses: 100,
    expiresAt: null,
    allowMultipleSubmissions: false,
    successMessage: null,
    createdAt: "2024-11-03T09:15:00.000Z",
    updatedAt: "2024-11-03T09:15:00.000Z",
    fields: [
      {
        id: "field-3-1",
        formId: "3",
        type: "text",
        label: "Nome",
        name: "nome",
        required: true,
        config: {
          placeholder: "Seu nome",
        },
      },
      {
        id: "field-3-2",
        formId: "3",
        type: "email",
        label: "E-mail",
        name: "email",
        required: true,
        config: {
          placeholder: "seu@email.com",
        },
      },
      {
        id: "field-3-3",
        formId: "3",
        type: "date",
        label: "Data de Nascimento",
        name: "data_nascimento",
        required: false,
        config: null,
      },
      {
        id: "field-3-4",
        formId: "3",
        type: "checkbox",
        label: "Interesses",
        name: "interesses",
        required: false,
        config: {
          options: ["Tecnologia", "Marketing", "Vendas", "Suporte"],
        },
      },
    ],
    _count: {
      submissions: 42,
    },
  },
  {
    id: "4",
    userId: "mock-user-1",
    name: "Feedback do Produto",
    description: "Nos ajude a melhorar",
    status: "ACTIVE",
    maxResponses: null,
    expiresAt: null,
    allowMultipleSubmissions: true,
    successMessage: null,
    createdAt: "2024-11-04T11:00:00.000Z",
    updatedAt: "2024-11-04T11:00:00.000Z",
    fields: [
      {
        id: "field-4-1",
        formId: "4",
        type: "select",
        label: "Qual produto você está avaliando?",
        name: "produto",
        required: true,
        config: {
          options: ["Produto A", "Produto B", "Produto C"],
        },
      },
      {
        id: "field-4-2",
        formId: "4",
        type: "number",
        label: "Nota (0-10)",
        name: "nota",
        required: true,
        config: {
          min: 0,
          max: 10,
        },
      },
      {
        id: "field-4-3",
        formId: "4",
        type: "textarea",
        label: "Comentários",
        name: "comentarios",
        required: false,
        config: {
          placeholder: "Deixe seu feedback",
        },
      },
    ],
    _count: {
      submissions: 203,
    },
  },
  {
    id: "5",
    userId: "mock-user-1",
    name: "Inscrição para Evento",
    description: "Garanta sua vaga",
    status: "ACTIVE",
    maxResponses: 50,
    expiresAt: "2024-12-31T23:59:59.000Z",
    allowMultipleSubmissions: false,
    successMessage: null,
    createdAt: "2024-11-05T16:20:00.000Z",
    updatedAt: "2024-11-05T16:20:00.000Z",
    fields: [
      {
        id: "field-5-1",
        formId: "5",
        type: "text",
        label: "Nome Completo",
        name: "nome",
        required: true,
        config: {
          placeholder: "Digite seu nome",
        },
      },
      {
        id: "field-5-2",
        formId: "5",
        type: "email",
        label: "E-mail",
        name: "email",
        required: true,
        config: {
          placeholder: "seu@email.com",
        },
      },
      {
        id: "field-5-3",
        formId: "5",
        type: "phone",
        label: "Telefone",
        name: "telefone",
        required: true,
        config: {
          placeholder: "(00) 00000-0000",
        },
      },
      {
        id: "field-5-4",
        formId: "5",
        type: "radio",
        label: "Você precisa de certificado?",
        name: "certificado",
        required: true,
        config: {
          options: ["Sim", "Não"],
        },
      },
    ],
    _count: {
      submissions: 38,
    },
  },
  {
    id: "6",
    userId: "mock-user-1",
    name: "Avaliação de Desempenho",
    description: "Feedback interno",
    status: "ACTIVE",
    maxResponses: null,
    expiresAt: null,
    allowMultipleSubmissions: false,
    successMessage: null,
    createdAt: "2024-11-06T08:45:00.000Z",
    updatedAt: "2024-11-06T08:45:00.000Z",
    fields: [
      {
        id: "field-6-1",
        formId: "6",
        type: "text",
        label: "Nome do Colaborador",
        name: "colaborador",
        required: true,
        config: {
          placeholder: "Nome completo",
        },
      },
      {
        id: "field-6-2",
        formId: "6",
        type: "select",
        label: "Departamento",
        name: "departamento",
        required: true,
        config: {
          options: ["TI", "Vendas", "Marketing", "RH", "Financeiro"],
        },
      },
      {
        id: "field-6-3",
        formId: "6",
        type: "number",
        label: "Auto-avaliação (0-10)",
        name: "autoavaliacao",
        required: true,
        config: {
          min: 0,
          max: 10,
        },
      },
    ],
    _count: {
      submissions: 67,
    },
  },
  {
    id: "7",
    userId: "mock-user-1",
    name: "Solicitação de Suporte",
    description: "Precisa de ajuda? Conte conosco!",
    status: "ACTIVE",
    maxResponses: null,
    expiresAt: null,
    allowMultipleSubmissions: true,
    successMessage: null,
    createdAt: "2024-11-07T13:10:00.000Z",
    updatedAt: "2024-11-07T13:10:00.000Z",
    fields: [
      {
        id: "field-7-1",
        formId: "7",
        type: "text",
        label: "Seu Nome",
        name: "nome",
        required: true,
        config: {
          placeholder: "Como devemos te chamar?",
        },
      },
      {
        id: "field-7-2",
        formId: "7",
        type: "email",
        label: "E-mail para contato",
        name: "email",
        required: true,
        config: {
          placeholder: "seu@email.com",
        },
      },
      {
        id: "field-7-3",
        formId: "7",
        type: "select",
        label: "Tipo de Problema",
        name: "tipo",
        required: true,
        config: {
          options: ["Técnico", "Financeiro", "Dúvida", "Outro"],
        },
      },
      {
        id: "field-7-4",
        formId: "7",
        type: "textarea",
        label: "Descreva o problema",
        name: "descricao",
        required: true,
        config: {
          placeholder: "Detalhe o que está acontecendo",
        },
      },
    ],
    _count: {
      submissions: 124,
    },
  },
  {
    id: "8",
    userId: "mock-user-1",
    name: "Quiz de Conhecimento",
    description: "Teste seus conhecimentos",
    status: "ACTIVE",
    maxResponses: null,
    expiresAt: null,
    allowMultipleSubmissions: true,
    successMessage: null,
    createdAt: "2024-11-08T15:30:00.000Z",
    updatedAt: "2024-11-08T15:30:00.000Z",
    fields: [
      {
        id: "field-8-1",
        formId: "8",
        type: "text",
        label: "Seu Nome",
        name: "nome",
        required: true,
        config: {
          placeholder: "Digite seu nome",
        },
      },
      {
        id: "field-8-2",
        formId: "8",
        type: "radio",
        label: "Qual a capital do Brasil?",
        name: "questao1",
        required: true,
        config: {
          options: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"],
        },
      },
      {
        id: "field-8-3",
        formId: "8",
        type: "radio",
        label: "Quantos estados tem o Brasil?",
        name: "questao2",
        required: true,
        config: {
          options: ["24", "26", "27", "28"],
        },
      },
    ],
    _count: {
      submissions: 89,
    },
  },
  {
    id: "9",
    userId: "mock-user-1",
    name: "Formulário de Agendamento",
    description: "Agende seu horário",
    status: "ACTIVE",
    maxResponses: 30,
    expiresAt: null,
    allowMultipleSubmissions: false,
    successMessage: null,
    createdAt: "2024-11-09T10:00:00.000Z",
    updatedAt: "2024-11-09T10:00:00.000Z",
    fields: [
      {
        id: "field-9-1",
        formId: "9",
        type: "text",
        label: "Nome",
        name: "nome",
        required: true,
        config: {
          placeholder: "Seu nome",
        },
      },
      {
        id: "field-9-2",
        formId: "9",
        type: "email",
        label: "E-mail",
        name: "email",
        required: true,
        config: {
          placeholder: "seu@email.com",
        },
      },
      {
        id: "field-9-3",
        formId: "9",
        type: "date",
        label: "Data Preferida",
        name: "data",
        required: true,
        config: null,
      },
      {
        id: "field-9-4",
        formId: "9",
        type: "select",
        label: "Horário",
        name: "horario",
        required: true,
        config: {
          options: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
        },
      },
    ],
    _count: {
      submissions: 21,
    },
  },
  {
    id: "10",
    userId: "mock-user-1",
    name: "Pesquisa de Mercado",
    description: "Sua opinião é importante",
    status: "ACTIVE",
    maxResponses: null,
    expiresAt: null,
    allowMultipleSubmissions: false,
    successMessage: null,
    createdAt: "2024-11-10T12:00:00.000Z",
    updatedAt: "2024-11-10T12:00:00.000Z",
    fields: [
      {
        id: "field-10-1",
        formId: "10",
        type: "number",
        label: "Idade",
        name: "idade",
        required: true,
        config: {
          min: 18,
          max: 100,
        },
      },
      {
        id: "field-10-2",
        formId: "10",
        type: "radio",
        label: "Gênero",
        name: "genero",
        required: false,
        config: {
          options: ["Masculino", "Feminino", "Outro", "Prefiro não informar"],
        },
      },
      {
        id: "field-10-3",
        formId: "10",
        type: "checkbox",
        label: "Quais redes sociais você usa?",
        name: "redes_sociais",
        required: false,
        config: {
          options: ["Facebook", "Instagram", "Twitter", "LinkedIn", "TikTok"],
        },
      },
    ],
    _count: {
      submissions: 156,
    },
  },
  {
    id: "11",
    userId: "mock-user-1",
    name: "Pesquisa de Mercado",
    description: "Sua opinião é importante",
    status: "ACTIVE",
    maxResponses: null,
    expiresAt: null,
    allowMultipleSubmissions: false,
    successMessage: null,
    createdAt: "2024-11-10T12:00:00.000Z",
    updatedAt: "2024-11-10T12:00:00.000Z",
    fields: [
      {
        id: "field-11-1",
        formId: "11",
        type: "number",
        label: "Idade",
        name: "idade",
        required: true,
        config: {
          min: 18,
          max: 100,
        },
      },
      {
        id: "field-11-2",
        formId: "11",
        type: "radio",
        label: "Gênero",
        name: "genero",
        required: false,
        config: {
          options: ["Masculino", "Feminino", "Outro", "Prefiro não informar"],
        },
      },
      {
        id: "field-11-3",
        formId: "11",
        type: "checkbox",
        label: "Quais redes sociais você usa?",
        name: "redes_sociais",
        required: false,
        config: {
          options: ["Facebook", "Instagram", "Twitter", "LinkedIn", "TikTok"],
        },
      },
    ],
    _count: {
      submissions: 156,
    },
  },
  {
    id: "12",
    userId: "mock-user-1",
    name: "Pesquisa de Mercado",
    description: "Sua opinião é importante",
    status: "ACTIVE",
    maxResponses: null,
    expiresAt: null,
    allowMultipleSubmissions: false,
    successMessage: null,
    createdAt: "2024-11-10T12:00:00.000Z",
    updatedAt: "2024-11-10T12:00:00.000Z",
    fields: [
      {
        id: "field-12-1",
        formId: "12",
        type: "number",
        label: "Idade",
        name: "idade",
        required: true,
        config: {
          min: 18,
          max: 100,
        },
      },
      {
        id: "field-12-2",
        formId: "12",
        type: "radio",
        label: "Gênero",
        name: "genero",
        required: false,
        config: {
          options: ["Masculino", "Feminino", "Outro", "Prefiro não informar"],
        },
      },
      {
        id: "field-12-3",
        formId: "12",
        type: "checkbox",
        label: "Quais redes sociais você usa?",
        name: "redes_sociais",
        required: false,
        config: {
          options: ["Facebook", "Instagram", "Twitter", "LinkedIn", "TikTok"],
        },
      },
    ],
    _count: {
      submissions: 156,
    },
  },
  {
    id: "13",
    userId: "mock-user-1",
    name: "Pesquisa de Mercado",
    description: "Sua opinião é importante",
    status: "ACTIVE",
    maxResponses: null,
    expiresAt: null,
    allowMultipleSubmissions: false,
    successMessage: null,
    createdAt: "2024-11-10T12:00:00.000Z",
    updatedAt: "2024-11-10T12:00:00.000Z",
    fields: [
      {
        id: "field-13-1",
        formId: "13",
        type: "number",
        label: "Idade",
        name: "idade",
        required: true,
        config: {
          min: 18,
          max: 100,
        },
      },
      {
        id: "field-13-2",
        formId: "13",
        type: "radio",
        label: "Gênero",
        name: "genero",
        required: false,
        config: {
          options: ["Masculino", "Feminino", "Outro", "Prefiro não informar"],
        },
      },
      {
        id: "field-13-3",
        formId: "13",
        type: "checkbox",
        label: "Quais redes sociais você usa?",
        name: "redes_sociais",
        required: false,
        config: {
          options: ["Facebook", "Instagram", "Twitter", "LinkedIn", "TikTok"],
        },
      },
    ],
    _count: {
      submissions: 156,
    },
  },
];

// Função helper para simular delay de API
export const mockDelay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Função para buscar formulário por ID
export const getMockFormById = (id: string): MockForm | undefined => {
  return MOCK_FORMS.find((form) => form.id === id);
};

// Função para paginar formulários
export const getMockFormsPaginated = (page: number = 1, limit: number = 15) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedForms = MOCK_FORMS.slice(start, end);

  return {
    data: paginatedForms,
    pagination: {
      page,
      limit,
      total: MOCK_FORMS.length,
      totalPages: Math.ceil(MOCK_FORMS.length / limit),
    },
  };
};
