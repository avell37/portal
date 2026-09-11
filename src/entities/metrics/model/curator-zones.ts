export interface CuratorZoneEntry {
  period: string
  direction: string
  course: number
  risk: number
  attention: number
  development: number
  lateness: number
  poorAttendance: number
}

// Source: "Таблица кураторы" — real per-period, per-direction, per-course curator zone counts.
// risk = Зона риска, attention = Зона внимания, development = Зона развития.
export const CURATOR_ZONES: CuratorZoneEntry[] = [
  { period: '1 сем 2025-2026 год', direction: 'ИТ', course: 1, risk: 2, attention: 1, development: 36, lateness: 0, poorAttendance: 0 },
  { period: '1 сем 2025-2026 год', direction: 'ИБ', course: 1, risk: 1, attention: 3, development: 6, lateness: 1, poorAttendance: 1 },
  { period: '1 сем 2025-2026 год', direction: 'Дизайн', course: 1, risk: 4, attention: 11, development: 45, lateness: 1, poorAttendance: 1 },
  { period: '1 сем 2025-2026 год', direction: 'Реклама', course: 1, risk: 1, attention: 2, development: 9, lateness: 1, poorAttendance: 0 },
  { period: '1 сем 2025-2026 год', direction: 'ИТ', course: 2, risk: 5, attention: 14, development: 12, lateness: 3, poorAttendance: 3 },
  { period: '1 сем 2025-2026 год', direction: 'ИБ', course: 2, risk: 0, attention: 6, development: 1, lateness: 2, poorAttendance: 0 },
  { period: '1 сем 2025-2026 год', direction: 'Дизайн', course: 2, risk: 5, attention: 10, development: 23, lateness: 2, poorAttendance: 3 },
  { period: '1 сем 2025-2026 год', direction: 'Реклама', course: 2, risk: 1, attention: 2, development: 3, lateness: 1, poorAttendance: 1 },
  { period: '1 сем 2025-2026 год', direction: 'ИТ', course: 3, risk: 7, attention: 7, development: 13, lateness: 12, poorAttendance: 7 },
  { period: '1 сем 2025-2026 год', direction: 'Дизайн', course: 3, risk: 9, attention: 3, development: 9, lateness: 6, poorAttendance: 7 },
  { period: '1 сем 2025-2026 год', direction: 'ИТ', course: 4, risk: 1, attention: 1, development: 0, lateness: 0, poorAttendance: 1 },
  { period: '1 сем 2025-2026 год', direction: 'Дизайн', course: 4, risk: 1, attention: 1, development: 2, lateness: 1, poorAttendance: 1 },
  { period: '2 сем 2025-2026 год', direction: 'ИТ', course: 1, risk: 5, attention: 2, development: 30, lateness: 2, poorAttendance: 5 },
  { period: '2 сем 2025-2026 год', direction: 'ИБ', course: 1, risk: 2, attention: 1, development: 9, lateness: 1, poorAttendance: 0 },
  { period: '2 сем 2025-2026 год', direction: 'Дизайн', course: 1, risk: 7, attention: 9, development: 43, lateness: 7, poorAttendance: 3 },
  { period: '2 сем 2025-2026 год', direction: 'Реклама', course: 1, risk: 0, attention: 2, development: 10, lateness: 0, poorAttendance: 0 },
  { period: '2 сем 2025-2026 год', direction: 'ИТ', course: 2, risk: 4, attention: 15, development: 10, lateness: 3, poorAttendance: 3 },
  { period: '2 сем 2025-2026 год', direction: 'ИБ', course: 2, risk: 0, attention: 7, development: 1, lateness: 0, poorAttendance: 0 },
  { period: '2 сем 2025-2026 год', direction: 'Дизайн', course: 2, risk: 4, attention: 15, development: 22, lateness: 2, poorAttendance: 4 },
  { period: '2 сем 2025-2026 год', direction: 'Реклама', course: 2, risk: 1, attention: 2, development: 4, lateness: 1, poorAttendance: 1 },
  { period: '2 сем 2025-2026 год', direction: 'ИТ', course: 3, risk: 5, attention: 6, development: 14, lateness: 5, poorAttendance: 4 },
  { period: '2 сем 2025-2026 год', direction: 'Дизайн', course: 3, risk: 6, attention: 3, development: 10, lateness: 5, poorAttendance: 4 },
  { period: '2 сем 2025-2026 год', direction: 'ИТ', course: 4, risk: 1, attention: 1, development: 2, lateness: 0, poorAttendance: 1 },
  { period: '2 сем 2025-2026 год', direction: 'Дизайн', course: 4, risk: 1, attention: 1, development: 0, lateness: 1, poorAttendance: 1 },
]

export const CURATOR_ZONE_PERIODS: string[] = [
  '1 сем 2025-2026 год',
  '2 сем 2025-2026 год',
]
