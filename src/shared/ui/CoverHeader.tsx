interface CoverHeaderProps {
  tag: string
  title: string
  subtitle: string
}

export default function CoverHeader({ tag, title, subtitle }: CoverHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-purple px-8 py-12 text-white">
      <div className="pointer-events-none absolute -right-16 -top-16 h-80 w-80 rounded-full bg-purple-dark opacity-60" />
      <div className="pointer-events-none absolute -bottom-20 right-16 h-44 w-44 rounded-full bg-purple-deep opacity-80" />
      <div className="relative z-10">
        <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.12em] opacity-60">{tag}</div>
        <h1 className="mb-2 text-3xl font-semibold leading-tight sm:text-4xl">{title}</h1>
        <p className="text-base opacity-75">{subtitle}</p>
      </div>
    </div>
  )
}
