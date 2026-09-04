interface StatCardProps {
  value: string | number
  label: string
  color: string
}

export default function StatCard({ value, label, color }: StatCardProps) {
  return (
    <div className="rounded-lg p-4 text-center text-white" style={{ background: color }}>
      <div className="text-3xl font-bold leading-none">{value}</div>
      <div className="mt-1.5 text-[11px] opacity-80">{label}</div>
    </div>
  )
}
