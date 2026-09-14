export function shortenPeriod(period: string): string {
  const m = period.match(/(\d)\s*сем\s*(\d{4})-(\d{4})/)
  if (!m) return period
  const [, sem, y1, y2] = m
  return `${sem} сем ${y1!.slice(2)}-${y2!.slice(2)}`
}
