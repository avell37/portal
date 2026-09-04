import type { ReactNode } from 'react'

interface PanelProps {
  title: string
  titleColor?: string
  bg?: string
  children: ReactNode
}

export default function Panel({ title, titleColor = 'var(--color-ink-muted)', bg = 'white', children }: PanelProps) {
  return (
    <div className="rounded-lg p-4" style={{ background: bg }}>
      <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide" style={{ color: titleColor }}>
        {title}
      </div>
      {children}
    </div>
  )
}

export function PanelRow({ label, value, valueColor }: { label: string; value: ReactNode; valueColor?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-black/[0.06] py-1.5 text-[12px] last:border-none">
      <span className="text-ink-muted">{label}</span>
      <span className="font-bold" style={{ color: valueColor }}>{value}</span>
    </div>
  )
}
