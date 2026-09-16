import { Download } from 'lucide-react'

export default function ExportButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-[12px] border border-border bg-white px-3.5 py-2 text-[13px] font-semibold text-auth-primary transition-colors hover:bg-gray-light"
    >
      <Download size={14} />
      {label}
    </button>
  )
}
