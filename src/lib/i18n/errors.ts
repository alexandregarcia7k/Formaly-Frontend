/**
 * Error messages i18n
 * TODO: Integrate with i18n library (next-intl, react-i18next, etc)
 */

type Locale = 'pt-BR' | 'en-US';

const errorMessages = {
  'pt-BR': {
    validation: {
      stats: 'Erro ao validar estatísticas',
      responses: 'Erro ao validar respostas',
      chart: 'Erro ao validar gráfico',
      activities: 'Erro ao validar atividades',
    },
  },
  'en-US': {
    validation: {
      stats: 'Error validating statistics',
      responses: 'Error validating responses',
      chart: 'Error validating chart',
      activities: 'Error validating activities',
    },
  },
} as const;

/**
 * Get error message for current locale
 * TODO: Get locale from user preferences or browser
 */
export function getErrorMessage(key: keyof typeof errorMessages['pt-BR']['validation']): string {
  const locale: Locale = 'pt-BR'; // TODO: Get from context/preferences
  return errorMessages[locale].validation[key];
}
