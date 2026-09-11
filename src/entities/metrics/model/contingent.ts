export interface ContingentEntry {
  period: string
  direction: string
  course: number
  count: number
  expelled: number
  transfers: number
  academicLeave: number
  downgrade: number
  attendance: number | null
  avgGrade: number | null
  avgScore: number | null
  retakes: number | null
}

// Source: "Таблица контингент и обучалка" — real per-period, per-direction, per-course contingent stats.
export const CONTINGENT: ContingentEntry[] = [
  { period: '1 сем 2024-2025 год', direction: 'ИТ', course: 1, count: 28, expelled: 0, transfers: 0, academicLeave: 0, downgrade: 0, attendance: 80, avgGrade: 3.5, avgScore: 56, retakes: 119 },
  { period: '1 сем 2024-2025 год', direction: 'ИБ', course: 1, count: 7, expelled: 0, transfers: 0, academicLeave: 0, downgrade: 0, attendance: 85, avgGrade: 4, avgScore: 69, retakes: 5 },
  { period: '1 сем 2024-2025 год', direction: 'Дизайн', course: 1, count: 33, expelled: 1, transfers: 0, academicLeave: 0, downgrade: 0, attendance: 87, avgGrade: 4, avgScore: 75, retakes: 64 },
  { period: '1 сем 2024-2025 год', direction: 'Реклама', course: 1, count: 6, expelled: 0, transfers: 0, academicLeave: 0, downgrade: 0, attendance: 85, avgGrade: 4, avgScore: 69, retakes: 5 },
  { period: '1 сем 2024-2025 год', direction: 'Дизайн', course: 2, count: 21, expelled: 1, transfers: 1, academicLeave: 0, downgrade: 0, attendance: 84, avgGrade: 4, avgScore: 70, retakes: 29 },
  { period: '1 сем 2024-2025 год', direction: 'ИТ', course: 2, count: 27, expelled: 0, transfers: 0, academicLeave: 0, downgrade: 1, attendance: 84, avgGrade: 4, avgScore: 58, retakes: 27 },
  { period: '1 сем 2024-2025 год', direction: 'ИТ', course: 3, count: 2, expelled: 0, transfers: 0, academicLeave: 0, downgrade: 0, attendance: 83, avgGrade: 4, avgScore: 60, retakes: 6 },
  { period: '1 сем 2024-2025 год', direction: 'Дизайн', course: 3, count: 4, expelled: 0, transfers: 0, academicLeave: 0, downgrade: 0, attendance: 84, avgGrade: 4, avgScore: 78, retakes: 5 },
  { period: '2 сем 2024-2025 год', direction: 'ИТ', course: 1, count: 28, expelled: 2, transfers: 1, academicLeave: 1, downgrade: 0, attendance: 63, avgGrade: 3.6, avgScore: 68.9, retakes: 48 },
  { period: '2 сем 2024-2025 год', direction: 'ИБ', course: 1, count: 7, expelled: 1, transfers: 0, academicLeave: 0, downgrade: 0, attendance: 81, avgGrade: 3.96, avgScore: 75.1, retakes: 5 },
  { period: '2 сем 2024-2025 год', direction: 'Дизайн', course: 1, count: 33, expelled: 1, transfers: 1, academicLeave: 0, downgrade: 2, attendance: 72, avgGrade: 4.08, avgScore: 77.8, retakes: 37 },
  { period: '2 сем 2024-2025 год', direction: 'Реклама', course: 1, count: 6, expelled: 0, transfers: 0, academicLeave: 0, downgrade: 0, attendance: 78, avgGrade: 4.4, avgScore: 82.6, retakes: 19 },
  { period: '2 сем 2024-2025 год', direction: 'Дизайн', course: 2, count: 21, expelled: 0, transfers: 0, academicLeave: 0, downgrade: 0, attendance: 83, avgGrade: 4.3, avgScore: 84.5, retakes: 6 },
  { period: '2 сем 2024-2025 год', direction: 'ИТ', course: 2, count: 27, expelled: 1, transfers: 0, academicLeave: 0, downgrade: 1, attendance: 79, avgGrade: 4.09, avgScore: 78.5, retakes: 21 },
  { period: '2 сем 2024-2025 год', direction: 'ИТ', course: 3, count: 2, expelled: 0, transfers: 1, academicLeave: 0, downgrade: 0, attendance: 64, avgGrade: 4.03, avgScore: 75.8, retakes: 0 },
  { period: '2 сем 2024-2025 год', direction: 'Дизайн', course: 3, count: 4, expelled: 0, transfers: 0, academicLeave: 0, downgrade: 0, attendance: 78, avgGrade: 4.4, avgScore: 86.7, retakes: 2 },
  { period: '1 сем 2025-2026 год', direction: 'ИТ', course: 1, count: 39, expelled: 0, transfers: 0, academicLeave: 1, downgrade: 0, attendance: 86, avgGrade: 3.8, avgScore: 72.4, retakes: 35 },
  { period: '1 сем 2025-2026 год', direction: 'ИБ', course: 1, count: 10, expelled: 0, transfers: 0, academicLeave: 0, downgrade: 0, attendance: 89, avgGrade: 4.1, avgScore: 79.1, retakes: 8 },
  { period: '1 сем 2025-2026 год', direction: 'Дизайн', course: 1, count: 60, expelled: 0, transfers: 0, academicLeave: 0, downgrade: 0, attendance: 81, avgGrade: 3.9, avgScore: 73.6, retakes: 99 },
  { period: '1 сем 2025-2026 год', direction: 'Реклама', course: 1, count: 12, expelled: 0, transfers: 0, academicLeave: 0, downgrade: 0, attendance: 91, avgGrade: 4.4, avgScore: 83.3, retakes: 19 },
  { period: '1 сем 2025-2026 год', direction: 'ИТ', course: 2, count: 31, expelled: 0, transfers: 0, academicLeave: 0, downgrade: 0, attendance: 74, avgGrade: 3.3, avgScore: 57.6, retakes: 78 },
  { period: '1 сем 2025-2026 год', direction: 'ИБ', course: 2, count: 7, expelled: 0, transfers: 0, academicLeave: 0, downgrade: 0, attendance: 81, avgGrade: 3.8, avgScore: 70.4, retakes: 0 },
  { period: '1 сем 2025-2026 год', direction: 'Дизайн', course: 2, count: 38, expelled: 0, transfers: 0, academicLeave: 1, downgrade: 0, attendance: 78, avgGrade: 3.8, avgScore: 68.9, retakes: 112 },
  { period: '1 сем 2025-2026 год', direction: 'Реклама', course: 2, count: 6, expelled: 0, transfers: 0, academicLeave: 1, downgrade: 0, attendance: 64, avgGrade: 4.1, avgScore: 78.3, retakes: 9 },
  { period: '1 сем 2025-2026 год', direction: 'ИТ', course: 3, count: 27, expelled: 0, transfers: 0, academicLeave: 0, downgrade: 0, attendance: 79, avgGrade: 4.1, avgScore: 77.8, retakes: 31 },
  { period: '1 сем 2025-2026 год', direction: 'Дизайн', course: 3, count: 21, expelled: 0, transfers: 0, academicLeave: 0, downgrade: 0, attendance: 76, avgGrade: 3.8, avgScore: 69.7, retakes: 52 },
  { period: '1 сем 2025-2026 год', direction: 'ИТ', course: 4, count: 2, expelled: 0, transfers: 0, academicLeave: 0, downgrade: 0, attendance: 67, avgGrade: 4.7, avgScore: 93.7, retakes: 11 },
  { period: '1 сем 2025-2026 год', direction: 'Дизайн', course: 4, count: 4, expelled: 0, transfers: 0, academicLeave: 0, downgrade: 0, attendance: 62, avgGrade: 4, avgScore: 71.4, retakes: 0 },
  { period: '2 сем 2025-2026 год', direction: 'ИТ', course: 1, count: 37, expelled: 1, transfers: 0, academicLeave: 1, downgrade: 1, attendance: null, avgGrade: null, avgScore: null, retakes: null },
  { period: '2 сем 2025-2026 год', direction: 'ИБ', course: 1, count: 12, expelled: 0, transfers: 0, academicLeave: 0, downgrade: 0, attendance: null, avgGrade: null, avgScore: null, retakes: null },
  { period: '2 сем 2025-2026 год', direction: 'Дизайн', course: 1, count: 59, expelled: 2, transfers: 1, academicLeave: 0, downgrade: 1, attendance: null, avgGrade: null, avgScore: null, retakes: null },
  { period: '2 сем 2025-2026 год', direction: 'Реклама', course: 1, count: 12, expelled: 0, transfers: 1, academicLeave: 0, downgrade: 0, attendance: null, avgGrade: null, avgScore: null, retakes: null },
  { period: '2 сем 2025-2026 год', direction: 'ИТ', course: 2, count: 29, expelled: 0, transfers: 0, academicLeave: 0, downgrade: 2, attendance: null, avgGrade: null, avgScore: null, retakes: null },
  { period: '2 сем 2025-2026 год', direction: 'ИБ', course: 2, count: 7, expelled: 0, transfers: 0, academicLeave: 0, downgrade: 0, attendance: null, avgGrade: null, avgScore: null, retakes: null },
  { period: '2 сем 2025-2026 год', direction: 'Дизайн', course: 2, count: 39, expelled: 0, transfers: 1, academicLeave: 1, downgrade: 1, attendance: null, avgGrade: null, avgScore: null, retakes: null },
  { period: '2 сем 2025-2026 год', direction: 'Реклама', course: 2, count: 6, expelled: 0, transfers: 0, academicLeave: 1, downgrade: 1, attendance: null, avgGrade: null, avgScore: null, retakes: null },
  { period: '2 сем 2025-2026 год', direction: 'ИТ', course: 3, count: 25, expelled: 1, transfers: 0, academicLeave: 0, downgrade: 1, attendance: null, avgGrade: null, avgScore: null, retakes: null },
  { period: '2 сем 2025-2026 год', direction: 'Дизайн', course: 3, count: 19, expelled: 0, transfers: 0, academicLeave: 0, downgrade: 1, attendance: null, avgGrade: null, avgScore: null, retakes: null },
  { period: '2 сем 2025-2026 год', direction: 'ИТ', course: 4, count: 2, expelled: 0, transfers: 0, academicLeave: 0, downgrade: 0, attendance: null, avgGrade: null, avgScore: null, retakes: null },
  { period: '2 сем 2025-2026 год', direction: 'Дизайн', course: 4, count: 4, expelled: 0, transfers: 0, academicLeave: 0, downgrade: 0, attendance: null, avgGrade: null, avgScore: null, retakes: null },
]

export const CONTINGENT_PERIODS: string[] = [
  '1 сем 2024-2025 год',
  '2 сем 2024-2025 год',
  '1 сем 2025-2026 год',
  '2 сем 2025-2026 год',
]
