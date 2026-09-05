export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div>
      <h1 className="text-[22px] font-semibold text-auth-black">{title}</h1>
      <div className="mt-8 flex h-64 items-center justify-center rounded-[20px] border border-dashed border-border bg-white text-[14px] text-auth-gray">
        Раздел «{title}» скоро появится здесь
      </div>
    </div>
  )
}
