import type { RetakeItem } from '@/entities/retake'

/** Наши attempt.date — свободный текст в духе "23 января 2026, 15:00" или
 * "Слот не назначен" — для таблицы в духе макета (отдельные колонки
 * Дата/Время) разбираем по запятой на лучшее усилие, без строгого парсинга. */
export function splitDateTime(dateStr: string): { date: string; time: string } {
  const idx = dateStr.indexOf(',')
  if (idx === -1) return { date: dateStr, time: '—' }
  return { date: dateStr.slice(0, idx).trim(), time: dateStr.slice(idx + 1).trim() }
}

export function latestAttempt(item: RetakeItem) {
  return item.attempts[item.attempts.length - 1]!
}

export function findNearestItem(items: RetakeItem[]): RetakeItem | undefined {
  return items.find((i) => latestAttempt(i).result === 'scheduled') ?? items[0]
}
