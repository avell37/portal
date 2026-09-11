export interface EmployerFeedbackEntry {
  period: string
  direction: string
  employer: string
  score: number
  comment: string
}

// Source: "Таблица отзывы работодателей" — real employer feedback after student internships.
export const EMPLOYER_FEEDBACK: EmployerFeedbackEntry[] = [
  { period: '1 сем 2024-2025 год', direction: 'ИТ', employer: 'Смартек', score: 4, comment: 'Подтянуть базу' },
  { period: '1 сем 2024-2025 год', direction: 'Дизайн', employer: 'Евапс', score: 5, comment: 'Отлично' },
  { period: '1 сем 2024-2025 год', direction: 'ИТ', employer: 'Евапс', score: 5, comment: 'Отлично' },
  { period: '2 сем 2024-2025 год', direction: 'ИБ', employer: 'Ингейт', score: 4.5, comment: 'дисциплина хромает' },
  { period: '2 сем 2024-2025 год', direction: 'Реклама', employer: 'Юнивеб', score: 5, comment: 'Сильные студенты' },
  { period: '2 сем 2024-2025 год', direction: 'Дизайн', employer: 'Ингейт', score: 4, comment: 'Нужно больше креатива' },
]
