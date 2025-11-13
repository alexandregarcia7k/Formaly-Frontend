export interface FilterOption {
  value: string;
  label: string;
}

export interface ActiveFilter {
  key: string;
  label: string;
  value: string;
}

// Constantes para filtros de formulários
export const FORM_STATUS = {
  ALL: "all",
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;

export const FORM_RESPONSES_FILTER = {
  ALL: "all",
  WITH: "with",
  WITHOUT: "without",
} as const;

// Tipos inferidos das constantes
export type FormStatus = typeof FORM_STATUS[keyof typeof FORM_STATUS];
export type FormResponsesFilter = typeof FORM_RESPONSES_FILTER[keyof typeof FORM_RESPONSES_FILTER];
