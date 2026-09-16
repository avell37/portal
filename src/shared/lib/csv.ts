function csvCell(v: unknown): string {
    const s = String(v ?? '')
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

/** Экспорт "в Excel" через настоящий CSV-файл (открывается в Excel как есть) —
 * без бэкенда и без библиотек, просто Blob + скачивание. ﻿ в начале —
 * BOM, чтобы Excel сразу понял кодировку UTF-8 и не показал кракозябры. */
export function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]) {
    const lines = [headers, ...rows].map((row) => row.map(csvCell).join(';'))
    const csv = '﻿' + lines.join('\r\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}
